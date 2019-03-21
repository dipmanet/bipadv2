export const districtsFill = {
    'fill-color': '#0081f0',
    'fill-opacity': 0.1,
};

export const districtsOutline = {
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

export const polygonFill = {
    'fill-color': 'red',
    'fill-opacity': 0.4,
};

export const resourcePointPaint = {
    'circle-color': '#ffffff',
    'circle-radius': 10,
    'circle-opacity': ['case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0.9,
    ],
};

export const resourceIconLayout = {
    'icon-image': ['get', 'iconName'],
    'icon-size': 1,
};
