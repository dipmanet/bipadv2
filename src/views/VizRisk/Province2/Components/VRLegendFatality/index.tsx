import React from "react";
import styles from "./styles.module.scss";

const VRLegendHazard = (props: Props) => {
	const { title, children } = props;
	return (
		<div className={styles.vrLegendContainer}>
			{title}
			{children}
		</div>
	);
};

export default VRLegendHazard;
