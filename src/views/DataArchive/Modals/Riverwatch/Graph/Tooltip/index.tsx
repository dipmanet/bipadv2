import React from "react";

import { getDate, getTimeWithIndictor, getDateWithRange } from "#views/DataArchive/utils";
import styles from "./styles.module.scss";

interface Payload {
	key: string;
	label: string;
	waterLevel: number;
	waterLevelAvg: number;
	waterLevelMin: number;
	waterLevelMax: number;
	waterLevelOn: string;
}
interface TooltipPayload {
	dataKey: string;
	name: string;
	value: number | string;
	payload: Payload;
}

interface TooltipProps {
	active?: boolean;
	payload?: TooltipPayload[];
	label?: string;
	periodCode?: string;
}

const emptyObject = {};
const Tooltip = (props: TooltipProps) => {
	const { active, label, payload, periodCode } = props;
	if (active && label && payload) {
		const { payload: innerPayload } = payload[0] || emptyObject;
		const { waterLevelOn, waterLevelAvg, waterLevelMin, waterLevelMax } = innerPayload;
		const minuteWise = periodCode === "minute";
		const date = getDate(waterLevelOn);
		const time = getTimeWithIndictor(waterLevelOn);
		const dateTimeForMinuteWise = `${date} ${time}`;
		const dateTImeForHourly = getDateWithRange(waterLevelOn);
		if (minuteWise) {
			return (
				<div className={styles.tooltip}>
					<div className={styles.value}>
						<b>Date: </b>
						{dateTimeForMinuteWise}
					</div>
					<div className={styles.value}>
						<b>Water Level: </b>
						{`${waterLevelAvg} m`}
					</div>
				</div>
			);
		}
		return (
			<div className={styles.tooltip}>
				<div className={styles.value}>
					<b>Date: </b>
					{periodCode === "hourly" ? dateTImeForHourly : date}
				</div>
				<div className={styles.value}>
					<b>Min Water Level: </b>
					{`${waterLevelMin} m`}
				</div>
				<div className={styles.value}>
					<b>Average Water Level: </b>
					{`${waterLevelAvg} m`}
				</div>
				<div className={styles.value}>
					<b>Max Water Level: </b>
					{`${waterLevelMax} m`}
				</div>
			</div>
		);
	}
	return null;
};

export default Tooltip;
