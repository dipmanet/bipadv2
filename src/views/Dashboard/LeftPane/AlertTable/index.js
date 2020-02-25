import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import {
    _cs,
    compareDate,
    compareString,
    compareBoolean,
} from '@togglecorp/fujs';

import NormalTaebul from '#rscv/Taebul';
import Sortable from '#rscv/Taebul/Sortable';
import ColumnWidth from '#rscv/Taebul/ColumnWidth';

import DownloadButton from '#components/DownloadButton';
import TableDateCell from '#components/TableDateCell';
import {
    convertTableToCsv,
    prepareColumns,
    defaultState,
} from '#utils/table';

import styles from './styles.scss';

const Taebul = Sortable(ColumnWidth(NormalTaebul));

const propTypes = {
    alertList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
};

const defaultProps = {
    alertList: [],
    className: undefined,
};

// eslint-disable-next-line react/no-multi-comp
export default class AlertTable extends React.PureComponent {
    static tableKeySelector = data => data.id;

    static propTypes = propTypes;

    static defaultProps = defaultProps;


    constructor(props) {
        super(props);

        const getHazardTitle = ({ hazardInfo: { title } = {} }) => title;

        this.columns = prepareColumns([
            {
                key: 'verified',
                value: { title: 'Verified' },

                comparator: (a, b, d) => compareBoolean(a.verified, b.verified, d),

                transformer: value => (value ? 'Yes' : 'No'),
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
                comparator: (a, b, d) => compareString(getHazardTitle(a), getHazardTitle(b), d),

                transformer: getHazardTitle,
            },
            {
                key: 'createdOn',
                value: { title: 'Created on' },
                comparator: (a, b, d) => compareDate(a.createdOn, b.createdOn, d),

                cellRenderer: TableDateCell,
            },
            {
                key: 'expireOn',
                value: { title: 'Expires on' },
                comparator: (a, b, d) => compareDate(a.expireOn, b.expireOn, d),

                cellRenderer: TableDateCell,
            },
        ], styles);

        this.state = {
            settings: defaultState,
        };
    }

    handleSettingsChange = (val) => {
        this.setState({ settings: val });
    }

    convertValues = memoize(convertTableToCsv)

    render() {
        const {
            className,
            alertList,
        } = this.props;

        const alertListForExport = this.convertValues(alertList, this.columns);

        return (
            <div className={_cs(className, styles.tabularView)}>
                <div className={styles.tableContainer}>
                    <Taebul
                        className={styles.alertsTable}
                        headClassName={styles.head}
                        data={alertList}
                        keySelector={AlertTable.tableKeySelector}
                        columns={this.columns}

                        settings={this.state.settings}
                        onChange={this.handleSettingsChange}
                        rowHeight={30}
                    />
                </div>
                <div className={styles.downloadLinkContainer}>
                    <DownloadButton
                        value={alertListForExport}
                        name="alerts"
                    >
                        Download csv
                    </DownloadButton>
                </div>
            </div>
        );
    }
}
