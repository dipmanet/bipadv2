import React from 'react';
import { doesObjectHaveNoData } from '@togglecorp/fujs';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';

import PrimaryButton from '#rsca/Button/PrimaryButton';
import { convertJsonToCsv } from '#utils/common';

// FIXME: move this somewhere nice
export default class MapDownloadButton extends React.PureComponent {
    static propTypes = {
        name: PropTypes.string,
        value: PropTypes.array, // eslint-disable-line react/forbid-prop-types
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        name: 'data',
        disabled: false,
        value: undefined,
    }

    handleClick = () => {
        const {
            value,
            name,
        } = this.props;
        const csv = convertJsonToCsv(value);
        console.log('csv', csv);
        const blob = new Blob([csv], { type: 'text/csv' });

        const currentTimestamp = (new Date()).getTime();
        const fileName = `${name}-${currentTimestamp}.csv`;
        saveAs(blob, fileName);
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
