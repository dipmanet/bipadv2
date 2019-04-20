import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {
    _cs,
    compareDate,
    compareNumber,
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

        const getHazardTitle = ({ hazardInfo: { title } = {} }) => title;
        const getEstimatedLoss = ({ hazardInfo: { estimatedLoss } = {} }) => estimatedLoss;
        const getInfraCount = ({ hazardInfo: { infrastructureDestroyedCount } = {} }) => (
            infrastructureDestroyedCount
        );
        const getLiveCount = ({ hazardInfo: { livestockDestroyedCount } = {} }) => (
            livestockDestroyedCount
        );
        const getPeopleCount = ({ hazardInfo: { peopleDeathCount } = {} }) => (
            peopleDeathCount
        );

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
                key: 'count',
                value: { title: 'No. of incidents' },
                comparator: (a, b, d) => compareString(a.count, b.count, d),
            },
            {
                key: 'estimatedLoss',
                value: { title: 'Total estimated loss' },

                comparator: (a, b, d) => compareNumber(getEstimatedLoss(a), getEstimatedLoss(b), d),
                transformer: getEstimatedLoss,
            },
            {
                key: 'infrastructureDestroyedCount',
                value: { title: 'Total infrastructure destroyed' },

                comparator: (a, b, d) => compareNumber(getInfraCount(a), getInfraCount(b), d),
                transformer: getInfraCount,
            },
            {
                key: 'livestockDestroyedCount',
                value: { title: 'Total livestock destroyed' },

                comparator: (a, b, d) => compareNumber(getLiveCount(a), getLiveCount(b), d),
                transformer: getLiveCount,
            },
            {
                key: 'peopleDeathCount',
                value: { title: 'Total people death' },

                comparator: (a, b, d) => compareNumber(getPeopleCount(a), getPeopleCount(b), d),
                transformer: getPeopleCount,
            },
            {
                key: 'createdOn',
                value: { title: 'Created on' },
                comparator: (a, b, d) => compareDate(a.createdOn, b.createdOn, d),

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
            lossAndDamageList,
        } = this.props;

        const lossAndDamageListForExport = this.convertValues(lossAndDamageList, this.columns);

        return (
            <div className={_cs(className, styles.tabularView)}>
                <div className={styles.tableContainer}>
                    <Taebul
                        className={styles.lossAndDamagesTable}
                        data={lossAndDamageList}
                        headClassName={styles.head}
                        keySelector={TabularView.tableKeySelector}
                        columns={this.columns}

                        settings={this.state.settings}
                        onChange={this.handleSettingsChange}
                    />
                </div>
                <div className={styles.downloadLinkContainer}>
                    <DownloadButton
                        onClick={this.handleClick}
                        value={lossAndDamageList}
                    >
                        Download csv
                    </DownloadButton>
                </div>
            </div>
        );
    }
}
