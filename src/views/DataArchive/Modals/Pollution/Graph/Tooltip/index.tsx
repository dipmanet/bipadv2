import React from 'react';

import styles from './styles.scss';

interface Payload {
    createdOn: string;
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

const getDates = (createdOn: string, label: string) => {
    const date = createdOn.split('T')[0];
    const year = date.split('-')[0];
    return isHourlySelected(label) ? date : year;
};

const emptyObject = {};
const Tooltip = (props: TooltipProps) => {
    const { active, label, payload } = props;
    if (active && label && payload) {
        const { payload: innerPayload, name, value } = payload[0] || emptyObject;
        const { createdOn } = innerPayload;
        const date = getDates(createdOn, label);
        return (
            <div className={styles.tooltip}>
                <div className={styles.value}>
                    <b>Date: </b>
                    {`${date} ${label}`}
                </div>
                <div className={styles.value}>
                    <b>{`${name}: `}</b>
                    {value}
                </div>
            </div>
        );
    }
    return null;
};

export default Tooltip;
