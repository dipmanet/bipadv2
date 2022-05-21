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
import PageContext from '#components/PageContext';

import {
	languageSelector,
} from '#selectors';

import styles from './styles.scss';
import { convertDateAccToLanguage } from '#utils/common';

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
}

class PastDateRangeInput extends React.Component<Props> {
	public static defaultProps = {
		value: undefined,
	};


	public static contextType = PageContext;

	public state = {
		customActive: false,
		customState: false,
	};

	// private testFunction() {
	// 	const { value } = this.props;
	// 	if (value.rangeInDays === 'custom') {
	// 		this.setState({ customState: true });
	// 		return;
	// 	}
	// 	this.setState({ customState: false });
	// }

	private handleRadioInputChange = (rangeInDays: number | 'custom') => {
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
			language: { language },
		} = this.props;
		const {
			customActive,
			customState,
		} = this.state;
		const { activeRouteDetails: { name: activePage } } = this.context;

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
				{customState && (
					<div className={styles.customRange}>
						<Translation>
							{
								t => (

									<DateInput
										onChange={this.handleStartDateInputChange}
										className={'startDateInput'}
										label={t('Start Date')}
										faramElementName="start"
										value={convertDateAccToLanguage(value.startDate, language)}
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
										value={convertDateAccToLanguage(value.endDate, language)}
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
