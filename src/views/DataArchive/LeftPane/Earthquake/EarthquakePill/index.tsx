import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    magnitude: number;
}

class EarthquakePill extends React.PureComponent <Props> {
    private magnitudeClassSelector = (magnitude: number): string => {
        if (magnitude <= 3) {
            return styles.minor;
        }
        if (magnitude <= 4) {
            return styles.light;
        }
        if (magnitude <= 5) {
            return styles.moderate;
        }
        if (magnitude <= 6) {
            return styles.strong;
        }
        if (magnitude <= 7) {
            return styles.major;
        }
        if (magnitude > 8) {
            return styles.great;
        }
        return styles.good;
    }

    public render() {
        const { magnitude } = this.props;
        return (
            <div className={_cs(styles.earthquakePill, this.magnitudeClassSelector(magnitude))}>
                {magnitude.toFixed(1)}
                <span> ML</span>
            </div>
        );
    }
}

export default EarthquakePill;
