/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import {
    _cs,
    isFalsy,
} from '@togglecorp/fujs';
import React from 'react';

import Numeral from '#rscv/Numeral';

import styles from './styles.scss';
import Icon from '#rscg/Icon';

const propTypes = {
    className: PropTypes.string,
    valueClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    label: PropTypes.string.isRequired,
    iconLabel: PropTypes.bool,
    type: PropTypes.string,
    // NOTE: PropTypes.object below because TextOutput sometimes gets <DateOutput> as value
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    isNumericValue: PropTypes.bool,
    alwaysVisible: PropTypes.bool,
};

const defaultProps = {
    iconLabel: false,
    className: undefined,
    valueClassName: undefined,
    labelClassName: undefined,
    value: undefined,
    type: 'normal',
    isNumericValue: false,
    alwaysVisible: false,
};

export default class TextOutput extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            className: classNameFromProps,
            label,
            value,
            type,
            iconLabel,
            isNumericValue,
            valueClassName,
            alwaysVisible,
            labelClassName,
            nullCondition,
            finalData,
            language = 'en',
            ...otherProps

        } = this.props;

        if (isFalsy(value) && !alwaysVisible) {
            return null;
        }

        const valueComponent = (value === '-')
            ? (
                <div className={_cs(styles.value, valueClassName)} title="N/A">
                    &#8212;
                    {/* {value} */}

                </div>
            )
            : isNumericValue

                ? (
                    finalData && finalData.label === 'Estimated loss (NPR)' && finalData.value === 0
                        ? (
                            <div className={_cs(styles.value, valueClassName)}>
                                <Numeral
                                    className={_cs(styles.value, valueClassName)}
                                    value={value}
                                    language={language}
                                    precision={0}
                                    {...otherProps}
                                    nullCondition={nullCondition}
                                />
                                <Icon
                                    className={styles.infoIcon}
                                    name="info"
                                    title={'0 can be no data available or zero estimated loss'}
                                />
                            </div>
                        )
                        : (
                            <Numeral
                                className={_cs(styles.value, valueClassName)}
                                value={value}
                                language={language}
                                precision={0}
                                {...otherProps}
                                nullCondition={nullCondition}
                            />
                        )

                ) : (
                    <div className={_cs(styles.value, valueClassName)}>
                        {value}
                    </div>
                );
        return (
            <div className={
                _cs(
                    classNameFromProps,
                    styles[type],
                )}
            >
                {iconLabel ? (
                    <div className={_cs(
                        styles.iconLabel,
                        label,
                    )}
                    />
                ) : (
                    <div className={_cs(styles.label, labelClassName)}>
                        {label}
                    </div>
                )}
                {valueComponent}
            </div>
        );
    }
}
