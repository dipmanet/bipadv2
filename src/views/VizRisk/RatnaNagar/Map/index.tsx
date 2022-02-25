import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}

const Map = () => {
    const map = useRef<null>(null);
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
            style: 'mapbox://styles/yilab/cky6ydau933qq15o7bmmblnt4',
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
    return <div ref={mapContainerRef} className="map-container" />;
};

export default Map;
