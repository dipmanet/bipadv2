import React from "react";
import * as PageType from "#store/atom/page/types";

import Icon from "#rscg/Icon";

import { getDate, getIndividualAverages } from "#views/DataArchive/utils";
import AverageBlock from "../AverageBlock";
import styles from "./styles.module.scss";

interface Props {
	data: PageType.DataArchiveRain;
}

const RainItem = (props: Props) => {
	const { data } = props;
	const { title: stationName, measuredOn, averages } = data;
	const { oneHour, threeHour, sixHour, twelveHour, twentyFourHour } =
		getIndividualAverages(averages);
	return (
		<div className={styles.rainItem}>
			<div className={styles.left}>
				<div className={styles.name}>{stationName || "N/A"}</div>
				<div className={styles.date}>
					<Icon className={styles.icon} name="calendar" />
					<div className={styles.dateValue}>{measuredOn && getDate(measuredOn.toString())}</div>
				</div>
			</div>
			<div className={styles.right}>
				<AverageBlock average={oneHour} />
				<AverageBlock average={threeHour} />
				<AverageBlock average={sixHour} />
				<AverageBlock average={twelveHour} />
				<AverageBlock average={twentyFourHour} />
			</div>
		</div>
	);
};

export default RainItem;
