export const provincesOutline = {
    'line-color': '#a3b7e3',
    'line-width': 2,
};

export const districtsOutline = {
    'line-color': '#a3b7e3',
    'line-width': 1,
};

export const districtsFill = {
    'fill-color': '#0081f0',
    'fill-opacity': ['case',
        ['boolean', ['feature-state', 'selected'], false],
        0.8,
        ['boolean', ['feature-state', 'hover'], false],
        0.4,
        0.1,
    ],
};

export const alertFill = {
    'fill-color': ['get', 'hazardColor'],
    'fill-opacity': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0.8,
    ],
};
