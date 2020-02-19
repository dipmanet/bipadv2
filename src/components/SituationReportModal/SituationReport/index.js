import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    _cs,
    listToMap,
    isDefined,
} from '@togglecorp/fujs';

import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    LabelList,
} from 'recharts';
import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';
import LoadingAnimation from '#rscv/LoadingAnimation';
import {
    hazardTypesList,
    generatePaint,
} from '#utils/domain';
import IncidentMap from '#views/Incidents/Map';
import HazardsLegend from '#components/HazardsLegend';
import ProvinceChoroplethMap from '#components/ProvinceChroplethMap';
import {
    getGroupMethod,
    getGroupedIncidents,
    getSumStats,
    getSanitizedIncidents,
} from '#views/LossAndDamage/common';
import { groupList } from '#utils/common';
import {
    mapStyleSelector,
    hazardTypesSelector,
    regionsSelector,
} from '#selectors';

import {
    createRequestClient,
    methods,
} from '#request';

import Table from './Table';
import styles from './styles.scss';

const REQUEST_LIMIT = 100;

const colorGrade = [
    '#ffe5d4',
    '#f9d0b8',
    '#f2bb9e',
    '#eca685',
    '#e4906e',
    '#dd7a59',
    '#d46246',
    '#cb4836',
    '#c22727',
];

const requestOptions = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        onMount: ({ props: { selectedReport } }) => isDefined(selectedReport),
        onPropsChanged: ['selectedReport'],
        query: ({ props: { selectedReportDetails } }) => {
            if (!selectedReportDetails) {
                return {};
            }
            const {
                fromDate,
                toDate,
                event,
                type,
            } = selectedReportDetails;

            if (type === 'yearly') {
                const gt = new Date(fromDate);
                const lt = new Date(toDate);

                return ({
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    incident_on__gt: gt.toISOString(),
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    incident_on__lt: lt.toISOString(),
                    limit: REQUEST_LIMIT,
                    expand: ['loss', 'event', 'wards'],
                });
            }

            return ({
                event,
                limit: REQUEST_LIMIT,
                expand: ['loss', 'event', 'wards'],
            });
        },
    },
};

const propTypes = {
    className: PropTypes.string,
    selectedReport: PropTypes.number,
    // eslint-disable-next-line react/forbid-prop-types
    selectedReportDetails: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    requests: PropTypes.object.isRequired,
};

const defaultProps = {
    className: undefined,
    selectedReport: undefined,
    selectedReportDetails: undefined,
};

const mapStateToProps = state => ({
    regions: regionsSelector(state),
    hazardTypes: hazardTypesSelector(state),
    mapStyle: mapStyleSelector(state),
});

class SituationReport extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    getIncidentHazardTypesList = memoize((incidentList) => {
        const { hazardTypes } = this.props;
        return hazardTypesList(incidentList, hazardTypes);
    });

    generateOverallDataset = memoize((incidents) => {
        if (!incidents || incidents.length <= 0) {
            return {
                mapping: [],
                aggregatedStat: {},
                mapState: [],
                maxCasuality: 1,
            };
        }

        const groupFn = getGroupMethod(1);
        const hazardGroupFn = d => d.hazard;
        const regionGroupedIncidents = getGroupedIncidents(incidents, groupFn);
        const hazardGroupedIncidents = getGroupedIncidents(incidents, hazardGroupFn);
        console.warn('here', hazardGroupedIncidents);
        const aggregatedStat = getSumStats(hazardGroupedIncidents);

        const listToMapGroupedItem = groupedIncidents => (
            listToMap(
                groupedIncidents,
                incident => incident.key,
                incident => incident,
            )
        );
        const mapping = listToMapGroupedItem(regionGroupedIncidents);
        const maxCasuality = regionGroupedIncidents.reduce((acc, incident) => (
            acc > incident.peopleDeathCount ? acc : incident.peopleDeathCount
        ), 0);

        const mapState = regionGroupedIncidents.map(r => ({
            id: r.key,
            value: r.peopleDeathCount,
        }));

        return {
            regionGroupedIncidents,
            hazardGroupedIncidents,
            mapState,
            mapping,
            aggregatedStat,
            maxCasuality,
        };
    })

    generatePaint = memoize(generatePaint);

    getSanitizedIncidents = memoize(getSanitizedIncidents);

    getHazardSummary = memoize((alertList) => {
        const { hazardTypes } = this.props;

        const freqCount = groupList(
            alertList.filter(i => i.hazard),
            alert => alert.hazard,
        );

        return freqCount.map(h => (
            {
                label: (hazardTypes[h.key] || {}).title,
                value: h.value.length,
                color: (hazardTypes[h.key] || {}).color,
            }
        )).sort((a, b) => (a.value - b.value));
    })

    render() {
        const {
            className,
            selectedReport,
            selectedReportDetails,
            requests,
            mapStyle,
            regions,
            hazardTypes,
        } = this.props;

        const {
            incidentsGetRequest: {
                pending: incidentsPending,
                response,
            },
        } = requests;

        if (!selectedReportDetails) {
            return (
                <div className={_cs(className, styles.situationReport)}>
                    Please selected a situation report
                </div>
            );
        }

        if (incidentsPending) {
            return (
                <div className={_cs(className, styles.situationReport)}>
                    <LoadingAnimation />
                </div>
            );
        }

        const incidents = response ? response.results : [];
        const filteredHazardTypes = this.getIncidentHazardTypesList(incidents);

        const sanitizedIncidents = this.getSanitizedIncidents(incidents, regions, hazardTypes);

        const {
            mapping,
            regionGroupedIncidents,
            hazardGroupedIncidents,
            mapState,
            aggregatedStat,
            maxCasuality,
        } = this.generateOverallDataset(sanitizedIncidents);

        const colorPaint = this.generatePaint(colorGrade, 0, maxCasuality);
        const hazardSummary = this.getHazardSummary(sanitizedIncidents);

        return (
            <div className={_cs(styles.situationReport, className)}>
                <div className={styles.maps}>
                    <Map
                        mapStyle={mapStyle}
                        mapOptions={{
                            logoPosition: 'top-left',
                            minZoom: 5,
                        }}
                        scaleControlShown
                        scaleControlPosition="bottom-right"
                        navControlShown
                        navControlPosition="bottom-right"
                    >
                        <MapContainer className={styles.mapContainer} />
                        <IncidentMap
                            sourceKey="situation-report-incidents"
                            incidentList={incidents}
                            isProviceOnlyMap
                        />
                        <HazardsLegend
                            filteredHazardTypes={filteredHazardTypes}
                            className={styles.hazardLegend}
                            itemClassName={styles.legendItem}
                        />
                    </Map>
                    <Map
                        mapStyle={mapStyle}
                        mapOptions={{
                            logoPosition: 'top-left',
                            minZoom: 5,
                        }}
                        scaleControlShown
                        scaleControlPosition="bottom-right"
                        navControlShown
                        navControlPosition="bottom-right"
                    >
                        <MapContainer className={styles.mapContainer} />
                        <ProvinceChoroplethMap
                            sourceKey="inci-choro"
                            paint={colorPaint.paint}
                            mapState={mapState}
                        />
                    </Map>
                </div>
                <div className={styles.charts}>
                    <div
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
                    </div>
                </div>
                <Table
                    className={styles.table}
                    data={hazardGroupedIncidents}
                    aggregatedStat={aggregatedStat}
                    hazardTypes={hazardTypes}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(createRequestClient(requestOptions)(SituationReport));
