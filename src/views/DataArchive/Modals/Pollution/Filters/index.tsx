import React, { useState } from 'react';
import Faram from '@togglecorp/faram';

import DateSelector from './DateSelector';
import ParameterSelector from './ParameterSelector';
import PeriodSelector from './PeriodSelector';

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

const Filters = () => {
    const [faramValue, setFaramValue] = useState(initialFaramValue);

    const handleSubmitClick = () => {
        console.log('Submit clicked: ', faramValue);
    };

    const handleFaramChange = (fv: any) => {
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
