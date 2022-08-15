import React, { useContext, useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';
import {
    getDataFromKey,
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

const LeftpaneSlide4 = () => {
    const {
        keyValueHtmlData,
        householdData,
        householdChartData,
        setSelectFieldValue,
    } = useContext(MainPageDataContext);
    const exposureChartData = householdChartData && householdChartData.Exposure;

    const [selctFieldCurrentValue, setSelctFieldCurrentValue] = useState('Building Type');
    const [curerntChartData, setCurerntChartData] = useState([]);

    useEffect(() => {
        setSelectFieldValue('Building Type');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        const currentChartSelectedData = exposureChartData[selctFieldCurrentValue];

        setCurerntChartData(currentChartSelectedData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selctFieldCurrentValue]);

    const htmlDataTop = keyValueHtmlData && getDataFromKey('vizrisk_ratnanagar', 'page6_htmldata', '301_3_35_35007',
        keyValueHtmlData);

    const htmlDataBottom = keyValueHtmlData && keyValueHtmlData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page6_bottom_htmldata_301_3_35_35007',
    )[0];

    const stackBarChartTitle = 'EXPOSURE OF HOUSEHOLDS';

    const municipalityName = 'Flood Exposure in Municipality ';
    const mainData = householdData.map(item => item.exposure);
    const dataArr = percentageCalculator(mainData, householdData);

    const averageExposureScore: any = ((mainData.reduce(
        (total: number, singleData: number) => total + singleData,
    )) / householdData.length / 10).toFixed(1);

    const selectFieldValues = [
        {
            optionTitle: '',
            optionValues: exposureChartData && Object.keys(exposureChartData),
        },
    ];
    const scoreStatus = getHouseHoldDataStatus(averageExposureScore);
    const color = getHouseHoldDataColor(averageExposureScore);

    return (
        <div className={styles.vrSideBar}>
            <div className="mainTitleDiv">
                {htmlDataTop && htmlDataTop.value && (
                    ReactHtmlParser(htmlDataTop.value)

                )}
            </div>
            <p>
                The exposure scores range from 0 to 10 and are divided into 5 classes,
                each represented by a different color. The exposure value of the municipality
                is low (
                {averageExposureScore}
                /10). A large family size corresponds to more exposure.
                Likewise, materials used for building construction and the type of building
                itself represent varying degrees of exposure.
            </p>

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
            <SelectComponent
                selectFieldValues={selectFieldValues}
                selctFieldCurrentValue={selctFieldCurrentValue}
                setSelctFieldCurrentValue={setSelctFieldCurrentValue}
            />
            {
                curerntChartData && curerntChartData.length > 0
                && (
                    <CommonBarChart
                        barTitle={selctFieldCurrentValue}
                        barData={curerntChartData}
                    />
                )
            }

        </div>
    );
};


export default LeftpaneSlide4;
