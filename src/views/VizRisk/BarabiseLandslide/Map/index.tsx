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
    const [pending, setPending] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    const {
        wards,
        selectedProvinceId: provinceId,
        selectedDistrictId: districtId,
        selectedMunicipalityId: municipalityId,
        incidentList,
        hazardTypes,
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
        if (pointFeatureCollection.features.length > 0) {
            const getDateRange = ini => ({
                ini: new Date(`01-01-${ini}`).getTime(),
                fin: new Date(`01-01-${ini + 1}`).getTime(),
            });
            console.log('date range for 2011', getDateRange(2011));

            console.log(getPointFeatureCollection(
                incidentList,
                hazardTypes,
                { ini: 1546280100000, fin: 1577816100000 },
            ));

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
            VRMap.on('load', () => {
                YEARS.map((layer) => {
                    VRMap.addSource(`landslidePoints${layer}`, {
                        type: 'geojson',
                        data: getPointFeatureCollection(
                            incidentList,
                            hazardTypes,
                            getDateRange(layer),
                        ),
                    });

                    VRMap.addLayer({
                        id: `landslide-layer-${layer}`,
                        type: 'circle',
                        source: `landslidePoints${layer}`,
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

                setPending(false);
                YEARS.map((layer) => {
                    VRMap.setPaintProperty(`landslide-layer-${layer}`, 'circle-opacity', 1);
                    return null;
                });
            });
        } else {
            setPending(true);
        }
    }, [YEARS, getPointFeatureCollection,
        hazardTypes, incidentList,
        pointFeatureCollection.features.length]);


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
