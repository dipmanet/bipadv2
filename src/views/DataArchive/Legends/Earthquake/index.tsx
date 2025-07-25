import React from "react";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import EarthquakeIcon from "#resources/icons/Earthquake.svg";
import Legend from "#rscz/Legend";

import styles from "./styles.module.scss";

const earthquakeLegendItems = [
	{ color: "#fcbba1", label: "Light (4.0 - 4.9)", radius: 8, style: styles.symbol },
	{ color: "#fc9272", label: "Moderate (5.0 -5.9)", radius: 12, style: styles.symbol },
	{ color: "#fb6a4a", label: "Strong (6.0 - 6.9)", radius: 16, style: styles.symbol },
	{ color: "#de2d26", label: "Major (7.0 - 7.9)", radius: 18, style: styles.symbol },
	{ color: "#a50f15", label: "Great (> 8)", radius: 22, style: styles.symbol },
];

const itemSelector = (d: { label: string }) => d.label;
const radiusSelector = (d: { radius: number }) => d.radius;
const legendColorSelector = (d: { color: string }) => d.color;
const legendLabelSelector = (d: { label: string }) => d.label;
const classNameSelector = (d: { style: string }) => d.style;

const EarthquakeLegend = () => (
	<div className={styles.legendContainer}>
		<header className={styles.header}>
			<ScalableVectorGraphics className={styles.legendIcon} src={EarthquakeIcon} alt="Earthquake" />
			<h4 className={styles.heading}>Earthquake (ML)</h4>
		</header>
		<Legend
			className={styles.legend}
			data={earthquakeLegendItems}
			itemClassName={styles.sizeLegendItem}
			keySelector={itemSelector}
			radiusSelector={radiusSelector}
			labelSelector={legendLabelSelector}
			symbolClassNameSelector={classNameSelector}
			colorSelector={legendColorSelector}
			emptyComponent={null}
		/>
		<div className={styles.sourceDetails}>
			<div className={styles.label}>Source:</div>
			<a
				className={styles.link}
				href="http://www.seismonepal.gov.np"
				target="_blank"
				rel="noopener noreferrer">
				Department of Mines and Geology
			</a>
		</div>
	</div>
);

export default EarthquakeLegend;
