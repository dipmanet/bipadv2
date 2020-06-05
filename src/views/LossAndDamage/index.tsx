import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    listToGroupList,
    isDefined,
    listToMap,
} from '@togglecorp/fujs';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Brush,
} from 'recharts';

import DateInput from '#rsci/DateInput';
import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import DangerButton from '#rsca/Button/DangerButton';
import Icon from '#rscg/Icon';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';

import { lossMetrics } from '#utils/domain';
import {
    sum,
    saveChart,
    encodeDate,
} from '#utils/common';
import {
    hazardTypesSelector,
    hazardFilterSelector,
    regionFilterSelector,
    regionsSelector,
} from '#selectors';
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

import TabularView from './TabularView';
import Comparative from './Comparative';
import { getSanitizedIncidents } from './common';

import {
    getResults,
    getPending,
} from '#utils/request';

import styles from './styles.scss';
import Overview from './Overview';

const ModalButton = modalize(Button);

const IncidentTableModal = ({
    closeModal,
    incidentList,
}) => (
    <Modal className={styles.lossAndDamageTableModal}>
        <ModalHeader
            title="Incidents"
            rightComponent={(
                <DangerButton
                    transparent
                    iconName="close"
                    onClick={closeModal}
                    title="Close Modal"
                />
            )}
        />
        <ModalBody className={styles.body}>
            <TabularView
                className={styles.table}
                lossAndDamageList={incidentList}
            />
        </ModalBody>
    </Modal>
);

interface State {
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

const today = new Date();
const oneYearAgo = new Date();
oneYearAgo.setMonth(today.getMonth() - 6);

const DEFAULT_START_DATE = oneYearAgo;
const DEFAULT_END_DATE = today;

const requestQuery = ({
    params: {
        startDate = DEFAULT_START_DATE.toISOString(),
        endDate = DEFAULT_END_DATE.toISOString(),
    } = {},
}) => ({
    expand: ['loss.peoples', 'wards'],
    limit: -1,
    incident_on__lt: endDate, // eslint-disable-line @typescript-eslint/camelcase
    incident_on__gt: startDate, // eslint-disable-line @typescript-eslint/camelcase
    ordering: '-incident_on',
    // lnd: true,
});

const requestOptions: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        query: requestQuery,
        onMount: true,
        // extras: { schemaName: 'incidentWithPeopleResponse' },
    },
};

const getDatesInIsoString = (startDate: string, endDate: string) => ({
    startDate: startDate ? (new Date(startDate)).toISOString() : undefined,
    endDate: endDate ? (new Date(endDate)).toISOString() : undefined,
});

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

class LossAndDamage extends React.PureComponent<Props, State> {
    public state = {
        startDate: encodeDate(DEFAULT_START_DATE),
        endDate: encodeDate(DEFAULT_END_DATE),
    }

