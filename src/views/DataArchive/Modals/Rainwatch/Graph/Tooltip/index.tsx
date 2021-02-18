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
        const {
            measuredOn,
        } = innerPayload;
        const minuteWise = periodCode === 'minute';
        const date = getDate(measuredOn);
        const time = getTimeWithIndictor(measuredOn);
        const dateTimeForMinuteWise = `${date} ${time}`;
        const dateTImeForHourly = getDateWithRange(measuredOn);
        const min = getIntervalwiseMin(intervalCode || '', innerPayload);
        const max = getIntervalwiseMax(intervalCode || '', innerPayload);
        const average = getIntervalwiseAverage(intervalCode || '', innerPayload);
        if (minuteWise) {
            return (
                <div className={styles.tooltip}>
                    <div className={styles.value}>
                        <b>Date: </b>
                        {dateTimeForMinuteWise}
                    </div>
                    <div className={styles.value}>
                        <b>Rainfall Amount: </b>
                        {average}
                    </div>
                </div>
            );
        }
        return (
            <div className={styles.tooltip}>
                <div className={styles.value}>
                    <b>Date: </b>
                    {periodCode === 'hourly' ? dateTImeForHourly : date}
                </div>
                <div className={styles.value}>
                    <b>Min Water Level: </b>
                    {min}
                </div>
                <div className={styles.value}>
                    <b>Average Water Level: </b>
                    {average}
                </div>
                <div className={styles.value}>
                    <b>Max Water Level: </b>
                    {max}
                </div>
            </div>
        );
    }
    return null;
};

export default Tooltip;
