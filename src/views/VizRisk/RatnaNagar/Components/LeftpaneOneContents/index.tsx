import React from 'react';
import { CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis } from 'recharts';

import styles from '../styles.scss';

const LeftPaneOneContents = () => (
    <div className={styles.vrSideBar}>
        <div className={styles.leftTopBar} />
        <h1> Ratnanagar Rural Municipality</h1>
        <p>
                Ratnanagar  Municipality is located in Sindhupalchok
                district of Bagmati province. The rural municipality
                has 7 wards covering a total area of 592 sq. km and
                is situated at an elevation of 800 m to 7000m AMSL.

        </p>
        <div className={styles.climateChart}>
            <p style={{ marginBottom: '0px', marginTop: '30px', fontWeight: 'bold' }}> Temperature</p>
            <ResponsiveContainer className={styles.chartContainer} height={300}>
                <LineChart
                    margin={{ top: 0, right: 10, left: 10, bottom: 10 }}
                    // data={lineData}
                >
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                    />
                    <XAxis
                        dataKey="name"
                        interval="preserveStart"
                        tick={{ fill: '#94bdcf' }}
                    />
                    <YAxis
                        unit={'℃'}
                        axisLine={false}
                        domain={[0, 40]}
                        padding={{ top: 20 }}
                        tick={{ fill: '#94bdcf' }}
                        tickCount={10}
                        interval="preserveEnd"
                        allowDataOverflow
                    />
                    <Legend iconType="square" iconSize={10} align="center" />
                    <Tooltip />
                    <Line type="monotone" dataKey="Max" stroke="#ffbf00" />
                    <Line type="monotone" dataKey="Avg" stroke="#00d725" />
                    <Line type="monotone" dataKey="Min" stroke="#347eff" />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className={styles.climateChart}>
            <p style={{ marginBottom: '0px', marginTop: '30px', fontWeight: 'bold' }}> Rainfall</p>
            <ResponsiveContainer className={styles.chartContainer} height={300}>
                <LineChart
                    margin={{ top: 0, right: 10, left: 10, bottom: 10 }}
                    // data={rainfallData}
                >
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                    />
                    <XAxis
                        dataKey="name"
                        interval="preserveStart"
                        tick={{ fill: '#94bdcf' }}
                    />
                    <YAxis
                        unit={'mm'}
                        axisLine={false}
                        domain={[0, 1150]}
                        padding={{ top: 20 }}
                        tick={{ fill: '#94bdcf' }}
                        tickCount={10}
                        interval="preserveEnd"
                        allowDataOverflow
                    />
                    <Legend iconType="square" iconSize={10} align="center" />
                    <Tooltip />
                    <Line type="monotone" dataKey="Rainfall" stroke="#ffbf00" />

                </LineChart>
            </ResponsiveContainer>

        </div>
    </div>

);


export default LeftPaneOneContents;
