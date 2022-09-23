import memoize from 'memoize-one';


export const generateColor = memoize((maxValue, minValue, colorMapping) => {
    const newColor = [];
    const { length } = colorMapping;
    const range = maxValue - minValue;
    colorMapping.forEach((color, i) => {
        const val = minValue + ((i * range) / (length - 1));
        newColor.push(val);
        newColor.push(color);
    });
    return newColor;
});

export const generatePaint = memoize(color => ({
    'fill-color': [
        'interpolate',
        ['linear'],
        ['feature-state', 'value'],
        ...color,
    ],
}));

export const generateMapState = memoize((geoareas, groupedIncidentMapping, metricFn) => {
    const value = geoareas.map(geoarea => ({
        id: geoarea.id,
        value: groupedIncidentMapping
            ? metricFn(groupedIncidentMapping[geoarea.id])
            : 0,
    }));
    return value;
});

export const colorGrade = [
    '#ffe5d4',
    '#f9d0b8',
    '#f2bb9e',
    '#eca685',
    '#e4906e',
    '#dd7a59',
    '#d46246',
    '#cb4836',
    '#c22727',
];
