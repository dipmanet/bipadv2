/* eslint-disable no-tabs */
import React from 'react';
import { PieChart, Pie, Legend,
    Tooltip, ResponsiveContainer,
    BarChart, CartesianGrid, XAxis,
    YAxis, Bar } from 'recharts';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import styles from './styles.scss';
import {
    generalDataSelector,
    budgetDataSelector,
    budgetActivityDataSelector,
    programAndPolicySelector,

} from '#selectors';
import Organisation from '../../Organisation';
import Inventory from '../../Inventory';
import Budget from '../../Budget';
import Header from './Header';

const mapStateToProps = state => ({
    generalData: generalDataSelector(state),
    programAndPolicyData: programAndPolicySelector(state),
    budgetData: budgetDataSelector(state),
    budgetActivityData: budgetActivityDataSelector(state),
});

interface Props{
    reportData: Element[];
}

export interface GeneralData{
    reportTitle?: string;
    fiscalYear: string;
    mayor: string;
    cao: string;
    focalPerson: string;
    formationDate: string;
    committeeMembers: number;
}

export interface BudgetData{
    totMunBudget: number;
    totDrrBudget: number;
    additionalDrrBudget: number;
}

export interface ProgramAndPolicyData{
    pointOne: string;
    pointTwo: string;
    pointThree: string;
}

export interface BudgetActivityData{
    name: string;
    fundSource: string;
    additionalDrrBudget: string;
    budgetCode: string;
    drrmCycle: string;
    projStatus: string;
    projCompletionDate: string;
    allocatedBudget: string;
    actualExp: string;
    remarks: string;
}


const data02 = [
    { name: 'Group A', value: 2400 },
    { name: 'Group B', value: 4567 },
    { name: 'Group C', value: 1398 },

];


