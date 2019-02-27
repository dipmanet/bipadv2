import React from 'react';
import PropTypes from 'prop-types';

import { _cs } from '@togglecorp/fujs';

import { convertJsonToCsv, convertCsvToLink } from '#utils/common';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: undefined,
};

export default class TabularView extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    render() {
        const { className } = this.props;

        const stockData = [
            {
                Symbol: 'AAPL',
                Company: 'Apple Inc.',
                Price: '132.54',
                Age: 12,
            },
            {
                Symbol: undefined,
                Company: 'Intel Corporation',
                Price: '33.45',
            },
            {
                Symbol: 'GOOG',
                Company: 'Google, Inc',
                Price: '554.52',
                Age: 12,
            },
        ];

        const csv = convertJsonToCsv(stockData);
        const data = convertCsvToLink(csv);

        return (
            <div className={_cs(className, styles.tabularView)}>
                <a
                    href={data}
                    download="export.csv"
                >
                    Download csv
                </a>
            </div>
        );
    }
}

