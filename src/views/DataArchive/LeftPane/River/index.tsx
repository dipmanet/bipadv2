import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";
import { compose, Dispatch } from "redux";
import * as PageType from "#store/atom/page/types";

import DataArchiveContext, { DataArchiveContextProps } from "#components/DataArchiveContext";

import { groupList } from "#utils/common";
import { getDatesFromFilters } from "#views/DataArchive/utils";

import Message from "#rscv/Message";

import {
	createConnectedRequestCoordinator,
	createRequestClient,
	NewProps,
	ClientAttributes,
	methods,
} from "#request";

import { transformDataRangeLocaleToFilter } from "#utils/transformations";

import { isAnyRequestPending } from "#utils/request";
import { setDataArchiveRiverListAction, setDataArchiveRiverStationAction } from "#actionCreators";

import { DARiverFiltersElement, RiverStation } from "#types";

import {
	dataArchiveRiverListSelector,
	riverFiltersSelector,
	riverStationsSelector,
} from "#selectors";

import { TitleContext, DataArchive } from "#components/TitleContext";

import { AppState } from "#store/types";

import Loading from "#components/Loading";
import RiverItem from "./RiverItem";
import RiverGroup from "./RiverGroup";
import Note from "./Note";
import Header from "./Header";
import TopBar from "./TopBar";

import styles from "./styles.module.scss";

interface PropsFromDispatch {
	setDataArchiveRiverList: typeof setDataArchiveRiverListAction;
	setDataArchiveRiverStations: typeof setDataArchiveRiverStationAction;
}

interface PropsFromState {
	riverList: PageType.DataArchiveRiver[];
	riverFilters: DARiverFiltersElement;
	riverStations: RiverStation[];
}

const mapStateToProps = (state: AppState): PropsFromState => ({
	riverList: dataArchiveRiverListSelector(state),
	riverFilters: riverFiltersSelector(state),
	riverStations: riverStationsSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
	setDataArchiveRiverList: (params) => dispatch(setDataArchiveRiverListAction(params)),
	setDataArchiveRiverStations: (params) => dispatch(setDataArchiveRiverStationAction(params)),
});

interface Params {}
interface OwnProps {}

interface State {}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	dataArchiveRiverRequest: {
		url: "/river-trimed/",
		method: methods.GET,
		query: ({ props: { riverFilters } }) => ({
			...transformDataRangeLocaleToFilter(riverFilters.dataDateRange, "water_level_on"),
			station: riverFilters.station.id,
			// historical: true,
			fields: [
				"id",
				"created_on",
				"title",
				"basin",
				"point",
				"water_level",
				"danger_level",
				"warning_level",
				"water_level_on",
				"status",
				"steady",
				"description",
				"station",
				"district",
				"station_series_id",
			],
			trimBy: "avg",
			trimType: "daily",
			expand: ["district"],
			limit: -1,
		}),
		onSuccess: ({ params, response, props: { setDataArchiveRiverList } }) => {
			interface Response {
				results: PageType.DataArchiveRiver[];
			}
			const { results: dataArchiveRiverList = [] } = response as Response;
			if (params.basinFilter !== undefined) {
				setDataArchiveRiverList({
					dataArchiveRiverList: dataArchiveRiverList.filter(
						(item) => item.basin === params.basinFilter
					),
				});
			} else {
				setDataArchiveRiverList({ dataArchiveRiverList });
			}
		},
		onPropsChanged: {
			riverFilters: true,
		},
		onMount: true,
		extras: {
			schemaName: "riverResponse",
		},
	},
	riverStationRequest: {
		url: "/river-stations/",
		method: methods.GET,
		// query: () => ({
		//     fields: ['id', 'province', 'district', 'municipality', 'ward', 'title', 'point'],
		// }),
		onSuccess: ({ params, response, props: { setDataArchiveRiverStations } }) => {
			interface Response {
				results: RiverStation[];
			}
			const { results: dataArchiveRiverStations = [] } = response as Response;

			if (params.stationFilter !== undefined) {
				setDataArchiveRiverStations({
					dataArchiveRiverStations: dataArchiveRiverStations.filter(
						(item) => item.id === params.stationFilter
					),
				});
			} else if (params.basinFilter !== undefined) {
				setDataArchiveRiverStations({
					dataArchiveRiverStations: dataArchiveRiverStations.filter(
						(item) => item.basin === params.basinFilter
					),
				});
			} else {
				setDataArchiveRiverStations({ dataArchiveRiverStations });
			}

			// setDataArchiveRiverStations({ dataArchiveRiverStations });
		},
		onPropsChanged: {
			riverFilters: true,
		},
		onMount: true,
	},
};

const River = (props: Props) => {
	const [sortKey, setSortKey] = useState("key");
	const { riverList, requests, riverFilters } = props;
	const pending = isAnyRequestPending(requests);

	const { setDataArchive } = useContext(TitleContext);

	const { setData }: DataArchiveContextProps = useContext(DataArchiveContext);

	requests.dataArchiveRiverRequest.setDefaultParams({
		basinFilter: riverFilters.basin ? riverFilters.basin.title : "",
	});

	requests.riverStationRequest.setDefaultParams({
		basinFilter: riverFilters.basin ? riverFilters.basin.title : "",
		stationFilter: riverFilters.station ? riverFilters.station.id : "",
	});

	useEffect(() => {
		if (setData) {
			setData(riverList);
		}
	}, [riverList, setData]);

	const {
		station: { title: location },
	} = riverFilters;
	const [startDate, endDate] = getDatesFromFilters(riverFilters);

	if (setDataArchive) {
		setDataArchive((prevState: DataArchive) => {
			if (
				prevState.mainModule !== "River" ||
				prevState.location !== location ||
				prevState.startDate !== startDate ||
				prevState.endDate !== endDate
			) {
				return { ...prevState, mainModule: "River", location, startDate, endDate };
			}
			return prevState;
		});
	}

	if (!pending && riverList.length < 1) {
		return (
			<div className={styles.message}>
				<Loading pending={isAnyRequestPending(requests)} />
				<Message>No data available for the applied filter.</Message>
			</div>
		);
	}

	const compare = (a: any, b: any) => {
		if (a[sortKey] < b[sortKey]) {
			return -1;
		}
		if (a[sortKey] > b[sortKey]) {
			return 1;
		}
		return 0;
	};

	const groupedRiverList = groupList(
		riverList.filter((e) => e.title),
		(river) => river.title || "N/A"
	).sort(compare);

	return (
		<div className={styles.river}>
			<Loading pending={pending} />
			<TopBar riverList={riverList} startDate={startDate} endDate={endDate} />
			<div className={styles.header}>
				<Header dataCount={riverList.length || 0} />
				<div className={styles.note}>{!pending && <Note />}</div>
				<div className={styles.basin}>
					{riverFilters.basin.title ? `Selected basin: ${riverFilters.basin.title}` : ""}
				</div>
			</div>
			{groupedRiverList.map((group) => {
				const { key, value } = group;
				if (value.length > 1) {
					return <RiverGroup title={key} data={value} key={key} />;
				}
				return <RiverItem key={key} data={value[0]} />;
			})}
		</div>
	);
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	createConnectedRequestCoordinator<ReduxProps>(),
	createRequestClient(requestOptions)
)(River);
