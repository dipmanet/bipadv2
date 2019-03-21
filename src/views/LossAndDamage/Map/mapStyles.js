export const boundsFill = {
    'fill-color': '#0081f0',
    'fill-opacity': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0.1,
    ],
};

export const boundsHoverFill = {
    'fill-color': '#0081f0',
    'fill-opacity': 0.1,
};

export const activeBoundsFill = {
    'fill-color': '#0081f0',
    'fill-opacity': 0.6,
};

export const polygonBoundsFill = {
    'fill-color': 'red',
    'fill-opacity': 0.4,
};

export const boundsOutline = {
    'line-color': '#4c4caa',
    'line-opacity': 0.2,
    'line-width': 1,
};

export const pointPaint = {
    'circle-color': [
        'match',
        ['get', 'severity'],
        'catastropic', '#ff4656',
        'major', '#f08842',
        'minor', '#f0b676',
        '#4666b0',
    ],
    'circle-radius': [
        'match',
        ['get', 'severity'],
        'catastropic', 10,
        'major', 9,
        'minor', 8,
        8,
    ],
    'circle-opacity': [
        'match',
        ['get', 'severity'],
        'catastropic', 1,
        'major', 0.9,
        'minor', 0.8,
        1,
    ],
};

export const hoverPaint = {
    'circle-color': '#f0f0f0',
    'circle-radius': 9,
    'circle-opacity': 1,
};

export const polygonHoverPaint = {
    'fill-opacity': 0.6,
};
