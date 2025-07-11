import React, { useState, useEffect } from "react";
import { _cs, isDefined } from "@togglecorp/fujs";

import Numeral from "#rscv/Numeral";

import styles from "./styles.module.scss";

const ChoroplethLegend = ({ minValue, legend, className }) => (
	<div className={_cs(className, styles.choroplethLegend)}>
		{isDefined(minValue) && (
			<Numeral className={styles.min} normal value={minValue} precision={2} />
		)}

		{Object.keys(legend).map((color) => {
			const value = legend[color];
			return (
				<div className={styles.legendElement} key={color}>
					<div className={styles.color} style={{ backgroundColor: color }} />
					<div className={styles.value}>
						<Numeral normal value={value} precision={2} />
					</div>
				</div>
			);
		})}
	</div>
);

export default ChoroplethLegend;
