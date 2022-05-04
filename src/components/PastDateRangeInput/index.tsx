import React from 'react';
import { connect } from 'react-redux';
import { FaramInputElement } from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import DateInput from '#rsci/DateInput';
import RadioInput from '#components/RadioInput';
import PageContext from '#components/PageContext';

import {
    languageSelector,
} from '#selectors';

import styles from './styles.scss';

const pastDataKeySelector = d => d.key;


const pastDateRangeOptions = [
    {
        label: '3 days',
        labelNe: '3 दिन',
        key: 3,
    },
    {
        label: '7 days',
        labelNe: '7 दिन',
        key: 7,
    },
    {
        label: '2 weeks',
        labelNe: '2 हप्‍ता',
        key: 14,
    },
    {
        label: '1 month',
        labelNe: '1 महिना',
        key: 30,
    },
    {
        label: '6 months',
        labelNe: '3 महिना',
        key: 183,
    },
    {
        label: '1 year',
        labelNe: '3 वर्ष',
        key: 365,
    },
    {
        label: 'Custom',
        labelNe: 'कस्टम',
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

    private pastDataLabelSelector = (d) => {
        const { language: { language } } = this.props;
        if (language === 'en') {
            return d.label;
        }
        return d.labelNe;
    };


    private handleStartDateInputChange = (newStartDate: string) => {
        const {
            value,
            onChange,
        } = this.props;
        console.log(newStartDate, 'date test start');


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
        console.log(newEndDate, 'date test end');

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
        } = this.props;
        const { activeRouteDetails: { name: activePage } } = this.context;

        return (
            <div className={_cs(styles.pastDateRangeInput, className)}>
                <RadioInput
                    keySelector={pastDataKeySelector}
                    labelSelector={this.pastDataLabelSelector}
                    options={activePage === 'dashboard' ? pastDateRangeDashboardOptions : pastDateRangeOptions}
                    onChange={this.handleRadioInputChange}
                    value={value.rangeInDays}
                    contentClassName={styles.dateRanges}
                />
                { value.rangeInDays === 'custom' && (
                    <div className={styles.customRange}>
                        <Translation>
                            {
                                t => (

                                    <DateInput
                                        className={styles.startDateInput}
                                        label={t('Start Date')}
                                        faramElementName="start"
                                        onChange={this.handleStartDateInputChange}
                                        value={value.startDate}
                                    />
                                )
                            }
                        </Translation>
                        <Translation>
                            {
                                t => (
                                    <DateInput
                                        className={styles.endDateInput}
                                        label={t('End Date')}
                                        faramElementName="end"
                                        onChange={this.handleEndDateInputChange}
                                        value={value.endDate}
                                    />
                                )
                            }
                        </Translation>

                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});

export default FaramInputElement(connect(
    mapStateToProps,
)(PastDateRangeInput));
