import React from "react";
import styles from "./styles.module.scss";

const FloodHistoryLegends = () => (
	<>
		<h2 className={styles.floodDepth2}>Flood depth (in meters)</h2>
		<div className={styles.floodDepthContainer}>
			<div className={styles.floodDepth}>
				<div className={styles.floodIndicator1}>{"> 2m"}</div>
				<div className={styles.floodText}>High</div>
			</div>
			<div className={styles.floodDepth}>
				<div className={styles.floodIndicator2}>{"1m - 2m"}</div>
				<div className={styles.floodText}>Med</div>
			</div>
			<div className={styles.floodDepth}>
				<div className={styles.floodIndicator3}>{"< 1m"}</div>
				<div className={styles.floodText}>Low</div>
			</div>
		</div>
	</>
);

export default FloodHistoryLegends;
