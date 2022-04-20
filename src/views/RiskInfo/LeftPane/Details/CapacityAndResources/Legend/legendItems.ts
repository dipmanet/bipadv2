/* eslint-disable @typescript-eslint/indent */
import styles from './styles.scss';

type ToggleValues = 'education' | 'health' | 'finance' | 'governance'
    | 'hotelandrestaurant' | 'cultural' | 'industry' | 'communication' | 'openspace' |
    'communityspace' | 'firefightingapparatus' | 'helipad' | 'bridge' | 'airway' | 'roadway' | 'waterway' | 'evacuationcentre';

interface LegendItems {
    color: string;
    key: ToggleValues;
    label: string;
    style: string;
}
const capacityAndResourcesLegendItems: LegendItems[] = [
    { color: '#ffd046', key: 'education', label: 'Education', style: styles.symbol },
    { color: '#EADAA2', key: 'health', label: 'Health', style: styles.symbol },
    { color: '#BD93BD', key: 'finance', label: 'Finance', style: styles.symbol },
    { color: '#82ddf0', key: 'governance', label: 'Governance', style: styles.symbol },
    { color: '#7dcd85', key: 'hotelandrestaurant', label: 'Hotel and Restaurant', style: styles.symbol },
    { color: '#c4b2bc', key: 'cultural', label: 'Cultural', style: styles.symbol },
    { color: '#a6a867', key: 'industry', label: 'Industry', style: styles.symbol },
    { color: '#efa8b8', key: 'communication', label: 'Communication', style: styles.symbol },
    { color: '#297eff', key: 'openspace', label: 'Humanitarian Open Spaces', style: styles.symbol },
    { color: '#FEE94E', key: 'communityspace', label: 'Community Spaces', style: styles.symbol },
    { color: '#F38171', key: 'firefightingapparatus', label: 'Fire Engine', style: styles.symbol },
    { color: '#BCE618', key: 'helipad', label: 'Helipad', style: styles.symbol },
    { color: '#AAB2AD', key: 'bridge', label: 'Bridge', style: styles.symbol },
    { color: '#F763C6', key: 'airway', label: 'Airway', style: styles.symbol },
    { color: '#1698EE', key: 'roadway', label: 'Roadway', style: styles.symbol },
    { color: '#9BD1E9', key: 'waterway', label: 'Waterway', style: styles.symbol },
    { color: '#CA8D4E', key: 'electricity', label: 'Electricity', style: styles.symbol },
    { color: '#2F6209', key: 'sanitation', label: 'Sanitation', style: styles.symbol },
    { color: '#3BC7F8', key: 'watersupply', label: 'Water Supply', style: styles.symbol },
    { color: '#F47267', key: 'evacuationcentre', label: 'Evacuation Center', style: styles.symbol },
];

export default capacityAndResourcesLegendItems;