const Preview = (props: Props) => {
    const {
        generalData,
        programAndPolicyData,
        budgetData,
        budgetActivityData,
        url,
    } = props;

    const {
        reportTitle,
        fiscalYear,
        mayor,
        cao,
        focalPerson,
        formationDate,
        committeeMembers,
    } = generalData;

    const {
        municipalBudget,
        drrFund,
        additionalFund,
    } = budgetData;

    const {
        name,
        fundSource,
        budgetCode,
        drrmCycle,
        projStatus,
        projCompletionDate,
        allocatedBudget,
        actualExp,
        remarks,
    } = budgetActivityData;

    const budgetChartData = Object.keys(budgetData).map(item => ({
        name: item,
        value: parseInt(budgetData[item], 10),
    }));

    const activityTableData = ['name', 'fundSource', 'budgetCode', 'allocatedBudget'];

    const disasterInventoryChartData = [
        {
            name: 'Bed',
            Amount: 98,
        },
        {
            name: 'Ambulance',
            Amount: 12,
        },
        {
            name: 'FireBrigade',
            Amount: 1,
        },
        {
            name: 'Loader',
            Amount: 13,
        },
        {
            name: 'Excavator',
            Amount: 9,
        },

    ];

    const CIChartData = [
        {
            name: 'Education',
            Amount: 98,
        },
        {
            name: 'Health',
            Amount: 12,
        },
        {
            name: 'Finance',
            Amount: 1,
        },
        {
            name: 'Governance',
            Amount: 13,
        },
        {
            name: 'Tourism',
            Amount: 9,
        },
        {
            name: 'Culture',
            Amount: 9,
        },
        {
            name: 'Industry',
            Amount: 9,
        },
        {
            name: 'Communication',
            Amount: 9,
        },

    ];

    const trainedHRData = [
        {
            name: 'Education',
            Amount: 98,
        },
        {
            name: 'Health',
            Amount: 12,
        },
        {
            name: 'Finance',
            Amount: 1,
        },
        {
            name: 'Governance',
            Amount: 13,
        },
        {
            name: 'Tourism',
            Amount: 9,
        },
        {
            name: 'Culture',
            Amount: 9,
        },
        {
            name: 'Industry',
            Amount: 9,
        },
        {
            name: 'Communication',
            Amount: 9,
        },

    ];

    return (
        <div className={styles.previewContainer}>
            <Header />
            <div className={styles.rowOne}>

                <div className={styles.columnOneOne}>
                    <Budget
                        previewDetails
                        reportData={''}
                        tableHeader={() => {}}
                        updateTab={() => {}}
                        page={-1}
                        handlePrevClick={() => {}}
                        handleNextClick={() => {}}
                    />
                </div>
                <div className={styles.columnOneTwo} />
            </div>
            <div className={styles.rowTwo}>
                <div className={styles.columnTwoOne}>
                    <div className={styles.mainTitle}>
                      DISASTER RELATED TOPICS IN ANNUAL
                      PROGRAM AND POLICIES
                        {' '}
                        <ul className={styles.listMain}>
                            {programAndPolicyData.length > 0
                        && ('firstName' in programAndPolicyData[0])
                                ? programAndPolicyData.map(item => (
                                    <li key={Math.random()}>
                                        { item.firstName}
                                    </li>
                                ))
                                : 'No data'
                            }
                        </ul>


                    </div>
                </div>
                {/* <div className={styles.columnTwoTwo}>
                    <div className={styles.title}>
                        <DRRMembers />
                    </div>
                </div> */}
                <div className={styles.columnTwoTwo}>

                    <Organisation hide={1} page={5} />
                </div>
            </div>


            <div className={styles.rowOrg}>
                {/* <Organisation rows={5} url={url} /> */}
                <div className={styles.mainTitle}>
                 DRR related organizations in Municipal Government
                </div>
                <Table striped bordered hover size="md">
                    <thead>
                        <tr>
                            <th>S.N</th>
                            <th>Name of Organisation</th>
                            <th>Number of Employees</th>
                            <th>Gender(M/F)</th>
                            <th>Level(A/B/C)</th>
                            <th>Type of organisation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Police Station, Godiyana,09 Rajapur</td>
                            <td>7</td>
                            <td>7/0</td>
                            <td>null</td>
                            <td>Government</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Police Station, Godiyana,09 Rajapur</td>
                            <td>8</td>
                            <td>8/0</td>
                            <td>null</td>
                            <td>Government</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Police Station, Godiyana,09 Rajapur</td>
                            <td>7</td>
                            <td>7/0</td>
                            <td>null</td>
                            <td>Government</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Police Station, Godiyana,09 Rajapur</td>
                            <td>3</td>
                            <td>2/1</td>
                            <td>null</td>
                            <td>CSO</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>Police Station, Godiyana,09 Rajapur</td>
                            <td>14</td>
                            <td>11/3</td>
                            <td>null</td>
                            <td>Government</td>
                        </tr>


                    </tbody>
                </Table>

            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                    <div className={styles.mainTitle}>
                 DRR RELATED CRITICAL INFRASTRUCTURES IN MUNICIPALITY
                    </div>
                    <BarChart
                        width={300}
                        height={130}
                        data={CIChartData}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#94bdcf' }}
                        />
                        {/* <Tooltip /> */}
                        {/* <Legend /> */}
                        <Bar dataKey="Amount" stackId="a" fill="#8884d8" />
                    </BarChart>
                </div>
                <div className={styles.columnThreeTwo}>
                    <div className={styles.mainTitle}>
                 DRR RELATED INVETORIES IN MUNICIPAL GOVERNMENT
                    </div>
                    <BarChart
                        width={300}
                        height={130}
                        data={disasterInventoryChartData}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#94bdcf' }}
                        />
                        {/* <Tooltip /> */}
                        {/* <Legend /> */}
                        <Bar dataKey="Amount" stackId="a" fill="#8884d8" />
                    </BarChart>
                </div>
            </div>
            <div className={styles.rowFour}>
                <div className={styles.columnFourOne}>
                    <div className={styles.columnThreeOne}>
                        <div className={styles.mainTitle}>
                             AVAILABLE TRAINED HUMAN RESOURCE IN DRR
                        </div>
                        <table id="table-to-xls">
                            <tbody>
                                <tr>

                                    <th>Name</th>
                                    <th>Position</th>
                                    <th>Training Title</th>
                                    <th>Training Date</th>


                                </tr>
                                <tr>
                                    <td>{'no data'}</td>
                                    <td>{'no data'}</td>
                                    <td>{'no data'}</td>
                                    <td>{'no data'}</td>

                                </tr>
                                <tr>
                                    <td>{'no data'}</td>
                                    <td>{'no data'}</td>
                                    <td>{'no data'}</td>
                                    <td>{'no data'}</td>

                                </tr>
                                <tr>
                                    <td>{'no data'}</td>
                                    <td>{'no data'}</td>
                                    <td>{'no data'}</td>
                                    <td>{'no data'}</td>

                                </tr>
                                <tr>
                                    <td>{'no data'}</td>
                                    <td>{'no data'}</td>
                                    <td>{'no data'}</td>
                                    <td>{'no data'}</td>

                                </tr>


                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={styles.columnFourTwo}>
                    <div className={styles.mainTitle}>
                 SIMULATIONS EXERCISES IN RAJAPUR MUNICIPALITY
                    </div>
                    <div className={styles.simulations}>
                     Total number of simulations: 50
                        <ul className={styles.simuList}>
                            <li>Hazardwise classification</li>
                            <li>Fire: 20</li>
                            <li>Flood: 2</li>
                            <li>Earthquake: 3</li>
                        </ul>

                    </div>
                </div>
            </div>


        </div>


    );
};

export default connect(mapStateToProps, undefined)(Preview);
