import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import { groupList, sum } from '#utils/common';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';

import { hazardTypesList } from '#utils/domain';
import Button from '#rsca/Button';
import Spinner from '#rscz/Spinner';
import HazardsLegend from '#components/HazardsLegend';

import SimpleVerticalBarChart from '#rscz/SimpleVerticalBarChart';
import DonutChart from '#rscz/DonutChart';
import ParallelCoordinates from '#rscz/ParallelCoordinates';

import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';

import {
    hazardTypesSelector,
} from '#selectors';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    hazardTypes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    pending: PropTypes.bool,
    lossAndDamageList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: undefined,
    pending: false,
    lossAndDamageList: [],
};

const margins = {
    top: 30,
    right: 20,
    bottom: 20,
    left: 20,
};

const barChartValueSelector = d => d.value;
const barChartLabelSelector = d => d.label;
const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;
const donutChartLabelModifier = (label, value) => `<div>${label}</div><div>Rs.${value}</div>`;
const donutChartColorSelector = d => d.color;
const parallelLabelSelector = d => d.label;
const parallelColorSelector = d => d.color;

const mapStateToProps = state => ({
    hazardTypes: hazardTypesSelector(state),
});

class LeftPane extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showDetails: true,
        };
    }

    getHazardTypes = memoize((lossAndDamageList) => {
        const { hazardTypes } = this.props;
        return hazardTypesList(lossAndDamageList, hazardTypes);
    })

    getHazardLossEstimation = memoize((lossAndDamageList) => {
        const { hazardTypes } = this.props;
        return groupList(
            lossAndDamageList.filter(v => (
                isDefined(v.loss) && isDefined(v.loss.estimatedLoss)
            )),
            incident => incident.hazard,
        ).map(({ key, value }) => ({
            // FIXME: potentially unsafe
            label: hazardTypes[key].title,
            color: hazardTypes[key].color,
            value: sum(value.map(val => val.loss.estimatedLoss)),
        })).filter(({ value }) => value > 0);
    });

    getHazardLossType = memoize((lossAndDamageList) => {
        const { hazardTypes } = this.props;
        return groupList(
            lossAndDamageList.filter(v => (
                isDefined(v.loss) && (
                    isDefined(v.loss.peopleDeathCount)
                    || isDefined(v.loss.livestockDestroyedCount)
                )
            )),
            incident => incident.hazard,
        ).map(({ key, value }) => ({
            // FIXME: potentially unsafe
            label: hazardTypes[key].title,
            color: hazardTypes[key].color,
            people: sum(value.map(val => val.loss.peopleDeathCount).filter(isDefined)),
            livestock: sum(value.map(val => val.loss.livestockDestroyedCount).filter(isDefined)),
        })).filter(({ people, livestock }) => people > 0 || livestock > 0);
    });

    getLossTypeCount = memoize((lossAndDamageList) => {
        const losses = lossAndDamageList
            .map(item => item.loss)
            .filter(isDefined);

        if (losses.length === 0) {
            return [];
        }

        const labelMap = {
            peopleDeathCount: 'People Death Count',
            livestockDestroyedCount: 'Livestock Destroyed Count',
            infrastructureDestroyedCount: 'Infrastructure Destroyed Count',
        };

        const people = sum(losses.map(loss => loss.peopleDeathCount).filter(isDefined));
        const livestock = sum(losses.map(loss => loss.liveStockDestroyedCount).filter(isDefined));
        const infra = sum(losses.map(loss => loss.infrastructureDestroyedCount).filter(isDefined));

        return [
            { label: 'People death', value: people },
            { label: 'Livestock death', value: livestock },
            { label: 'Infrastructure destroyed', value: infra },
        ].filter(({ value }) => value > 0);
    });

    handleShowDetailsButtonClick = () => {
        const { onExpandChange } = this.props;
        this.setState({ showDetails: true });

        if (onExpandChange) {
            onExpandChange(true);
        }
    }

    handleCollapseDetailsView = () => {
        const { onExpandChange } = this.props;
        this.setState({ showDetails: false });

        if (onExpandChange) {
            onExpandChange(false);
        }
    }

    renderSummary = ({ district }) => {
        const {
            lossAndDamageList,
            pending,
        } = this.props;

        const countData = this.getLossTypeCount(lossAndDamageList);
        const hazardLossEstimate = this.getHazardLossEstimation(lossAndDamageList);
        const hazardLossType = this.getHazardLossType(lossAndDamageList);
        const filteredHazardTypesList = this.getHazardTypes(lossAndDamageList);

        return (
            <div className={styles.districtSummary}>
                <div className={styles.content}>
                    <div className={styles.visualizationContainer}>
                        <div className={styles.parallelContainer}>
                            <header className={styles.header}>
                                <h4 className={styles.heading}>
                                    Hazard Death Count
                                </h4>
                            </header>
                            <ParallelCoordinates
                                data={hazardLossType}
                                className={styles.chart}
                                ignoreProperties={['label', 'color']}
                                labelSelector={parallelLabelSelector}
                                colorSelector={parallelColorSelector}
                                margins={margins}
                            />
                        </div>
                        <div className={styles.donutContainer}>
                            <header className={styles.header}>
                                <h4 className={styles.heading}>
                                    Estimated Monetary Loss
                                </h4>
                            </header>
                            <DonutChart
                                sideLengthRatio={0.4}
                                className={styles.chart}
                                data={hazardLossEstimate}
                                labelSelector={donutChartLabelSelector}
                                valueSelector={donutChartValueSelector}
                                labelModifier={donutChartLabelModifier}
                                colorSelector={donutChartColorSelector}
                            />
                        </div>
                        <div className={styles.barContainer}>
                            <header className={styles.header}>
                                <h4 className={styles.heading}>
                                    Total Loss Count
                                </h4>
                            </header>
                            <SimpleVerticalBarChart
                                className={styles.chart}
                                data={countData}
                                labelSelector={barChartLabelSelector}
                                valueSelector={barChartValueSelector}
                            />
                        </div>
                    </div>
                    <div className={styles.legendContainer}>
                        <HazardsLegend
                            filteredHazardTypes={filteredHazardTypesList}
                            className={styles.legend}
                            itemClassName={styles.legendItem}
                        />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {
            className,
            pending,
        } = this.props;

        const {
            showDetails,
        } = this.state;

        const DistrictSummary = this.renderSummary;

        return (
            <CollapsibleView
                className={_cs(className, styles.leftPane)}
                expanded={showDetails}
                collapsedViewContainerClassName={styles.showDetailsButtonContainer}
                collapsedView={
                    <React.Fragment>
                        <Button
                            className={styles.showDetailsButton}
                            onClick={this.handleShowDetailsButtonClick}
                            iconName={iconNames.lossAndDamange}
                            title="Show details"
                        />
                        <Spinner loading={pending} />
                    </React.Fragment>
                }
                expandedViewContainerClassName={styles.visualizationsContainer}
                expandedView={
                    <div className={styles.visualizations}>
                        <header className={styles.header}>
                            <h3 className={styles.heading}>
                                Summary
                            </h3>
                            <Spinner
                                className={styles.spinner}
                                loading={pending}
                            />
                            <Button
                                className={styles.collapseDetailsButton}
                                onClick={this.handleCollapseDetailsView}
                                iconName={iconNames.chevronUp}
                                title="Hide detailed view"
                                transparent
                            />
                        </header>
                        <div className={styles.summaryList}>
                            <DistrictSummary />
                        </div>
                    </div>
                }
            />
        );
    }
}

export default connect(mapStateToProps)(LeftPane);
