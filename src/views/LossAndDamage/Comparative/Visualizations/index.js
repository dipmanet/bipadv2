import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import { isDefined } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import HorizontalBar from '#rscz/HorizontalBar';
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

const peopleDeathChartColorScheme = [
    '#e53935',
];

const estimatedLossChartColorScheme = [
    '#ffefc3',
];

const barChartMargins = {
    left: 48,
    top: 10,
    right: 10,
    bottom: 48,
};

const estimatedLossValueSelector = d => d.estimatedLoss;
const estimatedLossValueLabelSelector = (d) => {
    const { number, normalizeSuffix } = Numeral.getNormalizedNumber({
        value: d,
        normal: true,
        precision: 0,
    });
    if (normalizeSuffix) {
        return `${number}${normalizeSuffix}`;
    }
    return number;
};
const estimatedLossLabelSelector = d => d.label;

const deathCountValueSelector = d => d.peopleDeathCount;
const deathCountLabelSelector = d => d.label;

const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;
const donutChartLabelModifier = (label, value) => `<div>${label}</div><div>Rs.${value}</div>`;
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

    getLossSummary = memoize(lossAndDamageList => (
        groupList(
            lossAndDamageList.filter(v => isDefined(v.loss)),
            item => new Date(item.incidentOn).getFullYear(),
        ).map(({ key, value }) => ({
            label: key,
            peopleDeathCount: sum(value.map(val => val.loss.peopleDeathCount)),
            estimatedLoss: sum(value.map(val => val.loss.estimatedLoss)),
        }))
    ))

    render() {
        const {
            className,
            lossAndDamageList = emptyList,
        } = this.props;

        const hazardLossEstimate = this.getHazardLossEstimation(lossAndDamageList);
        const hazardDeaths = this.getHazardPeopleDeathCount(lossAndDamageList);
        const filteredHazardTypesList = this.getHazardTypes(lossAndDamageList);
        const lossSummary = this.getLossSummary(lossAndDamageList);

        return (
            <React.Fragment>
                <div className={styles.visualizationContainer}>
                    <div className={styles.barChartContainer}>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                People death count
                            </h4>
                        </header>
                        <HorizontalBar
                            className={styles.chart}
                            data={lossSummary}
                            labelSelector={deathCountLabelSelector}
                            valueSelector={deathCountValueSelector}
                            colorScheme={peopleDeathChartColorScheme}
                            tiltLabels
                            margins={barChartMargins}
                        />
                    </div>
                    <div className={styles.barChartContainer}>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                Estimated Monetary Loss
                            </h4>
                        </header>
                        <HorizontalBar
                            className={styles.chart}
                            data={lossSummary}
                            labelSelector={estimatedLossLabelSelector}
                            valueSelector={estimatedLossValueSelector}
                            valueLabelFormat={estimatedLossValueLabelSelector}
                            colorScheme={estimatedLossChartColorScheme}
                            margins={barChartMargins}
                            tiltLabels
                        />
                    </div>
                    <div className={styles.donutContainer}>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                Total number of deaths per hazards
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
                        />
                    </div>
                    <div className={styles.donutContainer}>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                Estimated Monetary Loss by Hazard
                            </h4>
                        </header>
                        <div className={styles.content}>
                            <DonutChart
                                sideLengthRatio={0.4}
                                className={styles.chart}
                                data={hazardLossEstimate}
                                labelSelector={donutChartLabelSelector}
                                valueSelector={donutChartValueSelector}
                                labelModifier={donutChartLabelModifier}
                                colorSelector={donutChartColorSelector}
                            />
                            <HazardsLegend
                                filteredHazardTypes={filteredHazardTypesList}
                                className={styles.legend}
                                itemClassName={styles.legendItem}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(Visualizations);
