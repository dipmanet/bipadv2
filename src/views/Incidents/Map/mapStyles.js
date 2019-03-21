export const districtsFill = {
    'fill-color': '#0081f0',
    'fill-opacity': 0.1,
};

export const districtsOutline = {
    'line-color': '#4c4caa',
    'line-opacity': 0.2,
    'line-width': 1,
};

export const incidentPolygonPaint = {
    'fill-color': ['get', 'hazardColor'],
    'fill-opacity': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0.9,
    ],
};

export const incidentPointPaint = {
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
};
