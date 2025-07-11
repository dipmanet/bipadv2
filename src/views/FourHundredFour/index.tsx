import React from "react";

import Page from "#components/Page";

import styles from "./styles.module.scss";

export default class FourHundredFour extends React.PureComponent {
	public render() {
		return (
			<Page
				leftContent={null}
				mainContentClassName={styles.fourHundredFour}
				mainContent={
					<>
						<h1 className={styles.heading}>404</h1>
						<div className={styles.message}>The page you are looking for does not exist!</div>
					</>
				}
				hideMap
			/>
		);
	}
}
