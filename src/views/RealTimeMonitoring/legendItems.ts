import styles from './styles.scss';

export const rainLegendItems = [
    { color: '#2373a9', label: 'Below Warning Level', style: styles.symbol },
    { color: '#FDD835', label: 'Warning Level', style: styles.symbol },
    // { color: 'transparent', label: 'Above Warning Level', style: styles.triangleAboveWarning },
    // { color: 'transparent', label: 'Above Danger Level', style: styles.triangleAboveDanger },
    // { color: '#ACACAB', label: 'Status Not Available', style: styles.symbol },
];

export const riverLegendItems = [
    { color: '#7CB342', label: 'Below Warning Level', style: styles.symbol },
    { color: '#FDD835', label: 'Above Warning Level', style: styles.symbol },
    { color: '#e53935', label: 'Above Danger Level', style: styles.symbol },
];

// the code below is different due to the requirement of river icon to be triangle
export const newRiverLegendItems = [
    { order: 1, color: '#7CB342', label: 'Below Warning Level and Steady', style: styles.box },
    { order: 2, color: 'transparent', label: 'Below Warning Level and Rising', style: styles.triangleRisingBelowWarning },
    { order: 3, color: 'transparent', label: 'Below Warning Level and Falling', style: styles.triangleFallingBelowWarning },
    { order: 4, color: '#FDD835', label: 'Above Warning Level and Steady', style: styles.box },
    { order: 5, color: 'transparent', label: 'Above Warning Level and Rising', style: styles.triangleRisingAboveWarning },
    { order: 6, color: 'transparent', label: 'Above Warning Level and Falling', style: styles.triangleFallingAboveWarning },
    { order: 7, color: '#E53935', label: 'Above Danger Level and Steady', style: styles.box },
    { order: 8, color: 'transparent', label: 'Above Danger Level and Rising', style: styles.triangleRisingAboveDanger },
    { order: 9, color: 'transparent', label: 'Above Danger Level and Falling', style: styles.triangleFallingAboveDanger },
];

export const earthquakeLegendItems = [
    { color: '#fee5d9', label: 'Minor (>= 3)', radius: 6, style: styles.symbol },
    { color: '#fcbba1', label: 'Light (>= 4)', radius: 8, style: styles.symbol },
    { color: '#fc9272', label: 'Moderate (>= 5)', radius: 12, style: styles.symbol },
    { color: '#fb6a4a', label: 'Strong (>= 6)', radius: 16, style: styles.symbol },
    { color: '#de2d26', label: 'Major (>= 7)', radius: 18, style: styles.symbol },
    { color: '#a50f15', label: 'Great (>= 8)', radius: 22, style: styles.symbol },
];

export const pollutionLegendItems = [
    { order: 1, color: '#00fa2f', key: 'good', label: 'Good (0 to 50)', style: styles.symbol },
    { order: 2, color: '#f7ff00', key: 'moderate', label: 'Moderate (51 to 100)', style: styles.symbol },
    { order: 3, color: '#ff7300', key: 'unhealthyForSensitive', label: 'Unhealthy for Sensitive Groups (101 to 150)', style: styles.symbol },
    { order: 4, color: '#ff0000', key: 'unhealthy', label: 'Unhealthy (151 to 200)', style: styles.symbol },
    { order: 5, color: '#9e0095', key: 'veryUnhealthy', label: 'Very Unhealthy (201 to 300)', style: styles.symbol },
    { order: 6, color: '#8a0014', key: 'hazardous', label: 'Hazardous (301 to 400)', style: styles.symbol },
    { order: 7, color: '#8a0014', key: 'veryHazardous', label: 'Very Hazardous (401 to 500)', style: styles.symbol },
];

export const forestFireLegendItems = [
    { color: '#ff8300', label: 'Forest fire', style: styles.symbol },
];

export const noLegend = [
    { color: 'transparent', label: 'No legends to display', style: styles.symbol },
];
