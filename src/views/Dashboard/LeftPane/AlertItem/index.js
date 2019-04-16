import React from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';

import { _cs } from '@togglecorp/fujs';
import { hazardIcons } from '#resources/data';
import { iconNames } from '#constants';
import { getHazardColor } from '#utils/domain';
import DateOutput from '#components/DateOutput';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: undefined,
};

const DAY = 24 * 60 * 60 * 1000;
const isLessThanADayAgo = (date) => {
    const now = Date.now();
    const timediff = now - (new Date(date)).getTime();
    return timediff < DAY * 10;
};

export default class AlertItem extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    render() {
        const {
            alert,
            className,
            hazardTypes,
        } = this.props;

        const {
            title,
            hazard,
            startedOn,
        } = alert;

        const icon = hazardIcons[hazard];
        const isNew = isLessThanADayAgo(startedOn);

        return (
            <div
                className={_cs(
                    className,
                    styles.alertItem,
                    isNew && styles.new,
                )}
            >
                {icon ? (
                    <ReactSVG
                        className={styles.svgContainer}
                        path={icon}
                        svgClassName={styles.icon}
                        style={{
                            color: getHazardColor(hazardTypes, hazard),
                        }}
                    />
                ) : (
                    <div
                        className={_cs(
                            iconNames.alert,
                            styles.defaultIcon,
                        )}
                    />
                )}
                <div className={styles.right}>
                    <div className={styles.title}>
                        {title}
                    </div>
                    <div className={styles.bottom}>
                        <DateOutput
                            className={styles.startedOn}
                            value={startedOn}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
