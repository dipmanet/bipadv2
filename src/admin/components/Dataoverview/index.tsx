/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-tabs */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { connect, useDispatch, useSelector } from 'react-redux';
import Loader from 'react-loader';
import { navigate } from '@reach/router';
import styles from './styles.module.scss';
import HealthOverview from './HealthOverview';
import EpidemicOverview from './EpidemicOverview';

import {
    covidPageSelector,
    userSelector,
} from '#selectors';

import { createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { SetCovidPageAction } from '#actionCreators';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    covidPage: covidPageSelector(state),
    userDataMain: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setCovidPage: params => dispatch(SetCovidPageAction(params)),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    dailyCovid: {
        url: '/covid19-quarantineinfo/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            summary: true,
            summary_type: 'heoc_admin_overview_covid19_graph_daily',
            province: params.province,
            municipality: params.municipality,
            district: params.district,
            reported_on__gt: params.newYesterday,
            reported_on__lt: params.newToday,
        }),
        onSuccess: ({ response, props, params }) => {
            props.setCovidPage({
                dailyCovidData: response.results,
            });
            params.setLoading(false);
        },
    },
    weeklyCovid: {
        url: '/covid19-quarantineinfo/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            summary: true,
            summary_type: 'heoc_admin_overview_covid19_graph_weekly',
            province: params.province,
            municipality: params.municipality,
            district: params.district,
            reported_on__gt: params.newYesterday,
            reported_on__lt: params.newToday,
        }),
        onSuccess: ({ response, props, params }) => {
            props.setCovidPage({
                weeklyCovidData: response.results,
            });
            params.setLoading(false);
        },
    },
    monthlyCovid: {
        url: '/covid19-quarantineinfo/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            summary: true,
            summary_type: 'heoc_admin_overview_covid19_graph_monthly',
            province: params.province,
            municipality: params.municipality,
            district: params.district,
            reported_on__gt: params.newYesterday,
            reported_on__lt: params.newToday,
        }),
        onSuccess: ({ response, props, params }) => {
            props.setCovidPage({
                monthlyCovidData: response.results,
            });
            params.setLoading(false);
        },
    },
    yearlyCovid: {
        url: '/covid19-quarantineinfo/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            summary: true,
            summary_type: 'heoc_admin_overview_covid19_graph_yearly',
            province: params.province,
            municipality: params.municipality,
            district: params.district,
            reported_on__gt: params.newYesterday,
            reported_on__lt: params.newToday,
        }),
        onSuccess: ({ response, props, params }) => {
            props.setCovidPage({
                yearlyCovidData: response.results,
            });
            params.setLoading(false);
        },
    },
    covidTable: {
        url: '/covid19-quarantineinfo/',
        method: methods.GET,
        onMount: false,
        query: () => ({
            format: 'json',
            summary: true,
            summary_type: 'heoc_admin_overview_covid19_table',
        }),
        onSuccess: ({ response, props, params }) => {
            props.setCovidPage({
                tableCovidData: response.results,
            });
            params.setLoading(false);
        },
    },
    covidTotal: {
        url: '/covid19-quarantineinfo/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            summary: true,
            summary_type: 'heoc_admin_overview_covid19_total',
            province: params.province,
            municipality: params.municipality,
            district: params.district,
        }),
        onSuccess: ({ response, props, params }) => {
            props.setCovidPage({
                covidRegionWiseData: response.results,
            });
            params.setLoading(false);
        },
    },
};

