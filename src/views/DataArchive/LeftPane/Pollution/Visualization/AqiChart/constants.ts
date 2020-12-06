const GOOD_COLOR = '#00fa2f';
const MODERATE_COLOR = '#f7ff00';
const UNHEALTHY_FOR_SENSITIVE_COLOR = '#ff7300';
const UNHEALTHY_COLOR = '#ff0000';
const VERY_UNHEALTHY_COLOR = '#9e0095';
const HAZARDOUS_COLOR = '#8a0014';

export const stackedBars = [
    { dataKey: 'good', stackId: 'pollution', fill: GOOD_COLOR },
    { dataKey: 'moderate', stackId: 'pollution', fill: MODERATE_COLOR },
    { dataKey: 'unhealthyForSensitive', stackId: 'pollution', fill: UNHEALTHY_FOR_SENSITIVE_COLOR },
    { dataKey: 'unhealthy', stackId: 'pollution', fill: UNHEALTHY_COLOR },
    { dataKey: 'veryUnhealthy', stackId: 'pollution', fill: VERY_UNHEALTHY_COLOR },
    { dataKey: 'hazardous', stackId: 'pollution', fill: HAZARDOUS_COLOR },
    { dataKey: 'veryHazardous', stackId: 'pollution', fill: HAZARDOUS_COLOR },
];

export const legendData = [
    { id: 1, label: 'Good', fill: GOOD_COLOR },
    { id: 2, label: 'Moderate', fill: MODERATE_COLOR },
    { id: 3, label: 'Unhealthy for Sensitive Groups', fill: UNHEALTHY_FOR_SENSITIVE_COLOR },
    { id: 4, label: 'Unhealthy', fill: UNHEALTHY_COLOR },
    { id: 5, label: 'Very Unhealthy', fill: VERY_UNHEALTHY_COLOR },
    { id: 6, label: 'Hazardous', fill: HAZARDOUS_COLOR },
    { id: 7, label: 'Very Hazardous', fill: HAZARDOUS_COLOR },
];
