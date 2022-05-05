/* eslint-disable react/jsx-indent-props */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-tabs */
import React from 'react';
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import styles from './styles.scss';

const DemographicSlide = () => (
	<div className={styles.vrSideBar}>
		<h1>Demographics</h1>
		<p>
			Ratnanagar  Municipality is located in Sindhupalchok
			district of Bagmati province. The rural municipality
			has 7 wards covering a total area of 592 sq. km and
			is situated at an elevation of 800 m to 7000m AMSL.

		</p>
	</div>
);


export default DemographicSlide;
