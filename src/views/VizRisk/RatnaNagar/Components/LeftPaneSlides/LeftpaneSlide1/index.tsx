import React from 'react';
import { CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis } from 'recharts';

import styles from './styles.scss';

const LeftpaneSlide1 = () => {
    const lineData = [
        {
            Max: 20.4, Min: 5.8, Avg: 13.1, name: 'Jan',
        },
        {
            Max: 23.4, Min: 7.6, Avg: 15.5, name: 'Feb',
        },
        {
            Max: 26, Min: 10.7, Avg: 18.35, name: 'Mar',
        },
        {
            Max: 30.5, Min: 12.7, Avg: 21.6, name: 'Apr',
        },
        {
            Max: 30.9, Min: 16.4, Avg: 23.65, name: 'May',
        },
        {
            Max: 31.2, Min: 20.8, Avg: 26, name: 'Jun',
        },
        {
            Max: 29.3, Min: 21.2, Avg: 25.25, name: 'Jul',
        },
        {
            Max: 32, Min: 21.4, Avg: 26.7, name: 'Aug',
        },
        {
            Max: 31.3, Min: 20.2, Avg: 25.75, name: 'Sep',
        },
        {
            Max: 32.1, Min: 18.2, Avg: 25.15, name: 'Oct',
        },
        {
            Max: 26.4, Min: 8.3, Avg: 17.35, name: 'Nov',
        },
        {
            Max: 23.6, Min: 4, Avg: 13.8, name: 'Dec',
        },
    ];

    return (
        <div className={styles.vrSideBar}>
            <h1> Ratnanagar Rural Municipality</h1>
            <p>
                Ratnanagar  Municipality is located in Sindhupalchok
                district of Bagmati province. The rural municipality
                has 7 wards covering a total area of 592 sq. km and
                is situated at an elevation of 800 m to 7000m AMSL.

            </p>
            <p>
                Ratnanagar  Municipality is located in Sindhupalchok
                district of Bagmati province. The rural municipality
                has 7 wards covering a total area of 592 sq. km and
                is situated at an elevation of 800 m to 7000m AMSL.

            </p>
            <p>
                Ratnanagar  Municipality is located in Sindhupalchok
                district of Bagmati province. The rural municipality
                has 7 wards covering a total area of 592 sq. km and
                is situated at an elevation of 800 m to 7000m AMSL.

            </p>
            <div className={styles.climateChart}>
                <p style={{ marginBottom: '0px', marginTop: '30px', fontWeight: 'bold' }}> Temperature</p>
                <div className={styles.mainLineChart}>
                    <ResponsiveContainer className={styles.chartContainer} height={300}>
                        <LineChart
                            margin={{ top: 0, right: 5, left: 30, bottom: 10 }}
                            data={lineData}
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
                            <Tooltip />
                            <Line type="monotone" dataKey="Max" stroke="#ffbf00" strokeWidth={5} />
                            <Line type="monotone" dataKey="Avg" stroke="#00d725" strokeWidth={5} />
                            <Line type="monotone" dataKey="Min" stroke="#347eff" strokeWidth={5} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className={styles.climateChart}>
                <p style={{ marginBottom: '0px', marginTop: '30px', fontWeight: 'bold' }}> Rainfall</p>
                <div className={styles.mainLineChart}>
                    <ResponsiveContainer className={styles.chartContainer} height={300}>
                        <LineChart
                            margin={{ top: 0, right: 5, left: 30, bottom: 10 }}
                            data={lineData}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis
                                dataKey="name"
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
                            <Tooltip />
                            <Line type="monotone" dataKey="Max" stroke="#ffbf00" strokeWidth={5} />

                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};


export default LeftpaneSlide1;
