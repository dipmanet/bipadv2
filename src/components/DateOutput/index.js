import PropTypes from 'prop-types';
import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { iconNames } from '#constants';
import FormattedDate from '#rscv/FormattedDate';
import styles from './styles.scss';


const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

export default class DateOutput extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const {
            className: classNameFromProps,
            value,
            ...otherProps
        } = this.props;

        if (!value) {
            return null;
        }

        return (
            <div className={_cs(classNameFromProps, styles.dateOutput)}>
                <div
                    className={_cs(
                        styles.icon,
                        iconNames.calendar,
                        'date-output-icon',
                    )}
                />
                <FormattedDate
                    className={styles.formattedDate}
                    value={value}
                    mode="yyyy-MM-dd"
                    {...otherProps}
                />
            </div>
        );
    }
}
