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

export const committeeValues: {
    [key in Contact['committee']]: string;
} = {
    LDMC: 'Local Disaster Management Committee',
    WDMC: 'Ward Disaster Management Committee',
    CDMC: 'Community Disaster Management Committee',
    non_committee: 'Non committee members', // eslint-disable-line @typescript-eslint/camelcase
};

export const committeeValueList = mapToList(
    committeeValues,
    (v, k) => ({ key: k, label: v }),
);
