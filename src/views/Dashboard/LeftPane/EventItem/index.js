import React from 'react';
import PropTypes from 'prop-types';

import { _cs } from '@togglecorp/fujs';

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
        } = this.props;

        const {
            title,
            createdOn,
        } = event;

        return (
            <div
                className={_cs(
                    className,
                    styles.eventItem,
                )}
            >
                <div className={styles.title}>
                    {title}
                </div>
                <DateOutput
                    className={styles.createdOn}
                    value={createdOn}
                />
            </div>
        );
    }
}
