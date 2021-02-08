import React, { useState } from 'react';
import { compose } from 'redux';
import Faram from '@togglecorp/faram';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { MultiResponse } from '#store/atom/response/types';

import { getErrors } from '../utils';
import { ArchiveRiver, Errors, FaramValues } from '../types';

import styles from './styles.scss';

const riverFilterSchema = {
    fields: {
        dataDateRange: [],
        period: [],
    },
};

const initialFaramValue = {
    dataDateRange: {
        startDate: '',
        endDate: '',
    },
    period: {},
};

interface OwnProps {
    handleFilterValues: Function;
    handleStationData: Function;
    stationId: number;
}

interface Params {
    dataDateRange: {
        startDate: string;
        endDate: string;
    };
}

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    stationRequest: {
        url: '/river/',
        method: methods.GET,
        onMount: false,
        query: ({ params, props: { stationId } }) => {
            if (!params || !params.dataDateRange) {
                return undefined;
            }
            const { startDate, endDate } = params.dataDateRange;
            return {
                station: stationId,
                // eslint-disable-next-line @typescript-eslint/camelcase
                water_level_on__gt: `${startDate}T00:00:00+05:45`,
                // eslint-disable-next-line @typescript-eslint/camelcase
                water_level_on__lt: `${endDate}T23:59:59+05:45`,
                fields: [
                    'id',
                    'created_on',
                    'title',
                    'basin',
                    'point',
                    'water_level',
                    'danger_level',
                    'warning_level',
                    'water_level_on',
                    'status',
                    'steady',
                    'description',
                    'station',
                ],
                limit: 99,
            };
        },
        onSuccess: ({ props: { handleStationData }, response }) => {
            const stationData = response as MultiResponse<ArchiveRiver[]>;
            handleStationData(stationData.results);
        },
    },
};

type Props = NewProps<OwnProps, Params>;

const Filters = (props: Props) => {
    const [faramValue, setFaramValue] = useState(initialFaramValue);
    const [submittedStartDate, setSubmittedStartDate] = useState('');
    const [submittedEndDate, setSubmittedEndDate] = useState('');
    const [errors, setErrors] = useState<Errors[]>([]);

    const { handleFilterValues,
        requests: {
            stationRequest,
            stationRequest: { pending },
        } } = props;

    const handleSubmitClick = () => {
        const faramErrors = getErrors(faramValue);
        setErrors(faramErrors);
        if (faramErrors.length === 0) {
            handleFilterValues(faramValue);
            const { dataDateRange } = faramValue;
            const { startDate, endDate } = dataDateRange;
            if (submittedStartDate !== startDate || submittedEndDate !== endDate) {
                stationRequest.do({ dataDateRange });
                setSubmittedStartDate(startDate);
                setSubmittedEndDate(endDate);
            }
        }
    };

    const handleFaramChange = (fv: FaramValues) => {
        setFaramValue(fv);
    };
    return (
        <div>
          Filters
        </div>
    );
};

export default compose(
    createConnectedRequestCoordinator<OwnProps>(),
    createRequestClient(requests),
)(Filters);
