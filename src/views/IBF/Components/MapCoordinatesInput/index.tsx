/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from "react";
import style from "./styles.module.scss";

interface EventType {
	target: {
		name: string;
		value: number;
	};
}

const MapCoordinatesInput = ({
	type,
	placeholder,
	label,
	htmlForId,
	value,
	name,
	onChangeHandler,
	coordinate,
	// errorMessage,
}) => {
	useEffect(() => {
		const eventValue: EventType = {
			target: {
				name,
				value: coordinate,
			},
		};
		onChangeHandler(eventValue);
	}, [coordinate]);

	return (
		<div className={style.inputContainer}>
			<label htmlFor={htmlForId}>{label}</label>
			<input
				type={type}
				id={htmlForId}
				name={name}
				value={value}
				placeholder={placeholder}
				readOnly
			/>
			{/* {errorMessage ? <p>{errorMessage}</p> : '' } */}
		</div>
	);
};
export default MapCoordinatesInput;
