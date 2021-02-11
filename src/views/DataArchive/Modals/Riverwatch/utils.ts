import { ArchiveRiver, Errors } from './types';
import { isValidDate, getDateDiff } from '#views/DataArchive/utils';

export const riverToGeojson = (riverList: ArchiveRiver[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: riverList
            .filter(river => river.point)
            .map(river => ({
                id: river.id,
                type: 'Feature',
                geometry: {
                    ...river.point,
                },
                properties: {
                    ...river,
                    riverId: river.id,
                    title: river.title,
                    description: river.description,
                    basin: river.basin,
                    status: river.status,
                    steady: river.steady,
                },
            })),
    };
    return geojson;
};

const MINIMUM_DATA_ARCHIVE_RIVER_DATE = '2020-07-14';

export const getErrors = (fv: any) => {
    const { dataDateRange, period = {} } = fv;
    const { startDate, endDate } = dataDateRange;
    const errors: Errors[] = [];
    let error;
    if (!startDate || !endDate) {
        error = {
            type: 'Date',
            err: 'StartDate or EndDate not provided',
            message: 'Please fill both Start Date and End Date',
        };
        errors.push(error);
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        error = {
            type: 'Date',
            err: 'StartDate or EndDate not valid',
            message: 'Please provide valid Start Date and End Date',
        };
        errors.push(error);
    }

    if (startDate > endDate) {
        error = {
            type: 'Date',
            err: 'StartDate is greater than EndDate',
            message: 'StartDate cannot be greater than EndDate',
        };
        errors.push(error);
    }

    if (getDateDiff(startDate, endDate) > 365) {
        error = {
            type: 'Date',
            err: 'More than 1 year time period selected',
            message: 'Time period cannot be greater than one year',
        };
        errors.push(error);
    }

    if (startDate < MINIMUM_DATA_ARCHIVE_RIVER_DATE) {
        error = {
            type: 'Date',
            err: `No data archive river data before ${MINIMUM_DATA_ARCHIVE_RIVER_DATE}`,
            message: `Data is available from ${MINIMUM_DATA_ARCHIVE_RIVER_DATE} onwards only`,
        };
        errors.push(error);
    }

    if (Object.keys(period).length === 0) {
        error = {
            type: 'Period',
            err: 'Period not supplied',
            message: 'Please select a period value',
        };
        errors.push(error);
    }
    return errors;
};
