import styles from './styles.scss';

export const rain24LegendItems = [
    { color: '#BA2719', label: '> 140mm', labelNe: '> 140mm', style: styles.symbol },
    { color: '#F3A53A', label: '120mm - 139.9mm', labelNe: '120mm - 139.9mm', style: styles.symbol },
    { color: '#F8D054', label: '100mm - 119.9mm', labelNe: '100mm - 119.9mm', style: styles.symbol },
    { color: '#5D9E52', label: '80mm - 99.9mm', labelNe: '80mm - 99.9mm', style: styles.symbol },
    { color: '#569ED4', label: '0.5mm - 79.9mm', labelNe: '0.5mm - 79.9mm', style: styles.symbol },
    { color: '#798590', label: '0.01mm - 0.49mm', labelNe: '0.01mm - 0.49mm', style: styles.symbol },
    { color: '#BFBFBF', label: '0mm', labelNe: '0mm', style: styles.symbol },
];

export const rain12LegendItems = [
    { color: '#BA2719', label: '> 120mm', labelNe: '> 120mm', style: styles.symbol },
    { color: '#F3A53A', label: '100mm - 119.9mm', labelNe: '100mm - 119.9mm', style: styles.symbol },
    { color: '#F8D054', label: '80mm - 99.9mm', labelNe: '80mm - 99.9mm', style: styles.symbol },
    { color: '#5D9E52', label: '60mm - 79.9mm', labelNe: '60mm - 79.9mm', style: styles.symbol },
    { color: '#569ED4', label: '0.5mm - 59.9mm', labelNe: '0.5mm - 59.9mm', style: styles.symbol },
    { color: '#798590', label: '0.01mm - 0.49mm', labelNe: '0.01mm - 0.49mm', style: styles.symbol },
    { color: '#BFBFBF', label: '0mm', labelNe: '0mm', style: styles.symbol },
];

export const rain6LegendItems = [
    { color: '#BA2719', label: '> 100mm', labelNe: '> 100mm', style: styles.symbol },
    { color: '#F3A53A', label: '80mm - 99.9mm', labelNe: '80mm - 99.9mm', style: styles.symbol },
    { color: '#F8D054', label: '60mm - 79.9mm', labelNe: '60mm - 79.9mm', style: styles.symbol },
    { color: '#5D9E52', label: '40mm - 59.9mm', style: styles.symbol },
    { color: '#569ED4', label: '0.5mm - 39.9mm', labelNe: '0.5mm - 39.9mm', style: styles.symbol },
    { color: '#798590', label: '0.01mm - 0.49mm', labelNe: '0.01mm - 0.49mm', style: styles.symbol },
    { color: '#BFBFBF', label: '0mm', labelNe: '0mm', style: styles.symbol },
];

export const rain3LegendItems = [
    { color: '#BA2719', label: '> 80mm', labelNe: '> 80mm', style: styles.symbol },
    { color: '#F3A53A', label: '60mm - 79.9mm', labelNe: '60mm - 79.9mm', style: styles.symbol },
    { color: '#F8D054', label: '40mm - 59.9mm', style: styles.symbol },
    { color: '#5D9E52', label: '20mm - 39.9mm', labelNe: '20mm - 39.9mm', style: styles.symbol },
    { color: '#569ED4', label: '0.5mm - 19.9mm', labelNe: '0.5mm - 19.9mm', style: styles.symbol },
    { color: '#798590', label: '0.01mm - 0.49mm', labelNe: '0.01mm - 0.49mm', style: styles.symbol },
    { color: '#BFBFBF', label: '0mm', labelNe: '0mm', style: styles.symbol },
];

export const rain1LegendItems = [
    { color: '#BA2719', label: '> 60mm', labelNe: '> 60mm', style: styles.symbol },
    { color: '#F3A53A', label: '40mm - 59.9mm', labelNe: '40mm - 59.9mm', style: styles.symbol },
    { color: '#F8D054', label: '20mm - 39.9mm', labelNe: '20mm - 39.9mm', style: styles.symbol },
    { color: '#5D9E52', label: '10mm - 19.9mm', labelNe: '10mm - 19.9mm', style: styles.symbol },
    { color: '#569ED4', label: '0.5mm - 9.9mm', labelNe: '0.5mm - 9.9mm', style: styles.symbol },
    { color: '#798590', label: '0.01mm - 0.49mm', labelNe: '0.01mm - 0.49mm', style: styles.symbol },
    { color: '#BFBFBF', label: '0mm', labelNe: '0mm', style: styles.symbol },
];

