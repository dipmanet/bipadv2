import styles from './styles.scss';

type ToggleValues = 'education' | 'health' | 'finance' | 'governance'
| 'tourism' | 'cultural' | 'industry' | 'communication' | 'openspace' |
'communityspace';

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
    { color: '#7dcd85', key: 'tourism', label: 'Tourism', style: styles.symbol },
    { color: '#c4b2bc', key: 'cultural', label: 'Cultural', style: styles.symbol },
    { color: '#a6a867', key: 'industry', label: 'Industry', style: styles.symbol },
    { color: '#efa8b8', key: 'communication', label: 'Communication', style: styles.symbol },
    { color: '#297eff', key: 'openspace', label: 'Open Spaces', style: styles.symbol },
    { color: '#FEE94E', key: 'communityspace', label: 'Community Spaces', style: styles.symbol },
];

export default capacityAndResourcesLegendItems;
