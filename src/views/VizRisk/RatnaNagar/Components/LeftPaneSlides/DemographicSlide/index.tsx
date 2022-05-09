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
		keyValueJsonData,
	} = useContext(MainPageDataContext);

	const populationData = keyValueJsonData && keyValueJsonData.filter((item: any) => item.key === 'vizrisk_ratnanagar_page3_populationdata_301_3_35_35007')[0];

	return (
		<div className={styles.vrSideBar}>
			<h1>Demographics</h1>
			<p>
				Ratnanagar  Municipality is located in Sindhupalchok
				district of Bagmati province. The rural municipality
				has 7 wards covering a total area of 592 sq. km and
				is situated at an elevation of 800 m to 7000m AMSL.

			</p>
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
