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
                key: 'title',
                value: { title: 'Name' },
                comparator: createComparator(compareString, 'title'),
            },
            {
                key: 'elevation',
                value: { title: 'Elevation(m)' },
                comparator: createComparator(compareString, 'elevation'),
            },
            {
                key: 'totalArea',
                value: { title: 'Total Area(m²)' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'totalArea'),
            },
            {
                key: 'capacity',
                value: { title: 'Capacity(Persons)' },
                cellRenderer: NumeralCell,
                comparator: createComparator(compareNumber, 'capacity'),
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
                        value={incidentListForExport}
                        name="incidents"
                    >
                        Download csv
                    </DownloadButton>
                </div>
            </div>
        );
    }
}
