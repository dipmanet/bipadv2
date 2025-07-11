import React, { useEffect, useState } from "react";
import { FaramInputElement } from "@togglecorp/faram";
import SelectInput from "#rsci/SelectInput";
import ErrorMessage from "../ErrorMessage";
import { Periods, Errors } from "../../types";
import styles from "./styles.module.scss";

const periods: Periods[] = [
	// { periodCode: 'minute', periodName: 'Minute' },
	{ periodCode: "hourly", periodName: "Hourly" },
	{ periodCode: "daily", periodName: "Daily" },
	{ periodCode: "monthly", periodName: "Monthly" },
];

const periodKeySelector = (r: Periods) => r.periodCode;
const periodLabelSelector = (r: Periods) => r.periodName;

interface Props {
	onChange: Function;
	errors: Errors[];
}

const PeriodSelector = (props: Props) => {
	const [selectedperiod, setSelectedperiod] = useState("");
	const [error, setError] = useState("");
	const { onChange, errors } = props;
	const handlePeriodChange = (periodCode: string) => {
		setSelectedperiod(periodCode);
		const period = periods.filter((p) => p.periodCode === periodCode)[0];
		onChange(period);
	};

	useEffect(() => {
		if (errors) {
			const err = errors.filter((e) => e.type === "Period")[0];
			if (err) {
				const { message } = err;
				setError(message || "");
			} else {
				setError("");
			}
		}
	}, [errors]);
	return (
		<div className={styles.periodSelector}>
			<SelectInput
				className={styles.period}
				options={periods}
				keySelector={periodKeySelector}
				labelSelector={periodLabelSelector}
				value={selectedperiod}
				onChange={handlePeriodChange}
				placeholder="Select Period"
			/>
			{error && <ErrorMessage message={error} />}
		</div>
	);
};

export default FaramInputElement(PeriodSelector);
