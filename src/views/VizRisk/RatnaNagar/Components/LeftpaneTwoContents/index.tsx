import React from 'react';
import { Bar, BarChart, CartesianGrid,
    Label,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis } from 'recharts';

import styles from '../styles.scss';

const LeftPaneTwoContents = () => (
    <div className={styles.vrSideBar}>
        <div className={styles.leftTopBar} />
        <h1>Landcover</h1>
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

        <ResponsiveContainer
            // className={styles.respContainer}
            // width="100%"
            height={600}
        >
            <BarChart
                width={300}
                height={600}
                // data={landCoverData}
                layout="vertical"
                margin={{ left: 15, right: 45, bottom: 25 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: '#94bdcf' }}>
                    <Label
                        value="Coverage in Square Km"
                        offset={0}
                        position="insideBottom"
                        style={{
                            textAnchor: 'middle',
                            fill: 'rgba(255, 255, 255, 0.87)',
                            // margin: '10px',
                        }}
                    />
                </XAxis>


                <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#94bdcf' }}
                />
                {/* <Legend /> */}
                <Tooltip
                    // content={landCoverCustomTooltip}
                    cursor={{ fill: '#1c333f' }}
                />
                <Bar
                    dataKey="value"
                    fill="red"
                    barSize={22}
                  // label={{ position: 'right', fill: '#ffffff' }}
                    // tick={{ fill: '#94bdcf' }}
                    radius={[0, 5, 5, 0]}
                >
                    {/* {landCoverData.map((entry, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))} */}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>

);


export default LeftPaneTwoContents;
