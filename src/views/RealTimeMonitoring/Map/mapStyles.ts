export const boundsFill = {
    'fill-color': '#0081f0',
    'fill-opacity': 0.1,
};

export const boundsHoverFill = {
    'fill-color': '#0081f0',
    'fill-opacity': 0.5,
};

export const boundsOutline = {
    'line-color': '#4c4caa',
    'line-opacity': 0.2,
    'line-width': 1,
};

export const rainPointPaint = {
    'circle-color': '#EC7357',
    'circle-radius': 8,
    'circle-opacity': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0.9,
    ],
};

export const riverPointPaint = {
    'circle-color': '#6C49B8',
    'circle-radius': 8,
    'circle-opacity': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0.9,
    ],
};

export const earthquakePointPaint = {
    'circle-color': '#E41A1C',
    'circle-radius': 8,
    'circle-opacity': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0.9,
    ],
};

export const hoverPaint = {
    'circle-opacity': 0.6,
};
