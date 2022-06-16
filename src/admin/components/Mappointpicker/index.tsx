/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import mapboxgl from 'mapbox-gl';
import Loader from 'react-loader';
import styles from './styles.module.scss';
import Satelliteimg from '../../resources/mapbox-satellite.png';
import Mapboxlight from '../../resources/mapbox-light.png';
import Mapboxroads from '../../resources/mapbox-roads.png';
import Outline from '../../resources/outline.png';

interface Props {
    centriodsForMap: {
        provinceCentriodForMap: mapboxgl.LngLatLike;
        districtCentriodForMap: mapboxgl.LngLatLike;
        municipalityCentriodForMap: mapboxgl.LngLatLike;
        wardCentriodForMap: mapboxgl.LngLatLike;
        provinceId: number;
        districtId: number;
        municipalityId: number;
        wardId: number;
        setLattitude: Dispatch<SetStateAction<string | number>>;
        setLongitude: Dispatch<SetStateAction<string | number>>;
        lattitude?: number;
        longitude?: number;
    };
}

const Mappointpicker = (props: Props): JSX.Element => {
    const { centriodsForMap, resetMap, editedCoordinates,
        initialProvinceCenter,
        initialDistrictCenter,
        initialMunCenter, disableMapFilterLofic, disableMapFilter } = props;

    const mapContainerRef = useRef(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [showToggler, setshowToggler] = useState(false);

    const UNSUPPORTED_BROWSER = !mapboxgl.supported();
    const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;

    const [mapStylesChange, setmapStylesChange] = useState('');
    const [loadedStyle, setloadedStyle] = useState(false);


    if (TOKEN) {
        mapboxgl.accessToken = TOKEN;
    }
    const noop = () => { };
    const mapStyles = [
        {
            name: 'none',
            style: `${process.env.REACT_APP_MAP_STYLE_NONE}`,
            color: '#dddddd',
            title: 'Outline',
            description: 'A national political and administrative boundary layer. It’s a default map view.',
            icon: Outline,
        },
        {
            name: 'light',
            style: `${process.env.REACT_APP_MAP_STYLE_LIGHT}`,
            color: '#cdcdcd',
            title: 'Mapbox Light',
            description: 'Mapbox Light is map view designed to provide geographic context while highlighting the data on your dashboard, data visualization, or data overlay.',
            icon: Mapboxlight,
        },
        {
            name: 'roads',
            style: `${process.env.REACT_APP_MAP_STYLE_ROADS}`,
            color: '#671076',
            title: 'Mapbox Roads',
            description: 'Mapbox Roads is a map view highlighting the road features designed specifically for navigation.',
            icon: Mapboxroads,
        },
        {
            name: 'satellite',
            style: `${process.env.REACT_APP_MAP_STYLE_SATELLITE}`,
            color: '#c89966',
            title: 'Mapbox Satellite',
            description: 'Mapbox Satellite overlays satellite imagery onto the map and highlights roads, buildings and major landmarks for easy identification.',
            icon: Satelliteimg,
        },
    ];

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (UNSUPPORTED_BROWSER) {
            console.error('No Mapboxgl support.');
            return noop;
        }

        const { current: mapContainer } = mapContainerRef;
        if (!mapContainer) {
            console.error('No container found.');
            return noop;
        }
        const Map = new mapboxgl.Map({
            container: mapContainer,
            style: mapStyles.filter(n => n.name === 'none')[0].style,
            zoom: 6,
            center: [84.2676, 28.5465],
            minZoom: 2,
            maxZoom: 22,
        });
        map.current = Map;

        Map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
        Map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        Map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                // When active the map will receive updates to the
                // device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate
                // which direction the device is heading.
                showUserHeading: true,
            }),
        );
        const marker = new mapboxgl.Marker({ draggable: false, color: 'blue' });
        if (editedCoordinates) {
            if (Object.keys(editedCoordinates).length > 0) {
                const coordinates = {
                    lat: editedCoordinates.point.coordinates[1],
                    lng: editedCoordinates.point.coordinates[0],
                };

                const popup1 = new mapboxgl.Popup({ anchor: 'top' })
                    .setLngLat(coordinates)
                    .setHTML(` Lattitude : ${coordinates.lat}  Longitude : ${coordinates.lng}`)
                    .addTo(Map);
                marker.setLngLat(coordinates).addTo(Map);
                Map.fitBounds(editedCoordinates.wards[0].bbox);
            }
        }
        if (!props.disabled) {
            Map.on('click', (event) => {
                const coordinates = event.lngLat;
                const latitude = Number(coordinates.lat.toFixed(8));
                const longitude = Number(coordinates.lng.toFixed(8));
                centriodsForMap.setLattitude(latitude);
                centriodsForMap.setLongitude(longitude);
                marker.setLngLat(coordinates).addTo(Map);
                while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
                    const popup = new mapboxgl.Popup({ offset: 35 })
                        .setLngLat(coordinates)
                        .setHTML(` Lattitude : ${coordinates.lat}  Longitude : ${coordinates.lng}`)
                        .addTo(Map);
                }
            });
        }


        Map.on('idle', () => { disableMapFilterLofic(false); });

        Map.on('style.load', () => {
            Map.addSource('nepal', {
                type: 'vector',
                url: 'mapbox://yilab.25pvy15o',
            });
            Map.addLayer({
                id: 'province-line',
                source: 'nepal',
                'source-layer': 'provincegeo',
                type: 'line',
                layout: {
                    visibility: 'visible',
                },
                paint: {
                    'line-color': '#000000',
                    'line-width': 1,
                },
            });
            Map.addLayer({
                id: 'province-name',
                source: 'nepal',
                'source-layer': 'provincegeo',
                type: 'symbol',
                layout: {
                    visibility: 'visible',
                    'text-field': ['get', 'title_en'],
                    'text-anchor': 'center',
                    'text-size': 12,
                },
                paint: {
                    'text-color': 'black',
                },
            });

            Map.addLayer({
                id: 'district-line',
                source: 'nepal',
                'source-layer': 'districtgeo',
                type: 'line',
                layout: {
                    visibility: 'none',
                },
                paint: {
                    'line-color': '#000000',
                    'line-width': 1,
                },
            });
            Map.addLayer({
                id: 'district-name',
                source: 'nepal',
                'source-layer': 'districtgeo',
                type: 'symbol',
                layout: {
                    visibility: 'none',
                    'text-field': ['get', 'title_en'],
                    'text-anchor': 'center',
                    'text-size': 11,
                },
                paint: {
                    'text-color': 'black',
                },
            });
            Map.addLayer({
                id: 'municipality-line',
                source: 'nepal',
                'source-layer': 'municipalitygeo',
                type: 'line',
                layout: {
                    visibility: 'none',
                },
                paint: {
                    'line-color': '#000000',
                    'line-width': 0.8,
                },
            });
            Map.addLayer({
                id: 'municipality-name',
                source: 'nepal',
                'source-layer': 'municipalitygeo',
                type: 'symbol',
                layout: {
                    visibility: 'none',
                    'text-field': ['get', 'title_en'],
                    'text-anchor': 'center',
                    'text-size': 11,

                },
                paint: {
                    'text-color': 'black',
                },
            });
            Map.addLayer({
                id: 'ward-line',
                source: 'nepal',
                'source-layer': 'wardgeo',
                type: 'line',
                layout: {
                    visibility: 'none',
                },
                paint: {
                    'line-color': '#000000',
                    'line-width': 1,
                },
            });
            Map.addLayer({
                id: 'ward-name',
                source: 'nepal',
                'source-layer': 'wardgeo',
                type: 'symbol',
                layout: {
                    visibility: 'none',
                    'text-field': ['get', 'title'],
                    'text-anchor': 'center',
                },
                paint: {
                    'text-color': 'black',
                },
            });
            if (editedCoordinates && Object.keys(editedCoordinates).length > 0) {
                Map.setFilter('municipality-line', ['all', ['==', ['get', 'id'], `${editedCoordinates.wards[0].municipality.id}`]]);
                Map.setFilter('ward-line', ['all', ['==', ['get', 'municipality'], editedCoordinates.wards[0].municipality.id]]);
                Map.setFilter('ward-name', ['all', ['==', ['get', 'municipality'], editedCoordinates.wards[0].municipality.id]]);
                Map.setLayoutProperty('province-name', 'visibility', 'none');
                Map.setLayoutProperty('district-line', 'visibility', 'none');
                Map.setLayoutProperty('district-name', 'visibility', 'none');
                Map.setLayoutProperty('municipality-name', 'visibility', 'none');
                Map.setLayoutProperty('ward-line', 'visibility', 'visible');
                Map.setLayoutProperty('ward-name', 'visibility', 'visible');
            } else {
                Map.setLayoutProperty('province-line', 'visibility', 'visible');
                Map.setLayoutProperty('province-name', 'visibility', 'visible');
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editedCoordinates]);

    useEffect(() => {
        if (map.current.isStyleLoaded()) {
            if (map.current) {
                if (centriodsForMap.provinceCentriodForMap) {
                    map.current.flyTo({
                        center: centriodsForMap.provinceCentriodForMap,
                        zoom: 7.5,
                        bearing: 0,
                        speed: 3,
                        curve: 1,
                        easing(t) {
                            return t;
                        },
                        essential: true,
                    });
                }

                map.current.setFilter('province-line', ['all', ['==', ['get', 'id'], `${centriodsForMap.provinceId}`]]);
                map.current.setFilter('district-line', ['all', ['==', ['get', 'province'], centriodsForMap.provinceId]]);
                map.current.setFilter('district-name', ['all', ['==', ['get', 'province'], centriodsForMap.provinceId]]);
                map.current.setLayoutProperty('district-line', 'visibility', 'visible');
                map.current.setLayoutProperty('province-line', 'visibility', 'visible');
                map.current.setLayoutProperty('province-name', 'visibility', 'none');
                map.current.setLayoutProperty('district-name', 'visibility', 'visible');
                map.current.setLayoutProperty('municipality-name', 'visibility', 'none');
                map.current.setLayoutProperty('municipality-line', 'visibility', 'none');
                map.current.setLayoutProperty('ward-name', 'visibility', 'none');
                map.current.setLayoutProperty('ward-line', 'visibility', 'none');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [centriodsForMap.provinceCentriodForMap]);


    useEffect(() => {
        if (map.current.isStyleLoaded()) {
            if (map.current) {
                if (centriodsForMap.districtCentriodForMap) {
                    map.current.flyTo({
                        center: centriodsForMap.districtCentriodForMap,
                        zoom: 8.5,
                        bearing: 0,
                        speed: 3,
                        curve: 1,
                        easing(t) {
                            return t;
                        },
                        essential: true,
                    });
                }

                map.current.setFilter('district-line', ['all', ['==', ['get', 'id'], `${centriodsForMap.districtId}`]]);
                map.current.setFilter('municipality-line', ['all', ['==', ['get', 'district'], centriodsForMap.districtId]]);
                map.current.setLayoutProperty('municipality-line', 'visibility', 'visible');
                map.current.setFilter('municipality-name', ['all', ['==', ['get', 'district'], centriodsForMap.districtId]]);
                map.current.setLayoutProperty('province-line', 'visibility', 'none');
                map.current.setLayoutProperty('province-name', 'visibility', 'none');
                map.current.setLayoutProperty('district-name', 'visibility', 'none');
                map.current.setLayoutProperty('municipality-name', 'visibility', 'visible');
                map.current.setLayoutProperty('ward-line', 'visibility', 'none');
                map.current.setLayoutProperty('ward-name', 'visibility', 'none');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [centriodsForMap.districtCentriodForMap]);

    useEffect(() => {
        if (map.current.isStyleLoaded()) {
            if (map.current) {
                if (centriodsForMap.municipalityCentriodForMap) {
                    map.current.flyTo({
                        center: centriodsForMap.municipalityCentriodForMap,
                        zoom: 11,
                        bearing: 0,
                        speed: 3,
                        curve: 1,
                        easing(t) {
                            return t;
                        },
                        essential: true,
                    });
                }
                map.current.setFilter('municipality-line', ['all', ['==', ['get', 'id'], `${centriodsForMap.municipalityId}`]]);
                map.current.setFilter('ward-line', ['all', ['==', ['get', 'municipality'], centriodsForMap.municipalityId]]);
                map.current.setFilter('ward-name', ['all', ['==', ['get', 'municipality'], centriodsForMap.municipalityId]]);
                map.current.setLayoutProperty('ward-line', 'visibility', 'visible');
                map.current.setLayoutProperty('province-name', 'visibility', 'none');
                map.current.setLayoutProperty('district-line', 'visibility', 'none');
                map.current.setLayoutProperty('district-name', 'visibility', 'none');
                map.current.setLayoutProperty('municipality-name', 'visibility', 'none');
                map.current.setLayoutProperty('ward-name', 'visibility', 'visible');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [centriodsForMap.municipalityCentriodForMap]);


    useEffect(() => {
        if (map.current.isStyleLoaded()) {
            if (map.current) {
                if (centriodsForMap.wardCentriodForMap) {
                    map.current.flyTo({
                        center: centriodsForMap.wardCentriodForMap,
                        zoom: 14,
                        bearing: 0,
                        speed: 3,
                        curve: 1,
                        easing(t) {
                            return t;
                        },
                        essential: true,
                    });
                }
                map.current.setLayoutProperty('province-name', 'visibility', 'none');
                map.current.setLayoutProperty('district-line', 'visibility', 'none');
                map.current.setLayoutProperty('district-name', 'visibility', 'none');
                map.current.setLayoutProperty('municipality-name', 'visibility', 'none');
                map.current.setLayoutProperty('ward-line', 'visibility', 'visible');
                map.current.setLayoutProperty('ward-name', 'visibility', 'visible');
            }
        }
    }, [centriodsForMap.wardCentriodForMap, editedCoordinates]);

    // useEffect(() => {
    //     if (map.current.isStyleLoaded()) {
    //         if (map.current) {
    //             if (centriodsForMap.municipalityCentriodForMap) {
    //                 map.current.flyTo({
    //                     zoom: 6.0,
    //                     center: [84.2676, 28.5465],
    //                     bearing: 0,
    //                     speed: 5,
    //                     curve: 1,
    //                     easing(t) {
    //                         return t;
    //                     },
    //                     essential: true,
    //                 });
    //             }
    //             map.current.setLayoutProperty('province-line', 'visibility', 'visible');
    //             map.current.setLayoutProperty('province-name', 'visibility', 'visible');
    //         }
    //     }
    // }, [centriodsForMap.municipalityCentriodForMap, resetMap]);

    const handleClose = () => {
        if (showToggler === false) {
            setshowToggler(true);
        } else {
            setshowToggler(false);
        }
    };
    const handleStyleChange = (style) => {
        map.current.setStyle(style);
        setmapStylesChange(style);
        handleClose();
    };

    return (
        <>

            <div className={styles.mapCSS} ref={mapContainerRef}>
                {disableMapFilter
                    ? (
                        <Loader options={{
                            position: 'absolute',
                            top: '45%',
                            right: 0,
                            bottom: 0,
                            left: '48%',
                            background: 'gray',
                            zIndex: 9999,
                        }}
                        />
                    ) : ''}
                <div className={styles.adminLvlTogglerMain}>
                    <LayersIcon className={styles.layerIcon} onClick={handleClose} />
                    <div className={showToggler
                        ? styles.adminLvlToggler
                        : styles.adminLvlTogglerHide}
                    >
                        {mapStyles.map(item => (
                            <>
                                <div className={styles.mapStyles} role="presentation" onClick={() => handleStyleChange(item.style)}>
                                    <img src={item.icon} alt="" />
                                    <div className={styles.titleDescription}>
                                        <span className={styles.title}>
                                            {`${item.title}:`}
                                        </span>
                                        <span className={styles.description}>
                                            {`${item.description.slice(0, 55)}...`}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Mappointpicker;
