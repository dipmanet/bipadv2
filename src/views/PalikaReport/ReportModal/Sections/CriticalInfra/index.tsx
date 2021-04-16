import React from 'react';
import { ComposedChart,
    Line,
    Area,
    Bar,
    YAxis,
    XAxis,
    CartesianGrid,
    Legend,
    Scatter,
    ResponsiveContainer,
    BarChart } from 'recharts';
import styles from './styles.scss';
import chartData from './chartData';

interface Props{
    width: string;
    height?: string;

}

const CriticalInfra = (props: Props) => {
    const { width, height } = props;
    return (
        <>
            <p><strong>Critical Infrastructure at the Municipality</strong></p>
            <ResponsiveContainer width={width} height={height}>
                <BarChart
                    width={300}
                    height={600}
                    data={chartData.criticalInfra}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: '#94bdcf' }}
                    />
                    {/* <Tooltip /> */}
                    {/* <Legend /> */}
                    <Bar dataKey="Rent" stackId="a" fill="#8884d8" />
                    <Bar dataKey="Own-Building" stackId="a" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>

        </>
    );
};

export default CriticalInfra;
