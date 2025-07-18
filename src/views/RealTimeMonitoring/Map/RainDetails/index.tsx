/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-did-update-set-state */
import React from "react";
import memoize from "memoize-one";
import {
	_cs,
	compareDate,
	compareNumber,
	getDifferenceInDays,
	getDate,
	listToGroupList,
	isDefined,
	mapToList,
} from "@togglecorp/fujs";
import { timeFormat } from "d3-time-format";

import { Translation } from "react-i18next";
import Message from "#rscv/Message";
import DangerButton from "#rsca/Button/DangerButton";
import Modal from "#rscv/Modal";
import ModalHeader from "#rscv/Modal/Header";
import ModalBody from "#rscv/Modal/Body";
import Table from "#rscv/Table";
import Image from "#rsu/../v2/View/Image";
import FormattedDate from "#rscv/FormattedDate";
import TextOutput from "#components/TextOutput";
import LoadingAnimation from "#rscv/LoadingAnimation";
import MultiLineChart from "#rscz/MultiLineChart";
import Legend from "#rscz/Legend";

import { RealTimeRainDetails, WaterLevelAverage } from "#store/atom/page/types";
import { Header } from "#store/atom/table/types";
import { MultiResponse } from "#store/atom/response/types";
import {
	createConnectedRequestCoordinator,
	createRequestClient,
	NewProps,
	ClientAttributes,
	methods,
} from "#request";
import { groupList } from "#utils/common";

import {
	parsePeriod,
	getChartData,
	arraySorter,
	isEqualObject,
	parseInterval,
} from "#views/DataArchive/Modals/Rainwatch/utils";
import TableView from "#views/DataArchive/Modals/Rainwatch/TableView";

import Graph from "#views/DataArchive/Modals/Rainwatch/Graph";
import PeriodSelector from "#views/DataArchive/Modals/Rainwatch/Filters/PeriodSelector";
import styles from "./styles.module.scss";

interface Params {}
interface OwnProps {
	handleModalClose: () => void;
	title: string;
	className?: string;
}
interface State {}

interface LegendItem {
	key: string;
	label: string;
	color: string;
	language: string;
}

const RainEmptyComponent = () => <Message>Data is currently not available</Message>;

const RainEmptyComponentNe = () => <Message>डाटा हाल उपलब्ध छैन</Message>;

const rainLegendData: LegendItem[] = (language) => [
	{
		key: "averages",
		label: language === "en" ? "Average Rainfall (mm)" : "औसत वर्षा (मिमी)",
		color: "#7fc97f",
	},
];

const labelSelector = (d: LegendItem) => d.label;
const keySelector = (d: LegendItem) => d.label;
const colorSelector = (d: LegendItem) => d.color;

type Props = NewProps<OwnProps, Params>;

const waterLevelKeySelector = (waterLevel: WaterLevelAverage) => waterLevel.interval;
const rainKeySelector = (rain: RealTimeRainDetails) => rain.id;

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
	detailRequest: {
		url: "/rain/",
		method: methods.GET,
		// query: ({ props: { title } }) => ({
		//     historical: 'true',
		//     format: 'json',
		//     title,
		// }),
		query: ({ params, props: { title } }) => {
			if (!params || !params.dataDateRange) {
				return undefined;
			}
			const { startDate, endDate } = params.dataDateRange;

			let measuredOnGt;
			let measuredOnLt;
			if (params.isHourly === 2) {
				measuredOnGt = `${startDate}T01:00:00+05:45`;

				const [year, month, day] = endDate.split("-");

				const day1 = parseInt(day) + 1;
				// const date = new Date(`${endDate}Z`);
				measuredOnLt = `${year}-${month}-${day1}T01:00:00+05:45`;
			} else {
				// eslint-disable-next-line @typescript-eslint/camelcase
				measuredOnGt = `${startDate}T00:00:00+05:45`;
				// eslint-disable-next-line @typescript-eslint/camelcase
				measuredOnLt = `${endDate}T23:59:59+05:45`;
			}

			return {
				title,
				// eslint-disable-next-line @typescript-eslint/camelcase
				is_hourly: params.isHourly,
				// eslint-disable-next-line @typescript-eslint/camelcase
				is_daily: params.isDaily,

				// eslint-disable-next-line @typescript-eslint/camelcase
				measured_on__gt: measuredOnGt,
				// eslint-disable-next-line @typescript-eslint/camelcase
				measured_on__lt: measuredOnLt,

				fields: [
					"id",
					"created_on",
					"measured_on",
					"title",
					"image",
					"basin",
					"point",
					"averages",
					"status",
					"station",
				],
				limit: -1,
			};
		},
		onMount: false,
		onPropsChanged: ["title"],
	},
};

