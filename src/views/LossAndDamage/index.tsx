/* eslint-disable react/no-did-update-set-state */

/* eslint-disable react/no-unused-state */

/* eslint-disable @typescript-eslint/camelcase */
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import memoize from "memoize-one";
import { listToGroupList, isDefined, listToMap } from "@togglecorp/fujs";
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	Brush,
} from "recharts";
import { Translation } from "react-i18next";

import DateInput from "#rsci/DateInput";
import modalize from "#rscg/Modalize";
import Button from "#rsca/Button";
import DangerButton from "#rsca/Button/DangerButton";
import Icon from "#rscg/Icon";

import Modal from "#rscv/Modal";
import ModalHeader from "#rscv/Modal/Header";
import ModalBody from "#rscv/Modal/Body";

import { lossMetricsDamageLoss } from "#utils/domain";
import { sum, saveChart, encodeDate, convertDateAccToLanguage } from "#utils/common";
import {
	hazardTypesSelector,
	hazardFilterSelector,
	regionFilterSelector,
	regionsSelector,
	languageSelector,
	filtersSelector,
	incidentListSelectorIP,
} from "#selectors";
import {
	createConnectedRequestCoordinator,
	createRequestClient,
	NewProps,
	ClientAttributes,
	methods,
} from "#request";

import Loading from "#components/Loading";
import Page from "#components/Page";
import { getResults, getPending } from "#utils/request";
import {
	transformDataRangeToFilter,
	transformRegionToFilter,
	transformDataRangeLocaleToFilter,
	pastDaysToDateRange,
} from "#utils/transformations";
import { setFiltersAction, setIncidentListActionIP } from "#actionCreators";
import Spinner from "#rscv/Spinner";
import DateRangeInfo from "#components/DateRangeInfo";
import Loader from "react-loader-spinner";
import ADToBS from "#utils/AdBSConverter/AdToBs";
import BSToAD from "#utils/AdBSConverter/BsToAd";
// import { ADToBS, BSToAD } from 'bikram-sambat-js';
import RiskInfoLayerContext from "#components/RiskInfoLayerContext";
import TabularView from "./TabularView";
import { getSanitizedIncidents } from "./common";
import Overview from "./Overview";
import Dropdown from "./DropDown";
import BarChartVisual from "./Barchart";
import AreaChartVisual from "./AreaChart";
import HazardWise from "./HazardWise";
import DataTable from "./DataTable";
import FilterRadio from "./FilterRadio";
import NewCompare from "./NewCompare";

import styles from "./styles.module.scss";
import DataCount from "./DataCount";
import { Data } from "./types";

const ModalButton = modalize(Button);

const IncidentTableModal = ({ closeModal, incidentList }) => (
	<Modal className={styles.lossAndDamageTableModal}>
		<Translation>
			{(t) => (
				<ModalHeader
					title={t("Incidents")}
					rightComponent={
						<DangerButton transparent iconName="close" onClick={closeModal} title="Close Modal" />
					}
				/>
			)}
		</Translation>

		<ModalBody className={styles.body}>
			<TabularView className={styles.table} lossAndDamageList={incidentList} />
		</ModalBody>
	</Modal>
);

interface State {}

interface ComponentProps {}

interface Params {}

type Props = NewProps<ComponentProps, Params>;

const chartMargin = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
};

const today = new Date();
const oneYearAgo = new Date();
oneYearAgo.setMonth(today.getMonth() - 6);

const DEFAULT_START_DATE = oneYearAgo;
const DEFAULT_END_DATE = today;

const transformFilters = ({ dataDateRange, region, ...otherFilters }) => ({
	...otherFilters,
	// ...transformDataRangeToFilter(dataDateRange, 'incident_on'),
	...transformDataRangeLocaleToFilter(dataDateRange, "incident_on"),
	...transformRegionToFilter(region),
});

