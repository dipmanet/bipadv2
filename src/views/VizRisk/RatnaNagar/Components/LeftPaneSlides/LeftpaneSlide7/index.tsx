import React, { useContext } from 'react';
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';
import ReactHtmlParser from 'react-html-parser';
import CommonBarChart from '../../Charts/Barcharts';
import StackChart from '../../Charts/StackChart';
import Factors from '../../Factors';
import SelectComponent from '../../SelectComponent';
import styles from './styles.scss';

const LeftpaneSlide7 = () => {
    const {
        keyValueHtmlData,
    } = useContext(MainPageDataContext);

    const htmlData = keyValueHtmlData && keyValueHtmlData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page8_htmldata_301_3_35_35007',
    )[0];


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
                ReactHtmlParser(htmlData.value)
            )}
            <SelectComponent />
            <CommonBarChart barTitle={barTitle} barData={barData} />
        </div>
    );
};


export default LeftpaneSlide7;
