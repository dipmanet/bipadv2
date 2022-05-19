/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Legend,
    Label,
} from 'recharts';
import styles from './styles.scss';

interface Props {
    barTitle?: string;
    barData: object[];
}

const CommonBarChart = (props: Props) => {
    const { barTitle, barData } = props;
    return (
        <div className={styles.mainBarChart}>
            <h3 className={styles.barTitle}>{barTitle}</h3>
            <ResponsiveContainer
                width={'100%'}
                height={400}
            >
                <BarChart
                    width={200}
                    height={400}
                    data={barData}
                    layout="vertical"
                    margin={{ left: 45, bottom: 25 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.5} />
                    <XAxis type="number" tick={{ fill: '#94bdcf' }}>
                        <Label
                            value="Number of households"
                            offset={-10}
                            position="insideBottom"
                            style={{
                                textAnchor: 'middle',
                                fill: 'rgba(255, 255, 255, 0.87)',
                                // margin: '10px',
                            }}
                        />
                    </XAxis>
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: '#94bdcf' }}
                    />
                    {/* <Tooltip
                        cursor={{ fill: '#1c333f' }}
                    /> */}
                    <Bar
                        dataKey="count"
                        fill="#a8fffb"
                        barSize={15}
                    // tick={{ fill: '#94bdcf' }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CommonBarChart;
