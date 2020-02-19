import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    listToGroupList,
    isDefined,
} from '@togglecorp/fujs';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import SegmentInput from '#rsci/SegmentInput';
import FormattedDate from '#rscv/FormattedDate';
import Icon from '#rscg/Icon';

import { lossMetrics } from '#utils/domain';
import { sum } from '#utils/common';
import { hazardTypesSelector } from '#selectors';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import LossDetails from '#components/LossDetails';
import Loading from '#components/Loading';
import Page from '#components/Page';

import Comparative from './Comparative';
import { getMinDate } from './common';

import {
    getResults,
    getPending,
} from '#utils/request';

import styles from './styles.scss';

const CompareButton = modalize(Button);

interface State {
    selectedMetric: string;
}

interface ComponentProps {
}

interface Params {
}

type Props = NewProps<ComponentProps, Params>;

const chartMargin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

const requestOptions: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        query: {
            expand: ['loss.peoples', 'wards'],
            limit: 1000,
            // limit: -1,
            ordering: '-incident_on',
            lnd: true,
        },
        onMount: true,
        // extras: { schemaName: 'incidentWithPeopleResponse' },
    },
};

const timeTickFormatter = (timestamp: number) => {
    const date = new Date();
    date.setTime(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
};

const incidentMetricChartParams = {
    count: {
        color: '#ffa600',
        dataKey: 'summary.count',
        title: 'No. of incidents',
    },
    peopleDeath: {
        color: '#ff6361',
        dataKey: 'summary.peopleDeathCount',
        title: 'People death',
    },
    estimatedLoss: {
        color: '#58508d',
        dataKey: 'summary.estimatedLoss',
        title: 'Estimated loss',
    },
    infrastructureDestroyed: {
        color: '#003f5c',
        dataKey: 'summary.infrastructureDestroyedCount',
        title: 'Infrastructure destroyed',
    },
    livestockDestroyed: {
        color: '#bc5090',
        dataKey: 'summary.livestockDestroyedCount',
        title: 'Livestock destroyed',
    },
};


type TabKey = 'overview' | 'timeline' | 'comparative';

class LossAndDamage extends React.PureComponent<Props, State> {
    public state = {
        selectedMetric: 'count',
    }

    private calculateSummary = (data) => {
        const stat = lossMetrics.reduce((acc, { key }) => ({
            ...acc,
            [key]: sum(
                data
                    .filter(incident => incident.loss)
                    .map(incident => incident.loss[key])
                    .filter(isDefined),
            ),
        }), {});

        stat.count = data.length;

        return stat;
    };

    private getHazardsCount = (data, hazardTypes) => {
        const counts = Object.keys(hazardTypes).reduce((acc, hazard) => {
            const dataForCurrentHazard = data.filter(i => String(i.hazard) === String(hazard));
            const hazardCount = dataForCurrentHazard.length;

            if (hazardCount === 0) {
                return acc;
            }

            return {
                ...acc,
                [hazard]: {
                    hazardDetail: hazardTypes[hazard],
                    summary: this.calculateSummary(dataForCurrentHazard),
                },
            };
        }, {});

        return counts;
    }

    private getDataAggregatedByYear = (data, hazardTypes) => {
        const dataWithYear = data.map((d) => {
            const incidentDate = new Date(d.incidentOn);
            incidentDate.setDate(1);
            incidentDate.setHours(0);
            incidentDate.setMinutes(0);
            incidentDate.setSeconds(0);

            return {
                ...d,
                incidentMonthTimestamp: incidentDate.getTime(),
            };
        });

        const dateGroupedData = listToGroupList(
            dataWithYear,
            d => d.incidentMonthTimestamp,
            d => d,
        );
        const dateList = Object.keys(dateGroupedData);

        const aggregatedData = dateList.map((date) => {
            const dataListForCurrentYear = dateGroupedData[date].filter(d => !!d.loss);
            const summaryForCurrentYear = this.calculateSummary(dataListForCurrentYear);
            const hazardSummary = this.getHazardsCount(dataListForCurrentYear, hazardTypes);

            return {
                incidentMonthTimestamp: date,
                summary: summaryForCurrentYear,
                hazardSummary,
            };
        });

        return aggregatedData;
    }

    private getMinDate = memoize(getMinDate);

    public render() {
        const {
            requests,
            hazardTypes,
        } = this.props;

        const { selectedMetric } = this.state;

        const incidentList = getResults(requests, 'incidentsGetRequest');
        const pending = getPending(requests, 'incidentsGetRequest');

        const chartData = this.getDataAggregatedByYear(incidentList, hazardTypes);
        const minDate = this.getMinDate(incidentList);

        return (
            <>
                <Loading pending={pending} />
                <Page
                    leftContentContainerClassName={styles.left}
                    leftContent={(
                        <>
                            <div className={styles.dataDetails}>
                                <div className={styles.dateDetails}>
                                    <div className={styles.infoIconContainer}>
                                        <Icon
                                            className={styles.infoIcon}
                                            name="info"
                                        />
                                    </div>
                                    <div className={styles.label}>
                                        Data available from
                                    </div>
                                    <FormattedDate
                                        className={styles.dateFrom}
                                        value={minDate}
                                        mode="yyyy-MM-dd"
                                    />
                                    <div className={styles.label}>
                                        to
                                    </div>
                                    <FormattedDate
                                        className={styles.dateTo}
                                        value={new Date()}
                                        mode="yyyy-MM-dd"
                                    />
                                </div>
                                <div className={styles.sourceDetails}>
                                    <div className={styles.infoIconContainer}>
                                        <Icon
                                            className={styles.infoIcon}
                                            name="info"
                                        />
                                    </div>
                                    <div className={styles.label}>
                                        Data sources:
                                    </div>
                                    <div className={styles.value}>
                                        <div className={styles.source}>
                                            Nepal Police
                                        </div>
                                        <div className={styles.source}>
                                            <div className={styles.text}>
                                                Nepal Disaster Risk Reduction Portal
                                            </div>
                                            <a
                                                className={styles.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="http://drrportal.gov.np"
                                            >
                                                <Icon
                                                    name="externalLink"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.mainContent}>
                                <LossDetails
                                    className={styles.lossDetails}
                                    data={incidentList}
                                />
                                <div className={styles.chartList}>
                                    { Object.values(incidentMetricChartParams).map(metric => (
                                        <div
                                            key={metric.dataKey}
                                            className={styles.chartContainer}
                                        >
                                            <h4 className={styles.heading}>
                                                { metric.title }
                                            </h4>
                                            <div className={styles.content}>
                                                <ResponsiveContainer>
                                                    <AreaChart
                                                        data={chartData}
                                                        syncId="lndChart"
                                                        margin={chartMargin}
                                                    >
                                                        <defs>
                                                            <linearGradient id={`${metric.dataKey}-color`} y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor={metric.color} stopOpacity={0.8} />
                                                                <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis
                                                            type="number"
                                                            dataKey="incidentMonthTimestamp"
                                                            domain={['dataMin', 'dataMax']}
                                                            allowDecimals={false}
                                                            hide
                                                        />
                                                        <YAxis
                                                            hide
                                                            type="number"
                                                            domain={['dataMin', 'dataMax']}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            fill={`url(#${metric.dataKey}-color)`}
                                                            dataKey={metric.dataKey}
                                                            stroke={metric.color}
                                                        />
                                                        <Tooltip
                                                            labelFormatter={() => null}
                                                            formatter={(value, name, p) => [value, `${metric.title} in ${timeTickFormatter(p.payload.incidentMonthTimestamp)}`]}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    ))}
                                    <div className={styles.axis}>
                                        <ResponsiveContainer>
                                            <AreaChart
                                                data={chartData}
                                                margin={chartMargin}
                                            >
                                                <XAxis
                                                    tickFormatter={timeTickFormatter}
                                                    scale="time"
                                                    dataKey="incidentMonthTimestamp"
                                                    domain={['dataMin', 'dataMax']}
                                                    allowDecimals={false}
                                                    interval="preserveStartEnd"
                                                    angle={-30}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className={styles.hazardSummary}>
                                    <ResponsiveContainer>
                                        <AreaChart
                                            data={chartData}
                                            stackOffset="expand"
                                            margin={chartMargin}
                                        >
                                            <XAxis
                                                hide
                                                type="number"
                                                dataKey="incidentMonthTimestamp"
                                                domain={['dataMin', 'dataMax']}
                                                allowDecimals={false}
                                            />
                                            <YAxis
                                                hide
                                                type="number"
                                                domain={['dataMin', 'dataMax']}
                                            />
                                            <defs>
                                                { Object.values(hazardTypes).map(h => (
                                                    <linearGradient key={h.id} id={`hazardColor-${h.id}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={h.color} stopOpacity={0.9} />
                                                        <stop offset="95%" stopColor={h.color} stopOpacity={0.1} />
                                                    </linearGradient>
                                                ))}
                                            </defs>
                                            { Object.values(hazardTypes).map(h => (
                                                <Area
                                                    stackId="hazardSummary"
                                                    key={h.id}
                                                    type="monotone"
                                                    dataKey={`hazardSummary.${h.id}.summary.${selectedMetric}`}
                                                    stroke={h.color}
                                                    fill={`url(#hazardColor-${h.id})`}
                                                />
                                            ))}
                                            <Tooltip formatter={(value, name) => [value, hazardTypes[name.split('.')[1]].title]} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <footer className={styles.footer}>
                                <div className={styles.configurationOptions}>
                                    <SegmentInput
                                        options={lossMetrics}
                                        keySelector={d => d.key}
                                        labelSelector={d => d.label}
                                        value={selectedMetric}
                                        onChange={(metric: string) => {
                                            this.setState({ selectedMetric: metric });
                                        }}
                                    />
                                </div>
                                <CompareButton
                                    className={styles.compareButton}
                                    modal={<Comparative lossAndDamageList={incidentList} />}
                                >
                                    Compare regions
                                </CompareButton>
                            </footer>
                        </>
                    )}
                />
            </>
        );
    }
}

const mapStateToProps = state => ({
    hazardTypes: hazardTypesSelector(state),
});

export default compose(
    connect(mapStateToProps, null),
    createConnectedRequestCoordinator<ComponentProps>(),
    createRequestClient(requestOptions),
)(LossAndDamage);
