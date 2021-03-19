import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    aqi: number;
}

class PollutionPill extends React.PureComponent <Props> {
    private aqiClassSelector = (aqi: number): string => {
        if (aqi <= 50) {
            return styles.good;
        }
        if (aqi <= 100) {
            return styles.moderate;
        }
        if (aqi <= 150) {
            return styles.unhealthyForSensitive;
        }
        if (aqi <= 200) {
            return styles.unhealthy;
        }
        if (aqi <= 300) {
            return styles.veryUnhealthy;
        }
        if (aqi > 300) {
            return styles.hazardous;
        }
        return styles.good;
    }

    public render() {
        const { aqi } = this.props;
        return (
            <div className={_cs(styles.pollutionItem, this.aqiClassSelector(aqi))}>
                {aqi.toFixed(2)}
            </div>
        );
    }
}

export default PollutionPill;
