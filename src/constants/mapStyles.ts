const incidentCircleRadii = [
    'case',
    ['==', ['get', 'severity'], 'Minor'], 8,
    ['==', ['get', 'severity'], 'Major'], 11,
    ['==', ['get', 'severity'], 'Severe'], 15,
    ['==', ['get', 'severity'], 'Catastrophic'], 20,
    7,
];

export default {
    province: {
        outline: {
            'line-color': '#004d40',
            'line-width': 1,
        },
        choroplethOutline: {
            'line-color': '#000000',
            'line-width': 1,
        },
        fill: {
            'fill-color': '#000000',
            'fill-opacity': 0.1,
        },
    },
    district: {
        outline: {
            'line-color': '#004d40',
            'line-width': 1,
        },
        choroplethOutline: {
            'line-color': '#000000',
            'line-width': 1,
        },
        fill: {
            'fill-color': '#000000',
            'fill-opacity': 0.1,
        },
    },
    municipality: {
        outline: {
            'line-color': '#72b6ac',
            'line-width': 1,
        },
        choroplethOutline: {
            'line-color': '#000000',
            'line-width': 1,
        },
        fill: {
            'fill-color': '#000000',
            'fill-opacity': 0.1,
        },
    },
    ward: {
        outline: {
            'line-color': '#d0e8e4',
            'line-width': 1,
        },
        choroplethOutline: {
            'line-color': '#000000',
            'line-width': 1,
        },
        fill: {
            'fill-color': '#000000',
            'fill-opacity': 0.1,
        },
    },
    provinceLabel: {
        paint: {
            'text-color': '#002121',
            'text-halo-color': 'rgba(255, 255, 255, 0.7)',
            'text-halo-width': 2,
        },
        layout: {
            visibility: 'visible',
            // 'text-allow-overlap': true,
            'text-font': ['Rubik Bold'],
            'text-field': ['get', 'title'],
            'text-size': 12,
            'text-transform': 'uppercase',
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
    districtLabel: {
        paint: {
            'text-color': '#00695c',
            'text-halo-color': 'rgba(255, 255, 255, 0.7)',
            'text-halo-width': 2,
        },
        layout: {
            visibility: 'visible',
            'text-font': ['Rubik Bold'],
            'text-field': ['get', 'title'],
            'text-size': 11,
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
    municipalityLabel: {
        paint: {
            'text-color': '#00695c',
            'text-halo-color': 'rgba(255, 255, 255, 0.7)',
            'text-halo-width': 2,
        },
        layout: {
            visibility: 'visible',
            'text-font': ['Rubik Bold'],
            'text-field': ['get', 'title'],
            'text-size': 10,
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
    wardLabel: {
        paint: {
            'text-color': '#1c9688',
            'text-halo-color': 'rgba(255, 255, 255, 0.7)',
            'text-halo-width': 2,
        },
        layout: {
            visibility: 'visible',
            'text-font': ['Rubik Bold'],
            'text-field': ['get', 'title'],
            'text-size': 10,
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },

    alertPoint: {
        circle: {
            'circle-color': ['get', 'hazardColor'],
            'circle-radius': 8,
            'circle-stroke-color': '#000000',
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                3,
                1,
            ],
            'circle-opacity': 0.9,
        },
        circleDim: {
            'circle-color': ['get', 'hazardColor'],
            'circle-radius': 8,
            'circle-stroke-color': '#000000',
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                3,
                0,
            ],
            'circle-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.1,
            ],
        },
        animatedCircle: {
            'circle-color': ['get', 'hazardColor'],

            'circle-radius': 0,
            'circle-opacity': 0,

            'circle-radius-transition': { duration: 0 },
            'circle-opacity-transition': { duration: 0 },
            'circle-stroke-opacity': 0.2,
            'circle-stroke-color': ['get', 'hazardColor'],
            'circle-stroke-width': 1,
        },
    },
    alertConvex: {
        outline: {
            'line-color': ['get', 'hazardColor'],
            'line-width': 2,
            'line-dasharray': [2, 2],
            'line-offset': -6,
        },
    },
    alertPolygon: {
        fill: {
            'fill-color': ['get', 'hazardColor'],
            'fill-opacity': 0.3,
        },
        outline: {
            'line-color': ['get', 'hazardColor'],
            'line-width': 1,
            'line-dasharray': [2, 3],
        },
    },

    eventSymbol: {
        layout: {
            'text-field': '■',
            'text-allow-overlap': true,
            'text-size': 32,
        },
        paint: {
            'text-color': ['get', 'hazardColor'],
            'text-halo-color': '#000000',
            'text-halo-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                1,
            ],
            'text-opacity': 0.9,
        },
        paintDim: {
            'text-color': ['get', 'hazardColor'],
            'text-halo-color': '#000000',
            'text-halo-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                1,
            ],
            'text-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.1,
            ],
        },
    },

    eventConvex: {
        outline: {
            'line-color': ['get', 'hazardColor'],
            'line-width': 1,
            'line-dasharray': [2, 2],
            'line-offset': -6,
        },
    },
    eventPolygon: {
        fill: {
            'fill-color': ['get', 'hazardColor'],
            'fill-opacity': 0.3,
        },
        outline: {
            'line-color': ['get', 'hazardColor'],
            'line-width': 1,
            'line-dasharray': [2, 3],
        },
    },

    incidentPoint: {
        fill: {
            'circle-color': ['get', 'hazardColor'],
            'circle-radius': [...incidentCircleRadii],
            'circle-opacity': 0.8,
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                3,
                1,
            ],
            'circle-stroke-color': '#414141',
        },
        dimFill: {
            'circle-color': ['get', 'hazardColor'],
            'circle-radius': [...incidentCircleRadii],
            'circle-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.1,
            ],
            'circle-stroke-color': '#000000',
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                3,
                0,
            ],
        },
        animatedFill: {
            'circle-color': ['get', 'hazardColor'],

            'circle-radius': 0,
            'circle-opacity': 0,

            'circle-radius-transition': { duration: 0 },
            'circle-opacity-transition': { duration: 0 },
            'circle-stroke-opacity': 0.2,
            'circle-stroke-color': ['get', 'hazardColor'],
            'circle-stroke-width': 1,
        },
    },
    // FIXME: remove incident polygon
    incidentPolygon: {
        fill: {
            'fill-color': ['get', 'hazardColor'],
            'fill-opacity': 0.9,
            'fill-outline-color': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                '#000000',
                ['get', 'hazardColor'],
            ],
        },
    },

    resourceCluster: {
        circle: {
            'circle-color': '#ffeb3b',
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                10,
                100,
                20,
                750,
                30,
            ],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#000000',
            'circle-stroke-opacity': 0.3,
        },
    },

    resourcePoint: {
        circle: {
            'circle-color': '#ffffff',
            'circle-radius': 13,
            'circle-opacity': 0.9,
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                1,
            ],
            'circle-stroke-color': '#000000',
            'circle-stroke-opacity': 0.3,
        },
    },

    resourceSymbol: {
        layout: {
            'icon-image': ['get', 'iconName'],
            'icon-size': 0.2,
        },
        symbol: {
            // 'icon-color': 'red',
        },
    },

    rainPoint: {
        paint: {
            'circle-radius': 10,
            'circle-color': [
                'case',
                ['==', ['get', 'status'], 'BELOW WARNING LEVEL'], '#7CB342',
                ['==', ['get', 'status'], 'ABOVE WARNING LEVEL'], '#FDD835',
                ['==', ['get', 'status'], 'ABOVE DANGER LEVEL'], '#e53935',
                '#000000',
            ],
            'circle-opacity': [
                'case',
                ['==', ['get', 'status'], 'BELOW WARNING LEVEL'], 0.3,
                ['==', ['get', 'status'], 'ABOVE WARNING LEVEL'], 1,
                ['==', ['get', 'status'], 'ABOVE DANGER LEVEL'], 1,
                0.2,
            ],
            'circle-stroke-color': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                '#000000',
                'rgba(0, 0, 0, 0)',
            ],
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0,
            ],
        },
    },

    riverPoint: {
        layout: {
            'text-field': [
                'case',
                ['==', ['get', 'steady'], 'STEADY'], '●',
                ['==', ['get', 'steady'], 'RISING'], '▲',
                ['==', ['get', 'steady'], 'FALLING'], '▼',
                '\u25CF',
            ],
            'text-allow-overlap': true,
            'text-size': 24,
        },
        paint: {
            'circle-radius': 10,
            'circle-color': [
                'case',
                ['==', ['get', 'status'], 'BELOW WARNING LEVEL'], '#7CB342',
                ['==', ['get', 'status'], 'ABOVE WARNING LEVEL'], '#FDD835',
                ['==', ['get', 'status'], 'ABOVE DANGER LEVEL'], '#e53935',
                '#000000',
            ],
            'circle-opacity': [
                'case',
                ['==', ['get', 'steady'], 'STEADY'], 0.3,
                ['==', ['get', 'steady'], 'RISING'], 1,
                ['==', ['get', 'steady'], 'FALLING'], 1,
                0.3,
            ],

            'circle-stroke-color': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                '#000000',
                'rgba(0, 0, 0, 0)',
            ],
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0,
            ],
        },
    },

    firePoint: {
        layout: {
            'text-field': '◆',
            'text-allow-overlap': true,
            'text-size': 24,
        },
        paint: {
            'circle-radius': 10,
            'circle-color': '#e05648',
            'circle-opacity': 0.8,
            // 'circle-opacity': ['get', 'opacity'],
            'circle-stroke-color': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                '#000000',
                'rgba(0, 0, 0, 0)',
            ],
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0,
            ],
        },
    },

    pollutionPoint: {
        fill: {
            'circle-radius': 10,
            'circle-color': ['get', 'aqiColor'],
        },
    },
    pollutionText: {
        layout: {
            'text-font': ['League Mono Regular'],
            'text-field': ['get', 'aqi'],
            'text-allow-overlap': false,
            'text-size': 10,
            'symbol-sort-key': ['-', ['get', 'aqi']],
        },
        paint: {
            'text-color': '#000000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1.5,
        },
    },

    earthquakePoint: {
        fill: {
            'circle-radius': [
                'case',
                ['>=', ['get', 'magnitude'], 8], 21,
                ['>=', ['get', 'magnitude'], 7], 18,
                ['>=', ['get', 'magnitude'], 6], 15,
                ['>=', ['get', 'magnitude'], 5], 11,
                ['>=', ['get', 'magnitude'], 4], 8,
                7,
            ],
            'circle-color': [
                'case',
                ['>=', ['get', 'magnitude'], 8], '#a50f15',
                ['>=', ['get', 'magnitude'], 7], '#de2d26',
                ['>=', ['get', 'magnitude'], 6], '#fb6a4a',
                ['>=', ['get', 'magnitude'], 5], '#fc9272',
                ['>=', ['get', 'magnitude'], 4], '#fcbba1',
                '#fee5d9',
            ],
            'circle-stroke-color': '#000000',
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                0,
            ],
        },
    },
    earthquakeText: {
        layout: {
            'text-font': ['League Mono Regular'],
            'text-field': ['get', 'magnitude'],
            'text-allow-overlap': false,
            'text-size': [
                'case',
                ['>=', ['get', 'magnitude'], 8], 12,
                ['>=', ['get', 'magnitude'], 7], 11,
                ['>=', ['get', 'magnitude'], 6], 10,
                ['>=', ['get', 'magnitude'], 5], 9,
                ['>=', ['get', 'magnitude'], 4], 8,
                7,
            ],
            // NOTE: should negate idk why
            'symbol-sort-key': ['-', ['get', 'magnitude']],
        },
        paint: {
            'text-color': '#000000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1.5,
        },
    },
    contactPoint: {
        circle: {
            'circle-color': '#1565c0',
            'circle-radius': 7,
            'circle-opacity': 1,
        },
        clusteredCircle: {
            'circle-color': '#1565c0',
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'point_count'],
                2,
                10,
                40,
                100,
            ],
            'circle-opacity': 1,
        },
        clusterLabelLayout: {
            'text-field': '{point_count_abbreviated}',
            'text-size': 12,
        },
        clusterLabelPaint: {
            'text-color': '#ffffff',
        },
    },
};
