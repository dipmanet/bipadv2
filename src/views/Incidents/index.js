import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DateOutput from '#components/DateOutput';

import {
    RequestCoordinator,
    RequestClient,
    requestMethods,
} from '#request';

import {
    barChartData,
    pieChartData,
    donutChartData1,
    donutChartData2,
} from '#resources/data';

import {
    incidentListSelectorIP,
    setIncidentListActionIP,
} from '#redux';

import Page from '#components/Page';
import ListView from '#rscv/List/ListView';
import { iconNames } from '#constants';

import SimpleVerticalBarChart from '#rscz/SimpleVerticalBarChart';
import PieChart from '#rscz/PieChart';
import DonutChart from '#rscz/DonutChart';
import { basicColor } from '#constants/colorScheme';
import _cs from '#cs';

import IncidentItem from './IncidentItem';
import IncidentsFilter from './Filter';
import Map from './Map';

import styles from './styles.scss';

const requests = {
    incidentsRequest: {
        method: requestMethods.GET,
        url: '/incident/',
        onSuccess: ({ response, props: { setIncidentList } }) => {
            if (response.status === 'success') {
                setIncidentList(response);
            }
        },
    },
    // TODO: add schema, onFailure, onFatal
};
const emptyObject = {};
const incidentKeySelector = d => d.pk;

const barChartValueSelector = d => d.value;
const barChartLabelSelector = d => d.label;

const pieChartValueSelector = d => d.value;
const pieChartLabelSelector = d => d.label;

const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;

const propTypes = {
    incidentList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {};

const mapStateToProps = state => ({
    incidentList: incidentListSelectorIP(state),
});

const mapDispatchToProps = dispatch => ({
    setIncidentList: params => dispatch(setIncidentListActionIP(params)),
});

@connect(mapStateToProps, mapDispatchToProps)
@RequestCoordinator
@RequestClient(requests)
export default class Incidents extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getIncidentRendererParams = (_, d) => ({
        data: d,
        className: styles.incident,
    });

    renderIncidents = ({
        className,
        data,
    }) => (
        <div className={className}>
            <header className={styles.header}>
                <h4 className={styles.heading}>
                    Incidents
                </h4>
            </header>
            <ListView
                className={styles.incidentList}
                data={data}
                renderer={IncidentItem}
                rendererParams={this.getIncidentRendererParams}
                keySelector={incidentKeySelector}
            />
        </div>
    );

    renderKeyStatistics = ({ className }) => {
        console.warn('rendering key statistics');

        return (
            <div className={className}>
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        Key statistics
                    </h4>
                </header>
                <div className={styles.content}>
                    <div className={styles.donutCharts}>
                        <DonutChart
                            className={styles.donutChart1}
                            data={donutChartData1}
                            labelSelector={donutChartLabelSelector}
                            valueSelector={donutChartValueSelector}
                            sideLengthRatio={0.3}
                            colorScheme={basicColor}
                        />
                        <DonutChart
                            className={styles.donutChart2}
                            data={donutChartData2}
                            colorScheme={basicColor}
                            labelSelector={donutChartLabelSelector}
                            valueSelector={donutChartValueSelector}
                            sideLengthRatio={0.3}
                        />
                    </div>
                    <PieChart
                        className={styles.pieChart}
                        colorScheme={basicColor}
                        data={pieChartData}
                        labelSelector={pieChartLabelSelector}
                        valueSelector={pieChartValueSelector}
                    />
                    <SimpleVerticalBarChart
                        className={styles.barChart}
                        data={barChartData}
                        labelSelector={barChartLabelSelector}
                        valueSelector={barChartValueSelector}
                    />
                </div>
            </div>
        );
    }

    render() {
        const {
            incidentList,
        } = this.props;

        const IncidentInfo = this.renderIncidents;

        return (
            <React.Fragment>
                <Map incidentList={incidentList} />
                <Page
                    leftContentClassName={styles.left}
                    leftContent={
                        <IncidentInfo
                            className={styles.incidents}
                            data={incidentList}
                        />
                    }
                    rightContentClassName={styles.right}
                    rightContent={
                        <IncidentsFilter />
                    }
                />
            </React.Fragment>
        );
    }
}
