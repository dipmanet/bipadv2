import React from 'react';
import PropTypes from 'prop-types';

import Table from '#rscv/Table';
import FormattedDate from '#rscv/FormattedDate';
import { iconNames } from '#constants';

import { _cs } from '@togglecorp/fujs';

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
                key: 'createdOn',
                label: 'Created On',
                order: 1,
                modifier: row => (
                    <FormattedDate
                        date={row.createdOn}
                        mode="dd-MM-yyyy"
                    />
                ),
            },
            {
                key: 'expireOn',
                label: 'Expires On',
                order: 2,
                modifier: row => (
                    <FormattedDate
                        date={row.expiresOn}
                        mode="dd-MM-yyyy"
                    />
                ),
            },
            {
                key: 'title',
                label: 'Title',
                order: 3,
            },
            {
                key: 'description',
                label: 'Description',
                order: 4,
            },
            {
                key: 'source',
                label: 'Source',
                order: 5,
            },
            {
                key: 'event',
                label: 'Event',
                order: 6,
            },
            {
                key: 'hazardInfo',
                label: 'Hazard',
                order: 7,
                modifier: row => row.hazardInfo.title,
            },
            {
                key: 'verified',
                label: 'Verified',
                order: 8,
                modifier: (row) => {
                    const iconClass = row.verified ? `
                    ${iconNames.check} ${styles.verified}` : `
                    ${iconNames.close} ${styles.notVerified}
                    `;
                    return <span className={iconClass} />;
                },
            },
        ];
    }


    render() {
        const {
            className,
            alertList,
        } = this.props;

        return (
            <div className={_cs(className, styles.tabularView)}>
                <Table
                    className={styles.alertsTable}
                    data={alertList}
                    headers={this.alertsTableHeader}
                    keySelector={TabularView.tableKeySelector}
                />
            </div>
        );
    }
}
