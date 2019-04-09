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
    lossAndDamageList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
};

const defaultProps = {
    lossAndDamageList: [],
    className: undefined,
};

export default class TabularView extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static tableKeySelector = data => data.id;

    constructor(props) {
        super(props);
        this.lossAndDamagesTableHeader = [
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
                key: 'count',
                label: 'No. of incidents',
                order: 7,
                sortable: true,
                comparator: (a, b) => compareString(a.count, b.count),
            },
            {
                key: 'estimatedLoss',
                label: 'Total estimated loss',
                modifier: row => row.loss.estimatedLoss,
                order: 8,
                sortable: true,
                comparator: (a, b) => compareString(a.loss.estimatedLoss, b.loss.estimatedLoss),
            },
            {
                key: 'infrastructureDestroyedCount',
                label: 'Total infrastructure destroyed',
                modifier: row => row.loss.infrastructureDestroyedCount,
                order: 9,
                sortable: true,
                comparator: (a, b) => compareString(
                    a.loss ? a.loss.infrastructureDestroyedCount : 0,
                    b.loss ? b.loss.infrastructureDestroyedCount : 0,
                ),
            },
            {
                key: 'livestockDestroyedCount',
                label: 'Total livestock destroyed',
                modifier: row => row.loss.livestockDestroyedCount,
                order: 10,
                sortable: true,
                comparator: (a, b) => compareString(
                    a.loss ? a.loss.livestockDestroyedCount : 0,
                    b.loss ? b.loss.livestockDestroyedCount : 0,
                ),
            },
            {
                key: 'peopleDeathCount',
                label: 'Total people death',
                modifier: row => row.loss.peopleDeathCount,
                order: 11,
                sortable: true,
                comparator: (a, b) => compareString(
                    a.loss ? a.loss.peopleDeathCount : 0,
                    b.loss ? b.loss.peopleDeathCount : 0,
                ),
            },
            {
                key: 'description',
                label: 'Description',
                order: 12,
                sortable: true,
                comparator: (a, b) => compareString(a.description, b.description),
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
        ];
    }

    render() {
        const {
            className,
            lossAndDamageList,
        } = this.props;

        // need to transform data
        const lossAndDamageListForExport = lossAndDamageList.map(lossAndDamage => ({
            verified: lossAndDamage.verified,
            title: lossAndDamage.title,
            description: lossAndDamage.description,
            source: lossAndDamage.source,
            'estimated loss': lossAndDamage.loss.estimatedLoss,
            'infrastructure destroyed': lossAndDamage.loss.infrastructureDestroyedCount,
            'livestock destroyed': lossAndDamage.loss.livestockDestroyedCount,
            'people death': lossAndDamage.loss.peopleDeathCount,
            // FIXME: potential problem
            hazard: lossAndDamage.hazardInfo.title,
            'created on': lossAndDamage.createdOn,
            'expire on': lossAndDamage.expireOn,
        }));
        const csv = convertJsonToCsv(lossAndDamageListForExport);
        const data = convertCsvToLink(csv);

        return (
            <div className={_cs(className, styles.tabularView)}>
                <div className={styles.tableContainer}>
                    <Table
                        className={styles.lossAndDamagesTable}
                        data={lossAndDamageList}
                        headers={this.lossAndDamagesTableHeader}
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
