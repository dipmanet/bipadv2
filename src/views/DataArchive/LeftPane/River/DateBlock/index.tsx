import React from 'react';

import styles from './styles.scss';

interface Props {
    day: string;
    monthName: string;
    year: string;
}

const shortenMonth = (monthName: string) => monthName.substr(0, 3);
const DateBlock = (props: Props) => {
    const { day, monthName, year } = props;
    return (
        <div className={styles.dateBlock}>
            <div className={styles.day}>
                {day}
            </div>
            <div className={styles.yearMonth}>
                {`${shortenMonth(monthName)} ${year}`}
            </div>
        </div>
    );
};

export default DateBlock;
