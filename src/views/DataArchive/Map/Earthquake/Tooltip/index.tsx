import React from 'react';
import FormattedDate from '#rscv/FormattedDate';

import styles from './styles.scss';

interface Props {
    address: string;
    description: string;
    eventOn: string | number | Date | undefined;
    magnitude: number;
}

const magnitudeClassSelector = (magnitude: number) => {
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

const Tooltip = ({ address, description, eventOn, magnitude }: Props) => (
    <div className={styles.tooltip}>
        <div className={styles.header}>
            <h3>{ address }</h3>
            <span className={magnitudeClassSelector(magnitude)}>
                { magnitude }
                {' '}
                    ML
            </span>
        </div>

        <div className={styles.description}>
            <div className={styles.key}>Description:</div>
            <div className={styles.value}>{ description }</div>
        </div>

        <div className={styles.eventOn}>
            <div className={styles.key}>Event On:</div>
            <div className={styles.value}>
                <FormattedDate
                    value={eventOn}
                    mode="yyyy-MM-dd hh:mm"
                />
            </div>
        </div>
    </div>
);

export default Tooltip;
