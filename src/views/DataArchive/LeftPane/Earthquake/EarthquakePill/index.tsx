import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    magnitude: number;
}

const magnitudeClassSelector = (magnitude: number): string => {
    if (magnitude < 4) {
        return styles.minor;
    }
    if (magnitude < 5) {
        return styles.light;
    }
    if (magnitude < 6) {
        return styles.moderate;
    }
    if (magnitude < 7) {
        return styles.strong;
    }
    if (magnitude < 8) {
        return styles.major;
    }
    if (magnitude >= 8) {
        return styles.great;
    }
    return styles.minor;
};
// class EarthquakePill extends React.PureComponent <Props> {
const EarthquakePill = (props: Props) => {
    const { magnitude } = props;
    return (
        <div className={_cs(styles.earthquakePill, magnitudeClassSelector(magnitude))}>
            {magnitude.toFixed(1)}
            <span className={styles.ml}> ML</span>
        </div>
    );
};

export default EarthquakePill;
