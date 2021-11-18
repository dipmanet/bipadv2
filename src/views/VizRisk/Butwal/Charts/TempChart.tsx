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

export default function TempChart(props) {
    const { tempChartData, renderLegend, CustomTooltip } = props;

    return (
        <div>
            <ResponsiveContainer
                className={styles.chartContainer}
                width="100%"
                height={350}
            >
                <LineChart
                    margin={{ top: 5, right: 2, left: 15, bottom: 20 }}
                    data={tempChartData}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        interval="preserveStart"
                        tick={{ fill: '#94bdcf' }}
                    />
                    <YAxis
                        unit={'℃'}
                        axisLine={false}
                        domain={[0, 40]}
                        // padding={{ top: 20 }}
                        tick={{ fill: '#94bdcf' }}
                        tickCount={10}
                        interval="preserveEnd"
                        allowDataOverflow
                    />
                    <Legend
                        iconType="square"
                        iconSize={10}
                        align="center"
                        content={renderLegend}
                    />
                    <Tooltip content={CustomTooltip} />
                    <Line type="monotone" dataKey="Max" stroke="#ffbf00" />
                    <Line type="monotone" dataKey="Avg" stroke="#00d725" />
                    <Line type="monotone" dataKey="Min" stroke="#347eff" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
