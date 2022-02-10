/* eslint-disable no-tabs */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'react-loader';
import { navigate } from '@reach/router';
import styles from './styles.module.scss';
// import { covidDailyData, covidTableData, covidMonthlyData, covidWeeklyData, covidYearlyData, getCovidDataRegionWise } from '../../Redux/covidActions/covidActions';
// import { RootState } from '../../Redux/store';
import HealthOverview from './HealthOverview';
import EpidemicOverview from './EpidemicOverview';

const Overview = () => {
    const [activeDataSource, setactiveDataSource] = useState('Hourly');
    const buttonElements = ['Hourly', 'Daily', 'Weekly', 'Monthly'];
    // const { loadingUser, userDataMain } = useSelector((state: RootState) => state.user);
    // const dispatch = useDispatch();


    // useEffect(() => {
    //     dispatch(covidDailyData());
    //     dispatch(covidWeeklyData());
    //     dispatch(covidMonthlyData());
    //     dispatch(covidYearlyData());
    //     dispatch(covidTableData());
    // }, [dispatch]);

    // useEffect(() => {
    //     if (userDataMain && userDataMain.profile && userDataMain.profile.province) {
    //         dispatch(getCovidDataRegionWise(userDataMain.profile.province));
    //     }
    // }, [dispatch, loadingUser, userDataMain]);

    const handleClick = (item) => {
        if (item === 'Daily') {
            setactiveDataSource('Daily');
        } else if (item === 'Weekly') {
            setactiveDataSource('Weekly');
        } else if (item === 'Monthly') {
            setactiveDataSource('Monthly');
        } else if (item === 'Hourly') {
            setactiveDataSource('Hourly');
        }
    };


    // const { loadingDaily, dailyCovidData } = useSelector((state: RootState) => state.covidDailyDataIs);
    // const { loadingWeekly, weeklyCovidData } = useSelector((state: RootState) => state.covidWeeklyDataIs);
    // const { loadingMonthly, monthlyCovidData } = useSelector((state: RootState) => state.covidMonthlyDataIs);
    // const { loadingYearly, yearlyCovidData } = useSelector((state: RootState) => state.covidYearlyDataIs);
    // const { loadingTable, tableCovidData } = useSelector((state: RootState) => state.covidTabledata);
    // const { loadingCovidRegionWiseData, covidRegionWiseData } = useSelector((state: RootState) => state.covidRegionWiseData);


    // const navigate = useNavigate();

    const viewDataTable = () => {
        navigate('/covid19-table');
    };

    return (
        <>
            {/* {(loadingDaily || loadingWeekly || loadingMonthly || loadingYearly || loadingTable) ? ( */}
			(
            <div style={{ height: '280px' }}>
                <Loader options={{
                    position: 'fixed',
                    top: '48%',
                    right: 0,
                    bottom: 0,
                    left: '48%',
                    background: 'gray',
                    zIndex: 9999,
                }}
                />
            </div>
            )
                : (
            <div className={styles.dataOverview}>
                <h1 className={styles.dataOverviewTitle}>Covid-19 Data Infographic</h1>
                <div className={styles.mainOverviewDataArea}>
                    <div className={styles.overviewChartArea}>
                        <div className={styles.firstRowArea}>
                            <h2 className={styles.summaryData}>COVID-19 Data Summary</h2>
                            <div className={styles.timeFlowButtons}>
                                {
                                    buttonElements.map(item => (
                                        <button
                                            onClick={() => handleClick(item)}
                                            key={item}
                                            type="submit"
                                            className={activeDataSource === item
                                                ? styles.dailyweeklyMonthlyYearlyActive
                                                : styles.dailyweeklyMonthlyYearly}
                                        >
                                            {item}
                                            <div className={styles.subTitle}>
                                                {item === 'Hourly' ? '24-hrs'
                                                    : item === 'Daily' ? '7-days'
                                                        : item === 'Weekly' ? '4-weeks'
                                                            : '1-month' }
                                            </div>

                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                        <div className={styles.dummyBar} />
                        <div className={styles.mainLineChartSection}>
                            <div className={styles.barChart}>
                                <ResponsiveContainer width="100%" height="88%">
                                    <LineChart
                                        width={800}
                                        height={250}
                                        // data={activeDataSource === 'Daily' ? dailyCovidData : activeDataSource === 'Weekly'
                                        //     ? weeklyCovidData : activeDataSource === 'Monthly'
                                        //         ? monthlyCovidData : yearlyCovidData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" angle={-45} height={70} dx={-25} dy={25} />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="totalPositive" stroke="#72CCA1" strokeWidth={2} />
                                        <Line type="monotone" dataKey="totalRecovered" stroke="#003572" strokeWidth={2} />
                                        <Line type="monotone" dataKey="totalDeath" stroke="#A3301C" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={styles.seperatorBar} />
                            <div className={styles.covidCasesMain}>
                                <div className={styles.covidCaseCountSection}>
                                    <div className={styles.mainCount}>
                                        <h1 className={styles.countNumber}>
                                            {/* {covidRegionWiseData ? covidRegionWiseData.totalPositive : '-'} */}
                                        </h1>
                                        <p className={styles.checkingStatus}>
                                            <div className={styles.colorBoxes3} />
Total Infected
                                        </p>
                                    </div>
                                    <div className={styles.smallBar} />
                                    <div className={styles.mainCount}>
                                        <h1 className={styles.countNumber}>
                                            {/* {covidRegionWiseData ? covidRegionWiseData.totalRecovered : '-'} */}
                                        </h1>
                                        <p className={styles.checkingStatus1}>
                                            {' '}
                                            <div className={styles.colorBoxes1} />
Total Recovered
                                        </p>
                                    </div>
                                    <div className={styles.smallBar} />
                                    <div className={styles.mainCountThird}>
                                        <h1 className={styles.countNumber}>
                                            {/* {covidRegionWiseData ? covidRegionWiseData.totalDeath : '-'} */}
                                        </h1>
                                        <p className={styles.checkingStatus}>
                                            <div className={styles.colorBoxes2} />
Total Death
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className={styles.additionalDataInfo}>
							The graph gives the summary of the total people infected due to COVID (as represented by the blue line),
							the total people recovered from COVID (as represented by green line),
							and the total people dead due to COIVD (as represented by the red line).
							The data can be viewed on a daily, weekly, monthly, and yearly basis.
                        </p>
                    </div>
                    <div className={styles.overviewTable}>
                        <div className={styles.tableNameAndButton}>
                            <h1 className={styles.mainTableName}>COVID-19 Data Table</h1>
                            <button type="submit" onClick={viewDataTable} className={styles.viewDataTabeleButton}>View Data Table</button>
                        </div>
                        <div className={styles.mainTable}>
                            <TableContainer component={Paper}>

                                <Table sx={{ minWidth: 250 }} aria-label="caption table">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#DCECFE', fontWeight: 'bold' }}>
                                            <TableCell>Province</TableCell>
                                            <TableCell align="center">Total Positive</TableCell>
                                            <TableCell align="center">Total Recovered</TableCell>
                                            <TableCell align="center">Total Death</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {/* <TableBody>
                                        {tableCovidData.length > 0 && tableCovidData.map(data => (
                                            <TableRow key={data.provinceName}>
                                                <TableCell component="th" scope="row">
                                                    {data.provinceName}
                                                </TableCell>
                                                <TableCell align="center">{data.totalPositive}</TableCell>
                                                <TableCell align="center">{data.totalRecovered}</TableCell>
                                                <TableCell align="center">{data.totalDeath}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody> */}
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
                <EpidemicOverview />
                <HealthOverview />
            </div>
                )

        </>
    );
};

export default Overview;
