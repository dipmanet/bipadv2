import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import {
    ResponsiveContainer,
    PieChart,
    BarChart,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    Bar,
    Pie,
    Cell,
} from 'recharts';

import { isDefined } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import { hazardTypesList } from '#utils/domain';
import { groupList, sum } from '#utils/common';

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

const estimatedLossValueFormatter = (d) => {
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
        const lossSummary = this.getLossSummary(lossAndDamageList);
        // height: `${60 + lossSummary.length * 40}px`,

        return (
            <div className={styles.visualizationContainer}>
                <div className={styles.chartContainer}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            People death count
                        </h4>
                    </header>
                    <div
                        className={styles.barChart}
                        style={{ height: `${60 + lossSummary.length * 40}px` }}
                    >
                        <ResponsiveContainer>
                            <BarChart
                                data={lossSummary}
                                layout="vertical"
                            >
                                <Tooltip
                                    formatter={value => ([value, 'No of Deaths'])}
                                />
                                <Bar
                                    layout="vertical"
                                    dataKey="peopleDeathCount"
                                    fill="#ff6361"
                                />
                                <XAxis
                                    dataKey="peopleDeathCount"
                                    type="number"
                                />
                                <YAxis
                                    dataKey="label"
                                    type="category"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className={styles.chartContainer}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            Estimated Monetary Loss
                        </h4>
                    </header>
                    <div
                        className={styles.barChart}
                        style={{ height: `${60 + lossSummary.length * 40}px` }}
                    >
                        <ResponsiveContainer>
                            <BarChart
                                data={lossSummary}
                                layout="vertical"
                            >
                                <Tooltip
                                    formatter={value => ([estimatedLossValueFormatter(value), 'Estimated Monetary Loss'])}
                                />
                                <Bar
                                    layout="vertical"
                                    dataKey="estimatedLoss"
                                    fill="#58508d"
                                />
                                <XAxis
                                    dataKey="estimatedLoss"
                                    type="number"
                                />
                                <YAxis
                                    dataKey="label"
                                    type="category"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className={styles.chartContainer}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            Death toll by disaster
                        </h4>
                    </header>
                    <div className={styles.pieChart}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Tooltip />
                                <Pie
                                    dataKey="value"
                                    nameKey="label"
                                    data={hazardDeaths}
                                    innerRadius="70%"
                                    outerRadius="90%"
                                >
                                    { hazardDeaths.map(hazard => (
                                        <Cell
                                            key={hazard.label}
                                            fill={hazard.color}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className={styles.chartContainer}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            Estimated economic loss by disaster
                        </h4>
                    </header>
                    <div className={styles.pieChart}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Tooltip />
                                <Pie
                                    dataKey="value"
                                    nameKey="label"
                                    data={hazardLossEstimate}
                                    innerRadius="70%"
                                    outerRadius="90%"
                                >
                                    { hazardLossEstimate.map(loss => (
                                        <Cell
                                            key={loss.label}
                                            fill={loss.color}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Visualizations);
