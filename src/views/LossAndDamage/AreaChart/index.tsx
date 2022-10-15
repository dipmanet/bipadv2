/* eslint-disable max-len */
/* eslint-disable react/jsx-no-undef */
import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import Button from '#rsca/Button';
import styles from './styles.scss';
import { returnValueByDropdown } from '../utils/utils';

interface Data {
    incidentMonthTimestamp: string;
    summary: {
        count: number;
        estimatedLoss: number;
        infrastructureDestroyedCount: number;
        livestockDestroyedCount: number;
        peopleDeathCount: number;
        peopleInjuredCount: number;
        peopleMissingCount: number;
    };
}
interface BarchartProps {
    data: Data[];
    selectOption: {
        name: string;
        key: string;
    };
    handleSaveClick: (id: string, fileName: string) => void;
    downloadButton?: boolean;
}

interface TooltipInterface {
    active: boolean;
    payload: {
        value: number;
        name: string;
    }[];
}


const AreaChartVisual = (props: BarchartProps) => {
    const { selectOption: { name, key },
        data,
        handleSaveClick,
        downloadButton } = props;

    const chartData = data.map((item) => {
        const date = new Date();
        date.setTime(parseInt(item.incidentMonthTimestamp, 10));
        const year = date.getFullYear();
        const month = date.getMonth();
        const finalDate = `${year}-${month}`;
        const obj = {
            date: finalDate,
            [name]: item.summary[key],
        };
        return obj;
    });

    const CustomizedTick = (value: number) => returnValueByDropdown(name, value);

    function CustomTooltip({ payload, active }: TooltipInterface) {
        if (payload && active && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <span className={styles.label}>
                        {
                            `${payload[0].name}:${payload[0].value}`
                        }

                    </span>
                </div>
            );
        }
        return null;
    }


    return (
        <div className={styles.wrapper}>
            <div className={styles.firstDiv}>
                <p className={styles.text}>
                    Temporal distribution of
                    {' '}
                    {name}
                </p>
                {
                    downloadButton
                    && (
                        <Button
                            title="Download Chart"
                            className={styles.downloadButton}
                            transparent
                            // disabled={pending}
                            onClick={() => handleSaveClick('areaChart', 'areaChart')}
                            iconName="download"
                        />
                    )
                }


            </div>
            <div className={styles.areaChart} id="areaChart">
                {
                    chartData && (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                width={500}
                                height={200}
                                data={chartData}
                                margin={{
                                    top: 5,
                                    bottom: 45,
                                    left: -20,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#db6e51" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#db6e51" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid stroke="#ccc" horizontal vertical={false} />
                                <XAxis
                                    tickLine={false}
                                    dataKey="date"
                                    dy={15}
                                    angle={-30}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={CustomizedTick}
                                />
                                <Tooltip
                                    content={CustomTooltip}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={name}
                                    stroke="#db6e51"
                                    fillOpacity={1}
                                    fill="url(#colorUv)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )
                }
            </div>
        </div>
    );
};

export default AreaChartVisual;
