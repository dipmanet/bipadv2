export default {
    province: {
        outline: {
            'line-color': '#a3b7e3',
            'line-width': 2,
        },
        fill: {
            'fill-color': '#0081f0',
            'fill-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.2,
                0.05,
            ],
        },
    },
    district: {
        outline: {
            'line-color': '#a3b7e3',
            'line-width': 1.4,
        },
        fill: {
            // NOTE: hover and selection enabled in district
            'fill-color': '#0081f0',
            'fill-opacity': ['case',
                ['boolean', ['feature-state', 'selected'], false],
                0.5,
                ['boolean', ['feature-state', 'hover'], false],
                0.2,
                0.05,
            ],
        },
    },
    municipality: {
        outline: {
            'line-color': '#a3b7e3',
            'line-width': 0.8,
        },
        fill: {
            'fill-color': '#0081f0',
            'fill-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.2,
                0.05,
            ],
        },
    },
    ward: {
        outline: {
            'line-color': '#a3b7e3',
            'line-width': 0.5,
        },
        fill: {
            'fill-color': '#0081f0',
            'fill-opacity': 0.1,
        },
    },
    alertPolygon: {
        fill: {
            'fill-color': ['get', 'hazardColor'],
            'fill-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.8,
            ],
        },
    },
    incidentPoint: {
        fill: {
            'circle-color': ['get', 'hazardColor'],
            'circle-radius': {
                property: 'severity',
                type: 'exponential',
                stops: [
                    [124, 2],
                    [34615, 10],
                ],
            },
            'circle-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.9,
            ],
        },
    },
    incidentPolygon: {
        fill: {
            'fill-color': ['get', 'hazardColor'],
            'fill-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.9,
            ],
        },
    },
    resourcePoint: {
        circle: {
            'circle-color': '#ffffff',
            'circle-radius': 10,
            'circle-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.9,
            ],
        },
        layout: {
            'icon-image': ['get', 'iconName'],
            'icon-size': 1,
        },
    },
    rainPoint: {
        layout: {
            'text-field': '■',
            'text-allow-overlap': true,
            'text-size': 24,
        },
        paint: {
            'text-color': [
                'case',
                ['==', ['get', 'status'], 'BELOW WARNING LEVEL'], '#03A9F4',
                ['==', ['get', 'status'], 'ABOVE WARNING LEVEL'], '#3F51B5',
                ['==', ['get', 'status'], 'ABOVE DANGER LEVEL'], '#9c27b0',
                '#03A9F4',
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
            'text-color': [
                'case',
                ['==', ['get', 'status'], 'BELOW WARNING LEVEL'], '#00C853',
                ['==', ['get', 'status'], 'ABOVE WARNING LEVEL'], '#304FFE',
                ['==', ['get', 'status'], 'ABOVE DANGER LEVEL'], '#C51162',
                '#00C853',
            ],
        },
    },
    earthquakePoint: {
        fill: {
            'circle-color': '#D50000',
            'circle-radius': 6,
            'circle-opacity': [
                'case',
                ['>=', ['get', 'magnitude'], 8], 1,
                ['>=', ['get', 'magnitude'], 7], 0.9,
                ['>=', ['get', 'magnitude'], 6], 0.8,
                ['>=', ['get', 'magnitude'], 5], 0.7,
                ['>=', ['get', 'magnitude'], 4], 0.6,
                0.5,
            ],
        },
    },
};
