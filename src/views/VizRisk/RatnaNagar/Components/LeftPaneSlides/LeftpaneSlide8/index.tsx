import React, { useContext } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';
import {
    getHouseHoldDataColor,
    getHouseHoldDataStatus,
    percentageCalculator,
} from '#views/VizRisk/RatnaNagar/utils';
import CommonBarChart from '../../Charts/Barcharts';
import StackChart from '../../Charts/StackChart';
import Factors from '../../Factors';
import SelectComponent from '../../SelectComponent';
import styles from './styles.scss';

const LeftpaneSlide8 = () => {
    const {
        keyValueHtmlData,
        householdData,
    } = useContext(MainPageDataContext);

    const htmlDataTop = keyValueHtmlData && keyValueHtmlData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page9_htmldata_301_3_35_35007',
    )[0];
    const htmlDataBottom = keyValueHtmlData && keyValueHtmlData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page9_bottom_htmldata_301_3_35_35007',
    )[0];
    const stackBarChartTitle = 'HAZARD OF HOUSEHOLDS';

    const municipalityName = 'Ratnanagar Municipality ';
    const mainData = householdData.map(item => item.adaptiveCapacity);
    const dataArr = percentageCalculator(mainData, householdData);

    const averageExposureScore: any = ((mainData.reduce(
        (total: number, singleData: number) => total + singleData,
    )) / householdData.length / 10).toFixed(1);

    const scoreStatus = getHouseHoldDataStatus(averageExposureScore);
    const color = getHouseHoldDataColor(averageExposureScore);

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
            <div className="mainTitleDiv">
                {htmlDataTop && htmlDataTop.value && (
                    ReactHtmlParser(htmlDataTop.value)

                )}
            </div>
            <Factors
                municipalityName={municipalityName}
                factorScore={averageExposureScore}
                scoreStatus={scoreStatus}
                color={color}
            />
            {htmlDataBottom && htmlDataBottom.value && (
                ReactHtmlParser(htmlDataBottom.value)

            )}
            <StackChart
                stackBarChartTitle={stackBarChartTitle}
                dataArr={dataArr}
            />
            <SelectComponent />
            <CommonBarChart barTitle={barTitle} barData={barData} />
        </div>
    );
};


export default LeftpaneSlide8;
