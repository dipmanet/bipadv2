import React, { useState } from "react";
import Hexagon from "react-hexagon";
import styles from "./styles.module.scss";

const DemoGraphicsLegends = (props) => {
	const [showSus, setshowSus] = useState(false);
	const [showSes, setshowSes] = useState(false);
	const [showFlood, setshowFlood] = useState(false);
	const { handleSesmicLayerChange } = props;

	const handlePopulationClick = (val) => {
		if (val === "sus") {
			if (showSus) {
				setshowSus(false);
				// setshowSes(false);
				handleSesmicLayerChange("susHide");
			} else {
				setshowSus(true);
				if (showSes) {
					setshowSes(false);
					handleSesmicLayerChange("sesHide");
				}
				if (showFlood) {
					setshowFlood(false);
					handleSesmicLayerChange("floodHide");
				}
				handleSesmicLayerChange("sus");
			}
		}
		if (val === "ses") {
			if (showSes) {
				setshowSes(false);
				handleSesmicLayerChange("sesHide");
			} else {
				setshowSes(true);
				if (showSus) {
					setshowSus(false);
					handleSesmicLayerChange("susHide");
				}
				if (showFlood) {
					setshowFlood(false);
					handleSesmicLayerChange("floodHide");
				}
				handleSesmicLayerChange("ses");
			}
		}

		if (val === "flood") {
			if (showFlood) {
				setshowFlood(false);
				handleSesmicLayerChange("floodHide");
			} else {
				setshowFlood(true);
				if (showSus) {
					setshowSus(false);
					handleSesmicLayerChange("susHide");
				}
				if (showSes) {
					setshowSes(false);
					handleSesmicLayerChange("sesHide");
				}
				handleSesmicLayerChange("flood");
			}
		}
	};

	return (
		<>
			<div className={styles.hazardItemContainer}>
				<button
					type="button"
					className={showSus ? styles.legendBtnSelected : styles.legendBtn}
					onClick={() => handlePopulationClick("sus")}>
					<Hexagon
						style={{
							stroke: "#fff",
							strokeWidth: 50,
							fill: showSus ? "#036ef0" : "transparent",
						}}
						className={styles.educationHexagon}
					/>
					Landslide Suseptibility Map
				</button>
			</div>
			<div className={styles.hazardItemContainer}>
				<button
					type="button"
					className={showSes ? styles.legendBtnSelected : styles.legendBtn}
					onClick={() => handlePopulationClick("ses")}>
					<Hexagon
						style={{
							stroke: "#fff",
							strokeWidth: 50,
							fill: showSes ? "#036ef0" : "transparent",
						}}
						className={styles.educationHexagon}
					/>
					Seismic Hazard Map
				</button>
			</div>
			<div className={styles.hazardItemContainer}>
				<button
					type="button"
					className={showFlood ? styles.legendBtnSelected : styles.legendBtn}
					onClick={() => handlePopulationClick("flood")}>
					<Hexagon
						style={{
							stroke: "#fff",
							strokeWidth: 50,
							fill: showFlood ? "#036ef0" : "transparent",
						}}
						className={styles.educationHexagon}
					/>
					Flood Hazard Maps
				</button>
			</div>
		</>
	);
};

export default DemoGraphicsLegends;
