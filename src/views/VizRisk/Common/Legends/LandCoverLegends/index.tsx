import React from "react";
import Hexagon from "react-hexagon";
import styles from "./styles.module.scss";

const LandCoverLegends = (props) => {
	const { legends } = props;

	return (
		<div
			className={styles.mainDiv}
			style={{
				position: "fixed",
				bottom: "15px",
				right: "75px",
				zIndex: 200,
				backgroundColor: "rgb(18,31,57)",
				padding: "15px",
				// display: hide ? 'none' : 'block',
			}}>
			{legends.map((lgd) => (
				<p key={lgd.item} className={styles.landcoverIconContainer}>
					<span>
						<Hexagon
							style={{
								stroke: "#a6dea6",
								strokeWidth: 50,
								fill: lgd.color,
							}}
							className={styles.forestIcon}
						/>
					</span>
					<span className={styles.legendText}>{lgd.item}</span>
				</p>
			))}

			<div className={styles.landcoverIconContainer}>
				<div className={styles.roadIcon} />

				<span className={styles.legendText}>Roads</span>
			</div>

			<div className={styles.landcoverIconContainer}>
				<div className={styles.bridgeLine} />

				<span className={styles.legendText}>Bridges</span>
			</div>
		</div>
	);
};

export default LandCoverLegends;
