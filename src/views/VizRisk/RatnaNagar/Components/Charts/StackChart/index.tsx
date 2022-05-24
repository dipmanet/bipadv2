import React from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styles from './styles.scss';

interface BarData {
    'Very High'?: number;
    High?: number;
    Medium?: number;
    Low?: number;
    'Very Low'?: number;
}

interface Props {
    stackBarChartTitle: string;
    dataArr: any;
}

const StackChart = (props: Props) => {
    const { stackBarChartTitle, dataArr } = props;
    return (
        <div className={styles.stackChart}>
            <h2 className={styles.stackTitle}>{stackBarChartTitle}</h2>
            <ResponsiveContainer height={80} width={'100%'}>
                <BarChart
                    layout="vertical"
                    data={dataArr.chartData}
                    height={80}
                    stackOffset="expand"
                    margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <XAxis hide type="number" />
                    <YAxis type="category" dataKey="name" stroke="#FFFFFF" hide />
                    <Legend iconType="circle" margin={{ top: 0, left: 0, right: 10, bottom: -10 }} align="left" />
                    <Bar dataKey={dataArr.dataKeyName[0]} fill="#e75d4f" stackId="a" radius={[4, 0, 0, 4]} />
                    <Bar dataKey={dataArr.dataKeyName[1]} fill="#e79546" stackId="a" />
                    <Bar dataKey={dataArr.dataKeyName[2]} fill="#2af5ac" stackId="a" />
                    <Bar dataKey={dataArr.dataKeyName[3]} fill="#45c4fe" stackId="a" />
                    <Bar dataKey={dataArr.dataKeyName[4]} fill="#457ded" stackId="a" radius={[0, 4, 4, 0]} />
                    <Tooltip cursor={{ fill: '#00000050' }} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};


export default StackChart;
