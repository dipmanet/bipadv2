import React, { useState, useEffect } from "react";
import { FaramInputElement } from "@togglecorp/faram";
import DateInput from "#rsci/DateInput";
import ErrorMessage from "../ErrorMessage";
import { Errors } from "../../types";

import styles from "./styles.module.scss";

interface Props {
	onChange: Function;
	value: {
		startDate: string;
		endDate: string;
	};
	errors: Errors[];
}

const DateSelector = (props: Props) => {
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [error, setError] = useState("");

	const { onChange, value, errors } = props;
	const handleStartDateChange = (newStartDate: string) => {
		setStartDate(newStartDate);
		onChange({ ...value, startDate: newStartDate, endDate });
	};

	const handleEndDateChange = (newEndDate: string) => {
		setEndDate(newEndDate);
		onChange({ ...value, endDate: newEndDate, startDate });
	};

	useEffect(() => {
		if (errors) {
			const err = errors.filter((e) => e.type === "Date")[0];
			if (err) {
				const { message } = err;
				setError(message || "");
			} else {
				setError("");
			}
		}
	}, [errors]);

	return (
		<React.Fragment>
			<div className={styles.dateSelector}>
				<DateInput
					label="Start Date"
					className={styles.input}
					value={startDate}
					onChange={handleStartDateChange}
				/>
				<div className={styles.seperator}>To</div>
				<DateInput
					label="End Date"
					className={styles.input}
					value={endDate}
					onChange={handleEndDateChange}
				/>
			</div>
			{error && <ErrorMessage message={error} />}
		</React.Fragment>
	);
};

export default FaramInputElement(DateSelector);
