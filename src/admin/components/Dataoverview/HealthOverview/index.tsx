/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { tableHeadRef } from './utils';

const HealthOverview = () => {
    const [healthFacilityChart, sethealthFacilityChart] = useState([]);
    const [emergencyService, setEmergencyService] = useState([]);
    const [tableHead, setTableHead] = useState([]);
    // const {
    // healthOverviewTableLoading,
    // healthOverviewTableData,
    // healthOverviewTableError,
    // healthOverviewChartLoading,
    // healthOverviewChartData,
    // healthOverviewChartError,
    // } = useSelector((state) => state.health);

    // const {
    // userDataMain
    // } = useSelector((state) => state.user);


    // useEffect(() => {
    //     const region = {};
    //     if (userDataMain && userDataMain.profile && Object.keys(userDataMain).length > 0) {
    //         console.log('user data main', userDataMain);
    //         if (userDataMain.profile.municipality) {
    //             region.municipality = userDataMain.profile.municipality;
    //         }
    //         if (userDataMain.profile.district) {
    //             region.district = userDataMain.profile.district;
    //         }
    //         if (userDataMain.profile.province) {
    //             region.province = userDataMain.profile.province;
    //         }
    //     }
    //     dispatch(getHealthOverviewTable(region));
    //     dispatch(getHealthOverviewChart(region));
    // }, []);

    // useEffect(() => {
    //     if (Object.keys(healthOverviewChartData).length > 0) {
    //         const fcD = [
    //             {
    //                 name: 'New Health Facilities',
    //                 Total: healthOverviewChartData.healthFacility.new,
    //             },
    //             {
    //                 name: 'Total Health Facilities',
    //                 Total: healthOverviewChartData.healthFacility.total,
    //             },
    //         ];
    //         const ecD = [
    //             {
    //                 name: 'New Emergency Services',
    //                 Total: healthOverviewChartData.emergencyService.new,
    //             },
    //             {
    //                 name: 'Total Emergency Services',
    //                 Total: healthOverviewChartData.emergencyService.total,
    //             },
    //         ];
    //         console.log('facility', fcD);
    //         console.log('emergency', ecD);
    //         sethealthFacilityChart(fcD);
    //         setEmergencyService(ecD);
    //     }
    // }, []);

    const handleTableButton = () => {
        navigate('/health-table');
    };
    // const scale = scaleLog().base(Math.E);
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
                                <TableBody>
                                    {/* {Object.keys(healthOverviewTableData).map((tD, i) => (
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
                                    ))} */}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>

        </>
    );
};

export default HealthOverview;