const requestOptions: { [key: string] } = {
	incidentsGetRequest: {
		url: "/incident/",
		method: methods.GET,
		// We have to transform dateRange to incident_on__lt and incident_on__gt
		query: ({ props: { filters } }) => ({
			...transformFilters(filters),
			expand: ["loss", "event", "wards"],
			ordering: "-incident_on",
			limit: -1,
		}),
		onSuccess: ({ response, props: { setIncidentList } }) => {
			interface Response {
				results;
			}
			const { results: incidentList = [] } = response as Response;
			setIncidentList({ incidentList });
		},
		onMount: false,
		// onPropsChanged: {
		//     filters: ({
		//         props: { filters },
		//         prevProps: { filters: prevFilters },
		//     }) => {
		//         const shouldRequest = filters !== prevFilters;

		//         return shouldRequest;
		//     },
		// },
		// extras: { schemaName: 'incidentResponse' },
	},
};

const getDatesInIsoString = (startDate: string, endDate: string) => ({
	startDate: startDate ? new Date(startDate).toISOString() : undefined,
	endDate: endDate ? new Date(endDate).toISOString() : undefined,
});

const getDatesInLocaleTime = (startDate: string, endDate: string) => ({
	startDate: startDate ? `${startDate}T00:00:00+05:45` : undefined,
	endDate: endDate ? `${endDate}T23:59:59+05:45` : undefined,
});

const timeTickFormatter = (timestamp: number, language: string) => {
	const date = new Date();
	date.setTime(timestamp);
	return convertDateAccToLanguage(`${date.getFullYear()}-${date.getMonth() + 1}`, language);
};
class LossAndDamage extends React.PureComponent<Props, State> {
	public state = {
		startDate: encodeDate(DEFAULT_START_DATE),
		endDate: encodeDate(DEFAULT_END_DATE),
		submittedStartDate: encodeDate(DEFAULT_START_DATE),
		submittedEndDate: encodeDate(DEFAULT_END_DATE),
		Null_check_estimatedLoss: false,
		selectOption: { name: "Incidents", key: "count" },
		valueOnclick: { value: "count", index: 0 },
		regionRadio: { name: "province", id: 1 },
		incidentData: {},
		incidentType: "incident_count",
		isLoading: true,
		filterData: null,
		tableIncidentList: [],
		tablePending: true,
		summaryTypeData: "province_wise",
		changedStartDate: false,
		changedEndDate: false,
	};

	componentDidMount() {
		const { filters, setFilters, language } = this.props;
		const { startDate, endDate } = this.state;

		const sixMonths = {
			dataDateRange: {
				rangeInDays: 183,
				startDate: undefined,
				endDate: undefined,
			},
			hazard: [],
			region: filters.region,
		};

		setFilters({ filters: sixMonths });
		// fetch('http://192.168.1.101:8004/api/v1/incident/analytics/?summary_type=province_wise&incident_on__gt=2022-11-01T00:00:00&incident_on__lt=2023-05-03T00:00:00')
		//     .then(res => res.json())
		//     .then((data) => {
		//         this.setState({ incidentData: data.results });
		//     });
	}

