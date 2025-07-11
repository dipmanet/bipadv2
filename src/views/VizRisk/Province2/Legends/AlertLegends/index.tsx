import React from "react";
import Hexagon from "react-hexagon";
import styles from "./styles.module.scss";

const AlertsLegend = (props) => (
	<>
		<div className={styles.mainDivLand}>
			<p className={styles.landcoverIconContainer}>
				<span>
					<Hexagon
						style={{
							stroke: "#f3f2f2",
							strokeWidth: 50,
							fill: "red",
						}}
						className={styles.fireIcon}
					/>
				</span>
				Fire
			</p>
			<p className={styles.landcoverIconContainer}>
				<span>
					<Hexagon
						style={{
							stroke: "#a7ced6",
							strokeWidth: 50,
							fill: "#0670bc",
						}}
						className={styles.rainFallIcon}
					/>
				</span>
				Heavy Rainfall
			</p>

			<p className={styles.landcoverIconContainer}>
				<span>
					<Hexagon
						style={{
							stroke: "#edf7d2",
							strokeWidth: 50,
							fill: "#d3e878",
						}}
						className={styles.pollutionIcon}
					/>
				</span>
				Environmental Pollution
			</p>
			<p className={styles.landcoverIconContainer}>
				<span>
					<Hexagon
						style={{
							stroke: "#a6dea6",
							strokeWidth: 50,
							fill: "blue",
						}}
						className={styles.floodIcon}
					/>
				</span>
				Flood
			</p>
			<p className={styles.landcoverIconContainer}>
				<span>
					<Hexagon
						style={{
							stroke: "#a6dea6",
							strokeWidth: 50,
							fill: "#5ac44a",
						}}
						className={styles.floodIcon}
					/>
				</span>
				EarthQuake
			</p>
		</div>
	</>
);

export default AlertsLegend;
