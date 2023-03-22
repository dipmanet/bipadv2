/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import {
    Label,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    LabelList,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import styles from '../LeftPane/styles.scss';
import { customLableList } from '../Functions';

export default function BuildingChart(props) {
    const { buildingsChartData, vulnrerability } = props;


    const customToolTip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <h2>{payload[0].payload.provinceName}</h2>
                    <p>{`${vulnrerability === 'Human Development Index' ? 'HDI' : 'HPI'}: ${payload[0].payload.value}`}</p>
                </div>
            );
        }

        return null;
    };
    return (
        <div>
            <ResponsiveContainer
                // className={styles.respContainer}
                width="100%"
                height={500}
            >
                <BarChart
                    width={300}
                    height={500}
                    data={buildingsChartData}
                    layout="vertical"
                    margin={{ left: 15, right: 45, bottom: 25 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={'#436578'} />
                    <XAxis
                        type="number"
                        tick={{ fill: '#94bdcf' }}
                        domain={vulnrerability === 'Human Poverty Index' ? [dataMin => Math.floor(dataMin - 10), dataMax => Math.floor(dataMax + 5)]
                            : [dataMin => parseFloat(dataMin - 0.1).toFixed(2),
                            // eslint-disable-next-line indent
                            dataMax => parseFloat(dataMax + 0.1).toFixed(2)]
                        }
                    >
                        <Label
                            value={vulnrerability === 'Human Development Index' ? 'HDI Score' : 'HPI Score'}
                            offset={-10}
                            position="insideBottom"
                            style={{
                                textAnchor: 'middle',
                                fill: 'rgba(255, 255, 255, 0.87)',

                            }}
                        />
                    </XAxis>
                    <YAxis
                        type="category"
                        dataKey="provinceName"
                        tick={{ fill: '#94bdcf' }}
                    />
                    {/* <Legend /> */}
                    <Tooltip cursor={{ fill: '#1c333f' }} content={customToolTip} />
                    <Bar
                        dataKey="value"
                        fill="green"
                        barSize={18}
                        tick={{ fill: '#94bdcf' }}
                        radius={[0, 5, 5, 0]}
                    >
                        <LabelList dataKey="value" position="right" content={customLableList} />

                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