export const lT = {
    'Below Warning Level': 'चेतावनी तहभन्दा तल',
    'Warning Level': 'चेतावनी स्तर',
    'Above Warning Level': 'चेतावनी स्तरभन्दा माथि',
    'Above Danger Level': 'खतराको स्तरभन्दा माथि',
    'Status Not Available': 'स्थिति उपलब्ध छैन',
    'Below Warning Level and Steady': 'चेतावनी तह र स्थिर',
    'Below Warning Level and Rising': 'चेतावनी स्तरभन्दा तल र बढ्दै',
    'Below Warning Level and Falling': 'चेतावनी स्तर तल र झर्दै',
    'Above Warning Level and Steady': 'चेतावनी स्तर माथि र स्थिर',
    'Above Warning Level and Rising': 'चेतावनी स्तर माथि र बढ्दै',
    'Above Warning Level and Falling': 'चेतावनीको माथिल्लो तह र गिरावट',
    'Above Danger Level and Steady': 'खतराको स्तर माथि र स्थिर',
    'Above Danger Level and Rising': 'खतराको स्तर माथि र बढ्दै',
    'Above Danger Level and Falling': 'खतराको स्तर माथि र झर्दै',
    'Minor (2.0 - 3.9)': 'न्यून (2.0 - 3.9)',
    'Light (4.0 - 4.9)': 'लाइट (४.० - ४.९))',
    'Moderate (5.0 - 5.9)': 'मध्यम (५.० - ५.९)',
    'Strong (6.0 - 6.9)': 'बलियो (६.० - ६.९)',
    'Major (7.0 - 7.9)': 'प्रमुख (७.० - ७.९)',
    'Great (>8)': 'महान (>8)',
    'Good (0 - 50)': 'राम्रो (० - ५०)',
    'Moderate (51 - 100)': 'मध्यम (५१ - १००)',
    'Unhealthy for Sensitive Groups (101 - 150)': 'संवेदनशील समूहहरूका लागि अस्वास्थ्यकर (101 - 150)',
    'Unhealthy (151 - 200)': 'अस्वस्थ (151 - 200)',
    'Very Unhealthy (201 - 300)': 'धेरै अस्वस्थ (201 - 300)',
    'Hazardous (301 - 400)': 'खतरनाक (३०१ - ४००)',
    'Very Hazardous (401 - 500)': 'धेरै खतरनाक (४०१ - ५००)',
    'Forest fire': 'वन डढेँलो',
    'No legends to display': 'प्रदर्शन गर्न कुनै पौराणिक कथाहरू छैनन्',
};

export const rainLegendItems = [
    { color: '#2373a9', labelNe: 'चेतावनी तहभन्दा तल', label: 'Below Warning Level', style: styles.symbol },
    { color: '#FDD835', labelNe: 'चेतावनी स्तर', label: 'Warning Level', style: styles.symbol },

];

export const riverLegendItems = [
    { color: '#7CB342', labelNe: 'चेतावनी तहभन्दा तल', label: 'Below Warning Level', style: styles.symbol },
    { color: '#FDD835', labelNe: 'चेतावनी स्तरभन्दा माथि', label: 'Above Warning Level', style: styles.symbol },
    { color: '#e53935', labelNe: 'खतराको स्तरभन्दा माथि', label: 'Above Danger Level', style: styles.symbol },
];

