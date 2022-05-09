/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-tabs */
/* eslint-disable @typescript-eslint/indent */
import React, { useContext } from 'react';
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';
import CommonBarChart from '../../Charts/Barcharts';
import StackChart from '../../Charts/StackChart';
import Factors from '../../Factors';
import SelectComponent from '../../SelectComponent';
import styles from './styles.scss';

const LeftpaneSlide8 = () => {
	const {
		keyValueHtmlData,
		keyValueJsonData,
	} = useContext(MainPageDataContext);

	const htmlData = keyValueHtmlData && keyValueHtmlData.filter((item: any) => item.key === 'vizrisk_ratnanagar_page4_htmldata_301_3_35_35007')[0];
	const munName = 'Ratnanagar Municipality';
	const factorScore = 3;
	const scoreSattus = 'Low';

	const stackBarChartTitle = 'HAZARD OF HOUSEHOLDS';

	const data = [
		{
			'Very High': 5,
			High: 30,
			Medium: 10,
			Low: 20,
			'Very Low': 35,
		},
	];

	const barTitle = 'DISTRIBUTION OF HOUSEHOLD BY FAMILY SIZE';
	const barData = [
		{
			name: 'Page A',
			'Number of Household': 4000,
		},
		{
			name: 'Page B',
			'Number of Household': 1398,
		},
		{
			name: 'Page C',
			'Number of Household': 2000,
		},
		{
			name: 'Page D',
			'Number of Household': 2780,
		},
		{
			name: 'Page E',
			'Number of Household': 1890,
		},
	];
	return (
		<div className={styles.vrSideBar}>
			{htmlData && htmlData.value && (
				<div
					style={{ textAlign: 'initial' }}
					className={styles.mainIntroHtmlFromAPI}
					dangerouslySetInnerHTML={{
						__html: htmlData.value,
					}}
				/>
			)}
			<SelectComponent />
			<CommonBarChart barTitle={barTitle} barData={barData} />
		</div>
	);
};


export default LeftpaneSlide8;
