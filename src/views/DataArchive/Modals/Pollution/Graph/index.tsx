import React from 'react';
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    LabelList,
    Legend,
    Tooltip,
    CartesianGrid,
} from 'recharts';
import { ArchivePollution, ChartData } from '../types';

import NoData from '../NoData';
import styles from './styles.scss';

interface Props {
    stationData: ArchivePollution[];
    hourlyChartData: ChartData[];
}
const Graph = (props: Props) => {
    const { stationData, hourlyChartData } = props;
    if (stationData.length === 0) {
        return (
            <NoData />
        );
    }

    return (
        <div
            className={styles.chart}
        // id={downloadId}
            style={{
                height: `${stationData.length * 50}px`,
                minHeight: '320px',
            }}
        >
            <ResponsiveContainer className={styles.container}>
                <BarChart
                    data={hourlyChartData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis />
                    <XAxis dataKey="label" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="PM1_I" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Graph;
