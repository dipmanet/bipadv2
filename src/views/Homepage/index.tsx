/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
import React from "react";
import Page from "#components/Page";
import Slide1 from "#components/WalkthroughModal/Slide1";

import styles from "./styles.module.scss";

const HomePage = () => (
	<>
		<Page hideFilter hideMap />
		<div className={styles.mainContainer}>
			<section className={styles.scrollArea} id="1">
				<Slide1 />
			</section>
		</div>
	</>
);

export default HomePage;
