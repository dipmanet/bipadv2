import React from "react";
import { _cs } from "@togglecorp/fujs";

import styles from "./styles.module.scss";

export default class PrivacyPolicy extends React.PureComponent {
	render() {
		const { className } = this.props;

		return <div className={_cs(styles.privacyPolicy, className)}>Privacy Policy</div>;
	}
}
