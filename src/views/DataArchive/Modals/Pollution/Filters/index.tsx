import React, { useState } from 'react';
import Faram from '@togglecorp/faram';

import DateSelector from './DateSelector';
import ParameterSelector from './ParameterSelector';
import PeriodSelector from './PeriodSelector';

import { getErrors } from './utils';
import { FaramValues, Errors } from '../types';
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

interface Props {
    handleFilterValues: Function;
}
const Filters = (props: Props) => {
    const [faramValue, setFaramValue] = useState(initialFaramValue);
    const [errors, setErrors] = useState<Errors[]>([]);
    const { handleFilterValues } = props;
    const handleSubmitClick = () => {
        const faramErrors = getErrors(faramValue);
        setErrors(faramErrors);
        if (faramErrors.length === 0) {
            console.log('Submit clicked: ', faramValue);
            handleFilterValues(faramValue);
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

export default Filters;
