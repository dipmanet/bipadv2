import memoize from 'memoize-one';
import {
    _cs,
    compareDate,
    compareNumber,
    getDifferenceInDays,
    getDate,
    listToGroupList,
    isDefined,
    mapToList,
} from '@togglecorp/fujs';

import { Geometry, ArchivePollution } from './types';

export const pollutionToGeojson = (pollutionList: ArchivePollution[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: pollutionList
            .filter(pollution => pollution.point)
            .map(pollution => ({
                id: pollution.id,
                type: 'Feature',
                geometry: {
                    ...pollution.point,
                },
                properties: {
                    ...pollution,
                    aqi: Math.round(pollution.aqi),
                    date: Date.parse(pollution.createdOn) || 1,
                },
            })),
    };
    return geojson;
};

export const getSortedPollutionData = memoize((pollutionDetails: ArchivePollution[]) => {
    const sortedData = [...pollutionDetails].sort((a, b) => compareDate(b.createdOn, a.createdOn));
    return sortedData;
});

export const getTodaysPollutionDetails = memoize((pollutionDetails: ArchivePollution[]) => {
    const today = getDate(new Date().getTime());
    const todaysData = pollutionDetails.filter(
        pollutionDetail => getDate(pollutionDetail.createdOn) === today,
    );
    return todaysData;
});

export const parseParameter = memoize((pollutionDetails: ArchivePollution[]) => {
    const temp = [...pollutionDetails];
    const withParameter = temp.map((detail) => {
        const { observation } = detail;
        observation.forEach((obs) => {
            const { data, parameterCode } = obs;
            const { value } = data || {};
            const paramCode = parameterCode.replace('.', '');
            Object.assign(detail, { [paramCode]: value });
        });
        return detail;
    });
    return withParameter;
});

export const dateParser = (date: string) => {
    const [datePart, timePart] = date.split('T');
    const [hour, minutes] = timePart.split(':');
    const indicator = Number(hour) >= 12 ? 'PM' : 'AM';

    return `${datePart} ${hour}:${minutes} ${indicator}`;
};
