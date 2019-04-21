import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {
    _cs,
    compareString,
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
} from '#utils/table';

import educationIcon from '#resources/icons/Education.svg';
import financeIcon from '#resources/icons/University.svg';
import healthFacilityIcon from '#resources/icons/health-facility.svg';
import groupIcon from '#resources/icons/group.svg';

import styles from './styles.scss';

const Taebul = Sortable(ColumnWidth(NormalTaebul));

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
        this.columns = prepareColumns([
            {
                key: 'title',
                value: { title: 'Title' },
                comparator: (a, b) => compareString(a.title, b.title),
            },
            {
                key: 'resourceType',
                value: { title: 'Resource Type' },
                comparator: (a, b) => compareString(a.resourceType, b.resourceType),
            },
            {
                key: 'point',
                value: { title: 'Location' },

                transformer: ({ point: { coordinates } }) => coordinates,
                csvTransformer: ({ point: { coordinates } }) => `${coordinates[0]}, ${coordinates[1]}`,

                // FIXME: add styling
                cellRenderer: ({ value }) => (
                    <React.Fragment>
                        <Numeral
                            precision={4}
                            value={value[0]}
                        />
                        ,
                        <Numeral
                            precision={4}
                            value={value[1]}
                        />
                    </React.Fragment>
                ),
            },
            {
                key: 'distance',
                value: { title: 'Distance' },
                comparator: (a, b) => compareNumber(a.distance, b.distance),

                csvTransformer: val => `${val.distance} m`,
                // FIXME: add styling
                cellRenderer: ({ value }) => (
                    <Numeral
                        value={value}
                        precision={null}
                        suffix=" m"
                    />
                ),
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
            resourceList,
        } = this.props;

        const resourceListForExport = this.convertValues(resourceList, this.columns);

        return (
            <div className={_cs(className, styles.tabularView)}>
                <div className={styles.tableContainer}>
                    <Taebul
                        className={styles.resourcesTable}
                        headClassName={styles.head}
                        data={resourceList}
                        keySelector={TabularView.tableKeySelector}
                        columns={this.columns}

                        settings={this.state.settings}
                        onChange={this.handleSettingsChange}
                    />
                </div>
                <div className={styles.downloadLinkContainer}>
                    <DownloadButton
                        onClick={this.handleClick}
                        value={resourceListForExport}
                    >
                        Download csv
                    </DownloadButton>
                </div>
            </div>
        );
    }
}
