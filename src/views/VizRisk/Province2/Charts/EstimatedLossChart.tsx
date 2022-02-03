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

export default function EstimatedLossChart(props) {
    const { estimatedLossData } = props;


    const buildingToolTip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <h2>{payload[0].payload.name}</h2>
                    <p>{`Count: ${payload[0].payload.count}`}</p>
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
                    data={estimatedLossData}
                    layout="vertical"
                    margin={{ left: 15, right: 45, bottom: 25 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={'#436578'} />
                    <XAxis type="number" tick={{ fill: '#94bdcf' }}>
                        <Label
                            value="Estimated Loss"
                            offset={-10}
                            position="insideBottom"
                            style={{
                                textAnchor: 'middle',
                                fill: 'rgba(255, 255, 255, 0.87)',
                                marginTop: 25,

                            }}
                        />
                    </XAxis>
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: '#94bdcf' }}

                    />
                    {/* <Legend /> */}
                    <Tooltip cursor={{ fill: '#1c333f' }} />
                    <Bar
                        dataKey="totalEstimatedLoss"
                        fill="green"
                        barSize={18}
                        tick={{ fill: '#94bdcf' }}
                        radius={[0, 5, 5, 0]}
                    >
                        <LabelList dataKey="value" position="right" />

                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
