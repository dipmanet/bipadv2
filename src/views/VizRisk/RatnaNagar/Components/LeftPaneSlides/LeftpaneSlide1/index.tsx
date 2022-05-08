/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
import React, { useContext } from 'react';
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
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';

import styles from './styles.scss';

const LeftpaneSlide1 = () => {
	const {
		keyValueJsonData,
	} = useContext(MainPageDataContext);

	const tempData = keyValueJsonData && keyValueJsonData.filter((item: any) => item.key === 'vizrisk_ratnanagar_page1_tempdata_301_3_35_35007')[0];
	const rainFallData = keyValueJsonData && keyValueJsonData.filter((item: any) => item.key === 'vizrisk_ratnanagar_page1_rainfalldata_301_3_35_35007')[0];
	console.log(rainFallData);

	return (
		<div className={styles.vrSideBar}>
			<h1> Ratnanagar Rural Municipality</h1>
			<p>
				Ratnanagar  Municipality is located in Sindhupalchok
				district of Bagmati province. The rural municipality
				has 7 wards covering a total area of 592 sq. km and
				is situated at an elevation of 800 m to 7000m AMSL.

			</p>
			<p>
				Ratnanagar  Municipality is located in Sindhupalchok
				district of Bagmati province. The rural municipality
				has 7 wards covering a total area of 592 sq. km and
				is situated at an elevation of 800 m to 7000m AMSL.

			</p>
			<p>
				Ratnanagar  Municipality is located in Sindhupalchok
				district of Bagmati province. The rural municipality
				has 7 wards covering a total area of 592 sq. km and
				is situated at an elevation of 800 m to 7000m AMSL.

			</p>
			<div className={styles.climateChart}>
				<p style={{ marginBottom: '0px', marginTop: '30px', fontWeight: 'bold' }}> Temperature</p>
				<div className={styles.mainLineChart}>
					{
						tempData && tempData.value && tempData.value.length > 0

						&& (
							<ResponsiveContainer className={styles.chartContainer} height={300}>
								<LineChart
									margin={{ top: 0, right: 5, left: 30, bottom: 10 }}
									data={tempData.value}
								>
									<CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
									<XAxis
										dataKey="name"
										interval="preserveStart"
										tick={{ fill: '#94bdcf' }}
									/>
									<YAxis
										unit={'℃'}
										axisLine={false}
										domain={[0, 40]}
										tick={{ fill: '#94bdcf' }}
										tickCount={10}
										interval="preserveEnd"
										allowDataOverflow
									/>
									<Legend iconType="circle" iconSize={10} align="center" />
									<Tooltip />
									{/* <Line type="monotone" dataKey="Max" stroke="#ffbf00" strokeWidth={5} /> */}
									<Line type="monotone" dataKey="Avg" stroke="#00d725" strokeWidth={5} />
									{/* <Line type="monotone" dataKey="Min" stroke="#347eff" strokeWidth={5} /> */}
								</LineChart>
							</ResponsiveContainer>
						)
					}
				</div>
			</div>
			<div className={styles.climateChart}>
				<p style={{ marginBottom: '0px', marginTop: '30px', fontWeight: 'bold' }}> Rainfall</p>
				<div className={styles.mainLineChart}>
					{
						rainFallData && rainFallData.value && rainFallData.value.length > 0 && (
							<ResponsiveContainer className={styles.chartContainer} height={300}>
								<LineChart
									margin={{ top: 0, right: 5, left: 30, bottom: 10 }}
									data={rainFallData.value}
								>
									<CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
									<XAxis
										dataKey="month"
										interval="preserveStart"
										tick={{ fill: '#94bdcf' }}
									/>
									<YAxis
										unit={'mm'}
										axisLine={false}
										// domain={[0, 1150]}
										tick={{ fill: '#94bdcf' }}
										tickCount={10}
										interval="preserveEnd"
										allowDataOverflow
									/>
									<Legend iconType="circle" iconSize={10} align="center" />
									<Tooltip />
									<Line type="monotone" dataKey="Averagerainfall" stroke="#ffbf00" strokeWidth={5} />

								</LineChart>
							</ResponsiveContainer>
						)
					}

				</div>
			</div>
		</div>
	);
};


export default LeftpaneSlide1;
