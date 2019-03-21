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

export const pointPaint = {
    'circle-color': '#E71D36',
    'circle-radius': 8,
    'circle-opacity': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        0.9,
        0.5,
    ],
};

export const hoverPaint = {
    'circle-opacity': 0.6,
};
