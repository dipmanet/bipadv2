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

    populationDensity: {
        // url: `${process.env.REACT_APP_VIZ_RISK_MAP_SOURCE_DENSITY_POPULATION}`,
        url: 'mapbox://ankur20.92mbzrhu',
        layers: {
            density: 'density-b7o1uo',
        },
    },

    criticalInfrastructures: {
        // url: `${process.env.REACT_APP_VIZ_RISK_MAP_SOURCE_CRITICAL_INFRASTRUCTURES}`,
        url: 'mapbox://ankur20.3dfvc4sr',
        layers: {
            infrastructures: 'criticalInfrastructures-3a49md',
        },
    },
};
