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
        fill: {
            'circle-color': '#EC7357',
            'circle-radius': 6,
            'circle-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.9,
            ],
        },
    },
    riverPoint: {
        fill: {
            'circle-color': '#6C49B8',
            'circle-radius': 6,
            'circle-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.9,
            ],
        },
    },
    earthquakePoint: {
        fill: {
            'circle-color': '#E41A1C',
            'circle-radius': 6,
            'circle-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.9,
            ],
        },
    },
};
