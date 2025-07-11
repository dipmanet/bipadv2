import React from "react";
import { _cs } from "@togglecorp/fujs";

import styles from "./styles.module.scss";

interface Props {
	className?: string;
	text?: string;
}

class RiskDescription extends React.PureComponent<Props> {
	public render() {
		const { className, text } = this.props;

		if (!text) {
			return null;
		}

		return (
			<div title={text} className={_cs(className, styles.riskDescription)}>
				{text}
			</div>
		);
	}
}

export default RiskDescription;
