/* eslint-disable no-restricted-globals */
import React from 'react';

import { getDate, getTimeWithIndictor, getDateWithRange } from '#views/DataArchive/utils';
import styles from './styles.scss';


interface Payload {
    key: string;
    label: string;
    measuredOn: string;
    oneHourMin: number;
    oneHourAvg: number;
    oneHourMax: number;
    threeHourMin: number;
    threeHourAvg: number;
    threeHourMax: number;
    sixHourMin: number;
    sixHourAvg: number;
    sixHourMax: number;
    twelveHourMin: number;
    twelveHourAvg: number;
    twelveHourMax: number;
    twentyFourHourMin: number;
    twentyFourHourAvg: number;
    twentyFourHourMax: number;
    [key: string]: string | number;
}
interface TooltipPayload {
    dataKey: string;
    name: string;
    value: number | string;
    payload: Payload;
}

interface TooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
    periodCode?: string;
    intervalCode?: string;
}

const getIntervalwiseAverage = (intervalCode: string, payload: Payload) => {
    const average = payload[`${intervalCode}Avg`];
    return average;
};
const getIntervalwiseMin = (intervalCode: string, payload: Payload) => {
    const average = payload[`${intervalCode}Min`];
    return average;
};
const getIntervalwiseMax = (intervalCode: string, payload: Payload) => {
    const average = payload[`${intervalCode}Max`];
    return average;
};
const emptyObject = {};
const Tooltip = (props: TooltipProps) => {
    const { active, label, payload, periodCode, intervalCode } = props;
    if (active && label && payload) {
        const { payload: innerPayload } = payload[0] || emptyObject;
        let measuredOn;
        let date;
        let time;
        let dateTimeForHourly;
        if (periodCode !== 'monthly') {
            measuredOn = innerPayload.measuredOn;
            date = getDate(measuredOn);
            time = getTimeWithIndictor(measuredOn);
            dateTimeForHourly = getDateWithRange(measuredOn);
        }
        // const minuteWise = periodCode === 'minute';

        // const dateTimeForMinuteWise = `${date} ${time}`;

        // const min = getIntervalwiseMin(intervalCode || '', innerPayload);
        // const max = getIntervalwiseMax(intervalCode || '', innerPayload);
        // const average = getIntervalwiseAverage(intervalCode || '', innerPayload);
        if (periodCode === 'hourly') {
            return (
                <div className={styles.tooltip}>
                    <div className={styles.value}>
                        <b>Date: </b>
                        {dateTimeForHourly}
                    </div>
                    <div className={styles.value}>
                        <b>Accumulated Rain: </b>
                        {(innerPayload.accHourly === null || isNaN(Number(innerPayload.accHourly))) ? 'N/A' : `${innerPayload.accHourly.toFixed(2)} mm`}
                    </div>
                    <div className={styles.value}>
                        <b>Cumulative Rain: </b>
                        {(innerPayload.cumulativeHourData === null || isNaN(Number(innerPayload.cumulativeHourData))) ? 'N/A' : `${innerPayload.cumulativeHourData.toFixed(2)} mm`}
                    </div>

                </div>
            );
        }
        if (periodCode === 'daily') {
            return (
                <div className={styles.tooltip}>
                    <div className={styles.value}>
                        <b>Date: </b>
                        {date}
                    </div>
                    <div className={styles.value}>
                        <b>Accumulated Rain: </b>
                        {(innerPayload.accDaily === null || isNaN(Number(innerPayload.accDaily))) ? 'N/A' : `${innerPayload.accDaily.toFixed(2)} mm`}
                    </div>
                    <div className={styles.value}>
                        <b>Cumulative Rain: </b>
                        {(innerPayload.cumulativeDailyData === null || isNaN(Number(innerPayload.cumulativeDailyData))) ? 'N/A' : `${innerPayload.cumulativeDailyData.toFixed(2)} mm`}
                    </div>

                </div>
            );
        }
        if (periodCode === 'monthly') {
            return (
                <div className={styles.tooltip}>
                    <div className={styles.value}>
                        <b>Date: </b>
                        {innerPayload.yearMth}
                    </div>
                    <div className={styles.value}>
                        <b>Accumulated Rain: </b>
                        {(innerPayload.accMonthly === null || isNaN(Number(innerPayload.accMonthly))) ? 'N/A' : `${innerPayload.accMonthly.toFixed(2)} mm`}
                    </div>
                    <div className={styles.value}>
                        <b>Cumulative Rain: </b>
                        {(innerPayload.cumulativeMonthlyData === null || isNaN(Number(innerPayload.cumulativeMonthlyData))) ? 'N/A' : `${innerPayload.cumulativeMonthlyData.toFixed(2)} mm`}
                    </div>

                </div>
            );
        }
    }
    return null;
};

export default Tooltip;
