import React from 'react';

import styles from './styles.scss';

interface Payload {
    dateTime: string;
    key: string;
    label: string;
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
}

const isHourlySelected = (label: string) => label.includes('AM') || label.includes('PM');

const getDates = (dateTime: string, label: string) => {
    const date = dateTime.split('T')[0];
    const year = date.split('-')[0];
    return isHourlySelected(label) ? date : year;
};

const getAqiTraits = (aqi: number) => {
    if (aqi <= 50) {
        return { remark: 'Good', color: '#00fa2f' };
    }
    if (aqi <= 100) {
        return { remark: 'Moderate', color: '#f7ff00' };
    }
    if (aqi <= 150) {
        return { remark: 'Unhealthy for Sensitive Groups', color: '#ff7300' };
    }
    if (aqi <= 200) {
        return { remark: 'Unhealthy', color: '#ff0000' };
    }
    if (aqi <= 300) {
        return { remark: 'Very Unhealthy', color: '#9e0095' };
    }
    if (aqi <= 400) {
        return { remark: 'Hazardous', color: '#8a0014' };
    }
    if (aqi > 400) {
        return { remark: 'Very Hazardous', color: '#8a0014' };
    }
    return { remark: 'Good', color: '#00fa2f' };
};

const emptyObject = {};
const Tooltip = (props: TooltipProps) => {
    const { active, label, payload } = props;
    if (active && label && payload) {
        const { payload: innerPayload, name, value } = payload[0] || emptyObject;
        const { dateTime } = innerPayload;
        const date = getDates(dateTime, label);
        let remark = '';
        let color = '';
        if (name === 'AQI') {
            const { remark: remarkValue, color: colorValue } = getAqiTraits(Number(value));
            remark = remarkValue;
            color = colorValue;
        }
        return (
            <div className={styles.tooltip}>
                <div className={styles.value}>
                    <b>Date: </b>
                    {`${date} ${label}`}
                </div>
                <div className={styles.value}>
                    <b>{`${isHourlySelected(label) ? name : `Average ${name}`}: `}</b>
                    {value}
                </div>
                {name === 'AQI' && (
                    <div className={styles.remark}>
                        <b>Remark: </b>
                        <div
                            className={styles.box}
                            style={
                                { backgroundColor: `${color}` }
                            }
                        />
                        {remark}
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export default Tooltip;
