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

import { getMinDate } from './common';

import {
    getResults,
    getPending,
} from '#utils/request';

import styles from './styles.scss';

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
            limit: -1,
            ordering: '-incident_on',
            lnd: true,
        },
        onMount: true,
        // extras: { schemaName: 'incidentWithPeopleResponse' },
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
        const dataWithYear = data.map(d => ({
            ...d,
            incidentYear: (new Date(d.incidentOn)).getFullYear(),
        }));

        const yearGroupedData = listToGroupList(dataWithYear, d => d.incidentYear, d => d);
        const years = Object.keys(yearGroupedData);

        const aggregatedData = years.map((year) => {
            const dataListForCurrentYear = yearGroupedData[year].filter(d => !!d.loss);
            const summaryForCurrentYear = this.calculateSummary(dataListForCurrentYear);
            const hazardSummary = this.getHazardsCount(dataListForCurrentYear, hazardTypes);

            return {
                year: +year,
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
                                    <div className={styles.label}>
                                        Data available from
                                    </div>
                                    <FormattedDate
                                        className={styles.dateFrom}
                                        value={minDate}
                                    />
                                    <div className={styles.label}>
                                        to
                                    </div>
                                    <FormattedDate
                                        className={styles.dateTo}
                                        value={new Date()}
                                    />
                                </div>
                                <div className={styles.sourceDetails}>
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
                            <LossDetails
                                className={styles.lossDetails}
                                data={incidentList}
                            />
                            <div className={styles.chartList}>
                                <div className={styles.chartContainer}>
                                    <h4 className={styles.heading}>
                                        Number of incidents
                                    </h4>
                                    <div className={styles.content}>
                                        <ResponsiveContainer>
                                            <AreaChart
                                                data={chartData}
                                                syncId="lndChart"
                                                margin={chartMargin}
                                            >
                                                <defs>
                                                    <linearGradient id="incidentCountColor" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ffa600" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#ffa600" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    type="number"
                                                    dataKey="year"
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
                                                    fill="url(#incidentCountColor)"
                                                    dataKey="summary.count"
                                                    stroke="#ffa600"
                                                />
                                                <Tooltip
                                                    labelFormatter={() => null}
                                                    formatter={(value, name, p) => [value, `No. of incidents in ${p.payload.year}`]}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className={styles.chartContainer}>
                                    <h4 className={styles.heading}>
                                        People death
                                    </h4>
                                    <div className={styles.content}>
                                        <ResponsiveContainer>
                                            <AreaChart
                                                data={chartData}
                                                syncId="lndChart"
                                                margin={chartMargin}
                                            >
                                                <defs>
                                                    <linearGradient id="peopleDeathColor" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ff6361" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#ff6361" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis
                                                    hide
                                                    type="number"
                                                    dataKey="year"
                                                    domain={['dataMin', 'dataMax']}
                                                    allowDecimals={false}
                                                />
                                                <YAxis
                                                    hide
                                                    type="number"
                                                    domain={['dataMin', 'dataMax']}
                                                />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Area
                                                    type="monotone"
                                                    fill="url(#peopleDeathColor)"
                                                    dataKey="summary.peopleDeathCount"
                                                    stroke="#ff6361"
                                                />
                                                <Tooltip
                                                    labelFormatter={() => null}
                                                    formatter={(value, name, p) => [value, `People death in ${p.payload.year}`]}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className={styles.chartContainer}>
                                    <h4 className={styles.heading}>
                                        Estimated loss
                                    </h4>
                                    <div className={styles.content}>
                                        <ResponsiveContainer>
                                            <AreaChart
                                                data={chartData}
                                                syncId="lndChart"
                                                margin={chartMargin}
                                            >
                                                <defs>
                                                    <linearGradient id="estimatedLossColor" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#58508d" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#58508d" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis
                                                    hide
                                                    type="number"
                                                    dataKey="year"
                                                    domain={['dataMin', 'dataMax']}
                                                    allowDecimals={false}
                                                />
                                                <YAxis
                                                    hide
                                                    type="number"
                                                    domain={['dataMin', 'dataMax']}
                                                />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Area
                                                    type="monotone"
                                                    fill="url(#estimatedLossColor)"
                                                    dataKey="summary.estimatedLoss"
                                                    stroke="#58508d"
                                                />
                                                <Tooltip
                                                    labelFormatter={() => null}
                                                    formatter={(value, name, p) => [value, `Estimated loss in ${p.payload.year}`]}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className={styles.chartContainer}>
                                    <h4 className={styles.heading}>
                                        Infrastructure destroyed
                                    </h4>
                                    <div className={styles.content}>
                                        <ResponsiveContainer>
                                            <AreaChart
                                                data={chartData}
                                                syncId="lndChart"
                                                margin={chartMargin}
                                            >
                                                <defs>
                                                    <linearGradient id="infrastructureDestroyedColor" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#003f5c" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#003f5c" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    hide
                                                    type="number"
                                                    dataKey="year"
                                                    domain={['dataMin', 'dataMax']}
                                                    allowDecimals={false}
                                                />
                                                <YAxis
                                                    hide
                                                    type="number"
                                                    domain={['dataMin', 'dataMax']}
                                                />
                                                <Area
                                                    type="monotone"
                                                    fill="url(#infrastructureDestroyedColor)"
                                                    dataKey="summary.infrastructureDestroyedCount"
                                                    stroke="#003f5c"
                                                />
                                                <Tooltip
                                                    labelFormatter={() => null}
                                                    formatter={(value, name, p) => [value, `Infrastructure destroyed in ${p.payload.year}`]}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className={styles.chartContainer}>
                                    <h4 className={styles.heading}>
                                        Livestock destroyed
                                    </h4>
                                    <div className={styles.content}>
                                        <ResponsiveContainer>
                                            <AreaChart
                                                data={chartData}
                                                syncId="lndChart"
                                                margin={chartMargin}
                                            >
                                                <defs>
                                                    <linearGradient id="livestockDestroyedColor" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#bc5090" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#bc5090" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    type="number"
                                                    dataKey="year"
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
                                                    fill="url(#livestockDestroyedColor)"
                                                    dataKey="summary.livestockDestroyedCount"
                                                    stroke="#bc5090"
                                                />
                                                <Tooltip
                                                    labelFormatter={() => null}
                                                    formatter={(value, name, p) => [value, `Livestocks destroyed in ${p.payload.year}`]}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className={styles.axis}>
                                    <ResponsiveContainer>
                                        <AreaChart
                                            data={chartData}
                                            margin={chartMargin}
                                        >
                                            <XAxis
                                                type="number"
                                                dataKey="year"
                                                domain={['dataMin', 'dataMax']}
                                                allowDecimals={false}
                                                interval="preserveStartEnd"
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
                                            dataKey="year"
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
                                                <linearGradient id={`hazardColor-${h.id}`} x1="0" y1="0" x2="0" y2="1">
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
