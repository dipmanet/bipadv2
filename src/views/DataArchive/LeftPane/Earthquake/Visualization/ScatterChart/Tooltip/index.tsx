import React from 'react';

import styles from './styles.scss';

type TooltipNames = 'Magnitude' | 'Date' | 'Score';
interface TooltipPayload {
    dataKey: string;
    name: TooltipNames;
    unit: string;
    value: number | string;
}

interface TooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
}

const Tooltip = (props: TooltipProps) => {
    const { active, payload } = props;
    let tooltipPayload;
    if (active) {
        tooltipPayload = payload && payload.filter(p => p.name !== 'Score');
        return (
            <div className={styles.tooltip}>
                <p>
                    <b>Magnitude: </b>
                    {`${tooltipPayload && tooltipPayload[0].value} ML`}
                </p>
                <p>
                    <b>Date: </b>
                    {`${tooltipPayload && tooltipPayload[1].value}`}
                </p>
            </div>
        );
    }
    return null;
};

export default Tooltip;
