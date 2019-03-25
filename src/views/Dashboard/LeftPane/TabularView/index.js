import React from 'react';
import PropTypes from 'prop-types';

import Table from '#rscv/Table';
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

export default class TabularView extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static tableKeySelector = data => data.id;

    constructor(props) {
        super(props);
        this.alertsTableHeader = [
            {
                key: 'verified',
                label: 'Verified',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareBoolean(a.verified, b.verified),
                modifier: (row) => {
                    const iconClass = row.verified ? `
                    ${iconNames.check} ${styles.verified}` : `
                    ${iconNames.close} ${styles.notVerified}
                    `;
                    return <span className={iconClass} />;
                },
            },
            {
                key: 'title',
                label: 'Title',
                sortable: true,
                comparator: (a, b) => compareString(a.title, b.title),
                order: 3,
            },
            {
                key: 'description',
                label: 'Description',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareString(a.description, b.description),
            },
            {
                key: 'source',
                label: 'Source',
                order: 5,
                sortable: true,
                comparator: (a, b) => compareString(a.source, b.source),
            },
            /*
            {
                key: 'event',
                label: 'Event',
                order: 6,
                sortable: true,
                comparator: (a, b) => compareString(a.source, b.source),
            },
            */
            {
                key: 'hazardInfo',
                label: 'Hazard',
                order: 6,
                modifier: row => row.hazardInfo.title,
                sortable: true,
                // FIXME: potential problem
                comparator: (a, b) => compareString(a.hazardInfo.title, b.hazardInfo.title),
            },
            {
                key: 'createdOn',
                label: 'Created On',
                order: 7,
                sortable: true,
                comparator: (a, b) => compareDate(a.createdOn, b.createdOn),
                modifier: row => (
                    <FormattedDate
                        date={row.createdOn}
                        mode="yyyy-MM-dd"
                    />
                ),
            },
            {
                key: 'expireOn',
                label: 'Expires On',
                order: 8,
                sortable: true,
                comparator: (a, b) => compareDate(a.expireOn, b.expireOn),
                modifier: row => (
                    <FormattedDate
                        date={row.expiresOn}
                        mode="yyyy-MM-dd"
                    />
                ),
            },
        ];
    }

    render() {
        const {
            className,
            alertList,
        } = this.props;

        // need to transform data
        const alertListForExport = alertList.map(alert => ({
            verified: alert.verified,
            title: alert.title,
            description: alert.description,
            source: alert.source,
            // FIXME: potential problem
            hazard: alert.hazardInfo.title,
            'created on': alert.createdOn,
            'expire on': alert.expireOn,
        }));
        const csv = convertJsonToCsv(alertListForExport);
        const data = convertCsvToLink(csv);

        return (
            <div className={_cs(className, styles.tabularView)}>
                <div className={styles.tableContainer}>
                    <Table
                        className={styles.alertsTable}
                        data={alertList}
                        headers={this.alertsTableHeader}
                        keySelector={TabularView.tableKeySelector}
                    />
                </div>
                <div className={styles.downloadLinkContainer}>
                    <a
                        className={styles.downloadLink}
                        href={data}
                        download="export.csv"
                    >
                        Download csv
                    </a>
                </div>
            </div>
        );
    }
}
