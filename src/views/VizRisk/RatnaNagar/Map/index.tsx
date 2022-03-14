import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import styles from './styles.scss';

const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}

const Map = () => {
    const map = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    function noop() {}

    useEffect(() => {
        const { current: mapContainer } = mapContainerRef;
        if (!mapContainer) {
            console.error('No container found.');
            return noop;
        }
        if (map.current) { return noop; }

        const multihazardMap = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/yilab/cl02b42zi00b414qm2i7xqqex',
            minZoom: 2,
            maxZoom: 22,
        });

        map.current = multihazardMap;

        multihazardMap.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        multihazardMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
        const destroyMap = () => {
            multihazardMap.remove();
        };
        return destroyMap;
    }, []);
    return <div ref={mapContainerRef} className={styles.mapCSS} />;
};

export default Map;
