export const boundsFill = {
    'fill-color': '#0081f0',
    'fill-opacity': 0.1,
};

export const boundsHoverFill = {
    'fill-color': '#0081f0',
    'fill-opacity': 0.5,
};

export const polygonBoundsFill = {
    'fill-color': ['get', 'hazard'],
};

export const boundsOutline = {
    'line-color': '#4c4caa',
    'line-opacity': 0.2,
    'line-width': 1,
};

export const pointPaint = {
    'circle-color': ['get', 'hazardColor'],
    'circle-radius': {
        property: 'severity',
        type: 'exponential',
        stops: [
            [124, 2],
            [34615, 10],
        ],
    },
    'circle-opacity': 0.9,
};

export const hoverPaint = {
    'circle-radius': {
        property: 'severity',
        type: 'exponential',
        stops: [
            [124, 2],
            [34615, 10],
        ],
    },
    'circle-opacity': 0.6,
};

export const polygonHoverPaint = {
    'fill-opacity': 0.6,
};
