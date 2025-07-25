/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-did-update-set-state */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */

/* eslint-disable @typescript-eslint/indent */
import React from "react";
import { compose, Dispatch } from "redux";
import { connect } from "react-redux";
import { _cs, Obj, listToMap } from "@togglecorp/fujs";
import memoize from "memoize-one";

import { Translation } from "react-i18next";
import Legend from "#rscz/Legend";
import { FiltersElement } from "#types";
import { AppState } from "#store/types";
import * as PageType from "#store/atom/page/types";

import {
	createConnectedRequestCoordinator,
	createRequestClient,
	NewProps,
	ClientAttributes,
	methods,
} from "#request";

import { setIncidentListActionIP, setEventListAction } from "#actionCreators";
import {
	incidentListSelectorIP,
	filtersSelector,
	hazardTypesSelector,
	regionsSelector,
	languageSelector,
} from "#selectors";
import { hazardTypesList } from "#utils/domain";
import {
	transformDataRangeToFilter,
	transformRegionToFilter,
	transformDataRangeLocaleToFilter,
} from "#utils/transformations";

import Page from "#components/Page";
import Loading from "#components/Loading";
import HazardsLegend from "#components/HazardsLegend";

import { BSToAD } from "bikram-sambat-js";
import Map from "./Map";
import LeftPane from "./LeftPane";

import { getSanitizedIncidents } from "../LossAndDamage/common";

import styles from "./styles.module.scss";

const emptyHoverAttributeList: {
	id: number;
	value: boolean;
}[] = [];

interface State {
	hoveredIncidentId: number | undefined;
}

interface Params {}

interface ComponentProps {}

interface PropsFromDispatch {
	setIncidentList: typeof setIncidentListActionIP;
	setEventList: typeof setEventListAction;
}
interface PropsFromAppState {
	incidentList: PageType.Incident[];
	filters: FiltersElement;
	hazardTypes: Obj<PageType.HazardType>;
	regions: {
		provinces: object;
		districts: object;
		municipalities: object;
		wards: object;
	};
}

type ReduxProps = ComponentProps & PropsFromDispatch & PropsFromAppState;

type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromAppState => ({
	incidentList: incidentListSelectorIP(state),
	hazardTypes: hazardTypesSelector(state),
	regions: regionsSelector(state),
	filters: filtersSelector(state),
	language: languageSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
	setIncidentList: (params) => dispatch(setIncidentListActionIP(params)),
	setEventList: (params) => dispatch(setEventListAction(params)),
});