    private handleSaveClick = () => {
        saveChart('chartList', 'lndChart');
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

    private filterByRegion = (sanitizedIncidents, regionFilter) => {
        if (!regionFilter.adminLevel) {
            return sanitizedIncidents;
        }

        const regionNameMap = {
            1: 'province',
            2: 'district',
            3: 'municipality',
            4: 'ward',
        };

        const filterableProperty = regionNameMap[regionFilter.adminLevel];
        const filteredIncidents = sanitizedIncidents
            .filter(d => d[filterableProperty] === regionFilter.geoarea);

        return filteredIncidents;
    }

    private getFilteredData = memoize((data, hazardTypes, hazardFilter, regionFilter, regions) => {
        const hazardFilterMap = listToMap(hazardFilter, d => d, () => true);
        const sanitizedIncidents = getSanitizedIncidents(data, regions, hazardTypes);
        const regionFilteredData = this.filterByRegion(sanitizedIncidents, regionFilter);

        const filteredData = hazardFilter.length > 0
            ? regionFilteredData.filter(d => hazardFilterMap[d.hazard])
            : regionFilteredData;

        return filteredData;
    })

    private getDataAggregatedByYear = memoize((data) => {
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
            // const hazardSummary = this.getHazardsCount(dataListForCurrentYear, hazardTypes);

            return {
                incidentMonthTimestamp: date,
                summary: summaryForCurrentYear,
                // hazardSummary,
            };
        });

        return aggregatedData.sort(
            (a, b) => (a.incidentMonthTimestamp - b.incidentMonthTimestamp),
        );
    })

    private handleStartDateChange = (startDate) => {
        const { endDate } = this.state;
        const { requests: { incidentsGetRequest } } = this.props;

        incidentsGetRequest.do({
            ...getDatesInIsoString(startDate, endDate),
        });
    }

    private handleEndDateChange = (endDate) => {
        const { startDate } = this.state;
        const { requests: { incidentsGetRequest } } = this.props;

        incidentsGetRequest.do({
            ...getDatesInIsoString(startDate, endDate),
        });
    }

    public render() {
        const {
            requests,
            hazardTypes,
            hazardFilter,
            regionFilter,
            regions,
        } = this.props;

        const {
            startDate,
            endDate,
        } = this.state;

        const incidentList = getResults(requests, 'incidentsGetRequest');
        const pending = getPending(requests, 'incidentsGetRequest');

        const filteredData = this.getFilteredData(
            incidentList,
            hazardTypes,
            hazardFilter,
            regionFilter,
            regions,
        );
        const chartData = this.getDataAggregatedByYear(filteredData);

        return (
            <>
                <Loading pending={pending} />
                <Page
                    hideDataRangeFilter
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
                                        Showing data from
                                    </div>
                                    <DateInput
                                        showLabel={false}
                                        showHintAndError={false}
                                        className={styles.dateFromInput}
                                        value={startDate}
                                        onChange={this.handleStartDateChange}
                                    />
                                    <div className={styles.label}>
                                        to
                                    </div>
                                    <DateInput
                                        showLabel={false}
                                        showHintAndError={false}
                                        className={styles.dateToInput}
                                        value={endDate}
                                        onChange={this.handleEndDateChange}
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
                                                DRR Portal
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
                            <div className={styles.actions}>
                                <ModalButton
                                    disabled={pending}
                                    className={styles.compareButton}
                                    modal={<Comparative lossAndDamageList={filteredData} />}
                                >
                                    Compare regions
                                </ModalButton>
                                <ModalButton
                                    title="Show data in tabular format"
                                    className={styles.showTableButton}
                                    iconName="table"
                                    transparent
                                    modal={(
                                        <IncidentTableModal
                                            incidentList={filteredData}
                                        />
                                    )}
                                />
                            </div>
                            <div className={styles.mainContent}>
                                <LossDetails
                                    className={styles.lossDetails}
                                    data={filteredData}
                                />
                                <Button
                                    title="Download Chart"
                                    className={styles.downloadButton}
                                    transparent
                                    disabled={pending}
                                    onClick={this.handleSaveClick}
                                    iconName="download"
                                />
                                <div
                                    className={styles.chartList}
                                    id="chartList"
                                >
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
                                                syncId="lndChart"
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
                                                <Brush
                                                    dataKey="incidentMonthTimestamp"
                                                    tickFormatter={timeTickFormatter}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    mainContent={(
                        <Overview
                            lossAndDamageList={filteredData}
                        />
                    )}
                />
            </>
        );
    }
}

const mapStateToProps = state => ({
    hazardTypes: hazardTypesSelector(state),
    hazardFilter: hazardFilterSelector(state),
    regionFilter: regionFilterSelector(state),
    regions: regionsSelector(state),
});

export default compose(
    connect(mapStateToProps, null),
    createConnectedRequestCoordinator<ComponentProps>(),
    createRequestClient(requestOptions),
)(LossAndDamage);
