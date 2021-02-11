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

import DateSelector from './DateSelector';
import PeriodSelector from './PeriodSelector';
import IntervalSelector from './IntervalSelector';
import Loading from '#components/Loading';

import { getErrors } from '../utils';
import { ArchiveRain, Errors, FaramValues } from '../types';

import styles from './styles.scss';

const rainFilterSchema = {
    fields: {
        dataDateRange: [],
        period: [],
        interval: [],
    },
};

const initialFaramValue = {
    dataDateRange: {
        startDate: '',
        endDate: '',
    },
    period: {},
    interval: {},
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
        url: '/rain/',
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
                measured_on__gt: `${startDate}T00:00:00+05:45`,
                // eslint-disable-next-line @typescript-eslint/camelcase
                measured_on__lt: `${endDate}T23:59:59+05:45`,
                fields: [
                    'id',
                    'created_on',
                    'measured_on',
                    'title',
                    'basin',
                    'point',
                    'averages',
                    'status',
                    'station',
                ],
                limit: 99,
            };
        },
        onSuccess: ({ props: { handleStationData }, response }) => {
            const stationData = response as MultiResponse<ArchiveRain[]>;
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
        <div className={styles.filters}>
            <Loading pending={pending} />
            <div className={styles.header}>
                Filters
            </div>
            <div className={styles.selectors}>
                <Faram
                    schema={rainFilterSchema}
                    onChange={handleFaramChange}
                    // value={faramValues}
                    value={faramValue}
                    className={styles.filterViewContainer}
                >
                    <div className={styles.date}>
                        <div className={styles.element}>
                            <DateSelector
                                faramElementName="dataDateRange"
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className={styles.period}>
                        <div className={styles.title}>
                            Period
                        </div>
                        <div className={styles.element}>
                            <PeriodSelector
                                faramElementName="period"
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className={styles.intervals}>
                        <div className={styles.title}>
                            Interval
                        </div>
                        <div className={styles.element}>
                            <IntervalSelector
                                faramElementName="interval"
                                errors={errors}
                            />
                        </div>
                    </div>
                </Faram>
            </div>
            <div
                onClick={handleSubmitClick}
                className={styles.submitButton}
                role="presentation"
            >
                Submit
            </div>
        </div>
    );
};

export default compose(
    createConnectedRequestCoordinator<OwnProps>(),
    createRequestClient(requests),
)(Filters);
