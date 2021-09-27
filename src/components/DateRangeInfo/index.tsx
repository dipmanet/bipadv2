import React from 'react';

import { _cs } from '@togglecorp/fujs';
import { Translation } from 'react-i18next';
import Icon from '#rscg/Icon';
import FormattedDate from '#rscv/FormattedDate';

import styles from './styles.scss';

interface Props {
    className?: string;
    startDate: number | string | Date;
    endDate: number | string | Date;
}
interface State {
}

class DateRangeInfo extends React.PureComponent<Props, State> {
    public render() {
        const {
            className,
            startDate,
            endDate,
        } = this.props;

        return (
            <div className={_cs(className, styles.dateDetails)}>
                <div className={styles.infoIconContainer}>
                    <Icon
                        className={styles.infoIcon}
                        name="info"
                    />
                </div>
                <div className={styles.label}>
                    <Translation>
                        {
                            t => <p>{t('DateRangeInfo')}</p>
                        }
                    </Translation>
                </div>
                <FormattedDate
                    className={styles.startDate}
                    mode="yyyy-MM-dd"
                    value={startDate}
                />
                <div className={styles.label}>
                    <Translation>
                        {
                            t => <p>{t('to')}</p>
                        }
                    </Translation>
                </div>
                <FormattedDate
                    className={styles.endDate}
                    mode="yyyy-MM-dd"
                    value={endDate}
                />
            </div>
        );
    }
}

export default DateRangeInfo;
