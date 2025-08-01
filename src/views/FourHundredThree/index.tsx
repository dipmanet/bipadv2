import React from "react";

import FocusTrap from "react-focus-trap";
import Page from "#components/Page";

import styles from "./styles.module.scss";

export default class FourHundredThree extends React.PureComponent {
	public render() {
		return (
			<Page
				leftContent={null}
				mainContentClassName={styles.fourHundredThree}
				mainContent={
					<>
						<h1 className={styles.heading}>403</h1>
						<div className={styles.message}>
							You do not have enough permissions to view this page.
						</div>
					</>
				}
				hideMap
			/>
		);
	}
}
