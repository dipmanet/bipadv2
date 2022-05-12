import React, { useContext } from 'react';
import ReactHtmlParser from 'react-html-parser';
import PopulationChart from '#views/VizRisk/Butwal/Charts/PopulationChart';

import { populationCustomTooltip } from '#views/VizRisk/Butwal/Functions';
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';
import styles from './styles.scss';

const DemographicSlide = () => {
    const {
        keyValueHtmlData,
        keyValueJsonData,
    } = useContext(MainPageDataContext);

    const htmlData = keyValueHtmlData && keyValueHtmlData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page3_htmldata_301_3_35_35007',
    )[0];
    const populationData = keyValueJsonData && keyValueJsonData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page3_populationdata_301_3_35_35007',
    )[0];

    return (
        <div className={styles.vrSideBar}>
            <div className="mainTitleDiv">
                {htmlData && htmlData.value && (
                    ReactHtmlParser(htmlData.value)

                )}
            </div>
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
