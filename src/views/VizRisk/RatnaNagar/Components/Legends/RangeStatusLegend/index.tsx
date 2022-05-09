/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable no-tabs */
/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import styles from './styles.scss';

const RangeStatusLegend = () => {
	const data = [
		{
			status: 'Very High(6.5 - 10)',
			color: '#e75d4f',
		},
		{
			status: 'High(5 - 6.4)',
			color: '#e79546',
		},
		{
			status: 'Medium(3.5 - 4.9)',
			color: '#2af5ac',
		},
		{
			status: 'Low(2 - 3.4)',
			color: '#45c4fe',
		},
		{
			status: 'Very Low(0 - 1.9)',
			color: '#457ded',
		},
	];

	return (
		<div className={styles.mainStatusLegendContainer}>
			{
				data.map(item => (
					<div key={item.status} className={styles.statusSection}>
						<div style={{ backgroundColor: item.color }} className={styles.statusColor} />
						<p className={styles.statusname}>{item.status}</p>
					</div>
				))
			}
		</div>

	);
};

export default RangeStatusLegend;
