import React from "react";
import styles from "./styles.module.scss";

export default function LeftTopBar({ currentHeaderVal }) {
	return (
		<div className={styles.leftTopBar}>
			<h3 className={styles.munName}>
				Vizrisk-Ratnanagar
				{/* {currentHeaderVal && (
					<>
						{'->'}
						{' '}
						{currentHeaderVal}
					</>
				)} */}
			</h3>
		</div>
	);
}
