import React from "react";
import Hexagon from "react-hexagon";
import styles from "./styles.module.scss";

interface Props {
	currentOsmLayer: string;
	handleRadioButton: (item: string) => undefined;
}
const RadioButton = (props: Props) => {
	const { currentOsmLayer, handleRadioButton } = props;
	return (
		<div className={styles.radioButton}>
			<button
				type="button"
				className={
					currentOsmLayer === "Satellite Layer" ? styles.radioBtnSelected : styles.radioBtn
				}
				onClick={() => handleRadioButton("Satellite Layer")}>
				<Hexagon
					style={{
						stroke: "#9dc7fa",
						strokeWidth: 50,
						fill: currentOsmLayer === "Satellite Layer" ? "#036ef0" : "transparent",
					}}
					className={styles.radioHexagon}
				/>
				Satellite Layer{" "}
			</button>
			<button
				type="button"
				className={currentOsmLayer === "Osm Layer" ? styles.radioBtnSelected : styles.radioBtn}
				onClick={() => handleRadioButton("Osm Layer")}>
				<Hexagon
					style={{
						stroke: "#9dc7fa",
						strokeWidth: 50,
						fill: currentOsmLayer === "Osm Layer" ? "#036ef0" : "transparent",
					}}
					className={styles.radioHexagon}
				/>
				Osm Layer{" "}
			</button>
		</div>
	);
};

export default RadioButton;