const Overview = (props) => {
    const [activeDataSource, setactiveDataSource] = useState('Yearly');
    const buttonElements = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const [loading, setLoading] = useState(false);
    const {
        covidPage: {
            dailyCovidData,
            weeklyCovidData,
            monthlyCovidData,
            yearlyCovidData,
            tableCovidData,
            covidRegionWiseData,
        },
        userDataMain,
    } = props;

    const newToday = () => {
        const today = new Date();
        const temp = new Date(today.setUTCHours(23, 59, 59)).toISOString().split('T')[0];
        // return '2021-12-17T00:00:00+05:45';
        return temp;
    };
    const newYesterday = (period) => {
        const yesterday = new Date();
        let temp;
        if (period === 'daily') {
            yesterday.setDate(yesterday.getDate() - 7);
            temp = new Date(yesterday.setUTCHours(0, 0, 0, 0)).toISOString().split('T')[0];
            // temp = '2021-12-10T00:00:00+05:45';
        }
        if (period === 'weekly') {
            const today = new Date();
            const lastMonth = new Date(today);
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            temp = new Date(lastMonth.setUTCHours(0, 0, 0, 0)).toISOString().split('T')[0];
            // temp = '2021-11-17T00:00:00+05:45';
        }
        if (period === 'monthly') {
            const today = new Date();
            const lastYear = new Date(today);
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            temp = new Date(lastYear.setUTCHours(0, 0, 0, 0)).toISOString().split('T')[0];
            // temp = '2020-12-17T00:00:00+05:45';
        }
        if (period === 'yearly') {
            const today = new Date();
            const lastYear = new Date(today);
            lastYear.setFullYear(lastYear.getFullYear() - 4);
            temp = new Date(lastYear.setUTCHours(0, 0, 0, 0)).toISOString().split('T')[0];
            // temp = '2020-12-17T00:00:00+05:45';
        }
        return temp;
    };

    useEffect(() => {
        if (userDataMain.isSuperuser) {
            setLoading(true);
            props.requests.dailyCovid.do({
                newToday: newToday(),
                newYesterday: newYesterday('daily'),
                setLoading,
            });
            props.requests.weeklyCovid.do({
                newToday: newToday(),
                newYesterday: newYesterday('weekly'),
                setLoading,
            });
            props.requests.monthlyCovid.do({
                newToday: newToday(),
                newYesterday: newYesterday('monthly'),
                setLoading,
            });
            props.requests.yearlyCovid.do({
                newToday: newToday(),
                newYesterday: newYesterday('yearly'),
                setLoading,
            });
            props.requests.covidTable.do({ setLoading });
            props.requests.covidTotal.do({ setLoading });
        } else {
            setLoading(true);
            props.requests.dailyCovid.do({
                province: userDataMain.profile.province,
                district: userDataMain.profile.district,
                municipality: userDataMain.profile.municipality,
                newToday: newToday(),
                newYesterday: newYesterday('daily'),
                setLoading,
            });
            props.requests.weeklyCovid.do({
                province: userDataMain.profile.province,
                district: userDataMain.profile.district,
                municipality: userDataMain.profile.municipality,
                newToday: newToday(),
                newYesterday: newYesterday('weekly'),
                setLoading,
            });
            props.requests.monthlyCovid.do({
                province: userDataMain.profile.province,
                district: userDataMain.profile.district,
                municipality: userDataMain.profile.municipality,
                newToday: newToday(),
                newYesterday: newYesterday('monthly'),
                setLoading,
            });
            props.requests.yearlyCovid.do({
                province: userDataMain.profile.province,
                district: userDataMain.profile.district,
                municipality: userDataMain.profile.municipality,
                newToday: newToday(),
                newYesterday: newYesterday('yearly'),
                setLoading,
            });
            props.requests.covidTable.do({ setLoading });
            props.requests.covidTotal.do({
                province: userDataMain.profile.province,
                district: userDataMain.profile.district,
                municipality: userDataMain.profile.municipality,
                setLoading,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = (item) => {
        if (item === 'Daily') {
            setactiveDataSource('Daily');
        } else if (item === 'Weekly') {
            setactiveDataSource('Weekly');
        } else if (item === 'Monthly') {
            setactiveDataSource('Monthly');
        } else if (item === 'Yearly') {
            setactiveDataSource('Yearly');
        }
    };

    const viewDataTable = () => {
        navigate('/admin/covid-19/covid-19-data-table');
    };

    return (
        <>
            {
                loading ? (
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
                ) : (
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
                                                        {
                                                            item === 'Daily' ? '7-days'
                                                                : item === 'Weekly' ? '4-weeks'
                                                                    : item === 'Monthly' ? '12-months'
                                                                        : '4-years' }
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
                                                data={activeDataSource === 'Daily' ? dailyCovidData : activeDataSource === 'Weekly'
                                                    ? weeklyCovidData : activeDataSource === 'Monthly'
                                                        ? monthlyCovidData : yearlyCovidData}
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
                                                    {covidRegionWiseData ? covidRegionWiseData.totalPositive : '-'}
                                                </h1>
                                                <p className={styles.checkingStatus}>
                                                    <div className={styles.colorBoxes3} />
                                                    Total Infected
                                                </p>
                                            </div>
                                            <div className={styles.smallBar} />
                                            <div className={styles.mainCount}>
                                                <h1 className={styles.countNumber}>
                                                    {covidRegionWiseData ? covidRegionWiseData.totalRecovered : '-'}
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
                                                    {covidRegionWiseData ? covidRegionWiseData.totalDeath : '-'}
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
                                            <TableBody>
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
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                        <EpidemicOverview />
                        <HealthOverview />
                    </div>
                )
            }
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Overview,
        ),
    ),
);
