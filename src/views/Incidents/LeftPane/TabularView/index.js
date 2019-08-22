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

import Numeral from '#rscv/Numeral';
import NormalTaebul from '#rscv/Taebul';
import Sortable from '#rscv/Taebul/Sortable';
import ColumnWidth from '#rscv/Taebul/ColumnWidth';

import DownloadButton from '#components/DownloadButton';
import TableDateCell from '#components/TableDateCell';

import {
    convertTableToCsv,
    prepareColumns,
    defaultState,
    readNestedValue,
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

const NumeralCell = ({ value }) => (
    <Numeral
        className={styles.numeral}
        value={value}
        precision={0}
    />
);

const createComparator = (comparator, key) => (a, b, d) => comparator(
    readNestedValue(a, key),
    readNestedValue(b, key),
    d,
);

export default class TabularView extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    static tableKeySelector = data => data.id;

    constructor(props) {
        super(props);

        this.columns = prepareColumns([
            {
                key: 'verified',
                value: { title: 'Verified' },

                comparator: createComparator(compareBoolean, 'verified'),
                transformer: value => (value ? 'Yes' : 'No'),
            },
            {
                key: 'title',
                value: { title: 'Title' },
                comparator: createComparator(compareString, 'title'),
            },
            {
                key: 'description',
                value: { title: 'Description' },
                comparator: createComparator(compareString, 'description'),
            },
            {
                key: 'source',
                value: { title: 'Source' },
                comparator: createComparator(compareString, 'source'),
            },
            {
                key: 'hazardInfo.title',
                value: { title: 'Hazard' },
                comparator: createComparator(compareString, 'hazardInfo.title'),
            },
            {
                key: 'incidentOn',
                value: { title: 'Incident on' },
                cellRenderer: TableDateCell,
                comparator: createComparator(compareDate, 'incidentOn'),
            },
            {
                key: 'createdOn',
                value: { title: 'Created on' },
                cellRenderer: TableDateCell,
                comparator: createComparator(compareDate, 'createdOn'),
            },
            {
                key: 'provinceTitle',
                value: { title: 'Province' },
                comparator: createComparator(compareString, 'provinceTitle'),
            },
            {
                key: 'districtTitle',
                value: { title: 'District' },
                comparator: createComparator(compareString, 'districtTitle'),
            },
            {
                key: 'municipalityTitle',
                value: { title: 'Municipality' },
                comparator: createComparator(compareString, 'municipalityTitle'),
            },
            {
                key: 'wardTitle',
                value: { title: 'Ward' },
                comparator: createComparator(compareString, 'wardTitle'),
            },

            {
                key: 'loss.estimatedLoss',
                value: { title: 'Total estimated loss (NPR)' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.estimatedLoss'),
            },
            {
                key: 'loss.agricultureEconomicLoss',
                value: { title: 'Agriculture economic loss (NPR)' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.agricultureEconomicLoss'),
            },
            {
                key: 'loss.infrastructureEconomicLoss',
                value: { title: 'Infrastructur economic loss (NPR)' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.infrastructureEconomicLoss'),
            },
            {
                key: 'loss.infrastructureDestroyedCount',
                value: { title: 'Total infrastructure destroyed' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.infrastructureDestroyedCount'),
            },
            {
                key: 'loss.infrastructureDestroyedHouseCount',
                value: { title: 'House destroyed' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.infrastructureDestroyedHouseCount'),
            },
            {
                key: 'loss.infrastructureAffectedHouseCount',
                value: { title: 'House affected' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.infrastructureAffectedHouseCount'),
            },

            {
                key: 'loss.livestockDestroyedCount',
                value: { title: 'Total livestock destroyed' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.livestockDestroyedCount'),
            },

            {
                key: 'loss.peopleDeathCount',
                value: { title: 'Total - People Death' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleDeathCount'),
            },
            {
                key: 'loss.peopleDeathMaleCount',
                value: { title: 'Male - People Death' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleDeathMaleCount'),
            },
            {
                key: 'loss.peopleDeathFemaleCount',
                value: { title: 'Female - People Death' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleDeathFemaleCount'),
            },
            {
                key: 'loss.peopleDeathUnknownCount',
                value: { title: 'Unknown - People Death' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleDeathUnknownCount'),
            },
            {
                key: 'loss.peopleDeathDisabledCount',
                value: { title: 'Disabled - People Death' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleDeathDisabledCount'),
            },
            {
                key: 'loss.peopleMissingCount',
                value: { title: 'Total - People Missing' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleMissingCount'),
            },
            {
                key: 'loss.peopleMissingMaleCount',
                value: { title: 'Male - People Missing' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleMissingMaleCount'),
            },
            {
                key: 'loss.peopleMissingFemaleCount',
                value: { title: 'Female - People Missing' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleMissingFemaleCount'),
            },
            {
                key: 'loss.peopleMissingUnknownCount',
                value: { title: 'Unknown - People Missing' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleMissingUnknownCount'),
            },
            {
                key: 'loss.peopleMissingDisabledCount',
                value: { title: 'Disabled - People Missing' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleMissingDisabledCount'),
            },
            {
                key: 'loss.peopleInjuredCount',
                value: { title: 'Total - People Injured' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleInjuredCount'),
            },
            {
                key: 'loss.peopleInjuredMaleCount',
                value: { title: 'Male - People Injured' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleInjuredMaleCount'),
            },
            {
                key: 'loss.peopleInjuredFemaleCount',
                value: { title: 'Female - People Injured' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleInjuredFemaleCount'),
            },
            {
                key: 'loss.peopleInjuredUnknownCount',
                value: { title: 'Unknown - People Injured' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleInjuredUnknownCount'),
            },
            {
                key: 'loss.peopleInjuredDisabledCount',
                value: { title: 'Disabled - People Injured' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'loss.peopleInjuredDisabledCount'),
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
                        rowHeight={30}
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
