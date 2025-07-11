import React from "react";
import Icon from "#rscg/Icon";

import styles from "./styles.module.scss";

interface Props {
	note?: string;
}

const DEFAULT_NOTE =
	"Note: The calculated values are based on the 24 hours average of our readings taken every 10 minutes.";

const Note = (props: Props) => {
	const { note } = props;
	return (
		<div className={styles.note}>
			<Icon className={styles.infoIcon} name="info" />
			{note || DEFAULT_NOTE}
		</div>
	);
};

export default Note;
