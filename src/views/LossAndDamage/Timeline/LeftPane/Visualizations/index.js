import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import { isDefined } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import DonutChart from '#rscz/DonutChart';

import { hazardTypesList } from '#utils/domain';
import { groupList, sum } from '#utils/common';
import HazardsLegend from '#components/HazardsLegend';

import {
    hazardTypesSelector,
} from '#selectors';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: undefined,
};

const emptyList = [];
const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;
const donutChartColorSelector = d => d.color;

const estimatedMonetaryLossLabelModifier = (label, value) => (
    `<div>${label}</div>`
    + `<div>${Numeral.renderText({ prefix: 'Rs. ', value, precision: 0 })}</div>`
);
const deathsLabelModifier = (label, value) => (
    `<div>${label}</div>`
    + `<div>${value}</div>`
);

const mapStateToProps = state => ({
    hazardTypes: hazardTypesSelector(state),
});


class Visualizations extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    getHazardTypes = memoize((lossAndDamageList) => {
        const { hazardTypes } = this.props;
        return hazardTypesList(lossAndDamageList, hazardTypes);
    })

    getHazardPeopleDeathCount = memoize((lossAndDamageList) => {
        const { hazardTypes } = this.props;
        return groupList(
            lossAndDamageList.filter(v => (
                isDefined(v.loss) && isDefined(v.loss.peopleDeathCount)
            )),
            loss => loss.hazard,
        )
            .map(({ key, value }) => ({
                // FIXME: potentially unsafe
                label: hazardTypes[key].title,
                color: hazardTypes[key].color,
                value: sum(value.map(val => val.loss.peopleDeathCount)),
            }))
            .filter(({ value }) => value > 0)
            .sort((a, b) => a.value - b.value);
    })

    getHazardLossEstimation = memoize((lossAndDamageList) => {
        const { hazardTypes } = this.props;
        return groupList(
            lossAndDamageList.filter(v => (
                isDefined(v.loss) && isDefined(v.loss.estimatedLoss)
            )),
            loss => loss.hazard,
        )
            .map(({ key, value }) => ({
                // FIXME: potentially unsafe
                label: hazardTypes[key].title,
                color: hazardTypes[key].color,
                value: sum(value.map(val => val.loss.estimatedLoss)),
            }))
            .filter(({ value }) => value > 0)
            .sort((a, b) => a.value - b.value);
    });

    render() {
        const {
            className,
            lossAndDamageList = emptyList,
        } = this.props;

        const hazardDeaths = this.getHazardPeopleDeathCount(lossAndDamageList);
        const hazardLossEstimate = this.getHazardLossEstimation(lossAndDamageList);
        const filteredHazardTypesList = this.getHazardTypes(lossAndDamageList);

        return (
            <React.Fragment>
                <div className={styles.visualizationContainer}>
                    <div className={styles.donutContainer}>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                Total people death by hazard
                            </h4>
                        </header>
                        <DonutChart
                            sideLengthRatio={0.4}
                            className={styles.chart}
                            data={hazardDeaths}
                            labelSelector={donutChartLabelSelector}
                            valueSelector={donutChartValueSelector}
                            labelModifier={deathsLabelModifier}
                            colorSelector={donutChartColorSelector}
                            hideLabel
                        />
                    </div>
                    <div className={styles.donutContainer}>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                Estimated monetary loss by hazard
                            </h4>
                        </header>
                        <DonutChart
                            sideLengthRatio={0.4}
                            className={styles.chart}
                            data={hazardLossEstimate}
                            labelSelector={donutChartLabelSelector}
                            valueSelector={donutChartValueSelector}
                            labelModifier={estimatedMonetaryLossLabelModifier}
                            colorSelector={donutChartColorSelector}
                            hideLabel
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
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(Visualizations);
