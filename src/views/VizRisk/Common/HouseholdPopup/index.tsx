/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent-props */
import React, { useRef, useEffect } from "react";
import styles from "./styles.module.scss";

const handleButtonClick = () => {
	console.log("button click");
};

const HouseholdPopup = (props: Props) => {
	const tooltipContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		tooltipContainerRef.current = document.createElement("div");
		return () => {
			if (tooltipContainerRef.current) {
				tooltipContainerRef.current.remove();
			}
		};
	}, []);

	useEffect(() => {
		const button = document.createElement("BUTTON");
		button.innerHTML = "Add/Edit Details";
		button.addEventListener("click", handleButtonClick, false);
		tooltipContainerRef.current.appendChild(button);
	}, []);

	return tooltipContainerRef.current;
};

export default HouseholdPopup;
