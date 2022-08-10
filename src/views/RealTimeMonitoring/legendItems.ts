import styles from './styles.scss';

export const rain24LegendItems = [
    { color: '#BA2719', label: '> 140mm', style: styles.symbol },
    { color: '#F3A53A', label: '120mm - 139.9mm', style: styles.symbol },
    { color: '#F8D054', label: '100mm - 119.9mm', style: styles.symbol },
    { color: '#5D9E52', label: '80mm - 99.9mm', style: styles.symbol },
    { color: '#569ED4', label: '0.5mm - 79.9mm', style: styles.symbol },
    { color: '#798590', label: '0.01mm - 0.49mm', style: styles.symbol },
    { color: '#BFBFBF', label: '0mm', style: styles.symbol },
];

export const rain12LegendItems = [
    { color: '#BA2719', label: '> 120mm', style: styles.symbol },
    { color: '#F3A53A', label: '100mm - 119.9mm', style: styles.symbol },
    { color: '#F8D054', label: '80mm - 99.9mm', style: styles.symbol },
    { color: '#5D9E52', label: '60mm - 79.9mm', style: styles.symbol },
    { color: '#569ED4', label: '0.5mm - 59.9mm', style: styles.symbol },
    { color: '#798590', label: '0.01mm - 0.49mm', style: styles.symbol },
    { color: '#BFBFBF', label: '0mm', style: styles.symbol },
];

export const rain6LegendItems = [
    { color: '#BA2719', label: '> 100mm', style: styles.symbol },
    { color: '#F3A53A', label: '80mm - 99.9mm', style: styles.symbol },
    { color: '#F8D054', label: '60mm - 79.9mm', style: styles.symbol },
    { color: '#5D9E52', label: '40mm - 59.9mm', style: styles.symbol },
    { color: '#569ED4', label: '0.5mm - 39.9mm', style: styles.symbol },
    { color: '#798590', label: '0.01mm - 0.49mm', style: styles.symbol },
    { color: '#BFBFBF', label: '0mm', style: styles.symbol },
];

export const rain3LegendItems = [
    { color: '#BA2719', label: '> 80mm', style: styles.symbol },
    { color: '#F3A53A', label: '60mm - 79.9mm', style: styles.symbol },
    { color: '#F8D054', label: '40mm - 59.9mm', style: styles.symbol },
    { color: '#5D9E52', label: '20mm - 39.9mm', style: styles.symbol },
    { color: '#569ED4', label: '0.5mm - 19.9mm', style: styles.symbol },
    { color: '#798590', label: '0.01mm - 0.49mm', style: styles.symbol },
    { color: '#BFBFBF', label: '0mm', style: styles.symbol },
];

export const rain1LegendItems = [
    { color: '#BA2719', label: '> 60mm', style: styles.symbol },
    { color: '#F3A53A', label: '40mm - 59.9mm', style: styles.symbol },
    { color: '#F8D054', label: '20mm - 39.9mm', style: styles.symbol },
    { color: '#5D9E52', label: '10mm - 19.9mm', style: styles.symbol },
    { color: '#569ED4', label: '0.5mm - 9.9mm', style: styles.symbol },
    { color: '#798590', label: '0.01mm - 0.49mm', style: styles.symbol },
    { color: '#BFBFBF', label: '0mm', style: styles.symbol },
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
    { color: '#fee5d9', label: 'Minor (2.0 - 3.9)', radius: 6, style: styles.magnitude },
    { color: '#fcbba1', label: 'Light (4.0 - 4.9)', radius: 8, style: styles.magnitude },
    { color: '#fc9272', label: 'Moderate (5.0 - 5.9)', radius: 12, style: styles.magnitude },
    { color: '#fb6a4a', label: 'Strong (6.0 - 6.9)', radius: 16, style: styles.magnitude },
    { color: '#de2d26', label: 'Major (7.0 - 7.9)', radius: 18, style: styles.magnitude },
    { color: '#a50f15', label: 'Great (>8)', radius: 22, style: styles.magnitude },
];

export const pollutionLegendItems = [
    { order: 1, color: '#00fa2f', key: 'good', label: 'Good (0 - 50)', style: styles.symbol },
    { order: 2, color: '#f7ff00', key: 'moderate', label: 'Moderate (51 - 100)', style: styles.symbol },
    { order: 3, color: '#ff7300', key: 'unhealthyForSensitive', label: 'Unhealthy for Sensitive Groups (101 - 150)', style: styles.symbol },
    { order: 4, color: '#ff0000', key: 'unhealthy', label: 'Unhealthy (151 - 200)', style: styles.symbol },
    { order: 5, color: '#9e0095', key: 'veryUnhealthy', label: 'Very Unhealthy (201 - 300)', style: styles.symbol },
    { order: 6, color: '#8a0014', key: 'hazardous', label: 'Hazardous (301 - 400)', style: styles.symbol },
    { order: 7, color: '#8a0014', key: 'veryHazardous', label: 'Very Hazardous (401 - 500)', style: styles.symbol },
];

export const forestFireLegendItems = [
    { color: '#ff8300', label: 'Forest fire', style: styles.symbol },
];

export const noLegend = [
    { color: 'transparent', label: 'No legends to display', style: styles.noSymbol },
];
