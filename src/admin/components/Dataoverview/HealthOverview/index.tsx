/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { getHealthOverviewTable ,getHealthOverviewChart } from '../../../Redux/actions';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';
import { navigate } from '@reach/router';
import styles from './styles.module.scss';
import tableHeadRef from './utils';

import { createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { SetHealthInfrastructurePageAction } from '#actionCreators';
import {
    healthInfrastructurePageSelector,
    userSelector,
} from '#selectors';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    healthInfrastructurePage: healthInfrastructurePageSelector(state),
    userDataMain: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setHealthInfrastructurePage: params => dispatch(SetHealthInfrastructurePageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    resourceTable: {
        url: '/resource/',
        method: methods.GET,
        onMount: false,
        query: () => ({
            format: 'json',
            summary: 'true',
            summary_type: 'heoc_admin_overview_health_infrastructure_table',
        }),
        onSuccess: ({ response, props }) => {
            props.setHealthInfrastructurePage({
                healthOverviewTableData: response.results,
            });
        },
    },
    resourceChart: {
        url: '/resource/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            summary: 'true',
            summary_type: 'heoc_admin_overview_health_infrastructure_graph',
            province: params.province,
            municipality: params.municipality,
            district: params.district,
        }),
        onSuccess: ({ response, props }) => {
            props.setHealthInfrastructurePage({
                healthOverviewChartData: response.results,
            });
        },
    },
};


const HealthOverview = (props) => {
    const [healthFacilityChart, sethealthFacilityChart] = useState([]);
    const [emergencyService, setEmergencyService] = useState([]);
    const [tableHead, setTableHead] = useState([]);
    const {
        healthInfrastructurePage: {
            healthOverviewTableData,
            healthOverviewChartData,
        },
        userDataMain,
    } = props;

    useEffect(() => {
        props.requests.resourceTable.do();
        props.requests.resourceChart.do({
            province: userDataMain.profile.province,
            district: userDataMain.profile.district,
            municipality: userDataMain.profile.municipality,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (healthOverviewChartData && Object.keys(healthOverviewChartData).length > 0) {
            const fcD = [
                {
                    name: 'New Health Facilities',
                    Total: healthOverviewChartData.healthFacility.new,
                },
                {
                    name: 'Total Health Facilities',
                    Total: healthOverviewChartData.healthFacility.total,
                },
            ];
            const ecD = [
                {
                    name: 'New Emergency Services',
                    Total: healthOverviewChartData.emergencyService.new,
                },
                {
                    name: 'Total Emergency Services',
                    Total: healthOverviewChartData.emergencyService.total,
                },
            ];
            sethealthFacilityChart(fcD);
            setEmergencyService(ecD);
        }
    }, [healthOverviewChartData]);

    const handleTableButton = () => {
        navigate('/admin/health-infrastructure/health-infrastructure-data-table');
    };

    return (
        <>
            <h2 className={styles.mainHeading}>Health Infrastructure Data Visualization</h2>
            <div className={styles.main}>
                <div className={styles.chartsContainer}>
                    {
                        healthFacilityChart.length > 0 && (
                            <div className={styles.chartContainer}>
                                <h3>Health Facilities</h3>
                                <ResponsiveContainer width={'100%'} height={'100%'}>
                                    <BarChart
                                        data={healthFacilityChart}
                                        margin={{ left: 0, right: 20 }}
                                        width={800}
                                        height={250}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <YAxis type="number" scale="sqrt" />
                                        <XAxis
                                            type="category"
                                            dataKey="name"
                                            tick={{ fill: '#3e3e3e' }}
                                        />
                                        <Bar
                                            dataKey="Total"
                                            fill="#002e76"
                                            barSize={40}
                                            label={{ position: 'right', fill: '#3e3e3e' }}
                                            tick={{ fill: '#3e3e3e', fontSize: '11px' }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )
                    }
                    {
                        emergencyService.length > 0 && (
                            <div className={styles.chartContainer}>
                                <h3>Emergency Services</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={emergencyService}
                                        width={800}
                                        height={250}
                                        margin={{ left: 0, right: 20, top: 20 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <YAxis type="number" scale="sqrt" />
                                        <XAxis
                                            type="category"
                                            dataKey="name"
                                            tick={{ fill: '#3e3e3e' }}
                                        />
                                        <Bar
                                            dataKey="Total"
                                            fill="#002e76"
                                            barSize={40}
                                            label={{ position: 'right', fill: '#3e3e3e' }}
                                            tick={{ fill: '#3e3e3e' }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )
                    }
                    <div className={styles.textContainer}>
                        <p>An Integrated Disaster Information Management System is one of the most crucial components for policymaking, planning, and implementing DRRM activities. However, in Nepal, disaster data/information is still scattered, insufficient, and not fully harmonized.</p>
                    </div>
                </div>
                <div className={styles.overviewTable}>
                    <div className={styles.tableNameAndButton}>
                        <h1 className={styles.mainTableName}>Health Infastructure Data Table</h1>
                        <button type="submit" className={styles.viewDataTabeleButton} onClick={handleTableButton}>View Data Table</button>
                    </div>
                    <div className={styles.mainTable}>
                        <TableContainer component={Paper} style={{ overflow: 'hidden' }}>
                            <Table sx={{ minWidth: 250 }} aria-label="caption table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#DCECFE', fontWeight: 'bold' }}>
                                        <TableCell>Province</TableCell>
                                        <TableCell align="center">Total Hospital</TableCell>
                                        <TableCell align="center">Total Emergency Services</TableCell>
                                        <TableCell align="center">Total Bed Capacity</TableCell>
                                    </TableRow>
                                </TableHead>
                                { healthOverviewTableData && Object.keys(healthOverviewTableData).length > 0
                                && (
                                    <TableBody>
                                        {Object.keys(healthOverviewTableData).map((tD, i) => (
                                            <TableRow key={tD} className={styles.row}>
                                                <TableCell className={styles.cell}>
                                                    {tableHeadRef[Object.keys(healthOverviewTableData)[i]]}
                                                </TableCell>
                                                {
                                                    Object.keys(healthOverviewTableData[tD]).map(tC => (
                                                        <TableCell key={tC} className={styles.cell} align="center">
                                                            {typeof healthOverviewTableData[tD][tC] === 'number' ? healthOverviewTableData[tD][tC] : '-'}
                                                        </TableCell>
                                                    ))

                                                }
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                )
                                }
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>

        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            HealthOverview,
        ),
    ),
);
