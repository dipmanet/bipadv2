/* eslint-disable react/jsx-indent-props */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-tabs */
import React, { useContext } from 'react';
import PopulationChart from '#views/VizRisk/Butwal/Charts/PopulationChart';

import styles from './styles.scss';
import { populationCustomTooltip, renderLegendPopulaion } from '#views/VizRisk/Butwal/Functions';
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';

const DemographicSlide = () => {
	const {
		keyValueHtmlData,
		keyValueJsonData,
	} = useContext(MainPageDataContext);

	const htmlData = keyValueHtmlData && keyValueHtmlData.filter((item: any) => item.key === 'vizrisk_ratnanagar_page3_htmldata_301_3_35_35007')[0];
	const populationData = keyValueJsonData && keyValueJsonData.filter((item: any) => item.key === 'vizrisk_ratnanagar_page3_populationdata_301_3_35_35007')[0];

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
			{
				populationData && populationData.value && populationData.value.length > 0 && (
					<PopulationChart
						populationCustomTooltip={populationCustomTooltip}
						populationData={populationData.value}
					// renderLegendPopulaion={renderLegendPopulaion}
					/>

				)
			}

		</div>
	);
};


export default DemographicSlide;
