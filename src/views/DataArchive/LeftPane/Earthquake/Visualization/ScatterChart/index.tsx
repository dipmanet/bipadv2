import React from 'react';
import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import * as PageType from '#store/atom/page/types';
import { getTemporals } from '../utils';
import { saveChart } from '#utils/common';
import Button from '#rsca/Button';

import styles from './styles.scss';

interface EarthquakeWithTemporals extends PageType.DataArchiveEarthquake {
    temporalYear: string;
    temporalMonth: string;
    temporalWeek: string;
}
interface Props {
    earthquakeList: PageType.DataArchiveEarthquake[];
    chartTitle?: string;
    downloadId: string;
}


const withTemporalList = (earthquakeList: PageType.DataArchiveEarthquake[]) => {
    const withTemporals = (earthquakeList.map((earthquakeItem) => {
        const { eventOn } = earthquakeItem;
        const [year, month, week] = getTemporals(eventOn);
        return {
            ...earthquakeItem,
            temporalYear: `${year} ${month}`,
            temporalMonth: `${month}`,
            temporalWeek: `${week}`,
        };
    }));
    return withTemporals;
};

const DEFAULT_CHART_TITLE = 'Occurence Statictics';

const handleSaveClick = (downloadId: string) => {
    saveChart(downloadId || 'chartIdBipad', downloadId || 'chartIdBipad');
};

const ScatterChartViz = (props: Props) => {
    const { earthquakeList, chartTitle, downloadId } = props;
    const earthquakeWithTemporals = withTemporalList(earthquakeList);
    const sortedEarthquakeWithTemporals = earthquakeWithTemporals.sort(
        (a, b) => (a.eventOn < b.eventOn ? -1 : 1),
    );
    return (
        <div className={styles.visualizations}>
            <div
                className={styles.hazardStatisticsChart}
            >
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        {chartTitle || DEFAULT_CHART_TITLE}
                    </h4>
                    <Button
                        title="Download Chart"
                        className={styles.chartDownload}
                        transparent
                        onClick={() => handleSaveClick(downloadId)}
                        iconName="download"
                    />
                </header>
                <div
                    className={styles.chart}
                    id={downloadId}
                    style={{
                        height: `${earthquakeWithTemporals.length * 20}px`,
                        minHeight: '320px',
                    }}
                >
                    <ResponsiveContainer className={styles.container}>
                        <ScatterChart
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                            <YAxis
                                type="category"
                                dataKey={'temporalYear'}
                                allowDuplicatedCategory={false}
                                name="Date"
                            />
                            <XAxis
                                type="number"
                                dataKey={'magnitude'}
                                name="Magnitude"
                                unit=" ML"
                                domain={[4, 'auto']}
                                interval={0}
                                allowDecimals={false}
                            />
                            <ZAxis dataKey={'magnitude'} range={[30, 500]} />
                            <CartesianGrid />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            {/* <Legend /> */}
                            <Scatter
                                name="A
                                school"
                                data={sortedEarthquakeWithTemporals}
                                fill="#8884d8"
                                shape="circle"
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ScatterChartViz;
