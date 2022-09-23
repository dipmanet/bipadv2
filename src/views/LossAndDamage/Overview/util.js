import memoize from 'memoize-one';
import { listToMap } from '@togglecorp/fujs';
import {
    getGroupMethod,
    getGroupedIncidents,
    getAggregatedStats,
} from '../common';

// eslint-disable-next-line import/prefer-default-export
export const generateOverallDataset = memoize((incidents, regionLevel) => {
    if (!incidents || incidents.length <= 0) {
        return {
            mapping: [],
            aggregatedStat: {},
        };
    }

    const groupFn = getGroupMethod(regionLevel);
    const regionGroupedIncidents = getGroupedIncidents(incidents, groupFn);
    const aggregatedStat = getAggregatedStats(regionGroupedIncidents.flat());

    const listToMapGroupedItem = groupedIncidents => (
        listToMap(
            groupedIncidents,
            incident => incident.key,
            incident => incident,
        )
    );
    const mapping = listToMapGroupedItem(regionGroupedIncidents);
    return {
        mapping,
        aggregatedStat,
    };
});
