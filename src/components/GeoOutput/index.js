import PropTypes from 'prop-types';
import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { iconNames } from '#constants';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    geoareaName: PropTypes.string,
    alwaysVisible: PropTypes.bool,
};

const defaultProps = {
    className: '',
    geoareaName: '',
    alwaysVisible: false,
};

export default class DateOutput extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            className: classNameFromProps,
            geoareaName,
            alwaysVisible,
        } = this.props;

        if (!geoareaName && !alwaysVisible) {
            return null;
        }

        return (
            <div className={_cs(classNameFromProps, styles.dateOutput)}>
                <div
                    className={_cs(
                        styles.icon,
                        iconNames.location,
                        'geo-output-icon',
                    )}
                />
                <div className={styles.title}>
                    {geoareaName || '-'}
                </div>
            </div>
        );
    }
}
