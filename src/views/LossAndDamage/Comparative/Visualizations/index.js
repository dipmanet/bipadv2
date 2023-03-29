import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import { isDefined } from '@togglecorp/fujs';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';


import Numeral from '#rscv/Numeral';
import {
    hazardTypesSelector,
    languageSelector,
} from '#selectors';
import { groupList, sum } from '#utils/common';
import { hazardTypesList } from '#utils/domain';
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
    language: languageSelector(state),
});

class Visualizations extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    getHazardTypes = memoize((lossAndDamageList) => {
        const { hazardTypes } = this.props;
        return hazardTypesList(lossAndDamageList, hazardTypes);
    })

    getHazardPeopleDeathCount = memoize((lossAndDamageList, language) => {
        const { hazardTypes } = this.props;
        return groupList(
            lossAndDamageList.filter(v => (
                isDefined(v.loss) && isDefined(v.loss.peopleDeathCount)
            )),
            loss => loss.hazard,
        )
            .map(({ key, value }) => ({
                // FIXME: potentially unsafe
                label: language === 'en' ? hazardTypes[key].title : hazardTypes[key].titleNe,
                color: hazardTypes[key].color,
                value: sum(value.map(val => val.loss.peopleDeathCount)),
            }))
            .filter(({ value }) => value > 0)
            .sort((a, b) => a.value - b.value);
    })

    getHazardLossEstimation = memoize((lossAndDamageList, language) => {
        const { hazardTypes } = this.props;
        return groupList(
            lossAndDamageList.filter(v => (
                isDefined(v.loss) && isDefined(v.loss.estimatedLoss)
            )),
            loss => loss.hazard,
        )
            .map(({ key, value }) => ({
                // FIXME: potentially unsafe
                label: language === 'en' ? hazardTypes[key].title : hazardTypes[key].titleNe,
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
            language: { language },
        } = this.props;

        const hazardLossEstimate = this.getHazardLossEstimation(lossAndDamageList, language);
        const hazardDeaths = this.getHazardPeopleDeathCount(lossAndDamageList, language);
        const lossSummary = this.getLossSummary(lossAndDamageList);
        console.log('loss summary: ', lossSummary);
        // height: `${60 + lossSummary.length * 40}px`,

        return (
            <div className={styles.visualizationContainer}>
                <div className={styles.chartContainer}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            <Translation>
                                {
                                    t => <span>{t('People death count')}</span>
                                }

                            </Translation>
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
                            <Translation>
                                {
                                    t => <span>{t('Estimated Monetary Loss')}</span>
                                }
                            </Translation>

                        </h4>
                    </header>
                    <div
                        className={styles.barChart}
                        style={{ height: `${60 + lossSummary.length * 40}px` }}
                    >
                        <Translation>
                            {
                                t => (
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={lossSummary}
                                            layout="vertical"
                                        >
                                            <Tooltip
                                                formatter={value => ([estimatedLossValueFormatter(value), `${t('Estimated Monetary Loss')}`])}
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
                                )
                            }
                        </Translation>

                    </div>
                </div>
                <div className={styles.chartContainer}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            <Translation>
                                {
                                    t => <span>{t('Death toll by disaster')}</span>
                                }
                            </Translation>
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
                            <Translation>
                                {
                                    t => <span>{t('Estimated economic loss by disaster')}</span>
                                }
                            </Translation>
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
