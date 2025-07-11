import React, { useState } from "react";
import styles from "./styles.module.scss";

interface Props {
	dashboardViewHandler: () => void;
}

const Dashboard = (props: Props) => {
	const { dashboardViewHandler } = props;

	return (
		<div className={styles.dashboardContainer}>
			<main className={styles.mainContainer}>
				<h4 className={styles.welcome}>Welcome to</h4>
				<h1 className={styles.title}>IBF Dashboard</h1>
				<p className={styles.content}>
					Welcome to the IBF dashboard for Early Action. This is the Nepal’s first prototype of a
					flood impact based forecast dashboard to enable early action.
				</p>
				<p className={styles.content}>
					IBF combines a forecast of a weather or climate hazard with vulnerability and exposure
					information and thus allow decision makers to analyze risk, therefore making preparedness
					and emergency response more effective.
				</p>

				<div className={styles.btnContainer}>
					<button type="button" className={styles.tourBtn}>
						TAKE A TOUR
					</button>
					<button type="button" className={styles.dashboardBtn} onClick={dashboardViewHandler}>
						VIEW DASHBOARD
					</button>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
