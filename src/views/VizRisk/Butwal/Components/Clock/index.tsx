/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

export default function DateTime() {
	return (
		<div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
			<div style={{ padding: "10px", cursor: "not-allowed" }}>
				<iframe
					id="myIframe"
					className={styles.iframeMain}
					src="https://free.timeanddate.com/clock/i82ith5s/n117/szw105/szh105/hocfff/hbw0/hfc0c2432/cf100/hgr0/fav0/fiv0/mqcfff/mqs2/mql3/mqw4/mqd70/mhcfff/mhs2/mhl3/mhw4/mhd70/mmv0/hhcfff/hhs3/hmcfff/hms3/hscfff"
					frameBorder="0"
					width="105"
					height="105"
				/>
			</div>
			<div style={{ padding: "10px" }}>
				<iframe
					src="https://free.timeanddate.com/clock/i82ith5s/n117/fn15/fceee/tc0c2432/ftbi/pa8/tt0/tw1/th2/ta1/tb4"
					frameBorder="0"
					width="163"
					height="48"
				/>
			</div>{" "}
			{/* {Date()} */}
		</div>
	);
}
