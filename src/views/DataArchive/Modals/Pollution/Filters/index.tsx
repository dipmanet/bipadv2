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
import ParameterSelector from './ParameterSelector';
import PeriodSelector from './PeriodSelector';

import { getErrors } from './utils';
import { FaramValues, Errors, ArchivePollution } from '../types';
import styles from './styles.scss';

const pollutionFilterSchema = {
    fields: {
        dataDateRange: [],
        parameter: [],
        period: [],
    },
};

const initialFaramValue = {
    dataDateRange: {
        startDate: '',
        endDate: '',
    },
    parameter: {},
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
        url: '/pollution/',
        method: methods.GET,
        onMount: false,
        query: ({ params, props: { stationId } }) => {
            if (!params || !params.dataDateRange) {
                return undefined;
            }
            const { startDate, endDate } = params.dataDateRange;
            return {
                station: stationId,
                historical: 'true',
                expand: ['province', 'district', 'municipality', 'ward'],
                // eslint-disable-next-line @typescript-eslint/camelcase
                created_on__gt: `${startDate}T00:00:00+05:45`,
                // eslint-disable-next-line @typescript-eslint/camelcase
                created_on__lt: `${endDate}T23:59:59+05:45`,
            };
        },
        onSuccess: ({ props: { handleStationData }, response }) => {
            const stationData = response as MultiResponse<ArchivePollution[]>;
            handleStationData(stationData.results);
        },
    },
};

type Props = NewProps<OwnProps, Params>;

const Filters = (props: Props) => {
    const [faramValue, setFaramValue] = useState(initialFaramValue);
    const [errors, setErrors] = useState<Errors[]>([]);
    const { handleFilterValues,
        requests: {
            stationRequest,
        } } = props;
    const handleSubmitClick = () => {
        const faramErrors = getErrors(faramValue);
        setErrors(faramErrors);
        if (faramErrors.length === 0) {
            console.log('Submit clicked: ', faramValue);
            handleFilterValues(faramValue);
            const { dataDateRange } = faramValue;
            stationRequest.do({ dataDateRange });
        } else {
            console.log('Errors: ', faramErrors);
        }
    };

    const handleFaramChange = (fv: FaramValues) => {
        setFaramValue(fv);
    };

    return (
        <div className={styles.filters}>
            <div className={styles.header}>
                Filters
            </div>
            <div className={styles.selectors}>
                <Faram
                    schema={pollutionFilterSchema}
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
                    <div className={styles.parameters}>
                        <div className={styles.title}>
                        Parameter Selector
                        </div>
                        <div className={styles.element}>
                            <ParameterSelector
                                faramElementName="parameter"
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className={styles.period}>
                        <div className={styles.title}>
                        Period Selector
                        </div>
                        <div className={styles.element}>
                            <PeriodSelector
                                faramElementName="period"
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
