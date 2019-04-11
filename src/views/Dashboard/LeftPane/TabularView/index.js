import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import Button from '#rsca/Button';
import NormalTaebul from '#rscv/Taebul';
import Sortable from '#rscv/Taebul/Sortable';
import ColumnWidth from '#rscv/Taebul/ColumnWidth';

import FormattedDate from '#rscv/FormattedDate';
import { iconNames } from '#constants';
import { convertJsonToCsv, convertCsvToLink } from '#utils/common';

import {
    _cs,
    compareDate,
    compareString,
    compareBoolean,
} from '@togglecorp/fujs';

import styles from './styles.scss';

const propTypes = {
    alertList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
};

const defaultProps = {
    alertList: [],
    className: undefined,
};

// TODO: get styling fix
// TODO: use this everywhere

const getSortIcon = (sortOrder) => {
    const mapping = {
        asc: 'sortAscending',
        dsc: 'sortDescending',
    };
    return iconNames[mapping[sortOrder] || 'sort'];
};

const Header = ({ columnKey, title, sortable, sortOrder, onSortClick }) => (
    <React.Fragment>
        { sortable &&
            <Button
                className={styles.sortButton}
                onClick={() => onSortClick(columnKey)}
                iconName={getSortIcon(sortOrder)}
                transparent
                smallVerticalPadding
            />
        }
        <b>{title}</b>
    </React.Fragment>
);

const Cell = ({ value }) => (
    value || null
);

const DateCell = ({ value }) => (
    <FormattedDate value={value} mode="yyyy-MM-dd" />
);

const Taebul = Sortable(ColumnWidth(NormalTaebul));

export default class TabularView extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static tableKeySelector = data => data.id;

    constructor(props) {
        super(props);

        this.columns = [
            {
                key: 'verified',
                value: { title: 'Verified' },

                comparator: (a, b, d) => compareBoolean(a.verified, b.verified, d),

                transformer: value => (value ? 'y' : 'n'),
            },
            {
                key: 'title',
                value: { title: 'Title' },

                comparator: (a, b, d) => compareString(a.title, b.title, d),
            },
            {
                key: 'description',
                value: { title: 'Description' },
                comparator: (a, b, d) => compareString(a.description, b.description, d),
            },
            {
                key: 'source',
                value: { title: 'Source' },
                comparator: (a, b, d) => compareString(a.source, b.source, d),
            },
            {
                key: 'hazardInfo',
                value: { title: 'Hazard' },
                comparator: (a, b, d) => compareString(a.hazardInfo.title, b.hazardInfo.title, d),

                transformer: value => value.title,
            },
            {
                key: 'createdOn',
                value: { title: 'Created on' },
                comparator: (a, b, d) => compareDate(a.createdOn, b.createdOn, d),

                cellRenderer: DateCell,
            },
            {
                key: 'expireOn',
                value: { title: 'Expires on' },
                comparator: (a, b, d) => compareDate(a.expireOn, b.expireOn, d),

                cellRenderer: DateCell,
            },
        ].map(item => ({
            headerRendererParams: this.headerRendererParams,
            cellRendererParams: this.cellRendererParams,
            headerRenderer: Header,
            cellRenderer: Cell,
            ...item,
        }));

        this.state = {
            settings: {
                columnWidths: {},
                defaultColumnWidth: 200,
            },
        };
    }

    headerRendererParams = ({ column, columnKey }) => ({
        title: column.value.title,
        sortOrder: column.sortOrder,
        onSortClick: column.onSortClick,
        sortable: column.sortable,
        columnKey,
    })

    cellRendererParams = ({ datum, column, columnKey }) => ({
        value: column.transformer ? column.transformer(datum[columnKey]) : datum[columnKey],
    })

    handleSettingsChange = (val) => {
        this.setState({ settings: val });
    }

    convertValues = memoize((data, columns) => (
        data.map((datum) => {
            const val = {};
            columns.forEach((column) => {
                const {
                    key,
                    value: { title },
                    transformer,
                } = column;
                val[title] = transformer ? transformer(datum[key]) : datum[key];
            });
            return val;
        })
    ))

    render() {
        const {
            className,
            alertList,
        } = this.props;

        const alertListForExport = this.convertValues(alertList, this.columns);
        console.warn(alertListForExport);
        const csv = convertJsonToCsv(alertListForExport);
        const csvLink = convertCsvToLink(csv);

        return (
            <div className={_cs(className, styles.tabularView)}>
                <div className={styles.tableContainer}>
                    <Taebul
                        className={styles.alertsTable}
                        data={alertList}
                        keySelector={TabularView.tableKeySelector}
                        columns={this.columns}

                        settings={this.state.settings}
                        onChange={this.handleSettingsChange}
                    />
                </div>
                <div className={styles.downloadLinkContainer}>
                    <a
                        className={styles.downloadLink}
                        href={csvLink}
                        download="export.csv"
                    >
                        Download csv
                    </a>
                </div>
            </div>
        );
    }
}
