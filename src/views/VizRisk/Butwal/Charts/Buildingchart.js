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
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import styles from '../LeftPane/styles.scss';

export default function BuildingChart(props) {
    const { buildingsChartData } = props;


    const buildingToolTip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <h2>{payload[0].payload.name}</h2>
                    <p>{`Value: ${payload[0].payload.buildingcount}`}</p>
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
                height={130}
            >
                <BarChart
                    width={300}
                    height={100}
                    data={buildingsChartData}
                    layout="vertical"
                    margin={{ left: 15, right: 45, bottom: 25 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fill: '#94bdcf' }}>
                        <Label
                            value="Buildings Count"
                            offset={0}
                            position="insideBottom"
                            style={{
                                textAnchor: 'middle',
                                fill: 'rgba(255, 255, 255, 0.87)',

                            }}
                        />
                    </XAxis>
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: '#94bdcf' }}
                    />
                    {/* <Legend /> */}
                    <Tooltip content={buildingToolTip} cursor={{ fill: '#1c333f' }} />
                    <Bar
                        dataKey="buildingcount"
                        fill="green"
                        barSize={18}
                        tick={{ fill: '#94bdcf' }}
                        radius={[0, 5, 5, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
