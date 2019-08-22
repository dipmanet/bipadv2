import PropTypes from 'prop-types';
import React from 'react';
import { _cs, isFalsy } from '@togglecorp/fujs';

import { iconNames } from '#constants';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

export default class DistanceOutput extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            className: classNameFromProps,
            value: valueFromProps,
        } = this.props;

        let amount = valueFromProps;
        let unit = 'Km';

        if (isFalsy(valueFromProps)) {
            return null;
        }

        if (amount < 1) {
            amount *= 1000;
            unit = 'm';
        }

        return (
            <div className={_cs(classNameFromProps, styles.distanceOutput)}>
                <div
                    className={_cs(
                        styles.icon,
                        iconNames.distance,
                        'distance-output-icon',
                    )}
                />
                <div className={styles.value}>
                    <div className={styles.amount}>
                        { amount }
                    </div>
                    <div className={styles.unit}>
                        { unit }
                    </div>
                </div>
            </div>
        );
    }
}
