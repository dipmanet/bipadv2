import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { schemeAccent } from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3-scale';

import {
    _cs,
    mapToList,
} from '@togglecorp/fujs';

import Button from '#rsca/Button';
import Spinner from '#rscz/Spinner';

import SimpleVerticalBarChart from '#rscz/SimpleVerticalBarChart';
import DonutChart from '#rscz/DonutChart';
import Legend from '#rscz/Legend';
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
};

const defaultProps = {
    className: undefined,
    pending: false,
};
const colors = scaleOrdinal().range(schemeAccent);

const barChartValueSelector = d => d.value;
const barChartLabelSelector = d => d.label;
const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;
const donutChartColorSelector = d => d.color;
const parallelLabelSelector = d => d.label;
const parallelColorSelector = d => d.color;

const itemSelector = d => d.label;
const legendColorSelector = d => d.color;
const legendLabelSelector = d => d.label;

class LeftPane extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showDetails: true,
        };
    }

    getHazardLossEstimation = memoize((lossAndDamageList) => {
        const { hazardTypes } = this.props;

        const lossEstimation = lossAndDamageList
            .filter(v => (
                v.loss !== undefined &&
                v.loss.estimatedLoss
            ))
            .reduce((acc, current) => {
                if (acc[current.hazard] === undefined) {
                    acc[current.hazard] = 0;
                } else {
                    acc[current.hazard] += current.loss.estimatedLoss;
                }
                return acc;
            }, {});

        return mapToList(
            lossEstimation,
            (d, k) => ({
                label: hazardTypes[k].title,
                value: d,
                color: colors(hazardTypes[k].title),
            }),
        );
    });

    getHazardLossType = memoize((lossAndDamageList) => {
        const { hazardTypes } = this.props;

        const hazardLossType = lossAndDamageList
            .filter(v => (
                v.loss !== undefined && (
                    v.loss.peopleDeathCount ||
                    v.loss.livestockDestroyedCount ||
                    v.loss.infrastructureDestroyedCount
                )))
            .reduce((acc, current) => {
                if (acc[current.hazard] === undefined) {
                    acc[current.hazard] = {
                        people: 0,
                        infrastructure: 0,
                        livestock: 0,
                    };
                } else {
                    const {
                        peopleDeathCount = 0,
                        livestockDestroyedCount = 0,
                        infrastructureDestroyedCount = 0,
                    } = current.loss;

                    acc[current.hazard].people += peopleDeathCount;
                    acc[current.hazard].infrastructure +=
                        infrastructureDestroyedCount;
                    acc[current.hazard].livestock += livestockDestroyedCount;
                }
                return acc;
            }, {});

        return mapToList(
            hazardLossType,
            (d, k) => ({
                ...d,
                label: hazardTypes[k].title,
            }),
        ).filter(item => !(
            item.people === 0 &&
            item.livestock === 0 &&
            item.infrastructure === 0
        )).map(item => ({ ...item, color: colors(item.label) }));
    });

    getLossTypeCount = memoize((lossAndDamageList) => {
        const losses = lossAndDamageList.map(item => item.loss).filter(v => v !== undefined);

        if (losses.length === 0) {
            return [];
        }

        const acc = {
            peopleDeathCount: 0,
            livestockDestroyedCount: 0,
            infrastructureDestroyedCount: 0,
        };

        losses.forEach((current) => {
            const {
                peopleDeathCount = 0,
                livestockDestroyedCount = 0,
                infrastructureDestroyedCount = 0,
            } = current;
            acc.peopleDeathCount += peopleDeathCount;
            acc.livestockDestroyedCount += livestockDestroyedCount;
            acc.infrastructureDestroyedCount += infrastructureDestroyedCount;
        });

        return mapToList(
            acc,
            (d, k) => ({
                label: k,
                value: d,
            }),
        );
    });

    handleShowDetailsButtonClick = () => {
        this.setState({ showDetails: true });
    }

    handleCollapseDetailsView = () => {
        this.setState({ showDetails: false });
    }

    renderLegend = colorMap => (
        <Legend
            className={styles.legend}
            data={colorMap}
            itemClassName={styles.legendItem}
            keySelector={itemSelector}
            labelSelector={legendLabelSelector}
            colorSelector={legendColorSelector}
        />
    )

    render() {
        const {
            className,
            lossAndDamageList,
            pending,
        } = this.props;

        const countData = this.getLossTypeCount(lossAndDamageList);
        const hazardLossEstimate = this.getHazardLossEstimation(lossAndDamageList);
        const hazardLossType = this.getHazardLossType(lossAndDamageList);

        const {
            showDetails,
        } = this.state;

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
                            <h4 className={styles.heading}>
                                Details
                            </h4>
                            <Button
                                className={styles.collapseDetailsButton}
                                onClick={this.handleCollapseDetailsView}
                                iconName={iconNames.shrink}
                                title="Hide detailed view"
                                transparent
                            />
                        </header>
                        <div className={styles.content}>
                            <div className={styles.barContainer}>
                                <header className={styles.header}>
                                    <h4 className={styles.heading}>
                                        Loss count
                                    </h4>
                                </header>
                                <SimpleVerticalBarChart
                                    className={styles.chart}
                                    data={countData}
                                    labelSelector={barChartLabelSelector}
                                    valueSelector={barChartValueSelector}
                                />
                            </div>
                            <div className={styles.donutContainer}>
                                <header className={styles.header}>
                                    <h4 className={styles.heading}>
                                        Estimated Monetary Loss
                                    </h4>
                                </header>
                                <DonutChart
                                    sideLengthRatio={0.5}
                                    className={styles.chart}
                                    data={hazardLossEstimate}
                                    labelSelector={donutChartLabelSelector}
                                    valueSelector={donutChartValueSelector}
                                    colorSelector={donutChartColorSelector}
                                />
                                { this.renderLegend(hazardLossEstimate) }
                            </div>
                            <div className={styles.parallelContainer}>
                                <header className={styles.header}>
                                    <h4 className={styles.heading}>
                                        Hazard Loss Details
                                    </h4>
                                </header>
                                <ParallelCoordinates
                                    data={hazardLossType}
                                    className={styles.chart}
                                    ignoreProperties={['label', 'color']}
                                    labelSelector={parallelLabelSelector}
                                    colorSelector={parallelColorSelector}
                                    margins={{
                                        top: 20,
                                        right: 20,
                                        bottom: 20,
                                        left: 20,
                                    }}
                                />
                                { this.renderLegend(hazardLossType) }
                            </div>
                        </div>
                    </div>
                }
            />
        );
    }
}

const mapStateToProps = state => ({
    hazardTypes: hazardTypesSelector(state),
});

export default connect(mapStateToProps)(LeftPane);