const transformFilters = ({ dataDateRange, region, ...otherFilters }: FiltersElement) => ({
	...otherFilters,
	// ...transformDataRangeToFilter(dataDateRange, 'incident_on'),
	...transformDataRangeLocaleToFilter(dataDateRange, "incident_on"),
	...transformRegionToFilter(region),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	incidentsGetRequest: {
		url: "/incident/",
		method: methods.GET,
		// We have to transform dateRange to incident_on__lt and incident_on__gt
		query: ({ props, params: { filters } }) => ({
			...transformFilters(filters),
			expand: ["loss", "event", "wards"],
			ordering: "-incident_on",
			limit: -1,
			data_source: "drr_api",
		}),
		onSuccess: ({ response, props: { setIncidentList } }) => {
			interface Response {
				results: PageType.Incident[];
			}
			const { results: incidentList = [] } = response as Response;

			setIncidentList({ incidentList });
		},
		onMount: true,
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
	eventsRequest: {
		url: "/event/",
		method: methods.GET,
		query: ({ props: { filters } }) => ({
			...transformFilters(filters),
		}),
		onSuccess: ({ response, props: { setEventList } }) => {
			interface Response {
				results: PageType.Event[];
			}
			const { results: eventList = [] } = response as Response;
			setEventList({ eventList });
		},
		onMount: true,
		extras: { schemaName: "eventResponse" },
	},
};

const RECENT_DAY = 1;

interface LegendItem {
	label: string;
	labelNe: string;
	style: string;
	color: string;
	radius?: number;
}

const incidentPointSizeData: LegendItem[] = [
	{ label: "Minor (0)", labelNe: "न्यून (0)", style: styles.symbol, color: "#a3a3a3", radius: 8 },
	{
		label: "Major (<10)",
		labelNe: "प्रमुख (<10)",
		style: styles.symbol,
		color: "#a3a3a3",
		radius: 11,
	},
	{
		label: "Severe (<100)",
		labelNe: "गम्भीर (<100)",
		style: styles.symbol,
		color: "#a3a3a3",
		radius: 15,
	},
	{
		label: "Catastrophic (>100)",
		labelNe: "विनाशकारी (>100)",
		style: styles.symbol,
		color: "#a3a3a3",
		radius: 20,
	},
];

const labelSelector = (d: LegendItem, language: string) => {
	if (language === "en") {
		return d.label;
	}
	return d.labelNe;
};
const keySelector = (d: LegendItem) => d.label;
const classNameSelector = (d: LegendItem) => d.style;
const colorSelector = (d: LegendItem) => d.color;
const radiusSelector = (d: LegendItem) => d.radius;

class Incidents extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			hoveredIncidentId: undefined,
			changedStartDate: false,
			changedEndDate: false,
		};
	}

	// public componentDidMount(): void {
	//     const { setIncidentList } = this.props;
	//     setIncidentList({});
	// }

	componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
		// const {
		//     requests: {
		//         incidentsGetRequest,

		//     },
		//     filters,
		// } = this.props;
		// if (prevProps.filters !== filters) {
		//     console.log('This is final filter', filters);
		//     // incidentsGetRequest.do({
		//     //     startDate,
		//     // });
		// }

		const {
			filters,
			language: { language },
			requests: { incidentsGetRequest },
		} = this.props;
		const {
			dataDateRange,
			dataDateRange: { rangeInDays },
		} = filters;
		const { startDate: langStartDate, endDate: langEndDate } = filters.dataDateRange;
		const { changedEndDate, changedStartDate } = this.state;

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
		if (prevProps.filters !== filters) {
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
				},
			};
			if (rangeInDays === "custom") {
				incidentsGetRequest.do({
					filters: modifiedFilter,
				});
			} else {
				incidentsGetRequest.do({
					filters,
				});
			}
		}
	}

	private getSanitizedIncidents = memoize(getSanitizedIncidents);

	private getIncidentHazardTypesList = memoize((incidentList) => {
		const { hazardTypes } = this.props;
		return hazardTypesList(incidentList, hazardTypes);
	});

	private getIncidentMap = memoize((incidentList) =>
		listToMap(
			incidentList,
			(d: PageType.Incident) => d.id,
			(d) => d
		)
	);

	private handleIncidentHover = (hoveredIncidentId: number) => {
		this.setState({ hoveredIncidentId });
	};

	private getMapHoverAttributes = (hoveredIncidentId: number | undefined) => {
		if (!hoveredIncidentId) {
			return emptyHoverAttributeList;
		}

		return [
			{
				id: hoveredIncidentId,
				value: true,
			},
		];
	};

	public render() {
		const {
			incidentList,
			requests: {
				incidentsGetRequest,
				incidentsGetRequest: { pending: pendingIncidents },
				eventsRequest: { pending: pendingEvents },
			},
			regions,
			hazardTypes,
			filters,
			language: { language },
		} = this.props;

		const { hoveredIncidentId } = this.state;

		const sanitizedIncidentList = this.getSanitizedIncidents(incidentList, regions, hazardTypes);
		incidentsGetRequest.setDefaultParams({
			filters,
		});

		const mapHoverAttributes = this.getMapHoverAttributes(hoveredIncidentId);

		const filteredHazardTypes = this.getIncidentHazardTypesList(sanitizedIncidentList);

		const pending = pendingEvents || pendingIncidents;

		return (
			<div>
				<Loading pending={pending} />
				<Map
					incidentList={sanitizedIncidentList}
					recentDay={RECENT_DAY}
					onIncidentHover={this.handleIncidentHover}
					mapHoverAttributes={mapHoverAttributes}
					isHovered={!!hoveredIncidentId}
					pending={pending}
				/>
				<Page
					leftContentContainerClassName={styles.leftPaneContainer}
					leftContent={
						<LeftPane
							className={styles.leftPane}
							incidentList={sanitizedIncidentList}
							recentDay={RECENT_DAY}
							onIncidentHover={this.handleIncidentHover}
							hoveredIncidentId={hoveredIncidentId}
							dateRange={filters.dataDateRange}
							pending={pending}
						/>
					}
					mainContentContainerClassName={_cs(styles.legendContainer, "map-legend-container")}
					mainContent={
						<div>
							<div className={styles.pointSizeLegendContainer}>
								<header className={styles.header}>
									<h4 className={styles.heading}>
										<Translation>{(t) => <span>{t("People death count")}</span>}</Translation>
									</h4>
								</header>
								<Legend
									className={styles.pointSizeLegend}
									colorSelector={colorSelector}
									radiusSelector={radiusSelector}
									data={incidentPointSizeData}
									emptyComponent={null}
									itemClassName={styles.legendItem}
									keySelector={keySelector}
									labelSelector={(e) => labelSelector(e, language)}
									symbolClassNameSelector={classNameSelector}
								/>
							</div>
							{filteredHazardTypes.length > 0 && (
								<div className={styles.hazardLegend}>
									<div className={styles.legendTitle}>
										<Translation>{(t) => <span>{t("Hazards Legend")}</span>}</Translation>
									</div>
									<HazardsLegend
										filteredHazardTypes={filteredHazardTypes}
										className={styles.legend}
										itemClassName={styles.legendItem}
									/>
								</div>
							)}
						</div>
					}
				/>
			</div>
		);
	}
}

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	createConnectedRequestCoordinator<ReduxProps>(),
	createRequestClient(requests)
)(Incidents);
function setIncidentList(arg0: { [x: number]: any }) {
	throw new Error("Function not implemented.");
}
