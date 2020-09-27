import React from 'react';

import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    LabelList,
    // Tooltip,
} from 'recharts';
import {
    saveChart,
} from '#utils/common';
import Message from '#rscv/Message';
import Button from '#rsca/Button';

import styles from './styles.scss';

interface ChartData {
    label: string | number;
    value: number;
    mag4: number;
    mag5: number;
    mag6: number;
    mag7: number;
    mag8: number;
}

interface Props {
    federalWiseData: ChartData[];
    chartTitle?: string;
}

const handleSaveClick = () => {
    saveChart('earthquakeSummary', 'earthquakeSummary');
};

const DEFAULT_CHART_TITLE = 'Occurence Statictics';

const removeZero = (federalWiseData: ChartData[]) => {
    const cleanData = federalWiseData.map((data) => {
        const keys = ['mag4', 'mag5', 'mag6', 'mag7', 'mag8'];
        keys.forEach((key) => {
            if (data[key] === 0) {
                // eslint-disable-next-line no-param-reassign
                delete data[key];
            }
        });
        return { ...data };
    });
    return cleanData;
};

const bars = [
    { dataKey: 'mag4', stackId: 'magnitude', fill: '#A40E4C' },
    { dataKey: 'mag5', stackId: 'magnitude', fill: '#2C2C54' },
    { dataKey: 'mag6', stackId: 'magnitude', fill: '#A4BAB7' },
    { dataKey: 'mag7', stackId: 'magnitude', fill: '#C57B57' },
    { dataKey: 'mag8', stackId: 'magnitude', fill: '#F49D6E' },
];

const RegionChart = (props: Props) => {
    const { federalWiseData, chartTitle } = props;
    const cleanData = removeZero(federalWiseData);
    if (!federalWiseData || federalWiseData.length === 0) {
        return (
            <div
                className={styles.message}
            >
                <Message>
                        Nothing to display
                </Message>
            </div>
        );
    }

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
                        onClick={handleSaveClick}
                        iconName="download"
                    />
                </header>
                <div
                    className={styles.chart}
                    id="earthquakeSummary"
                >
                    <ResponsiveContainer className={styles.container}>
                        <BarChart
                            layout="vertical"
                            data={cleanData}
                            margin={{ top: 20, right: 10, left: 40, bottom: 5 }}
                        >
                            <YAxis dataKey="label" type="category" />
                            <XAxis
                                dataKey="value"
                                type="number"
                            />
                            {/* <Tooltip cursor={false} /> */}
                            { bars.map((bar) => {
                                const { dataKey, stackId, fill } = bar;
                                return (
                                    <Bar
                                        key={dataKey}
                                        isAnimationActive={false}
                                        dataKey={dataKey}
                                        stackId={stackId}
                                        fill={fill}
                                    >
                                        <LabelList
                                            dataKey={dataKey}
                                            position="center"
                                            angle={0}
                                            className={styles.labelList}
                                        />
                                    </Bar>
                                );
                            }) }
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RegionChart;
