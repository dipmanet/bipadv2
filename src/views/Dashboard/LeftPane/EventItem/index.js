import React from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';

import { _cs } from '@togglecorp/fujs';

import { getHazardColor, getHazardIcon } from '#utils/domain';
import DateOutput from '#components/DateOutput';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: undefined,
};

const emptyObject = {};

export default class EventItem extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    render() {
        const {
            event = emptyObject,
            className,
            hazardTypes,
        } = this.props;

        const {
            title,
            createdOn,
            hazard,
        } = event;

        const icon = getHazardIcon(hazardTypes, hazard);

        return (
            <div
                className={_cs(
                    className,
                    styles.eventItem,
                )}
            >
                <ReactSVG
                    className={styles.svgContainer}
                    path={icon}
                    svgClassName={styles.icon}
                    style={{
                        color: getHazardColor(hazardTypes, hazard),
                    }}
                />
                <div className={styles.right}>
                    <div className={styles.title}>
                        {title}
                    </div>
                    <DateOutput
                        className={styles.createdOn}
                        value={createdOn}
                    />
                </div>
            </div>
        );
    }
}
