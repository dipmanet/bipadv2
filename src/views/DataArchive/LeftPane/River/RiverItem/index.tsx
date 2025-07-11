import React from "react";
import * as PageType from "#store/atom/page/types";

import { getMonthName, getSpecificDate } from "#views/DataArchive/utils";
import DateBlock from "../DateBlock";
import RiverPill from "../RiverPill";

import styles from "./styles.module.scss";

interface Props {
	data: PageType.DataArchiveRiver;
}
const RiverItem = (props: Props) => {
	const { data } = props;
	const { title: stationName, waterLevelOn, waterLevel, status } = data;
	const day = getSpecificDate(`${waterLevelOn}`, "day");
	const year = getSpecificDate(`${waterLevelOn}`, "year");
	const monthName = getMonthName(`${waterLevelOn}`);
	return (
		<div className={styles.riverItem}>
			<DateBlock day={day} monthName={monthName} year={year} />
			<div className={styles.details}>
				<div className={styles.name}>{stationName || "N/A"}</div>
				<div className={styles.status}>{`Status: ${status}`}</div>
			</div>
			<div className={styles.right}>
				<RiverPill waterLevel={waterLevel} status={status} />
			</div>
		</div>
	);
};

export default RiverItem;