	componentDidUpdate(prevProps, prevState) {
		const {
			filters,
			language: { language },
		} = this.props;
		const { rangeInDays, startDate: langStartDate, endDate: langEndDate } = filters.dataDateRange;
		const { changedStartDate, changedEndDate } = this.state;
		if (prevProps.filters.dataDateRange.rangeInDays !== rangeInDays) {
			if (rangeInDays !== "custom") {
				const { startDate: startDateFromFilter, endDate: endDateFromFilter } =
					pastDaysToDateRange(rangeInDays);
				this.handleStartDateChange(encodeDate(startDateFromFilter));
				this.handleEndDateChange(encodeDate(endDateFromFilter));
			}
			// if (prevProps.filters.dataDateRange.rangeInDays !== rangeInDays) {
			//     if (rangeInDays !== 'custom') {
			//         const { startDate: startDateFromFilter, endDate: endDateFromFilter } = pastDaysToDateRange(rangeInDays);
			//         this.handleStartDateChange(encodeDate(startDateFromFilter));
			//         this.handleEndDateChange(encodeDate(endDateFromFilter));
			//     } else {
			//         const { startDate: startDateFromFilter, endDate: endDateFromFilter } = filters.dataDateRange;
			//         this.handleStartDateChange(startDateFromFilter);
			//         this.handleEndDateChange(endDateFromFilter);
			//     }
		}
		if (prevProps.filters.dataDateRange.startDate !== langStartDate) {
			if (language === "np") {
				this.setState({ changedStartDate: true });
			} else {
				this.setState({ changedStartDate: false });
			}
		}
		if (prevProps.filters.dataDateRange.endDate !== langEndDate) {
			if (language === "np") {
				this.setState({ changedEndDate: true });
			} else {
				this.setState({ changedEndDate: false });
			}
		}
		if (
			prevProps.filters.dataDateRange.startDate !== langStartDate ||
			prevProps.filters.dataDateRange.endDate !== langEndDate
		) {
			if (rangeInDays === "custom") {
				this.setState({
					startDate:
						language === "np" ? convertDateAccToLanguage(langStartDate, language) : langStartDate,
					endDate:
						language === "np" ? convertDateAccToLanguage(langEndDate, language) : langEndDate,
				});
			}
		}

		if (prevProps.language.language !== language) {
			if (rangeInDays === "custom") {
				if (language === "np") {
					this.setState({
						startDate: convertDateAccToLanguage(langStartDate, language),
						endDate: convertDateAccToLanguage(langEndDate, language),
					});
				}
				if (language === "en") {
					this.setState({
						startDate: changedStartDate ? BSToAD(langStartDate) : langStartDate,
						endDate: changedEndDate ? BSToAD(langEndDate) : langEndDate,
					});
				}
			}
		}

		if (prevProps.filters !== filters) {
			const {
				dataDateRange,
				region: { adminLevel, geoarea },
			} = filters;
			const { incidentType } = this.state;
			// Convertion of the nepali date   // fetch(`${process.env.REACT_APP_API_SERVER_URL}/incident/analytics/?${federalFilter}&data_source=drr_api&incident_type=${incidentType}&hazard=${finalFilters.hazard.join(',')}&summary_type=${summaryType}&incident_on__gt=${finalFilters.incident_on__gt.split('+')[0]}&incident_on__lt=${finalFilters.incident_on__lt.split('+')[0]}`)
			//     .then(res => res.json())
			//     .then((data) => {
			//         this.setState({ incidentData: data.results, isLoading: false });
			//     });to english date for api call as data only get fetch for english date

			const modifiedFilter = {
				...filters,
				dataDateRange: {
					...dataDateRange,
					// startDate: language === 'np' ? BSToAD(dataDateRange.dataDateRange) : dataDateRange.startDate,
					// endDate: language === 'np' ? BSToAD(dataDateRange.endDate) : dataDateRange.endDate,
					startDate:
						prevProps.filters.dataDateRange.startDate !== dataDateRange.startDate
							? language === "np"
								? BSToAD(dataDateRange.startDate)
								: dataDateRange.startDate
							: changedStartDate
							? BSToAD(dataDateRange.startDate)
							: dataDateRange.startDate,
					endDate:
						prevProps.filters.dataDateRange.endDate !== dataDateRange.endDate
							? language === "np"
								? BSToAD(dataDateRange.endDate)
								: dataDateRange.endDate
							: changedEndDate
							? BSToAD(dataDateRange.endDate)
							: dataDateRange.endDate,
					// endDate: convertDateAccToLanguage(dataDateRange.endDate, language),
				},
			};

			const finalFilters = transformFilters(modifiedFilter);
			// let incidentOnGt = finalFilters.incident_on__gt;
			// let incidentOnLt = finalFilters.incident_on__lt;
			// if (language === 'np') {
			//     incidentOnGt = BSToAD();
			// }

			this.setState({ filterData: finalFilters });
			const summaryType =
				adminLevel === 1
					? "district_wise"
					: adminLevel === 2
					? "municipality_wise"
					: adminLevel === 3
					? "ward_wise"
					: "province_wise";
			this.setState({
				summaryTypeData: summaryType,
			});
			const federalFilter =
				adminLevel === 1
					? `province=${geoarea}`
					: adminLevel === 2
					? `district=${geoarea}`
					: adminLevel === 3
					? `municipality=${geoarea}`
					: "province=";

			if (adminLevel === undefined) {
				this.setState({ regionRadio: { name: "province", id: 1 } });
			}

			fetch(
				`${
					process.env.REACT_APP_API_SERVER_URL
				}/incident/analytics/?${federalFilter}&data_source=drr_api&incident_type=${incidentType}&hazard=${finalFilters.hazard.join(
					","
				)}&summary_type=${summaryType}&incident_on__gt=${
					finalFilters.incident_on__gt.split("+")[0]
				}&incident_on__lt=${finalFilters.incident_on__lt.split("+")[0]}`
			)
				.then((res) => res.json())
				.then((data) => {
					this.setState({ incidentData: data.results, isLoading: false });
				});
		}
	}

