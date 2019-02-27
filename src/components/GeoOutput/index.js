import PropTypes from 'prop-types';
import React from 'react';

import { iconNames } from '#constants';
import _cs from '#cs';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

const emptyObject = {};

export default class DateOutput extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const {
            className: classNameFromProps,
            geoareaName,
        } = this.props;

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
                    {geoareaName}
                </div>
            </div>
        );
    }
}
