import React, { useState } from "react";
import { FaramInputElement } from "@togglecorp/faram";
import SelectInput from "#rsci/SelectInput";

import { RiverStation } from "#types";
import styles from "./styles.module.scss";

interface Props {
	onChange: Function;
	value: string[];
	stations: RiverStation[];
}

const stationKeySelector = (r: RiverStation) => r.id;
const StationLabelSelector = (r: RiverStation) => r.title;

const compare = (a: RiverStation, b: RiverStation) => {
	const sortKey = "title";
	if (a[sortKey] < b[sortKey]) {
		return -1;
	}
	if (a[sortKey] > b[sortKey]) {
		return 1;
	}
	return 0;
};

const StationSelector = (props: Props) => {
	const { onChange: onChangeFromProps, stations: stationsFromProps, value } = props;
	const [selectedStation, setSelectedStation] = useState(
		value && Object.keys(value).length > 0 && value.id
	);
	const handleStationChange = (stationId: number) => {
		setSelectedStation(stationId);
		const station = stationsFromProps && stationsFromProps.filter((s) => s.id === stationId)[0];
		onChangeFromProps(station || {});
	};
	const sortedStations = stationsFromProps && stationsFromProps.sort(compare);
	if (!sortedStations || sortedStations.length < 1) {
		return (
			<div className={styles.stationSelector}>
				<span className={styles.stationInput}>No station filters</span>
			</div>
		);
	}
	return (
		<div className={styles.stationSelector}>
			<SelectInput
				className={styles.stationInput}
				label="Station Name"
				options={sortedStations}
				keySelector={stationKeySelector}
				labelSelector={StationLabelSelector}
				value={selectedStation}
				onChange={handleStationChange}
				placeholder="All Stations"
				autoFocus
			/>
		</div>
	);
};

export default FaramInputElement(StationSelector);
