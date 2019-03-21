export const districtsFill = {
    'fill-color': '#0081f0',
    'fill-opacity': 0.1,
};

export const districtsOutline = {
    'line-color': '#4c4caa',
    'line-opacity': 0.2,
    'line-width': 1,
};

export const polygonFill = {
    'fill-color': 'red',
    'fill-opacity': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        0.8,
        0.5,
    ],
};
