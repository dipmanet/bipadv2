export default {
    nepal: {
        url: `${process.env.REACT_APP_MAP_SOURCE_NEPAL}`,
        layers: {
            province: 'provincegeo',
            district: 'districtgeo',
            municipality: 'municipalitygeo',
            ward: 'wardgeo',
            water: 'water copy',
        },
    },

    nepalCentroid: {
        url: `${process.env.REACT_APP_MAP_SOURCE_NEPAL_CENTROID}`,
        layers: {
            province: 'provincecentroidgeo',
            district: 'districtcentroidgeo',
            municipality: 'municipalitycentroidgeo',
            ward: 'wardcentroidgeo',
        },
    },
};
