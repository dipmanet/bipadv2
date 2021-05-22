import React from 'react';
import {
    Bar, BarChart,
    CartesianGrid,
    XAxis, YAxis,
} from 'recharts';
import Gt from '#views/PalikaReport/utils';
import Translations from '#views/PalikaReport/Translations';
import styles from './styles.scss';

interface Props{
    chartData: any[];
}

const ReportChart = (props: Props) => {
    const { chartData } = props;
    return (
        <div className={styles.budgetPreviewContainer}>
            <h2>
                <Gt section={Translations.InventoryHeading} />
            </h2>
            <BarChart
                width={350}
                height={200}
                data={chartData}
                layout="vertical"
                margin={{ left: 10, right: 5, top: 10 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    type="number"
                    tick={false}
                />
                <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#777', fontSize: '10px' }}
                />
                <Bar
                    dataKey="Total"
                    fill="rgb(0,164,109)"
                    barCategoryGap={80}
                    label={{ position: 'insideRight', fill: '#fff', fontSize: '10px' }}
                    tick={{ fill: 'rgb(200,200,200)' }}
                    cx={90}
                    cy={105}
                    barSize={20}
                />
            </BarChart>
        </div>
    );
};

export default ReportChart;
