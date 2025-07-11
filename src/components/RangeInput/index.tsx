import React from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import PropTypes from 'prop-types';

import Delay from '#rscg/Delay';
import { NormalNumberInput } from '#rsci/NumberInput';

const propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    minLabel: PropTypes.string,
    label: PropTypes.string.isRequired,
    maxLabel: PropTypes.string,
    maxLimit: PropTypes.number,
    value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    noMax: PropTypes.bool,
    noMin: PropTypes.bool,
};

const defaultProps = {
    className: '',
    minLabel: 'Min',
    maxLabel: 'Max',
    maxLimit: 1000,
    noMax: false, // in case we are interested in the minimum value
    noMin: false, // in case we are interested in the maximum value
    value: undefined,
};

class RangeInput extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    handleMinChange = (val) => {
        if (this.props.noMin) {
            return;
        }
        const {
            value: { max } = {},
            onChange,
        } = this.props;

        if (isNotDefined(val) || isNotDefined(max) || val <= max) {
            onChange({ min: val, max });
        }
    }

    handleMaxChange = (val) => {
        if (this.props.noMax) {
            return;
        }
        const {
            value: { min } = {},
            onChange,
            maxLimit,
        } = this.props;

        if (
            isNotDefined(val)
            || ((isNotDefined(min) || val >= min) && val <= maxLimit)
        ) {
            onChange({ min, max: val });
        }
    }

    render() {
        const {
            className: classNameFromProps,
            minLabel,
            maxLabel,
            label,
            noMax,
            noMin,
            value: { min, max } = {},
        } = this.props;

        return (
            <div className={classNameFromProps}>
                <span>
                    {' '}
                    { label }
                    {' '}
                </span>
                { !noMin && (
                    <NormalNumberInput
                        key="min"
                        label={minLabel}
                        title={minLabel}
                        separator=" "
                        onChange={this.handleMinChange}
                        value={min}
                    />
                )
                }
                { !noMax && (
                    <NormalNumberInput
                        key="max"
                        label={maxLabel}
                        title={maxLabel}
                        separator=" "
                        onChange={this.handleMaxChange}
                        value={max}
                    />
                )
                }
            </div>
        );
    }
}

export default Delay(RangeInput);
