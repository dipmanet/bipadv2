export default {
    layers: [
        ['National Park', 'National Park Text', 'Buildings'],
        ['Population Density', 'ward-fill-local'],
        ['Shrub', 'Forest', 'Farmlands', 'Buildings', 'Roads', 'Snow'],
        ['Shrub', 'Forest', 'Farmlands', 'Buildings', 'Roads', 'Snow'],
        ['Shrub', 'Forest', 'Farmlands', 'Buildings', 'Roads', 'Snow'],
        ['Shrub', 'Forest', 'Farmlands', 'Buildings', 'Roads', 'Snow'],
        ['Shrub', 'Forest', 'Farmlands', 'Buildings', 'Roads', 'Snow'],
    ],
    mapboxStyle: process.env.REACT_APP_VIZRISK_JUGAL_LANDSLIDE,
    zoom: 9.8,
    lng: 85.79108507481781,
    lat: 28.015490220644214,
    mapCSS: {
        position: 'absolute',
        width: 'calc(70%)',
        left: 'calc(30% - 60px)',
        top: 0,
        height: '100vh',
    },
    hillshadeLayerName: 'Jugal_hillshade',
    ciPages: [4],
    incidentsPages: [5],
    incidentsSliderDelay: 2000,

};
