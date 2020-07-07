import React from 'react';
import * as PageType from '#store/atom/page/types';

import Icon from '#rscg/Icon';
import PollutionPill from '../PollutionPill';

import styles from './styles.scss';

interface Props {
    data: PageType.DataArchivePollution;
}

class PollutionItem extends React.PureComponent<Props> {
    private parseDate = (date: string): string => date.substring(0, date.indexOf('T'))

    private parseTime = (date: string): string => date.split('T')[1].split('.')[0];

    public render() {
        const { data } = this.props;
        const { title, aqi, createdOn } = data;
        return (
            <div className={styles.pollution}>
                <div className={styles.left}>
                    <div className={styles.location}>
                        {title}
                    </div>
                    <div className={styles.eventOn}>
                        <div className={styles.date}>
                            <Icon
                                className={styles.icon}
                                name="calendar"
                            />
                            <div className={styles.dateValue}>
                                {
                                    createdOn && this.parseDate(createdOn)}
                            </div>
                        </div>
                        <div className={styles.time}>
                            <Icon
                                className={styles.icon}
                                name="dataRange"
                            />
                            <div className={styles.timeValue}>
                                {
                                    createdOn && this.parseTime(createdOn)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <PollutionPill aqi={aqi} />
                </div>
            </div>
        );
    }
}

export default PollutionItem;
