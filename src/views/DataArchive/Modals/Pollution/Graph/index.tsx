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
    filterWiseChartData?: ChartData[];
    parameterCode?: string;
}
const Graph = (props: Props) => {
    const { stationData, filterWiseChartData, parameterCode } = props;
    const code = parameterCode ? parameterCode.replace('.', '') : '';
    if (stationData.length === 0) {
        return (
            <NoData />
        );
    }
    return (
        <div
            className={styles.chart}
        // id={downloadId}
        >
            <ResponsiveContainer className={styles.container}>
                <BarChart
                    data={filterWiseChartData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={code} fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Graph;
