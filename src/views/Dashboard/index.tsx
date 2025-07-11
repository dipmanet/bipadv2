import React, { useEffect, useState, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import memoize from "memoize-one";
import { _cs, Obj } from "@togglecorp/fujs";
import { Translation } from "react-i18next";
import HazardsLegend from "#components/HazardsLegend";
import Loading from "#components/Loading";
import Page from "#components/Page";
import Map from "./Map";
import LeftPane from "./LeftPane";
import styles from "./styles.module.scss";

import { AppState } from "#store/types";
import * as PageTypes from "#store/atom/page/types";
import {
	setAlertListActionDP,
	setEventListAction,
	setDashboardHazardTypesAction,
	setFiltersAction,
	setHazardTypesAction,
} from "#actionCreators";
import {
	alertListSelectorDP,
	eventListSelector,
	hazardTypesSelector,
	dashboardFiltersSelector,
} from "#selectors";
import { pastDaysToDateRange, transformRegionToFilter } from "#utils/transformations";
import { hazardTypesList } from "#utils/domain";
import {
	MapStateElement,
	AlertElement,
	EventElement,
	FiltersElement,
	DataDateRangeValueElement,
} from "#types";
import {
	createConnectedRequestCoordinator,
	createRequestClient,
	ClientAttributes,
	methods,
	NewProps,
} from "#request";

const emptyAlertHoverAttributeList: MapStateElement[] = [];
const emptyEventHoverAttributeList: MapStateElement[] = [];
const RECENT_DAY = 1;

interface DateFilterParamName {
	start: string;
	end: string;
}

const transformDataRangeToLocaleFilter = (
	dataRange: DataDateRangeValueElement,
	{ start, end }: DateFilterParamName
) => {
	const formatDate = (date: Date) => {
		const [day, month, year] = date.toLocaleDateString("en-GB").split("/");
		return `${year}-${month}-${day}`;
	};

	const getNonCustomFilter = (startDate?: string, endDate?: string) => ({
		[start]: startDate ? `${startDate}T00:00:00+05:45` : undefined,
		[end]: endDate ? `${endDate}T23:59:59+05:45` : undefined,
	});

	if (dataRange.rangeInDays !== "custom") {
		const { startDate, endDate } = pastDaysToDateRange(dataRange.rangeInDays);
		return getNonCustomFilter(formatDate(startDate), formatDate(endDate));
	}

	const startDate = dataRange.startDate ? new Date(dataRange.startDate) : undefined;
	const endDate = dataRange.endDate ? new Date(dataRange.endDate) : undefined;

	return {
		[start]: startDate ? `${startDate.toISOString().split("T")[0]}T00:00:00+05:45` : undefined,
		[end]: endDate ? `${endDate.toISOString().split("T")[0]}T23:59:59+05:45` : undefined,
	};
};

const transformFilters = (
	{ dataDateRange, region, ...otherFilters }: FiltersElement,
	dateFilterParamName: DateFilterParamName
) => ({
	...otherFilters,
	...transformDataRangeToLocaleFilter(dataDateRange, dateFilterParamName),
	...transformRegionToFilter(region),
});

const mapStateToProps = (state: AppState) => ({
	alertList: alertListSelectorDP(state),
	eventList: eventListSelector(state),
	hazardTypes: hazardTypesSelector(state),
	filters: dashboardFiltersSelector(state),
});

const mapDispatchToProps = {
	setAlertList: setAlertListActionDP,
	setEventList: setEventListAction,
	setDashboardHazardTypes: setDashboardHazardTypesAction,
	setHazardTypes: setHazardTypesAction,
	setFilters: setFiltersAction,
};

type ReduxProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
type ExtraParams = {
	triggerAlertRequest: (timeout: number) => void;
	triggerEventRequest: (timeout: number) => void;
};
type Props = NewProps<ReduxProps, ExtraParams>;

const requests: Record<string, ClientAttributes<ReduxProps, ExtraParams>> = {
	alertsRequest: {
		url: "/alert/",
		method: methods.GET,
		query: ({ props }) => ({
			...transformFilters(props.filters, {
				start: "started_on__gt",
				end: "started_on__lt",
			}),
			expand: ["event"],
			ordering: "-started_on",
		}),
		onSuccess: ({ response, props, params }) => {
			props.setAlertList({ alertList: response.results || [] });
			params?.triggerAlertRequest(60 * 1000);
		},
		onFailure: ({ params }) => params?.triggerAlertRequest(60 * 1000),
		onFatal: ({ params }) => params?.triggerAlertRequest(60 * 1000),
		onMount: true,
		onPropsChanged: {
			filters: ({ props, prevProps }) => props.filters !== prevProps.filters,
		},
		extras: { schemaName: "alertResponse" },
	},
	eventsRequest: {
		url: "/event/",
		method: methods.GET,
		query: ({ props }) => ({
			...transformFilters(props.filters, {
				start: "started_on__gt",
				end: "started_on__lt",
			}),
			ordering: "-created_on",
		}),
		onSuccess: ({ response, props, params }) => {
			props.setEventList({ eventList: response.results || [] });
			params?.triggerEventRequest(60 * 1000);
		},
		onFailure: ({ params }) => params?.triggerEventRequest(60 * 1000),
		onFatal: ({ params }) => params?.triggerEventRequest(60 * 1000),
		onMount: true,
		onPropsChanged: {
			filters: ({ props, prevProps }) => props.filters !== prevProps.filters,
		},
		extras: { schemaName: "eventResponse" },
	},
};

const Dashboard: React.FC<Props> = (props) => {
	const { alertList, eventList, hazardTypes, filters, requests, setFilters, setHazardTypes } =
		props;

	const [hoveredAlertId, setHoveredAlertId] = useState<number | undefined>(undefined);
	const [hoveredEventId, setHoveredEventId] = useState<number | undefined>(undefined);

	const alertMapHoverAttributes = useMemo(
		() => (hoveredAlertId ? [{ id: hoveredAlertId, value: true }] : emptyAlertHoverAttributeList),
		[hoveredAlertId]
	);

	const eventMapHoverAttributes = useMemo(
		() => (hoveredEventId ? [{ id: hoveredEventId, value: true }] : emptyEventHoverAttributeList),
		[hoveredEventId]
	);

	const filteredHazardTypes = useMemo(() => {
		const items = [...alertList, ...eventList.filter((e) => e.hazard)];
		return hazardTypesList(items, hazardTypes);
	}, [alertList, eventList, hazardTypes]);

	const setDefaultFilterOnCustom = useCallback(() => {
		if (filters.dataDateRange.rangeInDays === "custom") {
			setFilters({
				filters: {
					...filters,
					dataDateRange: {
						rangeInDays: 7,
						startDate: undefined,
						endDate: undefined,
					},
				},
			});
		}
	}, [filters, setFilters]);

	useEffect(() => {
		requests.alertsRequest.setDefaultParams({
			triggerAlertRequest: (d) => setTimeout(() => requests.alertsRequest.do(), d),
			triggerEventRequest: (d) => setTimeout(() => requests.eventsRequest.do(), d),
		});

		setDefaultFilterOnCustom();
	}, [requests, setDefaultFilterOnCustom]);

	const pending = requests.alertsRequest.pending || requests.eventsRequest.pending;

	return (
		<>
			<Loading pending={pending} />
			{/* <Map
                alertList={alertList}
                eventList={eventList}
                recentDay={RECENT_DAY}
                onAlertHover={setHoveredAlertId}
                onEventHover={setHoveredEventId}
                alertHoverAttributes={alertMapHoverAttributes}
                eventHoverAttributes={eventMapHoverAttributes}
                isEventHovered={!!hoveredEventId}
                isAlertHovered={!!hoveredAlertId}
            /> */}
			<Page
				leftContentContainerClassName={styles.leftContainer}
				leftContent={
					<LeftPane
						className={styles.leftPane}
						alertList={alertList}
						eventList={eventList}
						hazardTypes={hazardTypes}
						pending={pending}
						recentDay={RECENT_DAY}
						onAlertChange={requests.alertsRequest.do}
						onEventChange={requests.eventsRequest.do}
						onDeleteAlertButtonClick={(alert) =>
							props.requests.deleteAlertRequest.do({
								alertId: alert.id,
								onSuccess: requests.alertsRequest.do,
							})
						}
						onDeleteEventButtonClick={(event) =>
							props.requests.deleteEventRequest.do({
								eventId: event.id,
								onSuccess: requests.eventsRequest.do,
							})
						}
						hoveredAlertId={hoveredAlertId}
						hoveredEventId={hoveredEventId}
						onAlertHover={setHoveredAlertId}
						onEventHover={setHoveredEventId}
						dateRange={filters.dataDateRange}
					/>
				}
				mainContentContainerClassName={_cs(styles.hazardLegendContainer, "map-legend-container")}
				mainContent={
					<>
						<div className={styles.legendTitle}>
							<Translation>{(t) => <span>{t("Hazards Legend")}</span>}</Translation>
						</div>
						<HazardsLegend
							filteredHazardTypes={filteredHazardTypes}
							className={styles.hazardLegend}
							itemClassName={styles.legendItem}
						/>
					</>
				}
			/>
		</>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createConnectedRequestCoordinator<ReduxProps>()(createRequestClient(requests)(Dashboard)));
