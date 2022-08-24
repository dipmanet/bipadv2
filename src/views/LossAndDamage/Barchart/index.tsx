/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from '#rsca/Button';
import styles from './styles.scss';
import { lossMetrics } from '#utils/domain';
import { nullCheck } from '../../../utils/common';

const BarChartVisual = (props) => {
    const { filter, data, valueOnclick, selectOption, regionRadio, regionWiseBarChartData } = props;

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

    return (
        // <div className={styles.container}>
        <div className={styles.wrapper}>

            <div className={styles.firstDiv}>
                <p className={styles.text}>{`${regionRadio}wise distribution`}</p>
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
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart
                                data={regionWiseBarChartData}
                                margin={{
                                    top: 5,
                                    bottom: 20,
                                    right: 20,
                                }}
                                barSize={20}
                                barCategoryGap={0}
                            >
                                <XAxis
                                    tickLine={false}
                                    dataKey="name"
                                    scale="point"
                                    padding={{ left: 25, right: 0 }}
                                    dy={15}
                                    angle={-30}
                                />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    content={<CustomTooltip />}
                                />
                                <CartesianGrid stroke="#ccc" horizontal vertical={false} />
                                <Bar dataKey="value" fill="#db6e51" />
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
