import React, { useState, useEffect } from "react";
import { FaramInputElement } from "@togglecorp/faram";

import SelectInput from "#rsci/SelectInput";
import ErrorMessage from "../ErrorMessage";

import { Intervals, Errors } from "../../types";
import styles from "./styles.module.scss";

interface Props {
	onChange: Function;
	errors: Errors[];
}
const intervals: Intervals[] = [
	{ intervalCode: "oneHour", intervalName: "1 HR" },
	{ intervalCode: "threeHour", intervalName: "3 HR" },
	{ intervalCode: "sixHour", intervalName: "6 HR" },
	{ intervalCode: "twelveHour", intervalName: "12 HR" },
	{ intervalCode: "twentyFourHour", intervalName: "24 HR" },
];

const intervalKeySelector = (r: Intervals) => r.intervalCode;
const intervalLabelSelector = (r: Intervals) => r.intervalName;

const IntervalSelector = (props: Props) => {
	const [selectedInterval, setSelectedInterval] = useState("");
	const [error, setError] = useState("");
	const { onChange, errors } = props;
	const handleIntervalChange = (intervalCode: string) => {
		setSelectedInterval(intervalCode);
		const interval = intervals.filter((i) => i.intervalCode === intervalCode)[0];
		onChange(interval);
	};

	useEffect(() => {
		if (errors) {
			const err = errors.filter((e) => e.type === "Interval")[0];
			if (err) {
				const { message } = err;
				setError(message || "");
			} else {
				setError("");
			}
		}
	}, [errors]);

	return (
		<div className={styles.intervalSelector}>
			<SelectInput
				className={styles.interval}
				options={intervals}
				keySelector={intervalKeySelector}
				labelSelector={intervalLabelSelector}
				value={selectedInterval}
				onChange={handleIntervalChange}
				placeholder="Select Interval"
				// autoFocus
			/>
			{error && <ErrorMessage message={error} />}
		</div>
	);
};

export default FaramInputElement(IntervalSelector);
