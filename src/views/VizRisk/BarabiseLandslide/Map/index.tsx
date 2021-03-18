import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
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
import SchoolGeoJSON from '../Data/rajapurGEOJSON';


import Loading from '#components/Loading';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5rdXIyMCIsImEiOiJja2tiOW4wNGIwNDh5MnBsY3EzeDNmcTV4In0.d4LelcSFDElA3BctgWvs1A';

const {
    criticalinfrastructures,
    evaccenters,
} = SchoolGeoJSON;

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
        console.log('mounting...');
        const VRMap = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/ankur20/ckkwdvg544to217orazo712ra',
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
                            duration: 1000,
                            delay: YEARS.indexOf(layer) * 1000,
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
        setPending(false);
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
                duration: 4000,
            });
        }
        if (page === 1) {
            mapRef.current.easeTo({
                zoom: 6.5,
                center: {
                    lng: 85.300140,
                    lat: 27.700769,
                },
                duration: 4000,
            });
            mapRef.current.panBy([-100, -100]);
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
