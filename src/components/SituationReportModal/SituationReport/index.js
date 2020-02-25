import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import html2canvas from 'html2canvas';
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
    Pie,
    Bar,
    Cell,
    PieChart,
    LabelList,
} from 'recharts';
import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';
import LoadingAnimation from '#rscv/LoadingAnimation';
import LegendItem from '#rscz/Legend/LegendItem';
import {
    hazardTypesList,
    generatePaint,
} from '#utils/domain';
import IncidentMap from '#views/Incidents/Map';
import Button from '#rsca/Button';
import LayerLegend from '#components/LayerLegend';
import HazardsLegend from '#components/HazardsLegend';
import ProvinceChoroplethMap from '#components/ProvinceChroplethMap';
import Message from '#rscv/Message';
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

const REQUEST_LIMIT = -1;

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

const pieColors = [
    '#003f5c',
    '#7a5195',
    '#ef5675',
    '#ffa600',
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
    // eslint-disable-next-line react/no-unused-prop-types
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
                minCasuality: 0,
                maxCasuality: 1,
            };
        }

        const groupFn = getGroupMethod(1);
        const hazardGroupFn = d => d.hazard;
        const regionGroupedIncidents = getGroupedIncidents(incidents, groupFn);
        const hazardGroupedIncidents = getGroupedIncidents(incidents, hazardGroupFn);
        const aggregatedStat = getSumStats(hazardGroupedIncidents);

        const listToMapGroupedItem = groupedIncidents => (
            listToMap(
                groupedIncidents,
                incident => incident.key,
                incident => incident,
            )
        );
        const mapping = listToMapGroupedItem(regionGroupedIncidents);
        const maxCasuality = Math.max(...regionGroupedIncidents.map(item => item.peopleDeathCount));
        const minCasuality = Math.min(...regionGroupedIncidents.map(item => item.peopleDeathCount));

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
            minCasuality,
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

    getDataForPieCharts = memoize((aggregatedStat) => {
        const peopleLossPieData = [
            {
                name: 'Death',
                value: aggregatedStat.peopleDeathCount,
            },
            {
                name: 'Injured',
                value: aggregatedStat.peopleInjuredCount,
            },
            {
                name: 'Missing',
                value: aggregatedStat.peopleMissingCount,
            },
            {
                name: 'Affected',
                value: aggregatedStat.peopleAffectedCount,
            },
        ];

        const familyLossPieData = [
            {
                name: 'Relocated',
                value: aggregatedStat.familyRelocatedCount,
            },
            {
                name: 'Affected',
                value: aggregatedStat.familyAffectedCount,
            },
            {
                name: 'Evacuated',
                value: aggregatedStat.familyEvacuatedCount,
            },
        ];

        return {
            peopleLossPieData,
            familyLossPieData,
        };
    });

    handleDownloadClick = () => {
        const element = document.getElementsByClassName(styles.situationReportFull)[0];

        html2canvas(element).then((canvas) => {
            canvas.toBlob((blob) => {
                const link = document.createElement('a');
                link.download = 'situation-report.png';
                link.href = URL.createObjectURL(blob);
                link.click();
            }, 'image/png');
        });
    }

    render() {
        const {
            className,
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
                    <Message>
                        Please selected a situation report
                    </Message>
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

        if (incidents.length < 1) {
            return (
                <div className={_cs(className, styles.situationReport)}>
                    <Message>
                        There are no incidents in this situation report
                    </Message>
                </div>
            );
        }

        const filteredHazardTypes = this.getIncidentHazardTypesList(incidents);

        const sanitizedIncidents = this.getSanitizedIncidents(incidents, regions, hazardTypes);

        const {
            hazardGroupedIncidents,
            mapState,
            aggregatedStat,
            minCasuality,
            maxCasuality,
        } = this.generateOverallDataset(sanitizedIncidents);

        const colorPaint = this.generatePaint(colorGrade, minCasuality, maxCasuality);
        const hazardSummary = this.getHazardSummary(sanitizedIncidents);
        const {
            peopleLossPieData,
            familyLossPieData,
        } = this.getDataForPieCharts(aggregatedStat);

        return (
            <div className={_cs(styles.situationReport, className)}>
                <div className={styles.situationReportFull}>
                    <Button
                        className={styles.downloadButton}
                        onClick={this.handleDownloadClick}
                        iconName="download"
                    >
                        Download
                    </Button>
                    <header className={styles.header}>
                        <h2>Incident Situation Report</h2>
                    </header>
                    <div className={styles.map}>
                        <h3 className={styles.mapHeading}>
                            Incident Statistics
                        </h3>
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
                    </div>
                    <div className={styles.vizContainer}>
                        <h3 className={styles.heading}>Disaster Summary</h3>
                        <div style={{ height: hazardSummary.length * 32 }}>
                            <ResponsiveContainer>
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
                    <div className={styles.map}>
                        <h3 className={styles.mapHeading}>
                            Casuality Statistics
                        </h3>
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
                            <LayerLegend
                                layer={{
                                    type: 'choropleth',
                                    minValue: minCasuality,
                                    legendTitle: 'Casualty Statistics',
                                    legend: colorPaint.legend,
                                }}
                            />
                        </Map>
                    </div>
                    <div className={styles.charts}>
                        <div className={styles.pieCharts}>
                            <div className={styles.pieChart}>
                                <h4>People Loss</h4>
                                <PieChart width={240} height={240}>
                                    <Pie
                                        data={peopleLossPieData}
                                        dataKey="value"
                                        cx={120}
                                        cy={120}
                                        outerRadius={60}
                                    >
                                        {peopleLossPieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${entry.name}`}
                                                fill={pieColors[index % pieColors.length]}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                                <div className={styles.legendContainer}>
                                    {peopleLossPieData.map((entry, index) => (
                                        <LegendItem
                                            className={styles.legend}
                                            key={`cell-${entry.name}`}
                                            color={pieColors[index % pieColors.length]}
                                            label={`${entry.name} (${entry.value})`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className={styles.pieChart}>
                                <h4>Family Loss</h4>
                                <PieChart width={240} height={240}>
                                    <Pie
                                        data={familyLossPieData}
                                        dataKey="value"
                                        cx={120}
                                        cy={120}
                                        outerRadius={60}
                                    >
                                        {familyLossPieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${entry.name}`}
                                                fill={pieColors[index % pieColors.length]}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                                <div className={styles.legendContainer}>
                                    {familyLossPieData.map((entry, index) => (
                                        <LegendItem
                                            className={styles.legend}
                                            key={`cell-${entry.name}`}
                                            color={pieColors[index % pieColors.length]}
                                            label={`${entry.name} (${entry.value})`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Table
                        className={styles.table}
                        data={hazardGroupedIncidents}
                        aggregatedStat={aggregatedStat}
                        hazardTypes={hazardTypes}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(createRequestClient(requestOptions)(SituationReport));
