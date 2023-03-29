import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import {
    _cs,
    isDefined,
    listToMap,
} from '@togglecorp/fujs';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import {
    Bar,
    BarChart,
    Cell,
    LabelList,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';


import styles from './styles.scss';

import HazardsLegend from '#components/HazardsLegend';
import LayerLegend from '#components/LayerLegend';
import ProvinceChoroplethMap from '#components/ProvinceChroplethMap';
import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';
import {
    createRequestClient,
    methods,
} from '#request';
import Button from '#rsca/Button';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Message from '#rscv/Message';
import LegendItem from '#rscz/Legend/LegendItem';
import {
    hazardTypesSelector,
    languageSelector,
    mapStyleSelector,
    regionsSelector,
} from '#selectors';
import { groupList } from '#utils/common';
import {
    generatePaint,
    hazardTypesList,
} from '#utils/domain';
import IncidentMap from '#views/Incidents/Map';
import {
    getGroupedIncidents,
    getGroupMethod,
    getSanitizedIncidents,
    getSumStats,
} from '#views/LossAndDamage/common';
import Table from './Table';

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
    language: languageSelector(state),
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
        const { language: { language } } = this.props;
        const peopleLossPieData = [
            {
                name: language === 'en' ? 'Death' : 'मृत्यु',
                value: aggregatedStat.peopleDeathCount,
            },
            {
                name: language === 'en' ? 'Injured' : 'घाइते',
                value: aggregatedStat.peopleInjuredCount,
            },
            {
                name: language === 'en' ? 'Missing' : 'हराइरहेको',
                value: aggregatedStat.peopleMissingCount,
            },
            {
                name: language === 'en' ? 'Affected' : 'प्रभावित',
                value: aggregatedStat.peopleAffectedCount,
            },
        ];

        const familyLossPieData = [
            {
                name: language === 'en' ? 'Relocated' : 'स्थानान्तरण गरिएको',
                value: aggregatedStat.familyRelocatedCount,
            },
            {
                name: language === 'en' ? 'Affected' : 'प्रभावित',
                value: aggregatedStat.familyAffectedCount,
            },
            {
                name: language === 'en' ? 'Evacuated' : 'खाली गरिएको',
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
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            const doc = new JsPDF('p', 'mm');
            let position = 10; // give some top padding to first page

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position += heightLeft - imgHeight; // top padding for other pages
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save('situation-report.pdf');
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
                    <Translation>
                        {
                            t => (
                                <Message>
                                    {t('Please select a situation report')}
                                </Message>
                            )
                        }
                    </Translation>

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
                    <Translation>
                        {
                            t => (
                                <Message>
                                    {t('There are no incidents in this situation report')}
                                </Message>
                            )
                        }
                    </Translation>

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
                <div className={styles.downloadButtonContainer}>
                    <Translation>
                        {
                            t => (
                                <Button
                                    className={styles.downloadButton}
                                    onClick={this.handleDownloadClick}
                                    iconName="download"
                                >

                                    {t('Download')}
                                </Button>
                            )
                        }
                    </Translation>

                </div>
                <div className={styles.situationReportFull}>
                    <header className={styles.header}>
                        <Translation>
                            {
                                t => (
                                    <h2>{t('Incident Situation Report')}</h2>

                                )
                            }
                        </Translation>
                    </header>
                    <div className={styles.map}>
                        <Translation>
                            {
                                t => (
                                    <h3 className={styles.mapHeading}>
                                        {t('Incident Statistics')}
                                    </h3>
                                )
                            }
                        </Translation>

                        <Map
                            mapStyle={mapStyle}
                            mapOptions={{
                                logoPosition: 'top-left',
                                minZoom: 5,
                                interactive: false,
                            }}
                            scaleControlShown={false}
                            navControlShown={false}
                        >
                            <MapContainer className={styles.mapContainer} />
                            <IncidentMap
                                sourceKey="situation-report-incidents"
                                incidentList={incidents}
                                isProviceOnlyMap
                            />
                            <div className={styles.legend}>
                                <Translation>
                                    {
                                        t => (
                                            <div className={styles.legendTitle}>{t('Hazards Legend')}</div>

                                        )
                                    }
                                </Translation>
                                <HazardsLegend
                                    filteredHazardTypes={filteredHazardTypes}
                                    className={styles.hazardLegend}
                                    itemClassName={styles.legendItem}
                                />
                            </div>
                        </Map>
                    </div>
                    <div className={styles.vizContainer}>
                        <Translation>
                            {
                                t => (
                                    <h3 className={styles.heading}>{t('Disaster Summary')}</h3>

                                )
                            }
                        </Translation>
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
                        <Translation>
                            {
                                t => (
                                    <h3 className={styles.mapHeading}>
                                        {t('Casuality Statistics')}
                                    </h3>
                                )
                            }
                        </Translation>

                        <Map
                            mapStyle={mapStyle}
                            mapOptions={{
                                logoPosition: 'top-left',
                                minZoom: 5,
                                interactive: false,
                            }}
                            scaleControlShown={false}
                            navControlShown={false}
                        >
                            <MapContainer className={styles.mapContainer} />
                            <ProvinceChoroplethMap
                                sourceKey="inci-choro"
                                paint={colorPaint.paint}
                                mapState={mapState}
                            />
                            <Translation>
                                {
                                    t => (

                                        <LayerLegend
                                            layer={{
                                                type: 'choropleth',
                                                minValue: minCasuality,
                                                legendTitle: t('Casuality Statistics'),
                                                legend: colorPaint.legend,
                                            }}
                                        />
                                    )
                                }
                            </Translation>

                        </Map>
                    </div>
                    <div className={styles.charts}>
                        <div className={styles.pieCharts}>
                            <div className={styles.pieChart}>
                                <Translation>
                                    {
                                        t => (
                                            <h4>{t('People Loss')}</h4>

                                        )
                                    }
                                </Translation>
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
                                <Translation>
                                    {
                                        t => (
                                            <h4>{t('Family Loss')}</h4>

                                        )
                                    }
                                </Translation>
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
