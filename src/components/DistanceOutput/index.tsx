import React from "react";
import { _cs, isFalsy } from "@togglecorp/fujs";
import PropTypes from "prop-types";

import { iconNames } from "#constants";
import styles from "./styles.module.scss";

const propTypes = {
	className: PropTypes.string,
};

const defaultProps = {
	className: "",
};

export default class DistanceOutput extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	render() {
		const { className: classNameFromProps, value: valueFromProps, language } = this.props;

		let amount = valueFromProps;
		let unit = language === "en" ? "Km" : "कि.मि.";

		if (isFalsy(valueFromProps)) {
			return null;
		}

		if (amount < 1) {
			amount *= 1000;
			unit = language === "en" ? "m" : "मि.";
		}

		return (
			<div className={_cs(classNameFromProps, styles.distanceOutput)}>
				<div className={_cs(styles.icon, iconNames.distance, "distance-output-icon")} />
				<div className={styles.value}>
					<div className={styles.amount}>{amount}</div>
					<div className={styles.unit}>{unit}</div>
				</div>
			</div>
		);
	}
}
