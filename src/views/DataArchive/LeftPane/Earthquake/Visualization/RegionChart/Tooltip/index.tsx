import React from 'react';

import styles from './styles.scss';


interface TooltipPayload {
    dataKey: string;
    name: string;
    value: number | string;
}

interface TooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}

const getTotalCount = (payload: TooltipPayload[]) => {
    const values: number[] = [];
    payload.forEach(p => values.push(Number(p.value)));

    // return sum of numbers
    return values.reduce((a, b) => a + b, 0);
};

const farmatLabels = (name: string, value: string | number) => {
    switch (name) {
        case 'mag4':
            return {
                name: 'Light',
                color: '#fcbba1',
                value,
            };
        case 'mag5':
            return {
                name: 'Moderate',
                color: '#fc9272',
                value,
            };
        case 'mag6':
            return {
                name: 'Strong',
                color: '#fb6a4a',
                value,
            };
        case 'mag7':
            return {
                name: 'Major',
                color: '#de2d26',
                value,
            };
        case 'mag8':
            return {
                name: 'Great',
                color: '#a50f15',
                value,
            };
        default:
            return null;
    }
};

const getSubLabels = (payload: TooltipPayload[]) => {
    const subLabels: any[] = [];
    payload.forEach((p) => {
        const { name, value } = p;
        subLabels.push(farmatLabels(name, value));
    });
    return subLabels;
};

const Tooltip = (props: TooltipProps) => {
    const { active, label, payload } = props;
    if (active && payload) {
        const subLabels = getSubLabels(payload);
        return (
            <div className={styles.tooltip}>
                <div className={styles.label}>
                    <b>{label}</b>
                </div>
                {subLabels.length > 0 && subLabels.map((subLabel) => {
                    const { name, value, color } = subLabel;
                    return (
                        <div className={styles.subLabel} key={name}>
                            <span className={styles.name}>
                                { name }
                            </span>
                            <div
                                className={styles.box}
                                style={
                                    { backgroundColor: `${color}` }
                                }
                            />
                            <span className={styles.value}>
                                {`: ${value}`}
                            </span>
                        </div>
                    );
                })}
                <div className={styles.totalCount}>
                    {`Total Count: ${payload && getTotalCount(payload)}`}
                </div>
            </div>
        );
    }
    return null;
};

export default Tooltip;
