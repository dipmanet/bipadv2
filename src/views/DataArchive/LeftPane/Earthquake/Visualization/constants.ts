const MAG_4_COLOR = '#fcbba1';
const MAG_5_COLOR = '#fc9272';
const MAG_6_COLOR = '#fb6a4a';
const MAG_7_COLOR = '#de2d26';
const MAG_8_COLOR = '#a50f15';

export const stackedBars = [
    { dataKey: 'mag4', stackId: 'magnitude', fill: MAG_4_COLOR },
    { dataKey: 'mag5', stackId: 'magnitude', fill: MAG_5_COLOR },
    { dataKey: 'mag6', stackId: 'magnitude', fill: MAG_6_COLOR },
    { dataKey: 'mag7', stackId: 'magnitude', fill: MAG_7_COLOR },
    { dataKey: 'mag8', stackId: 'magnitude', fill: MAG_8_COLOR },
];

export const legendData = [
    { id: 1, label: '< 5 ML', fill: MAG_4_COLOR },
    { id: 2, label: '< 6 ML', fill: MAG_5_COLOR },
    { id: 3, label: '< 7 ML', fill: MAG_6_COLOR },
    { id: 4, label: '< 8 ML', fill: MAG_7_COLOR },
    { id: 5, label: '> 8 ML', fill: MAG_8_COLOR },
];
