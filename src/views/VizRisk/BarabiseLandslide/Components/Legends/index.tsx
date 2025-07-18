import React from "react";
import Hexagon from "react-hexagon";
import legendData from "./legends";
import styles from "./styles.module.scss";

const Legends = (props) => {
	const { page } = props;
	const { type } = legendData[page];
	return (
		<>
			{type === "hexagon" ? (
				<div className={styles.legendsContainer}>
					<h2>{legendData[page].title}</h2>
					<div className={styles.legendsItemsList}>
						{legendData[page].legends.map((legend) => (
							<div key={legend.key} className={styles.legendsRow}>
								<Hexagon
									style={{
										stroke: "#fff",
										strokeWidth: 50,
										fill: legend.color,
									}}
									className={styles.legendsHexagon}
								/>
								{legend.label}
							</div>
						))}
					</div>
				</div>
			) : (
				<div className={styles.legendsContainer}>
					<h2>{legendData[page].title}</h2>
					<div className={styles.legendsItemsList}>
						{legendData[page].legends.map((legend) => (
							<div key={legend.key} className={styles.legendsRow}>
								<div
									style={{
										backgroundColor: legend.color,
										marginBottom: 0,
									}}
									className={styles.legendsSquare}
								/>
								{legend.label}
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);
};

export default Legends;
