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
import ReactHtmlParser from 'react-html-parser';
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';

import styles from './styles.scss';
import { getDataFromKey } from '#views/VizRisk/RatnaNagar/utils';
import RenderLegend from '../../Legends/RenderLegend';
import RenderLegendRainfall from '../../Legends/RenderLegendRailfall';

const LeftpaneSlide1 = () => {
    const {
        mainKey,
        suffix,
        keyValueHtmlData,
        keyValueJsonData,
    } = useContext(MainPageDataContext);

    const htmlData = keyValueHtmlData && getDataFromKey(mainKey, 'page1_htmldata', suffix, keyValueHtmlData);

    const tempData = keyValueJsonData && getDataFromKey(mainKey, 'page1_tempdata', suffix, keyValueJsonData);

    const rainFallData = keyValueJsonData && getDataFromKey(mainKey, 'page1_rainfalldata', suffix, keyValueJsonData);

    return (
        <div className={styles.vrSideBar}>
            <div className="mainTitleDiv">
                {htmlData && htmlData.value && (
                    ReactHtmlParser(htmlData.value)

                )}
            </div>
            <div className={styles.climateChart}>
                <p style={{ marginBottom: '0px', marginTop: '5px', fontWeight: 'bold' }}> Temperature</p>
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
                                    <Tooltip content={RenderLegend} />
                                    {/* <Line type="monotone" dataKey="Max" stroke="#ffbf00" strokeWidth={5} /> */}
                                    <Line type="monotone" dataKey="Average Temperature" stroke="#00d725" strokeWidth={5} />
                                    {/* <Line type="monotone" dataKey="Min" stroke="#347eff" strokeWidth={5} /> */}
                                </LineChart>
                            </ResponsiveContainer>
                        )
                    }
                </div>
            </div>
            <div className={styles.climateChart}>
                <p style={{ marginBottom: '0px', marginTop: '20px', fontWeight: 'bold' }}> Rainfall</p>
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
                                    <Tooltip content={RenderLegendRainfall} />
                                    <Line type="monotone" dataKey="Average Rainfall" stroke="#ffbf00" strokeWidth={5} />

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
