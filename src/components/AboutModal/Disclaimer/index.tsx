import React from "react";
import { _cs } from "@togglecorp/fujs";

import styles from "./styles.module.scss";

export default class Disclaimer extends React.PureComponent {
	render() {
		const { className } = this.props;

		return (
			<div className={_cs(styles.disclaimer, className)}>
				<p>The data/information used in the system are under the process of verification.</p>
			</div>
		);
	}
}
