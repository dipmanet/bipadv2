import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.module.scss";

const propTypes = {
	title: PropTypes.string.isRequired,
};

export default class GroupTitle extends React.PureComponent {
	static propTypes = propTypes;

	render() {
		const { title } = this.props;
		return <div className={styles.groupHeader}>{title}</div>;
	}
}
