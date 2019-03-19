import React from 'react';
import PropTypes from 'prop-types';

import {
    _cs,
    compareString,
    compareNumber,
} from '@togglecorp/fujs';

import educationIcon from '#resources/icons/Education.svg';
import financeIcon from '#resources/icons/University.svg';
import healthFacilityIcon from '#resources/icons/health-facility.svg';
import groupIcon from '#resources/icons/group.svg';

import Numeral from '#rscv/Numeral';
import Table from '#rscv/Table';

import { convertJsonToCsv, convertCsvToLink } from '#utils/common';

import styles from './styles.scss';

const propTypes = {
    resourceList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
};
const resourceIcons = {
    finance: financeIcon,
    health: healthFacilityIcon,
    education: educationIcon,
    volunteer: groupIcon,
};

const defaultProps = {
    resourceList: [],
    className: undefined,
};

export default class TabularView extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static tableKeySelector = data => data.title;

    constructor(props) {
        super(props);
        this.resourcesTableHeader = [
            {
                key: 'title',
                label: 'Title',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.title, b.title),
            },
            {
                key: 'resourceType',
                label: 'Resource Type',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.resourceType, b.resourceType),
                modifier: (row) => {
                    const { resourceType } = row;
                    return (
                        <span className={styles.resource}>
                            <img
                                src={resourceIcons[resourceType]}
                                alt={resourceType}
                                className={styles.icon}
                            />
                            { row.resourceType }
                        </span>
                    );
                },
            },
            {
                key: 'point',
                label: 'Location',
                order: 3,
                modifier: (row) => {
                    const { point: { coordinates } } = row;

                    return (
                        <div>
                            <Numeral
                                normal
                                precision={4}
                                value={coordinates[0]}
                            />
                            ,
                            <Numeral
                                normal
                                precision={4}
                                value={coordinates[1]}
                            />
                        </div>
                    );
                },
            },
            {
                key: 'distance',
                label: 'Distance',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareNumber(a.distance, b.distance),
                modifier: row => (
                    <Numeral
                        normal
                        value={row.distance}
                        precision={null}
                        suffix=" m"
                    />
                ),
            },
        ];
    }

    render() {
        const {
            className,
            resourceList,
        } = this.props;

        const resourceListForExport = resourceList.map(resource => ({
            title: resource.title,
            'resource type': resource.resourceType,
            point: resource.point.coordinates,
            distance: resource.distance,

        }));

        const csv = convertJsonToCsv(resourceListForExport);
        const data = convertCsvToLink(csv);

        return (
            <div className={_cs(className, styles.tabularView)}>
                <div className={styles.tableContainer}>
                    <Table
                        className={styles.resourcesTable}
                        data={resourceList}
                        headers={this.resourcesTableHeader}
                        keySelector={TabularView.tableKeySelector}
                    />
                </div>
                <div className={styles.downloadLinkContainer}>
                    <a
                        className={styles.downloadLink}
                        href={data}
                        download="resources.csv"
                    >
                        Download csv
                    </a>
                </div>
            </div>
        );
    }
}
