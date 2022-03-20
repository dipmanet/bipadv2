export default {
    layers: [
        ['land'],
        ['sand', 'watercover', 'forests', 'residential', 'landuseshrub', 'farmland'],
        ['ward-fill-local'],
        ['watercover', 'waterbody'],
    ],
    zoom: 11.8,


    mapCSS: {
        position: 'absolute',
        width: 'calc(70%)',
        left: 'calc(30% - 60px)',
        top: 0,
        height: '100vh',
    },
    // hillshadeLayerName: 'Butwal',
    ciPages: [3],
    incidentsPages: [2],
    susceptibiltyPages: [4],
    floodHazardLayers: [
        '5', '10', '20', '50', '75', '100',
        '200', '250', '500', '1000',
    ],
    incidentsSliderDelay: 2000,
};
