import React from "react";
import { compareString, compareNumber } from "@togglecorp/fujs";

import Modal from "#rscv/Modal";
import ModalHeader from "#rscv/Modal/Header";
import ModalBody from "#rscv/Modal/Body";
import ModalFooter from "#rscv/Modal/Footer";
import Table from "#rscv/Table";
import DownloadButton from "#components/DownloadButton";
import DangerButton from "#rsca/Button/DangerButton";

import { Header } from "#store/atom/table/types";
import { WaterLevelAverage, DataArchiveRain } from "#store/atom/page/types";

import { convertNormalTableToCsv } from "#utils/table";

import styles from "./styles.module.scss";

interface Props {
	dataArchiveRain: DataArchiveRain[];
	closeModal?: () => void;
}

const rainWatchKeySelector = (rain: DataArchiveRain) => rain.id;

const compareIntervalValues = (
	a: WaterLevelAverage[] = [],
	b: WaterLevelAverage[] = [],
	interval: number
) => {
	const aAverage = a.find((av) => av.interval === interval);
	const aValue = aAverage && aAverage.value ? aAverage.value : 0;

	const bAverage = b.find((av) => av.interval === interval);
	const bValue = bAverage && bAverage.value ? bAverage.value : 0;

	return compareNumber(aValue, bValue);
};

const defaultSort = {
	key: "status",
	order: "asc",
};

class RainModal extends React.PureComponent<Props> {
	public constructor(props: Props) {
		super(props);

		this.rainWatchHeader = [
			{
				key: "basin",
				label: "BASIN",
				order: 1,
				sortable: true,
				comparator: (a, b) => compareString(a.basin, b.basin),
			},
			{
				key: "title",
				label: "TITLE",
				order: 2,
				sortable: true,
				comparator: (a, b) => compareString(a.title, b.title),
			},
			{
				key: "description",
				label: "DESCRIPTION",
				order: 3,
			},
			{
				key: "measuredOn",
				label: "MEASURED ON",
				order: 3,
				sortable: true,
				comparator: (a, b) => compareString(a.measuredOn, b.measuredOn),
				modifier: (row: DataArchiveRain) => {
					const { measuredOn } = row;

					return measuredOn ? measuredOn.split("T")[0] : null;
				},
			},
			{
				key: "lastHour",
				label: "ACCUMULATED RAINFALL WITHIN LAST 1 HOURS (mm)",
				order: 4,
				modifier: (row) => {
					const { averages = [] } = row;
					const average = averages.find((av) => av.interval === 1);
					return average && average.value ? Number(average.value).toFixed(3) : undefined;
				},
				sortable: true,
				comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 1),
			},
			{
				key: "lastThreeHours",
				label: "ACCUMULATED RAINFALL WITHIN LAST 3 HOURS (mm)",
				order: 5,
				modifier: (row) => {
					const { averages = [] } = row;
					const average = averages.find((av) => av.interval === 3);
					return average && average.value ? Number(average.value).toFixed(3) : undefined;
				},
				sortable: true,
				comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 3),
			},
			{
				key: "lastSixHours",
				label: "ACCUMULATED RAINFALL WITHIN LAST 6 HOURS (mm)",
				order: 6,
				modifier: (row) => {
					const { averages = [] } = row;
					const average = averages.find((av) => av.interval === 6);
					return average && average.value ? Number(average.value).toFixed(3) : undefined;
				},
				sortable: true,
				comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 6),
			},
			{
				key: "lastTwelveHours",
				label: "ACCUMULATED RAINFALL WITHIN LAST 6 HOURS (mm)",
				order: 7,
				modifier: (row) => {
					const { averages = [] } = row;
					const average = averages.find((av) => av.interval === 12);
					return average && average.value ? Number(average.value).toFixed(3) : undefined;
				},
				sortable: true,
				comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 12),
			},
			{
				key: "lastTwentyFourHours",
				label: "ACCUMULATED RAINFALL WITHIN LAST 24 HOURS (mm)",
				order: 8,
				modifier: (row) => {
					const { averages = [] } = row;
					const average = averages.find((av) => av.interval === 24);
					return average && average.value ? Number(average.value).toFixed(3) : undefined;
				},
				sortable: true,
				comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 24),
			},
			{
				key: "status",
				label: "STATUS",
				order: 9,
				sortable: true,
				comparator: (a, b) => compareString(a.status, b.status),
			},
		];
	}

	private getClassName = (row: DataArchiveRain) => {
		const { status } = row;
		if (status === "BELOW WARNING LEVEL") {
			return styles.below;
		}
		if (status === "ABOVE WARNING LEVEL") {
			return styles.above;
		}
		if (status === "ABOVE DANGER LEVEL") {
			return styles.danger;
		}
		return styles.below;
	};

	private rainWatchHeader: Header<DataArchiveRain>[];

	public render() {
		const { dataArchiveRain, closeModal } = this.props;

		const formattedTableData = convertNormalTableToCsv(dataArchiveRain, this.rainWatchHeader);
		return (
			<Modal
				// closeOnEscape
				// onClose={closeModal}
				className={styles.rainWatchModal}>
				<ModalHeader
					title="Data Archive Rain"
					rightComponent={
						<DangerButton transparent iconName="close" onClick={closeModal} title="Close Modal" />
					}
				/>
				<div className={styles.warning}>
					Note : Warning level for rainfall (mm): 60 mm in 1 hr, 80 mm in 3 hr, 100 mm in 6 hr, 120
					mm in 12 hr, 140 mm in 24 hr. This indicates potential threat for landslides in steep
					slope and high flow in local areas.
				</div>
				<hr />
				<ModalBody className={styles.body}>
					<Table
						rowClassNameSelector={this.getClassName}
						className={styles.rainWatchTable}
						data={dataArchiveRain}
						headers={this.rainWatchHeader}
						keySelector={rainWatchKeySelector}
						defaultSort={defaultSort}
					/>
				</ModalBody>
				<ModalFooter>
					<DangerButton onClick={closeModal}>Close</DangerButton>
					<DownloadButton value={formattedTableData} name="DataArchiveRain.csv">
						Download
					</DownloadButton>
				</ModalFooter>
			</Modal>
		);
	}
}

export default RainModal;
