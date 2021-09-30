import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { Translation } from 'react-i18next';

import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    LabelList,
    Cell,
    Tooltip,
    Legend,
} from 'recharts';

import { npTranslation } from '#constants/translations';

import {
    groupList,
    saveChart,
} from '#utils/common';
import Button from '#rsca/Button';
import Message from '#rscv/Message';

import styles from './styles.scss';

import {
    languageSelector,
} from '#selectors';


const mapStateToProps = state => ({
    language: languageSelector(state),
});

const propTypes = {
    className: PropTypes.string,
    alertList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    language: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: undefined,
    alertList: [],
    language: { language: 'en' },
};

const CustomLabel = (props) => {
    const { value } = props;

    return (
        <div>
            {`Value: ${value}`}
        </div>
    );
};

class Visualization extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;


    handleSaveClick = () => {
        saveChart('hazardSummary', 'hazardSummary');
        // saveChart('hazardSeverity', 'hazardSeverity');
    }

    getHazardSummary = memoize((alertList) => {
        const { hazardTypes, language: { language } } = this.props;
        console.log('hazard types', hazardTypes);

        const freqCount = groupList(
            alertList.filter(i => i.hazard),
            alert => alert.hazard,
        );
        if (language === 'en') {
            return freqCount.map(h => (
                {
                    label: (hazardTypes[h.key] || {}).title,
                    value: h.value.length,
                    color: (hazardTypes[h.key] || {}).color,
                }
            )).sort((a, b) => (a.value - b.value));
        }
        return freqCount.map(h => (
            {
                label: (hazardTypes[h.key] || {}).titleNe,
                value: h.value.length,
                color: (hazardTypes[h.key] || {}).color,
            }
        )).sort((a, b) => (a.value - b.value));
    })

    getEventSummary = memoize((alertList) => {
        const freqCount = groupList(
            alertList.filter(i => i.event),
            alert => alert.event.title,
        );

        return freqCount.map(event => (
            {
                label: event.key,
                value: event.value.length,
            }
        )).sort((a, b) => (b.value - a.value));
    });

    getLabel = index => npTranslation.translation.hazardSummary[index].label;

    getTrans = (hazardData) => {
        console.log('hazard data', hazardData);
        const arr = hazardData.map((i, idx) => ({
            ...i,
            तथ्या्क: i.value,
            label: this.getLabel(idx),
        }));
        return arr;
    }

    customTooltip = ({ active, payload, label }) => {
        const { language: { language } } = this.props;

        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <p>{language === 'np' && `तथ्या्क: ${payload[0].payload.value}`}</p>
                    <p>{language === 'en' && `value: ${payload[0].payload.value}`}</p>
                </div>
            );
        }

        return null;
    };


    render() {
        const {
            className,
            alertList,
            hazardTypes,
            language: { language },
        } = this.props;

        const hazardSummary = this.getHazardSummary(alertList);
        const eventSummary = this.getEventSummary(alertList);

        if (!hazardSummary || hazardSummary.length === 0) {
            return (
                <div
                    className={styles.message}
                >
                    <Message>
                        <Translation>
                            {
                                t => <span>{t('No Alerts in the Selected Time Period')}</span>
                            }
                        </Translation>
                    </Message>
                </div>
            );
        }

        // To reduce space taken by pollution on Y-axis
        hazardSummary.map((hs) => {
            console.log('hazard summary', hazardSummary);
            if (hs.label === 'Environmental pollution') {
                // eslint-disable-next-line no-param-reassign
                hs.label = 'Env. Pollution';
            }
            return hs;
        });

        console.log('hazard summary', hazardSummary);

        const ChartView = () => (
            <div
                className={styles.hazardStatisticsChart}
            >
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        <Translation>
                            {
                                t => <span>{t('Hazard Occurence Statistics')}</span>
                            }
                        </Translation>

                    </h4>
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
                    <ResponsiveContainer>
                        <BarChart
                            layout="vertical"
                            data={language === 'en' ? hazardSummary : this.getTrans(hazardSummary)}
                            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                        >
                            <YAxis
                                dataKey="label"
                                type="category"
                            />
                            <XAxis
                                dataKey="value"
                                type="number"
                            />
                            <Tooltip
                                content={this.customTooltip}
                                cursor={false}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                align="center"
                                iconSize={0}
                                formatter={() => {
                                    if (language === 'en') {
                                        return ('  No. of Events  ');
                                    }
                                    return ('घटनाहरुको संख्या');
                                }}
                            />
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
                                    position="center"
                                    angle={0}
                                    className={styles.labelList}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );

        return (
            <div className={styles.visualizations}>
                <div className={styles.alertSummary}>
                    <header className={styles.header}>
                        <h3 className={styles.heading}>

                            <Translation>
                                {
                                    t => <span>{t('Number of Alerts')}</span>
                                }
                            </Translation>
                        </h3>
                    </header>
                    <div className={styles.content}>
                        {hazardSummary.map((s, idx) => (
                            <div key={s.label} className={styles.summaryItem}>
                                <div className={styles.label}>
                                    <Translation>
                                        {
                                            t => <span>{t(`hazardSummary.${idx}.label`, { returnObjects: true })}</span>
                                        }
                                    </Translation>
                                    {/* {s.label} */}
                                </div>
                                <div className={styles.value}>
                                    {s.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <ChartView />

                {/* <div
                    style={{
                        height: hazardSummary.length * 32,
                    }}
                    className={styles.container}
                >
                    <ResponsiveContainer className={styles.visualizationContainer}>
                        <BarChart
                            data={hazardSummary}
                            layout="vertical"
                        >
                            <XAxis
                                dataKey="value"
                                type="number"
                                hide
                            />
                            <Bar
                                fill="#e04656"
                                dataKey="value"
                                layout="vertical"
                            >
                                <LabelList
                                    dataKey="label"
                                    position="insideLeft"
                                />
                            </Bar>
                            <YAxis
                                dataKey="label"
                                type="category"
                                hide
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div> */}

            </div>
        );
    }
}

export default connect(mapStateToProps, undefined)(Visualization);
