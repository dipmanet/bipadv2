/* eslint-disable @typescript-eslint/camelcase */
import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import * as utils from '#views/IBF/utils';


import {
    setIbfPageAction,
} from '#actionCreators';

import {
    ibfPageSelector,
    districtsSelector,
    municipalitiesSelector,
} from '#selectors';

import { mapSources } from '#constants';


import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    ibfPage: ibfPageSelector(state),
    district: districtsSelector(state),
    municipality: municipalitiesSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    householdJson: {
        url: '/ibf-household/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            municipality: params.municipality,
            limit: -1,
        }),
        onSuccess: ({ props, response, params }) => {
            props.setIbfPage({ householdJson: [response.results] });
            params.setPending(false);
        },
    },

    householdDistrictAverage: {
        url: '/ibf-household/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            summary: 'true',
            municipality: params.municipality,
            limit: -1,
        }),
        onSuccess: ({ props, response, params }) => {
            props.setIbfPage({ householdDistrictAverage: response });
        },
    },
};

const Map = (props) => {
    const mapRef = useRef<mapboxgl.Map | undefined>(undefined);

    const mapContainerRef = useRef(null);
    const {
        ibfPage: { stations,
            selectedStation,
            leadTime,
            returnPeriod,
            stationDetail,
            calendarData,
            filter,
            householdJson,
            showHouseHold,
            selectedIndicator,
            selectedLegend },
        district,
        municipality,
    } = props;

    const rasterLayersYears = [5, 20];
    const [pending, setPending] = useState(false);
    const [mun, setMun] = useState();
    const prevMunRef = useRef();

    useEffect(() => {
        prevMunRef.current = filter.municipality;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mun]);

    const prevMun = prevMunRef.current;

    const getRasterLayer = (years: number) => [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&version=1.1.1',
        '&service=WMS',
        '&request=GetMap',
        `&layers=Bipad:IBF_Meteor_Flood_FD_1in${years}`,
        // `&layers=Bipad:Vector_FD_1in${years}`,
        '&tiled=true',
        '&width=256',
        '&height=256',
        '&srs=EPSG:3857',
        '&bbox={bbox-epsg-3857}',
        '&transparent=true',
        '&format=image/png',
        // '&CQL_FILTER=BBOX(the_geom, 81.2902824581022,
        //  28.2204802166605, 81.4884978072765, 28.4247247855239)',
    ].join('');

    const getTitle = (level, id) => {
        if (level === 'district') {
            return district.filter(item => item.id === Number(id))[0].title;
        }
        if (level === 'municipality') {
            return municipality.filter(item => item.id === Number(id))[0].title;
        }
        return null;
    };

    const getFiltlerExpression = (muni) => {
        const temp = ['any'];
        muni.map((item) => {
            temp.push(['==', ['get', 'title'], getTitle('municipality', item)]);
            return null;
        });
        return temp;
    };
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/yilab/ckr1mucvr7q3f1ao91578bqcq',
            preserveDrawingBuffer: true,
            center: [84.2676, 28.5465],
            zoom: 6,
        });
        // disable map zoom when using scroll
        map.scrollZoom.disable();
        mapRef.current = map;

        // Create a popup, but don't add it to the map yet.

        map.on('load', () => {
            map.addSource('stations', {
                type: 'geojson',
                data: stations,
            });
            map.addLayer({
                id: 'placesInitial',
                // type: 'circle',
                type: 'symbol',
                source: 'stations',
                layout: {
                    'icon-image': [
                        'case',
                        ['all',
                            ['==', ['get', 'is_activated'], false],
                        ],
                        'Location-disabled',
                        ['all',
                            ['==', ['get', 'exceed_twenty', ['at', leadTime, ['get', 'calculation']]], true],
                        ],
                        'Location-20',
                        ['all',
                            ['==', ['get', 'exceed_five', ['at', leadTime, ['get', 'calculation']]], true],
                        ],
                        'Location-5',
                        'Location',
                    ],
                    'icon-size': 0.35,
                    'icon-anchor': 'bottom',
                },
            });
            map.on('mouseenter', 'placesInitial', (e) => {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';

                const coordinates = e.features[0].geometry.coordinates.slice();
                const { station_name } = e.features[0].properties;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates).setHTML(
                    `<div style="padding: 0 5px;border-radius: 5px">
                    <p>${station_name}</p>
                    </div>
                    `,
                ).addTo(map);
            });

            map.on('mouseleave', 'placesInitial', () => {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });

            map.on('mouseenter', 'places', (e) => {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';

                const coordinates = e.features[0].geometry.coordinates.slice();
                const { station_name } = e.features[0].properties;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates).setHTML(
                    `<div style="padding: 0 5px;border-radius: 5px">
                    <p>${station_name}</p>
                    </div>
                    `,
                ).addTo(map);
            });


            rasterLayersYears.map((layer) => {
                mapRef.current.addSource(`ibfRaster${layer}`, {
                    type: 'raster',
                    tiles: [getRasterLayer(layer)],
                    tileSize: 256,
                });
                mapRef.current.addLayer(
                    {
                        id: `raster-ibf-${layer}`,
                        type: 'raster',
                        source: `ibfRaster${layer}`,
                        layout: { visibility: 'none' },
                        paint: {
                            'raster-opacity': 0.7,
                        },
                    },
                );
                return null;
            });

            map.addSource('boundary-layer', {
                type: 'vector',
                url: mapSources.nepal.url,
            });

            map.addSource('centroid', {
                type: 'vector',
                url: mapSources.nepalCentroid.url,
            });

            // Ward layer
            map.addLayer({
                id: 'ward-local',
                source: 'boundary-layer',
                'source-layer': mapSources.nepal.layers.ward,
                type: 'line',
                paint: {
                    'line-color': '#ffff00',
                },
                layout: { visibility: 'none' },
            });
            map.addLayer({
                id: 'ward-centroid',
                source: 'centroid',
                'source-layer': mapSources.nepalCentroid.layers.ward,
                type: 'symbol',
                layout: {
                    'text-field': ['get', 'title'],
                    'text-size': 12,
                    visibility: 'none',
                },
                paint: {
                    'text-color': '#ffffff',
                },
            });

            // Municipality Layer
            map.addLayer({
                id: 'municipality-centroid',
                source: 'centroid',
                'source-layer': mapSources.nepalCentroid.layers.municipality,
                type: 'symbol',
                layout: {
                    'text-field': ['get', 'title'],
                    'text-size': 12,
                    visibility: 'none',
                },
                paint: {
                    'text-color': '#ffffff',
                },
            });
            map.addLayer({
                id: 'municipality-local',
                source: 'boundary-layer',
                'source-layer': mapSources.nepal.layers.municipality,
                type: 'line',
                paint: {
                    'line-color': '#ff0000',
                },
                layout: { visibility: 'visible' },
                filter: ['all', ['==', ['get', 'district'], filter.municipality]],
            });

            // District Layer
            map.addLayer({
                id: 'district-centroid',
                source: 'centroid',
                'source-layer': mapSources.nepalCentroid.layers.district,
                type: 'symbol',
                layout: {
                    'text-field': ['get', 'title'],
                    'text-size': 12,
                    visibility: 'none',
                },
                paint: {
                    'text-color': '#ffffff',
                },
            });
            map.addLayer({
                id: 'district-local',
                source: 'boundary-layer',
                'source-layer': mapSources.nepal.layers.district,
                type: 'line',
                paint: {
                    'line-color': '#ff00ff',
                },
                layout: { visibility: 'none' },
            });
            if (returnPeriod === 20) {
                mapRef.current.setLayoutProperty('raster-ibf-20', 'visibility', 'visible');
                mapRef.current.setLayoutProperty('raster-ibf-5', 'visibility', 'none');
            } else if (returnPeriod === 5) {
                mapRef.current.setLayoutProperty('raster-ibf-5', 'visibility', 'visible');
                mapRef.current.setLayoutProperty('raster-ibf-20', 'visibility', 'none');
            } else {
                mapRef.current.setLayoutProperty('raster-ibf-20', 'visibility', 'none');
                mapRef.current.setLayoutProperty('raster-ibf-5', 'visibility', 'none');
            }

            const array = utils.getDistrictArray(stationDetail, selectedStation);
            const bbox = utils.getBboxFromDistrictArray(array, district);
            mapRef.current
                .fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
                    { padding: 50 });
            if (props.effectedDristict) {
                mapRef.current.setFilter('district-centroid', ['all', ['==', ['get', 'title'], getTitle('district', props.effectedDristict[0].id)]]);
                mapRef.current.setFilter('district-local', ['all', ['==', ['get', 'title'], getTitle('district', props.effectedDristict[0].id)]]);
                mapRef.current.setLayoutProperty('district-local', 'visibility', 'visible');
                mapRef.current.setLayoutProperty('district-centroid', 'visibility', 'visible');
            }
            if (props.effectedMunicipality) {
                let munbbox;
                if (props.effectedMunicipality.length === 1) {
                    munbbox = utils
                        .getBboxOfMunicipality(props.effectedMunicipality, municipality);
                    mapRef.current
                        .fitBounds([munbbox[0], munbbox[1], munbbox[2], munbbox[3]],
                            { padding: 50 });
                }
                mapRef.current.setFilter('municipality-local', getFiltlerExpression(props.effectedMunicipality));
                mapRef.current.setFilter('municipality-centroid', getFiltlerExpression(props.effectedMunicipality));
                mapRef.current.setLayoutProperty('municipality-local', 'visibility', 'visible');
                mapRef.current.setLayoutProperty('municipality-centroid', 'visibility', 'visible');
            }
        });
        return () => map.remove();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const mapContainer = {
        position: 'absolute',
        top: '0',
        right: '0',
        width: '100%',
        height: '100%',
        marginLeft: '50px',
    };

    return (
        <>
            <div style={props.myStyle ? props.myStyle : mapContainer} ref={mapContainerRef} />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Map,
        ),
    ),
);