	componentWillUnmount(): void {
		const { filters, setFilters } = this.props;
		const sixMonths = {
			dataDateRange: {
				rangeInDays: 7,
				startDate: undefined,
				endDate: undefined,
			},
			hazard: [],
			region: filters.region,
		};

		setFilters({ filters: sixMonths });
	}

	private handleSaveClick = (domId, saveName) => {
		saveChart(domId, saveName);
	};

	private calculateSummary = (data) => {
		const stat = lossMetricsDamageLoss.reduce(
			(acc, { key }) => ({
				...acc,
				[key]: sum(
					data
						.filter((incident) => incident.loss)
						.map((incident) => incident.loss[key])
						.filter(isDefined)
				),
			}),
			{}
		);

		stat.count = data.length;

		return stat;
	};

	private getHazardsCount = (data, hazardTypes) => {
		const counts = Object.keys(hazardTypes).reduce((acc, hazard) => {
			const dataForCurrentHazard = data.filter((i) => String(i.hazard) === String(hazard));
			const hazardCount = dataForCurrentHazard.length;

			if (hazardCount === 0) {
				return acc;
			}

			return {
				...acc,
				[hazard]: {
					hazardDetail: hazardTypes[hazard],
					summary: this.calculateSummary(dataForCurrentHazard),
				},
			};
		}, {});

		return counts;
	};

	private filterByRegion = (sanitizedIncidents, regionFilter) => {
		if (!regionFilter.adminLevel) {
			return sanitizedIncidents;
		}

		const regionNameMap = {
			1: "province",
			2: "district",
			3: "municipality",
			4: "ward",
		};

		const filterableProperty = regionNameMap[regionFilter.adminLevel];
		const filteredIncidents = sanitizedIncidents.filter(
			(d) => d[filterableProperty] === regionFilter.geoarea
		);

		return filteredIncidents;
	};

	private getFilteredData = memoize((data, hazardTypes, hazardFilter, regionFilter, regions) => {
		const hazardFilterMap = listToMap(
			hazardFilter,
			(d) => d,
			() => true
		);
		const sanitizedIncidents = getSanitizedIncidents(data, regions, hazardTypes);
		const regionFilteredData = this.filterByRegion(sanitizedIncidents, regionFilter);

		const filteredData =
			hazardFilter.length > 0
				? regionFilteredData.filter((d) => hazardFilterMap[d.hazard])
				: regionFilteredData;
		const null_check_estimatedLoss = filteredData
			.map((item) => (item.loss ? item.loss.estimatedLoss : undefined))
			.filter((item) => item === undefined);
		if (filteredData.length > 0 && filteredData.length === null_check_estimatedLoss.length) {
			this.setState({ Null_check_estimatedLoss: true });
		}
		return filteredData;
	});

