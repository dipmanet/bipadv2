import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";
import { compose, Dispatch } from "redux";
import * as PageType from "#store/atom/page/types";

import DataArchiveContext, { DataArchiveContextProps } from "#components/DataArchiveContext";
import Message from "#rscv/Message";
import { groupList } from "#utils/common";

import {
	createConnectedRequestCoordinator,
	createRequestClient,
	NewProps,
	ClientAttributes,
	methods,
} from "#request";

import { isAnyRequestPending } from "#utils/request";

import { transformDataRangeLocaleToFilter, pastDaysToDateRange } from "#utils/transformations";

import {
	setDataArchivePollutionListAction,
	setDataArchivePollutionStationAction,
} from "#actionCreators";

import { DAPollutionFiltersElement, PollutionStation } from "#types";

import { AppState } from "#store/types";

import Loading from "#components/Loading";

import {
	dataArchivePollutionListSelector,
	pollutionFiltersSelector,
	pollutionStationsSelector,
} from "#selectors";
import { TitleContext, DataArchive } from "#components/TitleContext";
import PollutionViz from "./Visualization";
import Note from "./Note";
import TopBar from "./TopBar";
import PollutionGroup from "./PollutionGroup";
import Header from "../Header";
import PollutionItem from "./PollutionItem";

import styles from "./styles.module.scss";

interface PropsFromDispatch {
	setDataArchivePollutionList: typeof setDataArchivePollutionListAction;
	setDataArchivePollutionStations: typeof setDataArchivePollutionStationAction;
}

interface PropsFromState {
	pollutionList: PageType.DataArchivePollution[];
	pollutionFilters: DAPollutionFiltersElement;
	pollutionStations: PollutionStation[];
}

const mapStateToProps = (state: AppState): PropsFromState => ({
	pollutionList: dataArchivePollutionListSelector(state),
	pollutionFilters: pollutionFiltersSelector(state),
	pollutionStations: pollutionStationsSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
	setDataArchivePollutionList: (params) => dispatch(setDataArchivePollutionListAction(params)),
	setDataArchivePollutionStations: (params) =>
		dispatch(setDataArchivePollutionStationAction(params)),
});
interface Params {}
interface OwnProps {}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

interface State {}

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	realTimePollutionRequest: {
		url: "/pollution-trimed/",
		method: methods.GET,
		query: ({ props: { pollutionFilters } }) => ({
			...transformDataRangeLocaleToFilter(pollutionFilters.dataDateRange, "date_time"),
			station: pollutionFilters.station.id,
			// historical: true,
			fields: [
				"id",
				"created_on",
				"date_time",
				"title",
				"aqi_color",
				"aqi",
				"observation",
				"point",
				"station",
				"description",
			],
			trimBy: "avg",
			trimType: "daily",
			limit: -1,
		}),
		onSuccess: ({ response, props: { setDataArchivePollutionList } }) => {
			interface Response {
				results: PageType.DataArchivePollution[];
			}
			const { results: dataArchivePollutionList = [] } = response as Response;
			setDataArchivePollutionList({ dataArchivePollutionList });
		},
		onPropsChanged: {
			pollutionFilters: true,
		},
		onMount: true,
		extras: {
			schemaName: "pollutionResponse",
		},
	},
	pollutionStationRequest: {
		url: "/pollution-stations/",
		method: methods.GET,
		query: () => ({
			fields: ["id", "province", "district", "municipality", "ward", "name", "point"],
		}),
		onSuccess: ({ response, props: { setDataArchivePollutionStations } }) => {
			interface Response {
				results: PollutionStation[];
			}
			const { results: dataArchivePollutionStations = [] } = response as Response;
			setDataArchivePollutionStations({ dataArchivePollutionStations });
		},
		onMount: true,
	},
};

const filterByStationName = (
	pollutionFilters: DAPollutionFiltersElement,
	pollutionList: PageType.DataArchivePollution[]
) => {
	const {
		station: { name: stationName },
	} = pollutionFilters;
	if (!stationName) {
		return pollutionList;
	}
	const filteredList = pollutionList.filter((pollutionItem) => pollutionItem.title === stationName);
	return filteredList;
};

const getYYYYMMDD = (date: Date) => {
	const d = new Date(date);
	return new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000).toISOString().split("T")[0];
};

const getDates = (eqFilters: DAPollutionFiltersElement) => {
	const { dataDateRange } = eqFilters;
	const { rangeInDays } = dataDateRange;
	let startDate;
	let endDate;
	if (rangeInDays !== "custom") {
		const { startDate: sDate, endDate: eDate } = pastDaysToDateRange(rangeInDays);
		startDate = getYYYYMMDD(sDate);
		endDate = getYYYYMMDD(eDate);
	} else {
		({ startDate, endDate } = dataDateRange);
	}
	return [startDate, endDate];
};

const Pollution = (props: Props) => {
	const [sortKey, setSortKey] = useState("key");
	const [activeView, setActiveView] = useState("data");
	const { pollutionList, requests, pollutionFilters } = props;
	const pending = isAnyRequestPending(requests);
	const { setDataArchive } = useContext(TitleContext);

	const { setData }: DataArchiveContextProps = useContext(DataArchiveContext);

	const filteredPollutionList = filterByStationName(pollutionFilters, pollutionList);
	const handleDataButtonClick = () => {
		setActiveView("data");
	};
	const handleVisualizationsButtonClick = () => {
		setActiveView("visualizations");
	};

	useEffect(() => {
		if (setData) {
			const filtered = filterByStationName(pollutionFilters, pollutionList);
			setData(filtered);
		}
	}, [pollutionFilters, pollutionList, setData]);
	const {
		station: { name: location },
	} = pollutionFilters;
	const [startDate, endDate] = getDates(pollutionFilters);

	if (setDataArchive) {
		setDataArchive((prevState: DataArchive) => {
			if (
				prevState.mainModule !== "Pollution" ||
				prevState.location !== location ||
				prevState.startDate !== startDate ||
				prevState.endDate !== endDate
			) {
				return { ...prevState, mainModule: "Pollution", location, startDate, endDate };
			}
			return prevState;
		});
	}

	if (!pending && filteredPollutionList.length < 1) {
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

	const groupedPollutionList = groupList(
		filteredPollutionList.filter((e) => e.title),
		(pollution) => pollution.title || "N/A"
	).sort(compare);
	return (
		<div className={styles.pollution}>
			<Loading pending={pending} />
			<TopBar pollutionFilters={pollutionFilters} pollutionList={filteredPollutionList} />
			<div className={styles.header}>
				<Header
					chosenOption="Pollution"
					dataCount={filteredPollutionList.length || 0}
					activeView={activeView}
					handleDataButtonClick={handleDataButtonClick}
					handleVisualizationsButtonClick={handleVisualizationsButtonClick}
				/>
				<div className={styles.note}>{!pending && <Note />}</div>
			</div>
			{/* {
                activeView === 'data' && filteredPollutionList.map(
                    (datum: PageType.DataArchivePollution) => (
                    <PollutionItem
                        data={datum}
                        key={datum.id}
                    />
                ))
            } */}
			{activeView === "data" &&
				groupedPollutionList.map((group) => {
					const { key, value } = group;
					if (value.length > 1) {
						return <PollutionGroup title={key} data={value} key={key} />;
					}
					return <PollutionItem key={key} data={value[0]} />;
				})}
			{activeView === "visualizations" && <PollutionViz pollutionList={filteredPollutionList} />}
		</div>
	);
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	createConnectedRequestCoordinator<ReduxProps>(),
	createRequestClient(requestOptions)
)(Pollution);
