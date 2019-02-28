import React from 'react';
import PropTypes from 'prop-types';

import {
    _cs,
    compareDate,
    compareString,
    compareBoolean,
    compareNumber,
} from '@togglecorp/fujs';
import FormattedDate from '#rscv/FormattedDate';
import Table from '#rscv/Table';

import { iconNames } from '#constants';
import { convertJsonToCsv, convertCsvToLink } from '#utils/common';

import styles from './styles.scss';

const propTypes = {
    incidentList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
};

const defaultProps = {
    incidentList: [],
    className: undefined,
};

export default class TabularView extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    static tableKeySelector = data => data.id;

    constructor(props) {
        super(props);
        this.incidentsTableHeader = [
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
                key: 'streetAddress',
                label: 'Street Address',
                order: 7,
                sortable: true,
                comparator: (a, b) => compareString(a.streetAddress, b.streetAddress),
            },
            {
                key: 'cause',
                label: 'Cause',
                order: 8,
                sortable: true,
                comparator: (a, b) => compareString(a.cause, b.cause),
            },
            {
                key: 'inducer',
                label: 'Inducer',
                order: 9,
                sortable: true,
                comparator: (a, b) => compareString(a.inducer, b.inducer),
            },
            {
                key: 'severity',
                label: 'Severity',
                order: 10,
                sortable: true,
                comparator: (a, b) => compareString(a.severity, b.severity),
            },
            {
                key: 'people-loss',
                label: 'Deaths',
                order: 11,
                modifier: (d = {}) => d.peopleDeathCount,
                sortable: true,
                comparator: (a, b) => compareNumber(a.loss, b.loss),
            },
            {
                key: 'createdOn',
                label: 'Created On',
                order: 13,
                sortable: true,
                comparator: (a, b) => compareDate(a.createdOn, b.createdOn),
                modifier: row => (
                    <FormattedDate
                        date={row.createdOn}
                        mode="dd-MM-yyyy"
                    />
                ),
            },
            {
                key: 'incidentOn',
                label: 'Incident On',
                order: 14,
                sortable: true,
                comparator: (a, b) => compareDate(a.incidentOn, b.incidentOn),
                modifier: row => (
                    <FormattedDate
                        date={row.incidentOn}
                        mode="dd-MM-yyyy"
                    />
                ),
            },
        ];
    }


    render() {
        const {
            className,
            incidentList,
        } = this.props;

        // need to transform data
        const incidentListForExport = incidentList.map(incident => ({
            verified: incident.verified,
            title: incident.title,
            description: incident.description,
            source: incident.source,
            hazard: incident.hazardInfo,
            'street address': incident.streetAddress,
            cause: incident.cause,
            inducer: incident.inducer,
            severity: incident.severity,
            deaths: (incident.loss || {}).peopleDeathCount,
            createdOn: incident.createdOn,
            incidentOn: incident.incidentOn,
        }));

        const csv = convertJsonToCsv(incidentListForExport);
        const data = convertCsvToLink(csv);

        return (
            <div className={_cs(className, styles.tabularView)}>
                <div className={styles.tableContainer}>
                    <Table
                        className={styles.incidentsTable}
                        data={incidentList}
                        headers={this.incidentsTableHeader}
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

