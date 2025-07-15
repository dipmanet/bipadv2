import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.module.scss";

const propTypes = {
	/**
	 * child elements
	 */
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.element]).isRequired,
};

const Group = ({ children }) => {
	return <div className={styles.group}>{children}</div>;
};

Group.propTypes = propTypes;

export default Group;
