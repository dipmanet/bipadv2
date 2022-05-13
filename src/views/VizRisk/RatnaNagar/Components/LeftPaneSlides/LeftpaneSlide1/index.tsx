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

const LeftpaneSlide1 = () => {
    const {
        keyValueHtmlData,
        keyValueJsonData,
    } = useContext(MainPageDataContext);
    const htmlData = keyValueHtmlData && keyValueHtmlData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page1_htmldata_301_3_35_35007',
    )[0];
    const tempData = keyValueJsonData && keyValueJsonData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page1_tempdata_301_3_35_35007',
    )[0];
    const rainFallData = keyValueJsonData && keyValueJsonData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page1_rainfalldata_301_3_35_35007',
    )[0];

    const renderLegend = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: 'transparent' }}>
                    <h2 style={{ margin: 0, fontSize: 14 }}>{payload[0].payload.name}</h2>
                    {/* {payload[0].payload.Max
						&& <p>{`Maximum: ${payload[0].payload.Max} ℃`}</p>
					} */}
                    <p style={{ margin: 0, fontSize: 14, color: '#00d725' }}>{`Average: ${payload[0].payload.Avg} ℃`}</p>
                    {/* {payload[0].payload.Min
						&& <p>{`Minimum: ${payload[0].payload.Min} ℃`}</p>
					} */}
                </div>
            );
        }
        return null;
    };
    const renderLegendRainfall = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: 'transparent' }}>
                    <h2 style={{ margin: 0, fontSize: 14 }}>{payload[0].payload.month}</h2>
                    {/* {payload[0].payload.Max
						&& <p>{`Maximum: ${payload[0].payload.Max} ℃`}</p>
					} */}
                    <p style={{ margin: 0, fontSize: 14, color: '#ffbf00' }}>{`Average: ${payload[0].payload.Averagerainfall} mm`}</p>
                    {/* {payload[0].payload.Min
						&& <p>{`Minimum: ${payload[0].payload.Min} ℃`}</p>
					} */}
                </div>
            );
        }
        return null;
    };
    return (
        <div className={styles.vrSideBar}>
            <div className="mainTitleDiv">
                {htmlData && htmlData.value && (
                    ReactHtmlParser(htmlData.value)

                )}
            </div>
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
                                    <Tooltip content={renderLegend} />
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
                                    <Tooltip content={renderLegendRainfall} />
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
