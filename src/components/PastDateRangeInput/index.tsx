import React from 'react';
import { FaramInputElement } from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import DateInput from '#rsci/DateInput';
import RadioInput from '#components/RadioInput';
import Icon from '#rscg/Icon';
import PageContext from '#components/PageContext';

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
        label: '6 months',
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

const pastDateRangeDashboardOptions = [
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
        label: '6 months',
        key: 183,
    },
    {
        label: '1 year',
        key: 365,
    },
];

interface InputValue {
    rangeInDays: number | 'custom';
    startDate: string | undefined;
    endDate: string | undefined;
}

interface Props {
    className?: string;
    onChange: (value: InputValue) => void;
    value: InputValue;
    error?: string;
}

class PastDateRangeInput extends React.PureComponent<Props> {
    public static defaultProps = {
        value: undefined,
    };

    public static contextType = PageContext;

    private handleRadioInputChange = (rangeInDays: number | 'custom') => {
        const { onChange } = this.props;

        if (rangeInDays === 'custom') {
            onChange({
                rangeInDays,
                startDate: undefined,
                endDate: undefined,
            });
        } else {
            onChange({
                rangeInDays,
                startDate: undefined,
                endDate: undefined,
            });
        }
    }

    private handleStartDateInputChange = (newStartDate: string) => {
        const {
            value,
            onChange,
        } = this.props;

        onChange({
            rangeInDays: 'custom',
            startDate: newStartDate,
            endDate: value ? value.endDate : undefined,
        });
    }

    private handleEndDateInputChange = (newEndDate: string) => {
        const {
            value,
            onChange,
        } = this.props;

        onChange({
            rangeInDays: 'custom',
            startDate: value ? value.startDate : undefined,
            endDate: newEndDate,
        });
    }

    public render() {
        const {
            className,
            value,
            error,
        } = this.props;
        const { activeRouteDetails: { name: activePage } } = this.context;

        return (
            <div className={_cs(styles.pastDateRangeInput, className)}>
                <RadioInput
                    keySelector={pastDataKeySelector}
                    labelSelector={pastDataLabelSelector}
                    options={activePage === 'dashboard' ? pastDateRangeDashboardOptions : pastDateRangeOptions}
                    onChange={this.handleRadioInputChange}
                    value={value.rangeInDays}
                    contentClassName={styles.dateRanges}
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
                {error && (
                    <div className={styles.error}>
                        <Icon
                            className={styles.infoIcon}
                            name="info"
                        />
                        {error}
                    </div>
                )}
            </div>
        );
    }
}

export default FaramInputElement(PastDateRangeInput);
