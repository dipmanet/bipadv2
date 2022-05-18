import React, { useContext, useEffect, useState } from 'react';
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
import RangeStatusLegend from '../../Legends/RangeStatusLegend';

const LeftpaneSlide7 = () => {
    const {
        keyValueHtmlData,
        householdData,
        householdChartData,
    } = useContext(MainPageDataContext);
    const exposureChartData = householdChartData && householdChartData.Sensitivity;

    const selectFieldValues = exposureChartData && Object.keys(exposureChartData);

    const [selctFieldCurrentValue, setSelctFieldCurrentValue] = useState(selectFieldValues[0]);
    const [curerntChartData, setCurerntChartData] = useState([]);

    useEffect(() => {
        const currentChartSelectedData = exposureChartData[selctFieldCurrentValue];

        setCurerntChartData(currentChartSelectedData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selctFieldCurrentValue]);

    const htmlDataTop = keyValueHtmlData && keyValueHtmlData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page8_htmldata_301_3_35_35007',
    )[0];
    const htmlDataBottom = keyValueHtmlData && keyValueHtmlData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page8_bottom_htmldata_301_3_35_35007',
    )[0];


    const stackBarChartTitle = 'SENSITIVITY OF HOUSEHOLDS';

    const municipalityName = 'Ratnanagar Municipality ';
    const mainData = householdData.map(item => item.sensitivity);
    const dataArr = percentageCalculator(mainData, householdData);

    const averageExposureScore: any = ((mainData.reduce(
        (total: number, singleData: number) => total + singleData,
    )) / householdData.length / 10).toFixed(1);

    const scoreStatus = getHouseHoldDataStatus(averageExposureScore);
    const color = getHouseHoldDataColor(averageExposureScore);

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
            <p>
                The sensitivity value of the municipality is very high(
                {averageExposureScore}
                /10).
                The higher the value of sensitivity, the greater the potential impact.

            </p>
            {htmlDataBottom && htmlDataBottom.value && (
                ReactHtmlParser(htmlDataBottom.value)

            )}
            <StackChart
                stackBarChartTitle={stackBarChartTitle}
                dataArr={dataArr}
            />
            <SelectComponent
                selectFieldValues={selectFieldValues}
                selctFieldCurrentValue={selctFieldCurrentValue}
                setSelctFieldCurrentValue={setSelctFieldCurrentValue}
            />
            {' '}
            <CommonBarChart barTitle={selctFieldCurrentValue} barData={curerntChartData} />
        </div>
    );
};


export default LeftpaneSlide7;
