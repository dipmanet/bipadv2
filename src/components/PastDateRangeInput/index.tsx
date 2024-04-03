/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable indent */
/* eslint-disable no-tabs */
import React from 'react';
import { connect } from 'react-redux';
import { FaramInputElement } from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import DateInput from '#rsci/DateInput';
import RadioInput from '#components/RadioInput';
import Icon from '#rscg/Icon';
import PageContext from '#components/PageContext';

import {
    languageSelector,
} from '#selectors';

import { convertDateAccToLanguage, hofLangToValue } from '#utils/common';
import ADToBS from '#utils/AdBSConverter/AdToBs';
import BSToAD from '#utils/AdBSConverter/BsToAd';
// import { ADToBS, BSToAD } from 'bikram-sambat-js';
import styles from './styles.scss';

const pastDataKeySelector = d => d.key;


const pastDateRangeOptions = [
    {
        label: '3 days',
        labelNe: '३ दिन',
        key: 3,
    },
    {
        label: '7 days',
        labelNe: '७ दिन',
        key: 7,
    },
    {
        label: '2 weeks',
        labelNe: '२ हप्‍ता',
        key: 14,
    },
    {
        label: '1 month',
        labelNe: '१ महिना',
        key: 30,
    },
    {
        label: '6 months',
        labelNe: '६ महिना',
        key: 183,
    },
    {
        label: '1 year',
        labelNe: '१ वर्ष',
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
        labelNe: '३ दिन',
        key: 3,
    },
    {
        label: '7 days',
        labelNe: '७ दिन',
        key: 7,
    },
    {
        label: '2 weeks',
        labelNe: '२ हप्‍ता',
        key: 14,
    },
    {
        label: '1 month',
        labelNe: '१ महिना',
        key: 30,
    },
    {
        label: '6 months',
        labelNe: '६ महिना',
        key: 183,
    },
    {
        label: '1 year',
        labelNe: '१ वर्ष',
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

class PastDateRangeInput extends React.Component<Props> {
    public static defaultProps = {
        value: undefined,
    };


    public static contextType = PageContext;

    public state = {
        customActive: false,
        customState: false,
        switchDateValue: false,
        changedStartDate: false,
        changedEndDate: false,


    };

    // private testFunction() {
    // 	const { value } = this.props;
    // 	if (value.rangeInDays === 'custom') {
    // 		this.setState({ customState: true });
    // 		return;
    // 	}
    // 	this.setState({ customState: false });
    // }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
        const {
            className,
            value,
            error,
            language: { language },
            onChange,
        } = this.props;
        const { switchDateValue } = this.state;

        // if ((prevProps.switchDateValue !== switchDateValue) && (prevProps.language.language !== language)) {
        //     onChange({
        //         rangeInDays: 'custom',
        //         startDate: language === 'en' && value && value.startDate ? value.startDate : convertDateAccToLanguage(value.startDate, language),
        //         // endDate: value ? value.endDate : undefined,
        //         endDate: language === 'en' && value && value.endDate ? value.endDate : convertDateAccToLanguage(value.endDate, language),
        //     });
        // }
    }

    private handleRadioInputChange = (rangeInDays: number | 'custom') => {
        const {

            language: { language },

        } = this.props;
        const { onChange } = this.props;
        this.setState({ customActive: true });

        if (rangeInDays === 'custom') {
            this.setState({ customState: true });
            onChange({
                rangeInDays,
                startDate: undefined,
                endDate: undefined,
            });
        } else {
            this.setState({ customState: false });
            onChange({
                rangeInDays,
                startDate: undefined,
                endDate: undefined,
            });
        }
    }

    private pastDataLabelSelector = (d, language) => {
        if (language === 'en') {
            return d.label;
        }
        return d.labelNe;
    };


    private handleStartDateInputChange = (newStartDate: string) => {
        const { switchDateValue } = this.state;
        this.setState({ switchDateValue: !switchDateValue });


        const {
            value,
            onChange,
            language: { language },
        } = this.props;
        if (language === 'np') {
            this.setState({ changedStartDate: true });
        } else {
            this.setState({ changedStartDate: false });
        }
        this.setState({ previousLanguage: language === 'en' ? 'np' : 'en' });
        onChange({
            rangeInDays: 'custom',
            startDate: language === 'en' ? newStartDate : convertDateAccToLanguage(newStartDate, language),
            // endDate: value ? value.endDate : undefined,
            endDate: value && value.endDate ? value.endDate : undefined,
        });
    }

    private handleEndDateInputChange = (newEndDate: string) => {
        const { switchDateValue } = this.state;
        this.setState({ switchDateValue: !switchDateValue });
        const {
            value,
            onChange,
            language: { language },
        } = this.props;
        if (language === 'np') {
            this.setState({ changedEndDate: true });
        } else {
            this.setState({ changedEndDate: false });
        }
        this.setState({ previousLanguage: language === 'en' ? 'np' : 'en' });
        onChange({
            rangeInDays: 'custom',
            startDate: value ? value.startDate : undefined,
            endDate: language === 'en' ? newEndDate : convertDateAccToLanguage(newEndDate, language),
        });
    }


    public render() {
        const {
            className,
            value,
            error,
            language: { language },
        } = this.props;
        const {
            customActive,
            customState,
            previousLanguage,
            changedStartDate,
            changedEndDate,
        } = this.state;
        const { activeRouteDetails: { name: activePage } } = this.context;
        const test = convertDateAccToLanguage(
            value.endDate,
            language,
        );

        return (
            <div className={_cs(styles.pastDateRangeInput, className)}>
                <RadioInput
                    keySelector={pastDataKeySelector}
                    labelSelector={d => this.pastDataLabelSelector(d, language)}
                    options={activePage === 'dashboard' ? pastDateRangeDashboardOptions : pastDateRangeOptions}
                    onChange={this.handleRadioInputChange}
                    value={value.rangeInDays}
                    contentClassName={styles.dateRanges}
                />
                {value.rangeInDays === 'custom'
                    && (
                        <div className={styles.customRange}>
                            <Translation>
                                {
                                    t => (

                                        <DateInput
                                            onChange={this.handleStartDateInputChange}
                                            className={'startDateInput'}
                                            label={t('Start Date')}
                                            faramElementName="start"
                                            value={language === 'en' ? value && value.startDate ? changedStartDate ? BSToAD(value.startDate) : value.startDate : '' : convertDateAccToLanguage(
                                                value.startDate,
                                                language,
                                            )}
                                            // value={value.startDate}
                                            language={language}
                                        />
                                    )
                                }
                            </Translation>
                            <Translation>
                                {
                                    t => (
                                        <DateInput
                                            onChange={this.handleEndDateInputChange}
                                            className={'endDateInput'}
                                            label={t('End Date')}
                                            faramElementName="end"
                                            value={language === 'en' ? value && value.endDate ? changedEndDate ? BSToAD(value.endDate) : value.endDate : '' : convertDateAccToLanguage(
                                                value.endDate,
                                                language,
                                            )}

                                            // value={value.endDate}
                                            language={language}
                                        />
                                    )
                                }
                            </Translation>

                        </div>
                    )
                }
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

const mapStateToProps = state => ({
    language: languageSelector(state),
});

export default FaramInputElement(connect(
    mapStateToProps,
)(PastDateRangeInput));
