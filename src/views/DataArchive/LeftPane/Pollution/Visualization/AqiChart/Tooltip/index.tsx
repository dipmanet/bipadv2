import React from 'react';

import styles from './styles.scss';


interface TooltipPayload {
    dataKey: string;
    name: string;
    value: number | string;
    color: string;
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

const farmatLabels = (name: string, value: string | number, color: string) => {
    switch (name) {
        case 'good':
            return {
                name: 'Good (0 - 50)',
                color,
                value,
            };
        case 'moderate':
            return {
                name: 'Moderate (51 - 100)',
                color,
                value,
            };
        case 'unhealthyForSensitive':
            return {
                name: 'Unhealthy for Sensitive Groups (101 -150)',
                color,
                value,
            };
        case 'unhealthy':
            return {
                name: 'Unhealth (151 - 200)',
                color,
                value,
            };
        case 'veryUnhealthy':
            return {
                name: 'Very Unhealthy (201 - 300)',
                color,
                value,
            };
        case 'hazardous':
            return {
                name: 'Hazardous (301 - 400)',
                color,
                value,
            };
        case 'veryHazardous':
            return {
                name: 'Very Hazardous (>400)',
                color,
                value,
            };
        default:
            return null;
    }
};

const getSubLabels = (payload: TooltipPayload[]) => {
    const subLabels: any[] = [];
    payload.forEach((p) => {
        const { name, value, color } = p;
        subLabels.push(farmatLabels(name, value, color));
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
                                style={{ backgroundColor: `${color}` }}
                            />
                            <span className={styles.value}>
                                {`: ${value}`}
                            </span>
                        </div>
                    );
                })}
                <div className={styles.totalCount}>
                    {`Total Days: ${payload && getTotalCount(payload)}`}
                </div>
            </div>
        );
    }
    return null;
};

export default Tooltip;
