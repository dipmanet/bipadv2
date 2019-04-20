import React from 'react';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import { doesObjectHaveNoData } from '@togglecorp/fujs';

import PrimaryButton from '#rsca/Button/PrimaryButton';

import { convertJsonToCsv } from '#utils/common';

// FIXME: move this somewhere nice
export default class DownloadButton extends React.PureComponent {
    static propTypes = {
        name: PropTypes.string,
        value: PropTypes.array, // eslint-disable-line react/forbid-prop-types
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        name: 'downloadFiled.csv',
        disabled: false,
        value: undefined,
    }

    handleClick = () => {
        const { value, name } = this.props;
        const csv = convertJsonToCsv(value);
        const blob = new Blob([csv], { type: 'text/csv' });
        saveAs(blob, name);
    }

    render() {
        const {
            disabled,
            value,
            name, // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
            ...otherProps
        } = this.props;

        return (
            <PrimaryButton
                {...otherProps}
                onClick={this.handleClick}
                disabled={doesObjectHaveNoData(value) || disabled}
            />
        );
    }
}
