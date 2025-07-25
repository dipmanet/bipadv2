import React from "react";
import { _cs } from "@togglecorp/fujs";

import styles from "./styles.module.scss";

interface Props {
	waterLevel: number;
	status: string;
}

const pillClassSelector = (status: string) => {
	if (status === "BELOW WARNING LEVEL") {
		return styles.belowWarning;
	}
	if (status === "ABOVE WARNING LEVEL") {
		return styles.aboveWarning;
	}
	if (status === "ABOVE DANGER LEVEL") {
		return styles.aboveDanger;
	}
	return styles.belowWarning;
};

const RiverPill = (props: Props) => {
	const { waterLevel, status } = props;
	return (
		<div className={_cs(styles.riverPill, pillClassSelector(status))}>
			{/* {`${waterLevel} m`} */}

			{waterLevel ? `${waterLevel.toFixed(2)} m` : "N/A"}
		</div>
	);
};

export default RiverPill;
