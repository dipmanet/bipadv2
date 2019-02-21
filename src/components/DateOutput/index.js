import PropTypes from 'prop-types';
import React from 'react';

import { iconNames } from '#constants';
import _cs from '#cs';
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
            ...otherProps
        } = this.props;

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
                    {...otherProps}
                />
            </div>
        );
    }
}
