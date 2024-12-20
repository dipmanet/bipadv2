import { mapToList } from '@togglecorp/fujs';

import {
    Contact,
    Training,
} from '#store/atom/page/types';

export const trainingValues: {
    [key in Training['title']]: string;
} = {
    LSAR: 'Lite Search and Rescue',
    rapid_assessment: 'Rapid Assessment', // eslint-disable-line @typescript-eslint/camelcase
    first_aid: 'First Aid', // eslint-disable-line @typescript-eslint/camelcase
    fire_fighting: 'Fire Fighting', // eslint-disable-line @typescript-eslint/camelcase
};

export const trainingValueList = mapToList(
    trainingValues,
    (v, k) => ({ key: k, label: v }),
);

export const trainingValuesNe: {
    [key in Training['title']]: string;
} = {
    LSAR: 'लाइट खोज र उद्धार',
    rapid_assessment: 'द्रुत मूल्याङ्कन', // eslint-disable-line @typescript-eslint/camelcase
    first_aid: 'प्राथमिक उपचार', // eslint-disable-line @typescript-eslint/camelcase
    fire_fighting: 'आगो नियन्‍त्रण', // eslint-disable-line @typescript-eslint/camelcase
};

export const trainingValueListNe = mapToList(
    trainingValuesNe,
    (v, k) => ({ key: k, label: v }),
);

export const trainingKeySelector = (committee: { key: string }) => committee.key;
export const trainingLabelSelector = (committee: { label: string }) => committee.label;

export const committeeValues: {
    [key in Contact['committee']]: string;
} = {
    PDMC: 'Province Disaster Management Committee',
    DDMC: 'District Disaster Management Committee',
    LDMC: 'Local Disaster Management Committee',
    WDMC: 'Ward Disaster Management Committee',
    CDMC: 'Community Disaster Management Committee',
    non_committee: 'Non committee members', // eslint-disable-line @typescript-eslint/camelcase
};

export const committeeValueList = mapToList(
    committeeValues,
    (v, k) => ({ key: k, label: v }),
);

export const committeeKeySelector = (committee: { key: string }) => committee.key;
export const committeeLabelSelector = (committee: { label: string }) => committee.label;
