/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Text } from 'recharts';
import Button from '#rsca/Button';
import styles from './styles.scss';

const BarChartVisual = (props) => {
    const { selectOption, regionRadio, regionWiseBarChartData } = props;

    function CustomTooltip({ payload, active, label }) {
        if (payload && active && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <span className={styles.label}>{payload[0].payload.name}</span>
                    <span className={styles.label}>{`${selectOption.name}:${payload[0].payload.value}`}</span>
                </div>
            );
        }
        return null;
    }

    const CustomizedLabel = (prop) => {
        // eslint-disable-next-line react/prop-types
        const { x, y, payload, dy, dx } = prop;
        return (
            <Text
                dy={dy}
                dx={dx}
                x={x}
                y={y}
                textAnchor="end"
                verticalAnchor="middle"
                fontSize={12}
                angle={-30}
                width={100}
            >
                {payload.value}

            </Text>
        );
    };

    return (
        // <div className={styles.container}>
        <div className={styles.wrapper}>

            <div className={styles.firstDiv}>
                <p className={styles.text}>
                    {
                        regionRadio === 'district' || regionRadio === 'municipality'
                            ? `${regionRadio}wise distribution (Top 10)`
                            : `${regionRadio}wise distribution`
                    }

                </p>
                <Button
                    title="Download Chart"
                    className={styles.downloadButton}
                    transparent
                    // disabled={pending}
                    // onClick={this.handleSaveClick}
                    iconName="download"
                />
            </div>
            <div className={styles.barChart}>
                {
                    regionWiseBarChartData
                    && (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={regionWiseBarChartData}
                                margin={{
                                    top: 5,
                                    bottom: 45,
                                }}
                                barSize={20}
                            >
                                <XAxis
                                    dy={10}
                                    dx={5}
                                    tickLine={false}
                                    dataKey="name"
                                    scale="auto"
                                    padding={{ left: 20, right: 20 }}
                                    interval={0}
                                    tick={<CustomizedLabel />}
                                />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={false}
                                    content={<CustomTooltip />}
                                />
                                <CartesianGrid stroke="#ccc" horizontal vertical={false} />
                                <Bar dataKey="value" fill="#db6e51" minPointSize={3} />
                            </BarChart>
                        </ResponsiveContainer>
                    )
                }
            </div>

        </div>
        // </div>
    );
};

export default BarChartVisual;
