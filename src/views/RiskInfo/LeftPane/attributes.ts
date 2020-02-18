import { listToMap } from '@togglecorp/fujs';
import { AttributeKey } from '#types';

export interface AttributeItem {
    key: AttributeKey;
    title: string;
    description?: string;
    color?: string;
    icon: string;
}

export const attributeListKeySelector = (d: AttributeItem) => d.key;

export const attributeList: AttributeItem[] = [
    {
        key: 'hazard',
        title: 'Hazard',
        description: 'A process, phenomenon or human activity that may cause loss of life, injury or other health impacts, property damage, social and economic disruption or environmental degradation.',
        color: '#e53935',
        icon: 'H',
    },
    {
        key: 'exposure',
        title: 'Exposure',
        description: 'The situation of people, infrastructure, housing, production capacities and other tangible human assets located in hazard-prone areas.',
        color: '#8e24aa',
        icon: 'E',
    },
    {
        key: 'vulnerability',
        title: 'Vulnerability',
        description: 'The conditions determined by physical, social, economic and environmental factors or processes, which increase the susceptibility of an individual, a community, assets or systems to the impacts of hazards.',
        color: '#7c6200',
        icon: 'V',
    },
    {
        key: 'risk',
        title: 'Risk',
        description: 'The potential loss of life, injury, or destroyed or damaged assets which could occur to a system, society or a community in a specific period of time, determined probabilistically as a function of hazard, exposure, vulnerability and capacity.',
        color: '#ff8f00',
        icon: 'R',
    },
    {
        key: 'capacity-and-resources',
        title: 'Capacity & resources',
        description: 'The combination of all the strengths, attributes and resources available within an organization, community or society to manage and reduce disaster risks and strengthen resilience.',
        color: '#1976d2',
        icon: 'CR',
    },
    {
        key: 'climate-change',
        title: 'Climate change',
        description: 'A change in the state of the climate that can be identified (e.g., by using statistical tests) by changes in the mean and/or the variability of its properties and that persists for an extended period, typically decades or longer. Climate change may be due to natural internal processes or external forcings, or to persistent anthropogenic changes in the composition of the atmosphere or in land use.',
        color: '#689f38',
        icon: 'CC',
    },
];

export const attributeColorMap = listToMap(attributeList, d => d.key, d => d.color);