const emptyArray: any[] = [];

class RainDetails extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			filterValues: {
				dataDateRange: {
					startDate: new Date(new Date().setDate(new Date().getDate() - 3))
						.toJSON()
						.slice(0, 10)
						.replace(/-/g, "-"),
					endDate: new Date().toJSON().slice(0, 10).replace(/-/g, "-"),
				},
				period: { periodCode: "hourly" },
			},
			riverDetails: [],
			filterwiseChartData: [],
			intervalCode: "",
			isInitial: true,
		};
		const { language } = this.props;

		this.latestWaterLevelHeader = [
			{
				key: "interval",
				label: language === "en" ? "INTERVAL" : "अन्तराल",
				order: 1,
			},
			{
				key: "value",
				label: language === "en" ? "VALUE (mm)" : "मान (मिमी)",
				order: 2,
				modifier: (row) => `${row.value || "-"}`,
			},
			{
				key: "status",
				label: language === "en" ? "STATUS" : "स्थिति",
				order: 3,
				modifier: (row) => {
					const { danger: dangerStatus, warning: warningStatus } = row.status;

					if (dangerStatus && warningStatus) {
						return "danger, warning";
					}
					if (dangerStatus) {
						return "danger";
					}
					if (warningStatus) {
						return "warning";
					}
					return null;
				},
			},
		];

		this.rainHeader = [
			{
				key: "createdOn",
				label: language === "en" ? "DATE" : "मिति",
				order: 1,
				modifier: (row) => (
					<FormattedDate value={row.createdOn} language={language} mode="yyyy-MM-dd, hh:mm aaa" />
				),
			},
			{
				key: "averages",
				label: language === "en" ? "AVERAGE RAINFALL (mm)" : "औसत वर्षा (मिमी)",
				order: 2,
				modifier: (row) => {
					const { averages = [] } = row;
					const average = averages.find((av) => av.interval === 1);
					return average ? average.value : undefined;
				},
			},
		];
	}

	public componentDidMount() {
		const {
			requests: { detailRequest },
		} = this.props;
		const { filterValues } = this.state;
		const { dataDateRange } = filterValues;
		const isDaily = true;
		detailRequest.do({ dataDateRange, isDaily });
	}

	public componentDidUpdate(prevProps, prevState) {
		const initialFaramValue = {
			dataDateRange: {
				startDate: "",
				endDate: "",
			},
			period: {},
		};

		if (
			prevState.filterValues !== this.state.filterValues ||
			prevState.riverDetails !== this.state.riverDetails
		) {
			const { riverDetails } = this.state;
			const rainDataWithParameter = parseInterval(riverDetails);
			const rainDataWithPeriod = parsePeriod(rainDataWithParameter);

			const hourWiseGroup = groupList(
				rainDataWithPeriod.filter((r) => r.dateWithHour),
				(rain) => rain.dateWithHour
			);

			const dailyWiseGroup = groupList(
				rainDataWithPeriod.filter((r) => r.dateOnly),
				(rain) => rain.dateOnly
			);

			const monthlyWiseGroup = groupList(
				rainDataWithPeriod.filter((r) => r.dateOnly),
				(rain) => rain.dateOnly
			);

			let filterWiseChartData;

			const {
				period: { periodCode },
			} = this.state.filterValues;

			if (periodCode === "hourly") {
				filterWiseChartData = getChartData(hourWiseGroup, "hourName");
				this.setState({ filterWiseChartData });
				this.setState({ intervalCode: "oneHour" });
			}
			if (periodCode === "daily") {
				filterWiseChartData = getChartData(dailyWiseGroup, "dateName");
				this.setState({ filterWiseChartData });
				this.setState({ intervalCode: "twentyFourHour" });
			}
			if (periodCode === "monthly") {
				filterWiseChartData = getChartData(monthlyWiseGroup, "monthName");
				this.setState({ filterWiseChartData });
				this.setState({ intervalCode: "twentyFourHour" });
			}

			if (filterWiseChartData) {
				filterWiseChartData.sort(arraySorter);
				this.setState({ filterWiseChartData: filterWiseChartData.sort(arraySorter) });
			}
			// eslint-disable-next-line react/destructuring-assignment
			const isInitialCheck = isEqualObject(initialFaramValue, this.state.filterValues);
			this.setState({ isInitial: isInitialCheck });
		}
	}

	private latestWaterLevelHeader: Header<WaterLevelAverage>[];

	private rainHeader: Header<RealTimeRainDetails>[];

	private getSortedRainData = memoize((rainDetails: RealTimeRainDetails[]) => {
		const sortedData = [...rainDetails].sort((a, b) => compareDate(b.createdOn, a.createdOn));
		return sortedData;
	});

	private getTodaysRainDetails = memoize((rainDetails: RealTimeRainDetails[]) => {
		const today = getDate(new Date().getTime());
		const todaysData = rainDetails.filter((rainDetail) => getDate(rainDetail.createdOn) === today);
		return todaysData;
	});

	private getWeeklyRainDetails = memoize((rainDetails: RealTimeRainDetails[]) => {
		const today = new Date().getTime();
		const filtered = rainDetails.filter(
			(rainDetail) => getDifferenceInDays(rainDetail.createdOn, today) < 8
		);

		const groupedRain = listToGroupList(filtered, (rain) =>
			new Date(rain.createdOn).setHours(0, 0, 0, 0)
		);

		interface Series {
			name: string;
			color: string;
			values: number[];
		}

		const data: Series = { name: "Average Rainfall (mm)", color: "#7fc97f", values: [] };
		const dates: number[] = [];

		Object.entries(groupedRain).forEach(([key, values]) => {
			const value = values.reduce((prev, curr) => (prev.createdOn > curr.createdOn ? prev : curr));
			const latestAverageValue = value.averages.reduce((prev, curr) =>
				prev.interval > curr.interval ? prev : curr
			);
			data.values.push(latestAverageValue.value || 0);
			dates.push(+key);
		});
		const series = [data];
		return { series, dates };
	});

	private getHourlyRainData = memoize((rainDetails: RealTimeRainDetails[]) => {
		const rainWithoutMinutes = rainDetails.map((rain) => {
			const { createdOn } = rain;
			const dateWithoutMinutes = new Date(createdOn).setMinutes(0, 0, 0);
			return {
				...rain,
				createdOn: dateWithoutMinutes,
			};
		});

		const groupedRain = listToGroupList(rainWithoutMinutes, (rain) => rain.createdOn);
		const rainHours = mapToList(groupedRain, (value) => value[0]).filter(isDefined);

		return rainHours;
	});

	private handlePeriodChange = (periodName: string) => {
		this.setState((prevState) => ({
			...prevState,
			filterValues: {
				dataDateRange: {
					startDate: new Date(new Date().setDate(new Date().getDate() - 3))
						.toJSON()
						.slice(0, 10)
						.replace(/-/g, "-"),
					endDate: new Date().toJSON().slice(0, 10).replace(/-/g, "-"),
				},
				period: { periodCode: periodName ? periodName.periodCode : "hourly" },
			},
		}));
	};

	private getHourlyChartData = memoize((rainDetails: RealTimeRainDetails[]) => {
		interface ChartData {
			createdOn: number[];
			averageRainfall: number[];
		}

		const initialChartData: ChartData = {
			averageRainfall: [],
			createdOn: [],
		};

		const data = rainDetails.reduce((acc, rain) => {
			const { averages, createdOn: co } = rain;

			const hourlyAverage = averages.find((av) => av.interval === 1);
			const rainfall = hourlyAverage && hourlyAverage.value ? hourlyAverage.value : 0;
			if (co) {
				const { averageRainfall, createdOn } = acc;

				averageRainfall.push(rainfall);
				createdOn.push(co);
			}

			return acc;
		}, initialChartData);

		const { averageRainfall, createdOn } = data;
		const series = [
			{
				name: "Average Rainfall (mm)",
				color: "#7fc97f",
				values: averageRainfall,
			},
		];

		return { series, dates: createdOn };
	});

	public render() {
		const {
			requests: {
				detailRequest: { response, pending },
			},
			title = "",
			handleModalClose,
		} = this.props;

		const { filterValues, filterWiseChartData, intervalCode, isInitial } = this.state;

		let riverDetails: RealTimeRainDetails[] = [];
		if (!pending && response) {
			const { results } = response as MultiResponse<RealTimeRainDetails>;
			riverDetails = results;
			this.setState({ riverDetails });
		}

		const {
			className,
			language,
			rainImage,
			status,
			basin,
			description,
			measuredOn,
			lng,
			lat,
			flow,
			waterLevel,
		} = this.props;

		const {
			period: { periodCode },
		} = this.state.filterValues;

		let rainDetails: RealTimeRainDetails[] = emptyArray;
		if (!pending && response) {
			const { results } = response as MultiResponse<RealTimeRainDetails>;
			rainDetails = results;
		}

		const sortedRainDetails = this.getSortedRainData(rainDetails);
		const todaysRainDetails = this.getTodaysRainDetails(sortedRainDetails);
		const latestRainDetail = sortedRainDetails[0];
		const hourlyRainDetails = this.getHourlyRainData(todaysRainDetails);
		const hourlyRainChartData = this.getHourlyChartData(hourlyRainDetails);
		const weeklyRainChartData = this.getWeeklyRainDetails(rainDetails);

		return (
			<>
				<Translation>
					{(t) => (
						<Modal
							// closeOnEscape
							// onClose={handleModalClose}
							className={_cs(className, styles.rainDetailModal)}>
							<ModalHeader
								title={title}
								rightComponent={
									<DangerButton
										transparent
										iconName="close"
										onClick={handleModalClose}
										title="Close Modal"
									/>
								}
							/>
							<ModalBody className={styles.body}>
								{pending && <LoadingAnimation />}
								<div className={styles.rainDetails}>
									<div className={styles.top}>
										{rainImage ? (
											<Image className={styles.image} src={rainImage} alt="rain-image" zoomable />
										) : (
											<div className={styles.noImage}>{t("Image not available")}</div>
										)}

										<div className={styles.details}>
											{/* <TextOutput
                                            className={styles.detail}
                                            labelClassName={styles.label}
                                            valueClassName={styles.value}
                                            label="Description"
                                            value={description || 'No Data'}
                                        /> */}
											<TextOutput
												className={styles.detail}
												labelClassName={styles.label}
												valueClassName={styles.value}
												label={t("Basin")}
												value={basin || "-"}
											/>
											<TextOutput
												className={styles.detail}
												labelClassName={styles.label}
												valueClassName={styles.value}
												label={t("Status")}
												value={status || "-"}
											/>
											<TextOutput
												className={styles.detail}
												labelClassName={styles.label}
												valueClassName={styles.value}
												label={t("Latitude")}
												value={lat || "-"}
											/>
											<TextOutput
												className={styles.detail}
												labelClassName={styles.label}
												valueClassName={styles.value}
												label={t("Longitude")}
												value={lng || "-"}
											/>
											<TextOutput
												className={styles.detail}
												labelClassName={styles.label}
												valueClassName={styles.value}
												label="Measured On"
												value={
													<FormattedDate
														value={measuredOn || ""}
														language={language}
														mode="yyyy-MM-dd, hh:mm:aaa"
													/>
												}
											/>
										</div>
									</div>
									<div className={styles.bottom}>
										<div className={styles.latestRainfall}>
											<header className={styles.header}>
												<h4 className={styles.heading}>{t("Latest Rainfall")}</h4>
											</header>
											<Graph
												stationData={riverDetails}
												filterWiseChartData={filterWiseChartData}
												intervalCode={intervalCode}
												periodCode={periodCode}
												isInitial={isInitial}
												stationName={title}
												filterValues={this.state.filterValues}
												chartTitle={"Accumulated Rainfall (mm)"}
											/>
										</div>
										<div className={styles.selectComponent}>
											<h3>Period</h3>
											<PeriodSelector onChange={this.handlePeriodChange} />
										</div>
										<div className={styles.accumulatedRainfall}>
											<TableView
												filterWiseChartData={filterWiseChartData}
												filterValues={this.state.filterValues}
												isInitial={isInitial}
												stationName={title}
											/>
										</div>
									</div>
								</div>
							</ModalBody>
						</Modal>
					)}
				</Translation>
			</>
		);
	}
}

export default createConnectedRequestCoordinator<OwnProps>()(
	createRequestClient(requests)(RainDetails)
);
