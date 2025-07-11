import React from "react";
import styles from "./styles.module.scss";

interface TooltipProps {
	currentSelection: string;
}

const DamageLossTooltip = (props: TooltipProps) => {
	const { currentSelection } = props;
	return <p className={styles.textData}>currently showing : Number of {currentSelection}</p>;
};

export default DamageLossTooltip;
