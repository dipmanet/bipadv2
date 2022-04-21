import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { schemeAccent } from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3-scale';
import {
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    Cell,
    LabelList,
} from 'recharts';
import { Translation } from 'react-i18next';
import Button from '#rsca/Button';

import {
    saveChart,
    groupList,
} from '#utils/common';

import { languageSelector } from '#selectors';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    hazardTypes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    incidentList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: undefined,
    incidentList: [],
    hazardTypes: {},
};

const colors = scaleOrdinal().range(schemeAccent);

const mapStateToProps = state => ({
    language: languageSelector(state),
});

class Visualizations extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    handleSaveClick = () => {
        saveChart('hazardSummary', 'hazardSummary');
        saveChart('hazardSeverity', 'hazardSeverity');
    }

    getHazardSummary = memoize((incidentList, language) => {
        const { hazardTypes } = this.props;
        console.log('hazardTypes', hazardTypes);
        const freqCount = groupList(
            incidentList.filter(i => i.hazard),
            incident => incident.hazard,
        );

        return freqCount.map(h => (
            {
                label: language === 'en'
                    ? (hazardTypes[h.key] || {}).title
                    : (hazardTypes[h.key] || {}).titleNe,
                value: h.value.length,
                color: (hazardTypes[h.key] || {}).color,
                deathCount: (freqCount && h.value.map(data => data.loss))
                    // eslint-disable-next-line max-len
                    .map(i => i).reduce((total, currentValue) => total + currentValue.peopleDeathCount || total, 0),

            }
        )).sort((a, b) => (a.value - b.value));
    })

    getLifeLossSummary = memoize((incidentList, language) => {
        const { hazardTypes } = this.props;

        const freqCount = groupList(
            incidentList.filter(i => i.hazard),
            incident => incident.hazard,
        );
        return freqCount.map(h => (
            {
                label: language === 'en'
                    ? (hazardTypes[h.key] || {}).title
                    : (hazardTypes[h.key] || {}).titleNe,
                value: h.value.length,
                color: (hazardTypes[h.key] || {}).color,
                deathCount: (freqCount && h.value.map(data => data.loss))
                    // eslint-disable-next-line max-len
                    .map(i => i).reduce((total, currentValue) => total + currentValue.peopleDeathCount || total, 0),

            }
        )).sort((a, b) => (a.deathCount - b.deathCount));
    })

    getSeveritySummary = memoize((incidentList) => {
        const freqCount = groupList(
            incidentList.filter(i => i.severity),
            incident => incident.severity,
        );
        return freqCount.map(s => (
            {
                label: s.key,
                value: s.value.length,
                color: colors(s.key),
            }
        ));
    });

    /* getEventSummary = memoize((incidentList) => {
     *     const freqCount = groupList(
     *         incidentList.filter(i => i.event),
     *         incident => incident.event.title,
     *     );

     *     return freqCount.map(event => ({ label: event.key, value: event.value.length }));
     * }); */

    render() {
        const {
            className,
            incidentList,
            hazardTypes,
            language: { language },
        } = this.props;

        const severitySummary = this.getSeveritySummary(incidentList);
        const hazardSummary = this.getHazardSummary(incidentList, language);
        const lifeLossSummary = this.getLifeLossSummary(incidentList, language);
        // const eventSummary = this.getEventSummary(incidentList);


        return (
            <div className={styles.visualizations}>
                <div
                    className={styles.hazardStatisticsChart}
                >
                    <header className={styles.header}>
                        {/* <h4 className={styles.heading}>
                            Hazard Occurence Statistics
                        </h4> */}
                        <Button
                            title="Download Chart"
                            className={styles.chartDownload}
                            transparent
                            onClick={this.handleSaveClick}
                            iconName="download"
                        />
                    </header>
                    <div
                        className={styles.chart}
                        id="hazardSummary"
                    >
                        <h4>
                            <Translation>
                                {

                                    t => <span>{t('Number of Incidents')}</span>
                                }
                            </Translation>
                        </h4>
                        <ResponsiveContainer height={hazardSummary.length * 40}>

                            <BarChart
                                layout="vertical"
                                data={hazardSummary}
                                margin={{ top: 20, right: 50, left: 20, bottom: 20 }}

                            >
                                <YAxis dataKey="label" type="category" />
                                <XAxis dataKey="value" type="number" />


                                {/* <Tooltip /> */}
                                <Bar
                                    dataKey="value"

                                >
                                    {hazardSummary.map(hazard => (
                                        <Cell
                                            key={hazard.label}
                                            fill={hazard.color}
                                        />
                                    ))}
                                    <LabelList
                                        dataKey="value"
                                        position="right"
                                        angle={0}
                                        className={styles.labelList}
                                    />
                                </Bar>
                            </BarChart>

                        </ResponsiveContainer>
                    </div>
                </div>
                {/* <div className={styles.eventStatisticsChart}>
                    <header className={styles.header}>
                    <h4 className={styles.heading}>
                    Major Event Statistics
                    </h4>
                    </header>
                    <SimpleHorizontalBarChart
                    className={styles.chart}
                    data={eventSummary}
                    labelSelector={barChartLabelSelector}
                    valueSelector={barChartValueSelector}
                    />
                    </div> */}
                <div
                    className={styles.severitySummary}

                >
                    <header className={styles.header}>
                        {/* <h4 className={styles.heading}>
                            Severity
                        </h4> */}
                    </header>
                    <div className={styles.chart} id="hazardSeverity">
                        {/* <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    dataKey="value"
                                    nameKey="label"
                                    data={severitySummary}
                                    innerRadius={50}
                                    outerRadius={90}
                                    label
                                >
                                    { severitySummary.map(severity => (
                                        <Cell
                                            key={severity.label}
                                            fill={severity.color}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer> */}
                        <h4>
                            <Translation>
                                {
                                    t => <span>{t('Hazard Severity (Fatality due to Hazard)')}</span>
                                }
                            </Translation>

                        </h4>
                        <ResponsiveContainer height={lifeLossSummary.length * 40}>

                            <BarChart
                                layout="vertical"
                                data={lifeLossSummary}
                                margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
                            >
                                <YAxis dataKey="label" type="category" interval={0} />
                                <XAxis dataKey="deathCount" type="number" />

                                {/* <Tooltip /> */}
                                <Bar
                                    dataKey="deathCount"
                                >
                                    {lifeLossSummary.map(hazard => (
                                        <Cell
                                            key={hazard.label}
                                            fill={hazard.color}
                                        />
                                    ))}
                                    <LabelList
                                        dataKey="deathCount"
                                        position="right"
                                        angle={0}
                                        className={styles.labelList}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Visualizations);
