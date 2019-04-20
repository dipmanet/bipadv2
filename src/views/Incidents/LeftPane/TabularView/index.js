import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {
    _cs,
    compareDate,
    compareString,
    compareBoolean,
    compareNumber,
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

        const getPeopleDeathCount = ({ loss: { peopleDeathCount } = {} }) => peopleDeathCount;
        const getHazardTitle = ({ hazardInfo: { title } = {} }) => title;

        this.columns = prepareColumns([
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
                comparator: (a, b, d) => compareString(getHazardTitle(a), getHazardTitle(b), d),

                transformer: getHazardTitle,
            },
            {
                key: 'streetAddress',
                value: { title: 'Street Address' },
                comparator: (a, b, d) => compareString(a.streetAddress, b.streetAddress, d),
            },
            {
                key: 'cause',
                value: { title: 'Cause' },
                comparator: (a, b, d) => compareString(a.cause, b.cause, d),
            },
            {
                key: 'inducer',
                value: { title: 'Inducer' },
                comparator: (a, b, d) => compareString(a.inducer, b.inducer, d),
            },
            {
                key: 'severity',
                value: { title: 'Severity' },
                comparator: (a, b, d) => compareString(a.severity, b.severity, d),
            },
            {
                key: 'people-death',
                value: { title: 'People death' },
                comparator: (a, b, d) => compareNumber(
                    getPeopleDeathCount(a),
                    getPeopleDeathCount(b),
                    d,
                ),

                transformer: getPeopleDeathCount,
            },
            {
                key: 'createdOn',
                value: { title: 'Created on' },
                comparator: (a, b, d) => compareDate(a.createdOn, b.createdOn, d),

                cellRenderer: TableDateCell,
            },
            {
                key: 'incidentOn',
                value: { title: 'Incident on' },
                comparator: (a, b, d) => compareDate(a.incidentOn, b.incidentOn, d),
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
            incidentList,
        } = this.props;

        const incidentListForExport = this.convertValues(incidentList, this.columns);

        return (
            <div className={_cs(className, styles.tabularView)}>
                <div className={styles.tableContainer}>
                    <Taebul
                        className={styles.incidentsTable}
                        headClassName={styles.head}
                        data={incidentList}
                        keySelector={TabularView.tableKeySelector}
                        columns={this.columns}

                        settings={this.state.settings}
                        onChange={this.handleSettingsChange}
                    />
                </div>
                <div className={styles.downloadLinkContainer}>
                    <DownloadButton
                        onClick={this.handleClick}
                        value={incidentListForExport}
                    >
                        Download csv
                    </DownloadButton>
                </div>
            </div>
        );
    }
}

