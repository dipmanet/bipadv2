import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Label,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function CIChart(props) {
    const { cIChartData, landCoverCustomTooltip } = props;
    return (
        <div>
            <ResponsiveContainer

                width="100%"
                height={'60%'}
            >
                <BarChart
                    width={200}
                    height={700}
                    data={cIChartData}
                    layout="vertical"
                    margin={{ left: 15, right: 25 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fill: '#94bdcf' }}>
                        <Label
                            value="Critical Infrastructures"
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
                    <Tooltip
                        content={landCoverCustomTooltip}
                        cursor={{ fill: '#1c333f' }}
                    />
                    <Bar
                        dataKey="value"
                        fill="rgb(0,219,95)"
                        barSize={15}
                  // label={{ position: 'right', fill: '#ffffff' }}
                        tick={{ fill: '#94bdcf' }}
                        radius={[0, 15, 15, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
