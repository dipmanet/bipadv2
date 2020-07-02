import React from 'react';
import * as PageType from '#store/atom/page/types';

import Icon from '#rscg/Icon';
import EarthquakePill from '../EarthquakePill';

import styles from './styles.scss';


interface Props {
    data: PageType.DataArchiveEarthquake;
}

class EarthquakeItem extends React.PureComponent<Props> {
    private parseDate = (date: string): string => date.substring(0, date.indexOf('T'))

    private parseTime = (date: string): string => date.split('T')[1].split('+')[0];

    public render() {
        const { data } = this.props;
        const { address, magnitude, eventOn } = data;
        return (
            <div className={styles.earthquake}>
                <div className={styles.left}>
                    <div className={styles.location}>
                        {address}
                    </div>
                    <div className={styles.eventOn}>
                        <div className={styles.date}>
                            <Icon
                                className={styles.icon}
                                name="calendar"
                            />
                            <div className={styles.dateValue}>{this.parseDate(eventOn)}</div>
                        </div>
                        <div className={styles.time}>
                            <Icon
                                className={styles.icon}
                                name="dataRange"
                            />
                            <div className={styles.timeValue}>{this.parseTime(eventOn)}</div>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <EarthquakePill magnitude={magnitude} />
                </div>
            </div>
        );
    }
}

export default EarthquakeItem;
