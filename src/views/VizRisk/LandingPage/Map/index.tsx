import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';

import { AppState } from '#types';
import { mapSources, mapStyles } from '#constants';
import { vzRiskMunicipalData, vzRiskProvinceData } from '../VzRiskData';
import { provincesSelector, municipalitiesSelector } from '#selectors';

import styles from './styles.scss';
import { checkIndicator, checkType } from '../utils';

const mapStateToProps = (state: AppState) => ({
    provinces: provincesSelector(state),
    municipalities: municipalitiesSelector(state),

});


const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;

if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}
interface Props {
}

const Map = (props: Props) => {
    const mapContainerRef = useRef();
    const updateMap = useRef<mapboxgl.Map>();

    const { vzLabel, provinces, municipalities } = props;

    function noop() { }

    useEffect(() => {
        const { current: mapContainer } = mapContainerRef;
        if (!mapContainer) {
            console.error('No container found.');
            return noop;
        }
        const provinceWithId = [2, 6];

        const allData = provinces.map(data => ({
            ...data,
            value: !!provinceWithId.includes(data.id),
        }));
        const array = vzRiskMunicipalData.map(item => item.federalId);

        const allDataMunipal = municipalities.map(data => ({
            ...data,
            value: !!array.includes(data.id),
            indicator: checkIndicator(vzRiskMunicipalData, data),
        }));


        console.log('allData', allDataMunipal);

        const landingPageMap = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/yilab/ckb7jq0gk08gx1io0xanwesfp',
            logoPosition: 'top-left',
            minZoom: 5,
            // makes initial map center to Nepal
            center: {
                lng: 85.300140,
                lat: 27.700769,
            },
            zoom: 6,
        });

        if (updateMap) {
            updateMap.current = landingPageMap;
        }

        landingPageMap.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        landingPageMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        landingPageMap.on('style.load', () => {
            landingPageMap.resize();
            landingPageMap.addSource('base-outline', {
                type: 'vector',
                url: mapSources.nepal.url,
            });

            landingPageMap.addLayer({
                id: 'province-vizrisk',
                source: 'base-outline',
                'source-layer': mapSources.nepal.layers.province,
                type: 'fill',
                paint: {
                    'fill-opacity': 1,
                    'fill-color': [
                        'case',
                        ['boolean', ['feature-state', 'value'], 'true'],
                        'red', 'white',
                    ],
                },
                layout: {
                    visibility: 'none',
                },
            });
            allDataMunipal.forEach((attribute) => {
                landingPageMap.setFeatureState({
                    id: attribute.id,
                    source: 'base-outline',
                    sourceLayer: mapSources.nepal.layers.municipality,
                }, {
                    color: checkType(attribute.indicator),
                    indicator: attribute.indicator,
                });
            });

            landingPageMap.addLayer({
                id: 'municipality-vizrisk',
                source: 'base-outline',
                'source-layer': mapSources.nepal.layers.municipality,
                type: 'fill',
                paint: {
                    'fill-opacity': 1,
                    'fill-color': ['feature-state', 'color'],
                },
                layout: {
                    visibility: 'visible',
                },
                // filter: ['==', ['feature-state', 'color'], 'red'],
            });

            landingPageMap.on('click', 'municipality-vizrisk', (e) => {
                console.log('features', e.features);
            });
            allData.forEach((attribute) => {
                landingPageMap.setFeatureState({
                    id: attribute.id,
                    source: 'base-outline',
                    sourceLayer: mapSources.nepal.layers.province,
                }, { value: attribute.value });
            });


            landingPageMap.addLayer({
                id: 'province-outline',
                source: 'base-outline',
                'source-layer': mapSources.nepal.layers.province,
                type: 'line',
                paint: mapStyles.province.outline,
                layout: {
                    visibility: 'none',
                },
            });
            landingPageMap.addLayer({
                id: 'municipality-outline',
                source: 'base-outline',
                'source-layer': mapSources.nepal.layers.municipality,
                type: 'line',
                paint: mapStyles.municipality.outline,
                layout: {
                    visibility: 'visible',
                },
            });
        });


        return () => landingPageMap.remove();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (updateMap.current && updateMap.current.isStyleLoaded()) {
            if (vzLabel === 'province') {
                if (updateMap.current) {
                    updateMap.current.setLayoutProperty('province-outline', 'visibility', 'visible');
                    updateMap.current.setLayoutProperty('province-vizrisk', 'visibility', 'visible');
                }
            } else {
                updateMap.current.setLayoutProperty('province-outline', 'visibility', 'none');
                updateMap.current.setLayoutProperty('province-vizrisk', 'visibility', 'none');
            }

            if (vzLabel === 'municipality') {
                if (updateMap.current) {
                    updateMap.current.setLayoutProperty('municipality-outline', 'visibility', 'visible');
                    updateMap.current.setLayoutProperty('municipality-vizrisk', 'visibility', 'visible');
                    // updateMap.current.setFilter('municipality-vizrisk',
                    // ['==', ['feature-state', 'color'], 'red']);
                }
            } else {
                updateMap.current.setLayoutProperty('municipality-outline', 'visibility', 'none');
                updateMap.current.setLayoutProperty('municipality-vizrisk', 'visibility', 'none');
            }
        }
    }, [vzLabel]);
    return (
        <div ref={mapContainerRef} className={styles.landingPageMap} />
    );
};

export default connect(mapStateToProps)(Map);