	private getDataAggregatedByYear = memoize((data) => {
		const dataWithYear = data.map((d) => {
			const incidentDate = new Date(d.incidentOn);
			incidentDate.setDate(1);
			incidentDate.setHours(0);
			incidentDate.setMinutes(0);
			incidentDate.setSeconds(0);

			return {
				...d,
				incidentMonthTimestamp: incidentDate.getTime(),
			};
		});

		const dateGroupedData = listToGroupList(
			dataWithYear,
			(d) => d.incidentMonthTimestamp,
			(d) => d
		);
		const dateList = Object.keys(dateGroupedData);

		const aggregatedData = dateList.map((date) => {
			const dataListForCurrentYear = dateGroupedData[date].filter((d) => !!d.loss);
			const summaryForCurrentYear = this.calculateSummary(dataListForCurrentYear);
			// const hazardSummary = this.getHazardsCount(dataListForCurrentYear, hazardTypes);

			return {
				incidentMonthTimestamp: date,
				summary: summaryForCurrentYear,
				// hazardSummary,
			};
		});

		return aggregatedData.sort((a, b) => a.incidentMonthTimestamp - b.incidentMonthTimestamp);
	});

	private handleStartDateChange = (startDate) => {
		// const { endDate } = this.state;
		// const { requests: { incidentsGetRequest } } = this.props;

		// incidentsGetRequest.do({
		//     ...getDatesInIsoString(startDate, endDate),
		// });
		const {
			language: { language },
		} = this.props;

		const newConvertedStartDate = convertDateAccToLanguage(startDate, language, true);
		this.setState({ startDate: newConvertedStartDate });
	};

	private handleEndDateChange = (endDate) => {
		// const { startDate } = this.state;
		// const { requests: { incidentsGetRequest } } = this.props;

		// incidentsGetRequest.do({
		//     ...getDatesInIsoString(startDate, endDate),
		// });
		const {
			language: { language },
		} = this.props;
		const newConvertedEndDate = convertDateAccToLanguage(endDate, language, true);

		this.setState({ endDate: newConvertedEndDate });
	};

	private handleSubmitClick = () => {
		const { startDate, endDate } = this.state;

		if (startDate > endDate) {
			return;
		}

		const {
			requests: { incidentsGetRequest },
		} = this.props;
		incidentsGetRequest.do({
			...getDatesInLocaleTime(startDate, endDate),
		});
		this.setState({
			submittedStartDate: startDate,
			submittedEndDate: endDate,
		});
	};

	private dateTimeStamp = (date) => String(new Date(date).getTime());

