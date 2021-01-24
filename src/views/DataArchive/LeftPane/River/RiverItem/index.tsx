import React from 'react';
import * as PageType from '#store/atom/page/types';

import DateBlock from '../DateBlock';
import RiverPill from '../RiverPill';

import { getMonthName, getSpecificDate } from '#views/DataArchive/utils';
import styles from './styles.scss';

interface Props {
    data: PageType.DataArchiveRiver;
}
const RiverItem = (props: Props) => {
    const { data } = props;
    const { basin, waterLevelOn, waterLevel, status } = data;
    const day = getSpecificDate(`${waterLevelOn}`, 'day');
    const year = getSpecificDate(`${waterLevelOn}`, 'year');
    const monthName = getMonthName(`${waterLevelOn}`);
    return (
        <div className={styles.riverItem}>
            <DateBlock
                day={day}
                monthName={monthName}
                year={year}
            />
            <div className={styles.details}>
                <div className={styles.basin}>
                    {basin ? `${basin} Basin` : 'N/A'}
                </div>
                <div className={styles.status}>
                    {`Status: ${status}`}
                </div>
            </div>
            <div className={styles.right}>
                <RiverPill
                    waterLevel={waterLevel}
                    status={status}
                />
            </div>
        </div>
    );
};

export default RiverItem;