// the code below is different due to the requirement of river icon to be triangle
export const newRiverLegendItems = [
    { order: 1, color: '#7CB342', labelNe: 'चेतावनी तह भन्दा तल र स्थीर प्रवाह', label: 'Below Warning Level and Steady', style: styles.box },
    { order: 2, color: 'transparent', labelNe: 'चेतावनी तह भन्दा तल र बढ्दो प्रवाह', label: 'Below Warning Level and Rising', style: styles.triangleRisingBelowWarning },
    { order: 3, color: 'transparent', labelNe: 'चेतावनी तह भन्दा तल र घट्दो प्रवाह', label: 'Below Warning Level and Falling', style: styles.triangleFallingBelowWarning },
    { order: 4, color: '#FDD835', labelNe: 'चेतावनी स्तर माथि र स्थिर', label: 'Above Warning Level and Steady', style: styles.box },
    { order: 5, color: 'transparent', labelNe: 'चेतावनी स्तर माथि र बढ्दै', label: 'Above Warning Level and Rising', style: styles.triangleRisingAboveWarning },
    { order: 6, color: 'transparent', labelNe: 'चेतावनीको माथिल्लो तह र गिरावट', label: 'Above Warning Level and Falling', style: styles.triangleFallingAboveWarning },
    { order: 7, color: '#E53935', labelNe: 'खतराको स्तर माथि र स्थिर', label: 'Above Danger Level and Steady', style: styles.box },
    { order: 8, color: 'transparent', labelNe: 'खतराको स्तर माथि र बढ्दै', label: 'Above Danger Level and Rising', style: styles.triangleRisingAboveDanger },
    { order: 9, color: 'transparent', labelNe: 'खतराको स्तर माथि र झर्दै', label: 'Above Danger Level and Falling', style: styles.triangleFallingAboveDanger },
];

export const earthquakeLegendItems = [
    { color: '#fee5d9', labelNe: 'न्यून (2.0 - 3.9)', label: 'Minor (2.0 - 3.9)', radius: 6, style: styles.magnitude },
    { color: '#fcbba1', labelNe: 'लाइट (४.० - ४.९))', label: 'Light (4.0 - 4.9)', radius: 8, style: styles.magnitude },
    { color: '#fc9272', labelNe: 'मध्यम (५.० - ५.९)', label: 'Moderate (5.0 - 5.9)', radius: 12, style: styles.magnitude },
    { color: '#fb6a4a', labelNe: 'बलियो (६.० - ६.९)', label: 'Strong (6.0 - 6.9)', radius: 16, style: styles.magnitude },
    { color: '#de2d26', labelNe: 'प्रमुख (७.० - ७.९)', label: 'Major (7.0 - 7.9)', radius: 18, style: styles.magnitude },
    { color: '#a50f15', labelNe: 'महान (>8)', label: 'Great (>8)', radius: 22, style: styles.magnitude },
];

export const pollutionLegendItems = [
    { order: 1, color: '#00fa2f', key: 'good', labelNe: 'राम्रो (० - ५०)', label: 'Good (0 - 50)', style: styles.symbol },
    { order: 2, color: '#f7ff00', key: 'moderate', labelNe: 'मध्यम (५१ - १००)', label: 'Moderate (51 - 100)', style: styles.symbol },
    { order: 3, color: '#ff7300', key: 'unhealthyForSensitive', labelNe: 'संवेदनशील समूहहरूका लागि अस्वास्थ्यकर (101 - 150)', label: 'Unhealthy for Sensitive Groups (101 - 150)', style: styles.symbol },
    { order: 4, color: '#ff0000', key: 'unhealthy', labelNe: 'अस्वस्थ (151 - 200)', label: 'Unhealthy (151 - 200)', style: styles.symbol },
    { order: 5, color: '#9e0095', key: 'veryUnhealthy', labelNe: 'धेरै अस्वस्थ (201 - 300)', label: 'Very Unhealthy (201 - 300)', style: styles.symbol },
    { order: 6, color: '#8a0014', key: 'hazardous', labelNe: 'खतरनाक (३०१ - ४००)', label: 'Hazardous (301 - 400)', style: styles.symbol },
    { order: 7, color: '#8a0014', key: 'veryHazardous', labelNe: 'धेरै खतरनाक (४०१ - ५००)', label: 'Very Hazardous (401 - 500)', style: styles.symbol },
];

export const forestFireLegendItems = [
    { color: '#ff8300', labelNe: 'वन डढेँलो', label: 'Forest fire', style: styles.symbol },
];

export const noLegend = [
    { color: 'transparent', labelNe: 'प्रदर्शन गर्न कुनै पौराणिक कथाहरू छैनन्', label: 'No legends to display', style: styles.noSymbol },
];