	public render() {
		const {
			requests,
			hazardTypes,
			hazardFilter,
			regionFilter,
			regions,
			language: { language },
			filters: {
				region: { adminLevel, geoarea },
			},
			filters,
			tableIncidentData,
		} = this.props;

		const {
			startDate,
			endDate,
			submittedStartDate,
			submittedEndDate,
			Null_check_estimatedLoss,
			valueOnclick,
			selectOption,
			regionRadio,
			incidentData,
			isLoading,
			filterData,
			tableIncidentList,
			tablePending,
			incidentType,
			summaryTypeData,
			changedEndDate,
			changedStartDate,
		} = this.state;

		const pending = false;
		// const incidentList: never[] = [];
		const filteredData = this.getFilteredData(
			tableIncidentData,
			hazardTypes,
			hazardFilter,
			regionFilter,
			regions
		);

		const chartData = this.getDataAggregatedByYear(filteredData);

		const chartDataFinal =
			incidentData &&
			incidentData.dateWise &&
			incidentData.dateWise
				.map((item) => ({
					incidentMonthTimestamp: this.dateTimeStamp(item.date),
					summary: { count: item.count },
				}))
				.sort((x, y) => x.incidentMonthTimestamp - y.incidentMonthTimestamp);

		const setVAlueOnClick = (dat) => {
			this.setState({ valueOnclick: dat });
		};

		const setSelectOption = (name, key) => {
			this.setState({ selectOption: { name, key } });
		};

		const setRegionRadio = (val, id) => {
			const { dataDateRange } = filters;
			this.setState({ isLoading: true });
			const finalFilters = transformFilters(filters);

			this.setState({ filterData: finalFilters });
			const summaryType =
				id === 1
					? "province_wise"
					: id === 2
					? "district_wise"
					: id === 3
					? "municipality_wise"
					: "ward_wise";
			this.setState({
				summaryTypeData: summaryType,
			});
			const federalFilter =
				adminLevel === 1
					? `province=${geoarea}`
					: adminLevel === 2
					? `district=${geoarea}`
					: adminLevel === 3
					? `municipality=${geoarea}`
					: "province=";

			if (adminLevel === undefined) {
				this.setState({ regionRadio: { name: "province", id: 1 } });
			}

			fetch(
				`${
					process.env.REACT_APP_API_SERVER_URL
				}/incident/analytics/?${federalFilter}&data_source=drr_api&incident_type=${incidentType}&hazard=${finalFilters.hazard.join(
					","
				)}&summary_type=${summaryType}&incident_on__gt=${
					finalFilters.incident_on__gt.split("+")[0]
				}&incident_on__lt=${finalFilters.incident_on__lt.split("+")[0]}`
			)
				.then((res) => res.json())
				.then((data) => {
					this.setState({ incidentData: data.results, isLoading: false });
				});

			this.setState({ regionRadio: { name: val, id } });
		};

		const hazardSummary = this.getHazardsCount(filteredData, hazardTypes);
		const dropDownClickHandler = (item, index) => {
			const { label, key } = item;
			this.setState({ isLoading: true });
			const { dataDateRange } = filters;

			const finalFilters = transformFilters(filters);

			this.setState({ filterData: finalFilters });
			const summaryType =
				adminLevel === 1
					? "district_wise"
					: adminLevel === 2
					? "municipality_wise"
					: adminLevel === 3
					? "ward_wise"
					: "province_wise";

			const federalFilter =
				adminLevel === 1
					? `province=${geoarea}`
					: adminLevel === 2
					? `district=${geoarea}`
					: adminLevel === 3
					? `municipality=${geoarea}`
					: "province=";

			const incidentTypeData =
				index === 0
					? "incident_count"
					: index === 1
					? "people_death_count"
					: index === 2
					? "estimated_loss"
					: index === 3
					? "infrastructures_destroyed"
					: index === 4
					? "livestocks_destroyed"
					: index === 5
					? "people_injured_count"
					: "people_missing_count";
			this.setState({ incidentType: incidentTypeData });
			fetch(
				`${
					process.env.REACT_APP_API_SERVER_URL
				}/incident/analytics/?${federalFilter}&data_source=drr_api&incident_type=${incidentTypeData}&hazard=${finalFilters.hazard.join(
					","
				)}&summary_type=${summaryTypeData}&incident_on__gt=${
					finalFilters.incident_on__gt.split("+")[0]
				}&incident_on__lt=${finalFilters.incident_on__lt.split("+")[0]}`
			)
				.then((res) => res.json())
				.then((data) => {
					this.setState({ incidentData: data.results, isLoading: false });
				});

			setVAlueOnClick({ value: key, index });
			setSelectOption(label, key);
		};
		const hazardTypeData = Object.values(hazardTypes);

		const hazardSummaryData = {};
		const hazardSummaryDataCalculation =
			incidentData &&
			incidentData.hazardWise &&
			incidentData.hazardWise.map((item, id) => {
				const selectedHazardDetails = hazardTypeData.find((itm) => itm.id === item.hazard);
				const data = {
					hazardDetail: selectedHazardDetails,
					summary: { count: item.count },
				};
				hazardSummaryData[`${selectedHazardDetails.id}`] = data;
				return null;
			});

		const barChartData =
			incidentData &&
			incidentData.data &&
			incidentData.data
				.map((item) => ({
					name: language === "en" ? item.federalTitleEn : item.federalTitleNe,
					value: item.count,
				}))
				.sort((x, y) => y.value - x.value)
				.slice(0, 10);

		const overallTotalIncident =
			incidentData && incidentData.data && incidentData.data.length
				? incidentData.data.reduce(
						(previousValue, currentValue) => previousValue + currentValue.count,
						0
				  )
				: "-";

		const finalFiltersForTable = transformFilters(filters);

		return (
			<>
				<Loading
					pending={isLoading}
					text={
						language === "en"
							? "Please wait, the system is loading data"
							: "कृपया पर्खनुहोस्, प्रणाली डेटा लोड गर्दैछ"
					}
				/>
				<Page
					leftContentContainerClassName={styles.left}
					leftContent={
						<>
							<div className={styles.dataDetails}>
								<div className={styles.dateDetails}>
									{/* <div className={styles.infoIconContainer}>
                                        <Icon
                                            className={styles.infoIcon}
                                            name="info"
                                        />
                                    </div> */}
									<DateRangeInfo
										className={styles.dateRange}
										startDate={convertDateAccToLanguage(startDate, language)}
										endDate={convertDateAccToLanguage(endDate, language)}
									/>
									{/* {language === 'en'
                                        && (
                                            <div className={styles.label}>
                                                Showing Data From
                                            </div>
                                        )
                                    } */}

									{/* <DateInput
                                        showLabel={false}
                                        showHintAndError={false}
                                        className={'startDateInput'}
                                        value={convertDateAccToLanguage(startDate, language)}
                                        onChange={this.handleStartDateChange}
                                        language={language}
                                    />
                                    <div className={styles.label}>
                                        <div className={styles.label}>
                                            {language === 'en'
                                                ? <span>to</span>
                                                : <span>देखि</span>
                                            }
                                        </div>
                                    </div>
                                    <DateInput
                                        showLabel={false}
                                        showHintAndError={false}
                                        className={'endDateInput'}
                                        value={convertDateAccToLanguage(endDate, language)}
                                        onChange={this.handleEndDateChange}
                                        language={language}
                                    />
                                    {language === 'np'
                                        && (
                                            <span>
                                                सम्‍मको डाटा
                                                {' '}
                                                {''}
                                            </span>
                                        )
                                    } */}
									{/* <div
                                        className={styles.submitButton}
                                        onClick={this.handleSubmitClick}
                                        role="presentation"
                                    >
                                        <Translation>
                                            {
                                                t => <span>{t('Submit')}</span>
                                            }
                                        </Translation>
                                    </div> */}
								</div>
								{startDate > endDate && (
									<div className={styles.warningText}>
										WARNING! Start date cannot be greater than End Date
									</div>
								)}
								<div className={styles.sourceDetails}>
									<div className={styles.infoIconContainer}>
										<Icon className={styles.infoIcon} name="info" />
									</div>
									<div className={styles.label}>
										<Translation>{(t) => <span>{t("Data sources")}</span>}</Translation>:
									</div>
									<div className={styles.value}>
										<div className={styles.source}>
											<Translation>{(t) => <span>{t("Nepal Police")}</span>}</Translation>
										</div>
										<div className={styles.source}>
											<div className={styles.text}>
												<Translation>{(t) => <span>{t("DRR Portal")}</span>}</Translation>
											</div>
											<a
												className={styles.link}
												target="_blank"
												rel="noopener noreferrer"
												href="http://drrportal.gov.np">
												<Icon name="externalLink" />
											</a>
										</div>
									</div>
								</div>
							</div>
							<div className={styles.actions}>
								<div className={styles.radioAndCompare}>
									<FilterRadio
										regionRadio={regionRadio}
										setRegionRadio={setRegionRadio}
										data={filteredData}
										valueOnclick={valueOnclick}
										regionFilter={regionFilter}
										language={language}
										federalLevel={adminLevel}
									/>
								</div>

								<ModalButton
									disabled={pending}
									className={styles.modalButton}
									modal={
										<NewCompare
											lossAndDamageList={[]}
											getDataAggregatedByYear={this.getDataAggregatedByYear}
											getHazardsCount={this.getHazardsCount}
											hazardTypes={hazardTypes}
											selectOption={selectOption}
											valueOnclick={valueOnclick}
											currentSelection={selectOption}
											language={language}
											regionRadio={regionRadio}
											pending={pending}
											dateTimeStamp={this.dateTimeStamp}
											finalFilters={filterData}
										/>
									}>
									{pending ? (
										<>
											{" "}
											<span>
												Loading,please wait <Spinner />
											</span>{" "}
										</>
									) : (
										<Translation>{(t) => <span>{t("Compare Regions")}</span>}</Translation>
									)}
								</ModalButton>
								<ModalButton
									disabled={pending}
									title={language === "en" ? "View Tabular Data" : "टेबुलर डाटा हेर्नुहोस्"}
									className={styles.showTableButton}
									iconName="table"
									transparent
									modal={
										<DataTable
											className={styles.headerText}
											incidentList={filteredData}
											language={language}
											pending={tablePending}
											finalFiltersForTable={finalFiltersForTable}
										/>
									}
								/>
							</div>
							<div className={styles.container}>
								<Dropdown
									dropDownClickHandler={dropDownClickHandler}
									selectOption={selectOption}
									setSelectOption={setSelectOption}
									dropdownOption={lossMetricsDamageLoss}
									icon
								/>
								<DataCount
									data={filteredData}
									value={selectOption}
									language={language}
									overallTotalIncident={overallTotalIncident}
								/>
								{!isLoading && incidentData && incidentData.data.length > 0 ? (
									<div style={{ width: "95%" }}>
										<BarChartVisual
											filter={regionFilter}
											data={filteredData}
											barChartData={barChartData}
											selectOption={selectOption}
											valueOnclick={valueOnclick}
											regionRadio={regionRadio}
											handleSaveClick={this.handleSaveClick}
											downloadButton
											fullScreenMode
											language={language}
										/>
										<AreaChartVisual
											selectOption={selectOption}
											data={chartDataFinal}
											handleSaveClick={this.handleSaveClick}
											downloadButton
											fullScreenMode
											language={language}
										/>
										<HazardWise
											selectOption={selectOption}
											data={hazardSummaryData}
											handleSaveClick={this.handleSaveClick}
											downloadButton
											fullScreenMode
											language={language}
										/>
									</div>
								) : !isLoading && incidentData && incidentData.data.length === 0 ? (
									<h3 style={{ marginTop: "50px" }} className={styles.headerText}>
										{language === "en" ? "No Data Available" : "डाटा उपलब्ध छैन"}
									</h3>
								) : (
									<div className={styles.dataUnavailable}>
										<h3 className={styles.headerText}>
											{language === "en"
												? "Please wait, the system is loading data"
												: "कृपया पर्खनुहोस्, प्रणाली डाटा लोड गर्दैछ"}
										</h3>
										<Spinner className={styles.spinner} />
									</div>
								)}
							</div>
						</>
					}
					mainContent={
						<Overview
							incidentData={incidentData}
							lossAndDamageList={filteredData}
							startDate={submittedStartDate}
							endDate={submittedEndDate}
							radioSelect={regionRadio}
							currentSelection={selectOption}
							pending={isLoading}
						/>
					}
				/>
			</>
		);
	}
}

const mapStateToProps = (state) => ({
	hazardTypes: hazardTypesSelector(state),
	hazardFilter: hazardFilterSelector(state),
	regionFilter: regionFilterSelector(state),
	regions: regionsSelector(state),
	language: languageSelector(state),
	filters: filtersSelector(state),
	tableIncidentData: incidentListSelectorIP(state),
});

const mapDispatchToProps = (dispatch) => ({
	setIncidentList: (params) => dispatch(setIncidentListActionIP(params)),
	setFilters: (params) => dispatch(setFiltersAction(params)),
});

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	createConnectedRequestCoordinator<ComponentProps>(),
	createRequestClient(requestOptions)
)(LossAndDamage);
