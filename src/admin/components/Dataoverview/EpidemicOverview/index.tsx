/* eslint-disable no-tabs */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '@reach/router';
// import {
//     getEpidemicChartHourly,
//     getEpidemicChartDaily,
//     getEpidemicChartWeekly,
//     getEpidemicChartMonthly,
//     getEpidemicTable,
//     getEpidemicTotal,
// } from '../../../Redux/actions';
// import { RootState } from '../../../Redux/store';
import styles from './styles.module.scss';

const EpidemicOverview = () => {
    const [activeDataSource, setactiveDataSource] = useState('Hourly');
    const buttonElements = ['Hourly', 'Daily', 'Weekly', 'Monthly'];
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const {
    //     userDataMain,
    // } = useSelector(state => state.user);

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
    //     dispatch(getEpidemicChartHourly(region));
    //     dispatch(getEpidemicChartDaily(region));
    //     dispatch(getEpidemicChartWeekly(region));
    //     dispatch(getEpidemicChartMonthly(region));
    //     dispatch(getEpidemicTable(region));
    //     dispatch(getEpidemicTotal(region));
    // }, [dispatch, userDataMain]);

    const handleClick = (item) => {
        setactiveDataSource(item);
    };

    // const {
    //     epidemicChartHourlyData,
    //     epidemicChartDailyData,
    //     epidemicChartWeeklyData,
    //     epidemicChartMonthlyData,
    //     epidemicTableData,
    //     epidemicTotalData,
    // } = useSelector((state: RootState) => state.epidemic);

    const [chartHourlyData, setHourlyData] = useState();
    const [chartDailyData, setDailyData] = useState();
    const [chartWeeklyData, setWeeklyData] = useState();
    const [chartMonthlyData, setMonthlyData] = useState();
    // useEffect(() => {
    //     const temp = epidemicChartHourlyData.map(item => ({ ...item, date: item.date.split('T')[1] }));
    //     setHourlyData(temp);
    // }, [epidemicChartHourlyData]);
    // useEffect(() => {
    //     const temp = epidemicChartDailyData.map(item => ({ ...item, date: item.date.split('T')[0] }));
    //     setDailyData(temp);
    // }, [epidemicChartDailyData]);
    // useEffect(() => {
    //     const temp = epidemicChartWeeklyData.map(item => ({ ...item, date: item.date.split('T')[0] }));
    //     setWeeklyData(temp);
    // }, [epidemicChartWeeklyData]);
    // useEffect(() => {
    //     const temp = epidemicChartMonthlyData.map(item => ({ ...item, date: item.date.split('T')[0] }));
    //     setMonthlyData(temp);
    // }, [epidemicChartDailyData, epidemicChartMonthlyData]);

    const handleTableButton = () => {
        navigate('/epidemics-table');
    };


    function CustomTooltip({ payload, label, active }) {
        if (active && payload && payload.length > 0) {
            return (
                <div className={styles.customTooltip}>

                    <p className="label">{`${label.split('T')[0]}`}</p>
                    <p className={styles.affected}>{`Total affected people: ${payload[0].value}`}</p>
                    <p className={styles.dead}>{`Total dead people: ${payload[1].value}`}</p>
                </div>
            );
        }

        return null;
    }
    return (
        <>
            <div className={styles.dataOverview}>
                <h1 className={styles.dataOverviewTitle}>Epidemic Data Infographic</h1>
                <div className={styles.mainOverviewDataArea}>
                    <div className={styles.overviewChartArea}>
                        <div className={styles.firstRowArea}>
                            <h2 className={styles.summaryData}>Epidemic Data Summary</h2>
                            <div className={styles.timeFlowButtons}>
                                {
                                    buttonElements.map(item => (
                                        <button
                                            onClick={() => handleClick(item)}
                                            key={item}
                                            type="submit"
                                            className={activeDataSource === item ? styles.dailyweeklyMonthlyYearlyActive
                                                : styles.dailyweeklyMonthlyYearly}
                                        >
                                            {item}
                                            <div className={styles.subTitle}>
                                                {item === 'Hourly' ? '24-hrs'
                                                    : item === 'Daily' ? '7-days'
                                                        : item === 'Weekly' ? '4-weeks'
                                                            : '12-months' }
                                            </div>

                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                        <div className={styles.dummyBar} />
                        <div className={styles.mainLineChartSection}>
                            <div className={styles.barChart}>
                                <ResponsiveContainer width="100%" height="80%">
                                    <LineChart
                                        width={800}
                                        height={250}
                                        data={activeDataSource === 'Hourly' ? chartHourlyData
                                            : activeDataSource === 'Daily' ? chartDailyData
                                                : activeDataSource === 'Weekly' ? chartWeeklyData
                                                    : chartMonthlyData
                                        }
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" angle={-45} height={70} dx={-25} dy={25} interval="preserveStartEnd" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="totalPeopleInjured" stroke="#003572" strokeWidth={2} />
                                        <Line type="monotone" dataKey="totalPeopleDeath" stroke="#A3301C" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={styles.seperatorBar} />
                            <div className={styles.covidCasesMain}>
                                <div className={styles.covidCaseCountSection}>
                                    <div className={styles.mainCount}>
                                        {/* <h1 className={styles.countNumber}>{epidemicTotalData.totalPeopleInjured}</h1> */}

                                        <p className={styles.checkingStatus1}>
                                            {' '}
                                            <div className={styles.colorBoxes1} />
Total Affected
                                        </p>
                                    </div>
                                    <div className={styles.smallBar} />
                                    <div className={styles.mainCountThird}>
                                        {/* <h1 className={styles.countNumber}>{epidemicTotalData.totalPeopleDeath}</h1> */}
                                        <p className={styles.checkingStatus}>
                                            <div className={styles.colorBoxes2} />
Total Dead
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <p className={styles.shortIdeaPara} style={{ color: '#3e3e3e', lineHeight: '26px' }}>
							The graph gives the summary of people affected (as represented by the blue line) and people dead (as represented by the red line) due to the epidemic. The data can be viewed on a daily, weekly, monthly, and yearly basis.
                        </p>

                    </div>
                    <div className={styles.overviewTable}>
                        <div className={styles.tableNameAndButton}>
                            <h1 className={styles.mainTableName}>Epidemic Data Table</h1>
                            <button type="submit" className={styles.viewDataTabeleButton} onClick={handleTableButton}>View Data Table</button>
                        </div>
                        <div className={styles.mainTable}>
                            <TableContainer component={Paper} style={{ overflow: 'hidden' }}>
                                <Table sx={{ minWidth: 250 }} aria-label="caption table">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#DCECFE', fontWeight: 'bold' }}>
                                            <TableCell>Province</TableCell>
                                            <TableCell align="center">Total Dead</TableCell>
                                            <TableCell align="center">Total Affected</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* {Object.keys(epidemicTableData).map(row => (
                                            <TableRow key={row}>
                                                <TableCell component="th" scope="row">
                                                    {row}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {epidemicTableData[row].totalPeopleDeath ? epidemicTableData[row].totalPeopleDeath : '-' }
                                                </TableCell>
                                                <TableCell align="center">
                                                    {epidemicTableData[row].totalPeopleInjured ? epidemicTableData[row].totalPeopleInjured : '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))} */}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default EpidemicOverview;
