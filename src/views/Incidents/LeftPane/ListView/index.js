import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import VirtualizedListView from '#rscv/VirtualizedListView';

import IncidentItem from '../IncidentItem';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    incidentList: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
    className: undefined,
    incidentList: [],
};

const incidentKeySelector = d => d.id;

export default class IncidentListView extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    getIncidentRendererParams = (_, d) => ({
        data: d,
        className: styles.incident,
        hazardTypes: this.props.hazardTypes,
        recentDay: this.props.recentDay,
    });

    render() {
        const {
            className,
            incidentList,
            hazardTypes,
            pending,
        } = this.props;

        return (
            <VirtualizedListView
                className={
                    _cs(
                        styles.incidentList,
                        className,
                    )
                }
                data={incidentList}
                renderer={IncidentItem}
                rendererParams={this.getIncidentRendererParams}
                keySelector={incidentKeySelector}
                emptyMessage="There are no incidents at the moment."
            />
        );
    }
}
