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
    { color: '#7CB342', label: 'Below Warning Level and Steady', style: styles.box },
    { color: 'transparent', label: 'Below Warning Level and Rising', style: styles.triangleRisingBelowWarning },
    { color: 'transparent', label: 'Below Warning Level and Falling', style: styles.triangleFallingBelowWarning },
    { color: '#FDD835', label: 'Above Warning Level and Steady', style: styles.box },
    { color: 'transparent', label: 'Above Warning Level and Rising', style: styles.triangleRisingAboveWarning },
    { color: 'transparent', label: 'Above Warning Level and Falling', style: styles.triangleFallingAboveWarning },
    { color: '#E53935', label: 'Above Danger Level and Steady', style: styles.box },
    { color: 'transparent', label: 'Above Danger Level and Rising', style: styles.triangleRisingAboveDanger },
    { color: 'transparent', label: 'Above Danger Level and Falling', style: styles.triangleFallingAboveDanger },
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
    { color: '#009966', label: 'Good (<= 12)', style: styles.symbol },
    { color: '#ffde33', label: 'Moderate (<= 35.4)', style: styles.symbol },
    { color: '#ff9933', label: 'Unhealthy for Sensitive Groups (<= 55.4)', style: styles.symbol },
    { color: '#cc0033', label: 'Unhealthy (<= 150.4)', style: styles.symbol },
    { color: '#660099', label: 'Very Unhealthy (<= 350.4)', style: styles.symbol },
    { color: '#7e0023', label: 'Hazardous (<= 500.4)', style: styles.symbol },
];

export const forestFireLegendItems = [
    { color: '#ff8300', label: 'Forest fire', style: styles.symbol },
];

export const noLegend = [
    { color: 'transparent', label: 'No legends to display', style: styles.symbol },
];
