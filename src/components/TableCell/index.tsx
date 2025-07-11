import React from "react";

import styles from "./styles.module.scss";

export default ({ value }) => (
	<div className={styles.cell} title={value}>
		{value}
	</div>
);
