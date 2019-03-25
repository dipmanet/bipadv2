export const provincesOutline = {
    'line-color': '#a3b7e3',
    'line-width': 2,
};

export const districtsOutline = {
    'line-color': '#a3b7e3',
    'line-width': 1.4,
};

export const municipalitiesOutline = {
    'line-color': '#a3b7e3',
    'line-width': 0.8,
};

export const wardsOutline = {
    'line-color': '#a3b7e3',
    'line-width': 0.5,
};

export const provincesFill = {
    'fill-color': '#0081f0',
    'fill-opacity': 0.1,
};

export const alertFill = {
    'fill-color': ['get', 'hazardColor'],
    'fill-opacity': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0.8,
    ],
};
