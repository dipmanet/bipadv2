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

    nepal1: {
        url: `${process.env.REACT_APP_VIZ_RISK_MAP_SOURCE_NEPAL}`,
        layers: {
            province: 'provincegeo',
            district: 'districtgeo',
            municipality: 'municipalitygeo',
            ward: 'wardgeo',
        },
    },

    nepalCentroid1: {
        url: `${process.env.RECT_APP_VIZ_RISK_MAP_SOURCE_NEPAL_CENTROID}`,
        layers: {
            province: 'provincecentroidgeo',
            district: 'districtcentroidgeo',
            municipality: 'municipalitycentroidgeo',
            ward: 'wardcentroidgeo',
        },
    },

    populationDensity: {
        url: `${process.env.REACT_APP_VIZ_RISK_MAP_SOURCE_DENSITY_POPULATION}`,
        layers: {
            density: 'density-b7o1uo',
        },
    },

    criticalInfrastructures: {
        url: `${process.env.REACT_APP_VIZ_RISK_MAP_SOURCE_CRITICAL_INFRASTRUCTURES}`,
        layers: {
            infrastructures: 'criticalInfrastructures-3a49md',
        },
    },
};
