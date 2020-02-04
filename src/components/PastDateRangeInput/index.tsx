import React from 'react';
import { FaramInputElement } from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import DateInput from '#rsci/DateInput';
import RadioInput from '#components/RadioInput';

import { pastDaysToDateRange } from '#utils/transformations';

import styles from './styles.scss';

const pastDataKeySelector = d => d.key;
const pastDataLabelSelector = d => d.label;

const pastDateRangeOptions = [
    {
        label: '3 days',
        key: 3,
    },
    {
        label: '7 days',
        key: 7,
    },
    {
        label: '2 weeks',
        key: 14,
    },
    {
        label: '1 month',
        key: 30,
    },
    {
        label: '6 month',
        key: 183,
    },
    {
        label: '1 year',
        key: 365,
    },
    {
        label: 'Custom',
        key: 'custom',
    },
];

interface Props {
    className?: string;
}

class PastDateRangeInput extends React.PureComponent<Props> {
    private handleRadioInputChange = (rangeInDays: number) => {
        const { onChange } = this.props;

        if (rangeInDays === 'others') {
            onChange({
                rangeInDays,
                startDate: undefined,
                endDate: undefined,
            });
        }

        const {
            startDate,
            endDate,
        } = pastDaysToDateRange(rangeInDays);

        onChange({
            rangeInDays,
            startDate,
            endDate,
        });
    }

    private handleStartDateInputChange = (newStartDate: string) => {
        const {
            value: {
                rangeInDays,
                endDate,
            } = {},
            onChange,
        } = this.props;

        onChange({
            rangeInDays,
            startDate: newStartDate,
            endDate,
        });
    }

    private handleEndDateInputChange = (newEndDate: string) => {
        const {
            value: {
                rangeInDays,
                startDate,
            } = {},
            onChange,
        } = this.props;

        onChange({
            rangeInDays,
            startDate,
            endDate: newEndDate,
        });
    }

    public render() {
        const {
            className,
            value = {},
        } = this.props;

        return (
            <div className={_cs(styles.pastDateRangeInput, className)}>
                <RadioInput
                    keySelector={pastDataKeySelector}
                    labelSelector={pastDataLabelSelector}
                    options={pastDateRangeOptions}
                    onChange={this.handleRadioInputChange}
                    value={value.rangeInDays}
                />
                { value.rangeInDays === 'custom' && (
                    <div className={styles.customRange}>
                        <DateInput
                            className={styles.startDateInput}
                            label="Start Date"
                            faramElementName="start"
                            onChange={this.handleStartDateInputChange}
                            value={value.startDate}
                        />
                        <DateInput
                            className={styles.endDateInput}
                            label="End Date"
                            faramElementName="end"
                            onChange={this.handleEndDateInputChange}
                            value={value.endDate}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default FaramInputElement(PastDateRangeInput);
