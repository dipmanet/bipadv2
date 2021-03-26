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
    wardFillLocalTikapur: {
        url: `${process.env.REACT_APP_MAP_SOURCE_TIKAPUR}`,
        layers: {
            ward: 'tikapur_municipality-9jw65r',
        },
    },
    wardFillLocalGulariya: {
        url: `${process.env.REACT_APP_MAP_SOURCE_GULARIYA}`,
        layers: {
            ward: 'mun_gulariya-5k57lz',
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

    // populationDensity: {
    //     // url: `${process.env.REACT_APP_VIZ_RISK_MAP_SOURCE_DENSITY_POPULATION}`,
    //     url: 'mapbox://ankur20.92mbzrhu',
    //     layers: {
    //         density: 'density-b7o1uo',
    //     },
    // },

    criticalInfrastructures: {
        // url: `${process.env.REACT_APP_VIZ_RISK_MAP_SOURCE_CRITICAL_INFRASTRUCTURES}`,
        url: 'mapbox://ankur20.3dfvc4sr',
        layers: {
            infrastructures: 'criticalInfrastructures-3a49md',
        },
    },
};
