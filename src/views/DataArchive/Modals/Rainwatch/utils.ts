import { ArchiveRain, Errors } from './types';
import { isValidDate, getDateDiff } from '#views/DataArchive/utils';

export const rainToGeojson = (rainList: ArchiveRain[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: rainList
            .filter(rain => rain.point)
            .map(rain => ({
                id: rain.id,
                type: 'Feature',
                geometry: {
                    ...rain.point,
                },
                properties: {
                    ...rain,
                    rainId: rain.id,
                    title: rain.title,
                    description: rain.description,
                    basin: rain.basin,
                    status: rain.status,
                },
            })),
    };
    return geojson;
};

const MINIMUM_DATA_ARCHIVE_RAIN_DATE = '2020-10-15';

export const getErrors = (fv: any) => {
    const { dataDateRange, interval = {}, period = {} } = fv;
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

    if (endDate < MINIMUM_DATA_ARCHIVE_RAIN_DATE) {
        error = {
            type: 'Date',
            err: `No data archive pollution data before ${MINIMUM_DATA_ARCHIVE_RAIN_DATE}`,
            message: `Data is available from ${MINIMUM_DATA_ARCHIVE_RAIN_DATE} onwards only`,
        };
        errors.push(error);
    }

    if (Object.keys(interval).length === 0) {
        error = {
            type: 'Interval',
            err: 'Interval not supplied',
            message: 'Please select an interval value',
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
