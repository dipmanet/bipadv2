export default {
    nepal: {
        url: 'mapbox://adityakhatri.29zl7210',
        layers: {
            province: 'provincegeo',
            district: 'districtgeo',
            municipality: 'municipalitygeo',
            ward: 'wardgeo',
        },
    },
    // FIXME: remove this
    district: {
        url: 'mapbox://adityakhatri.bp07bn0m',
        sourceLayer: 'districtgeo',
    },
    ward: {
        url: 'mapbox://adityakhatri.9fphxx3w',
        sourceLayer: 'wardgeo',
    },
};
