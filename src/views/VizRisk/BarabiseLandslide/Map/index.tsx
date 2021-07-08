import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';

import { ScatterplotLayer } from '@deck.gl/layers';


import { hazardTypesList,
    incidentPointToGeojsonVR,
    getWardFilter } from '#utils/domain';
import styles from './styles.scss';
import {
    // provincesSelector,
    municipalitiesSelector,
    districtsSelector,
    wardsSelector,
    regionLevelSelector,
    boundsSelector,
    selectedProvinceIdSelector,
    selectedDistrictIdSelector,
    selectedMunicipalityIdSelector,
} from '#selectors';
import SchoolGeoJSON from '../Data/criticalInfraGeoJSON';

import Loading from '#components/Loading';

const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}
const {
    criticalinfrastructures,
    evaccenters,
} = SchoolGeoJSON;
const INITIAL_VIEW_STATE = {
    longitude: 85.300140,
    latitude: 27.700769,
    zoom: 13,
    pitch: 0,
    bearing: 0,
};
const MALE_COLOR = [0, 128, 255];
const FEMALE_COLOR = [255, 0, 128];
const mapStateToProps = (state, props) => ({
    // provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    regionLevelFromAppState: regionLevelSelector(state, props),
    bounds: boundsSelector(state, props),
    selectedProvinceId: selectedProvinceIdSelector(state, props),
    selectedDistrictId: selectedDistrictIdSelector(state, props),
    selectedMunicipalityId: selectedMunicipalityIdSelector(state, props),
});

const LandSlideMap = (props) => {
    const [pending, setPending] = useState<boolean>(true);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);

    const {
        wards,
        selectedProvinceId: provinceId,
        selectedDistrictId: districtId,
        selectedMunicipalityId: municipalityId,
        incidentList,
        hazardTypes,
        page,
    } = props;
    const YEARS = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | undefined>(undefined);
    const layerRef = useRef(undefined);
    const UNSUPPORTED_BROWSER = !mapboxgl.supported();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function noop() {}

    const getPointFeatureCollection = memoize(incidentPointToGeojsonVR);
    const pointFeatureCollection = getPointFeatureCollection(
        incidentList,
        hazardTypes,
        { ini: 1546280100000, fin: 1577816100000 },
    );

    useEffect(() => {
        setPending(true);
        const VRMap = new mapboxgl.Map({
            container: mapContainer.current,
            style: process.env.REACT_APP_VIZRISK_BAHRABISE_LANDSLIDE,
            center: {
                lng: 85.300140,
                lat: 27.700769,
            },
            zoom: 6.5,
            minZoom: 2,
            maxZoom: 22,

        });
        VRMap.panBy([-100, -100]);
        mapRef.current = VRMap;


        return () => mapRef.current.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const getDateRange = ini => ({
            ini: new Date(`01-01-${ini}`).getTime(),
            fin: new Date(`01-01-${ini + 1}`).getTime(),
        });
        mapRef.current.on('load', () => setLoaded(true));
    }, [YEARS, getPointFeatureCollection, hazardTypes,
        incidentList, pointFeatureCollection.features.length]);


    // eslint-disable-next-line consistent-return
    useEffect(() => {
        const getDateRange = ini => ({
            ini: new Date(`01-01-${ini}`).getTime(),
            fin: new Date(`01-01-${ini + 1}`).getTime(),
        });

        if (loaded && pointFeatureCollection.features.length > 0) {
            console.log('loading');
            const cood = Object.values(pointFeatureCollection)[1]
                .map(item => item.geometry.coordinates);
            layerRef.current = [
                new ScatterplotLayer({
                    id: 'scatter-plot',
                    data: cood,
                    radiusScale: 30,
                    radiusMinPixels: 0.25,
                    getPosition: d => [d[0], d[1], 0],
                    getFillColor: d => (d[2] === 1 ? MALE_COLOR : FEMALE_COLOR),
                    getRadius: 1,
                    updateTriggers: {
                        getFillColor: [MALE_COLOR, FEMALE_COLOR],
                    },
                }),
            ];
            YEARS.map((layer) => {
                mapRef.current.addSource(`landslidePointss${layer}`, {
                    type: 'geojson',
                    data: getPointFeatureCollection(
                        incidentList,
                        hazardTypes,
                        getDateRange(layer),
                    ),
                });

                mapRef.current.addLayer({
                    id: `landslide-layer-${layer}`,
                    type: 'circle',
                    source: `landslidePointss${layer}`,
                    paint: {
                        'circle-color': '#a4ac5e',
                        'circle-radius': 7,
                        'circle-opacity': 0,
                        'circle-opacity-transition': {
                            duration: 100,
                            delay: YEARS.indexOf(layer) * 100,
                        },
                    },
                });

                return null;
            });

            YEARS.map((layer) => {
                mapRef.current.setPaintProperty(`landslide-layer-${layer}`, 'circle-opacity', 1);
                return null;
            });

            return () => {
                YEARS.map((layer) => {
                    console.log('mapreef in return: ', mapRef.current);
                    if (mapRef.current.isStyleLoaded()) {
                        const mapLayer = mapRef.current.getSource(`landslidePointss${layer}`);

                        if (typeof mapLayer !== 'undefined') {
                            mapRef.current.removeLayer(`landslide-layer-${layer}`).removeSource(`landslidePointss${layer}`);
                        }
                    }


                    // if (mapRef.current.getLayer(`landslide-layer-${layer}`)) {
                    //     mapRef.current.removeLayer(`landslide-layer-${layer}`);
                    // }
                    // if (mapRef.current.getSource(`landslidePointss${layer}`)) {
                    //     mapRef.current.removeSource(`landslidePointss${layer}`);
                    // }
                    return null;
                });
            };
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pointFeatureCollection.features.length]);

    useEffect(() => {
        if (page === 2) {
            mapRef.current.easeTo({
                zoom: 11.4,
                center: {
                    lng: 85.90010912899756,
                    lat: 27.821772478807212,
                },
                duration: 1000,
            });
        }
        if (page === 1) {
            mapRef.current.panBy([-100, -100]);
            mapRef.current.setZoom(6.5);
        }
    }, [page]);


    const mapStyle = {
        position: 'absolute',
        width: '100%',
        left: '0%',
        top: 0,
        bottom: 0,
    };
    return (
        <div>
            {/* {Object.keys(incidentData).length > 0 */}
            {/* ?  */}
            <div style={mapStyle} ref={mapContainer} />
            {/* :  */}
            {/* ( */}
            <Loading
                pending={pending}
            />
            {/* )} */}
        </div>
    );
};

export default connect(mapStateToProps)(LandSlideMap);
