import PropTypes from 'prop-types';
import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Icon from '#rscg/Icon';
import FormattedDate from '#rscv/FormattedDate';
import styles from './styles.scss';


const propTypes = {
    className: PropTypes.string,
    alwaysVisible: PropTypes.bool,
};

const defaultProps = {
    className: undefined,
    alwaysVisible: false,
};

export default class DateOutput extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            className: classNameFromProps,
            iconClassName,
            valueClassName,
            value,
            alwaysVisible,
            hideIcon,
            language,
            ...otherProps
        } = this.props;

        if (!value && !alwaysVisible) {
            return null;
        }

        return (
            <div className={_cs(classNameFromProps, styles.dateOutput)}>
                {!hideIcon && (
                    <Icon
                        className={_cs(
                            styles.icon,
                            iconClassName,
                        )}
                        name="calendar"
                    />
                )}
                <FormattedDate
                    className={_cs(
                        styles.formattedDate,
                        valueClassName,
                    )}
                    value={value}
                    language={language}
                    mode="yyyy-MM-dd"
                    {...otherProps}
                />
            </div>
        );
    }
}
