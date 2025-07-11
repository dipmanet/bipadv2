import React from "react";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import RainIcon from "#resources/icons/Rain.svg";
import Legend from "#rscz/Legend";

import styles from "./styles.module.scss";

const rainLegendItems = [
	{ color: "#2373a9", label: "Below Warning Level", style: styles.symbol },
	{ color: "#FDD835", label: "Warning Level", style: styles.symbol },
];

const itemSelector = (d: { label: string }) => d.label;
const legendColorSelector = (d: { color: string }) => d.color;
const legendLabelSelector = (d: { label: string }) => d.label;
const classNameSelector = (d: { style: string }) => d.style;

const RainLegend = () => (
	<div className={styles.legendContainer}>
		<header className={styles.header}>
			<ScalableVectorGraphics className={styles.legendIcon} src={RainIcon} alt="Rain" />
			<h4 className={styles.heading}>Rain</h4>
		</header>
		<Legend
			className={styles.legend}
			data={rainLegendItems}
			itemClassName={styles.legendItem}
			keySelector={itemSelector}
			// iconSelector={iconSelector}
			labelSelector={legendLabelSelector}
			symbolClassNameSelector={classNameSelector}
			colorSelector={legendColorSelector}
			emptyComponent={null}
		/>
		<div className={styles.sourceDetails}>
			<div className={styles.label}>Source:</div>
			<a
				className={styles.link}
				href="http://hydrology.gov.np"
				target="_blank"
				rel="noopener noreferrer">
				Department of Hydrology and Meteorology
			</a>
		</div>
	</div>
);

export default RainLegend;
