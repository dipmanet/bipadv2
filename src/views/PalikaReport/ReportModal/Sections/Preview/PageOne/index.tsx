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
import BudgetActivity from '../../BudgetActivity';
import CriticalInfra from '../../CriticalInfra';
import ProgrammeAndPolicies from '../../ProgrammeAndPolicies';
import Simulation from '../../Simulation';

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
                    <BudgetActivity
                        updateTab={() => {}}
                        page={-1}
                        handlePrevClick={() => {}}
                        handleNextClick={() => {}}
                        previewDetails
                    />
                </div>

                <div className={styles.columnOneTwo}>
                    <CriticalInfra
                        previewDetails
                        handleNextClick={() => {}}
                        updateTab={() => {}}

                    />

                </div>
            </div>
            <div className={styles.rowTwo}>
                <div className={styles.columnTwoOne}>
                    <BudgetActivity
                        updateTab={() => {}}
                        page={-1}
                        handlePrevClick={() => {}}
                        handleNextClick={() => {}}
                        monitoringDetails
                    />

                </div>

                <div className={styles.columnTwoTwo}>
                    <Inventory
                        updateTab={() => {}}
                        page={-1}
                        handlePrevClick={() => {}}
                        handleNextClick={() => {}}
                        previewDetails
                    />
                </div>
            </div>

            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                    <ProgrammeAndPolicies
                        updateTab={() => {}}
                        page={-1}
                        handlePrevClick={() => {}}
                        handleNextClick={() => {}}
                        previewDetails
                    />
                </div>
                <div className={styles.columnThreeTwo}>
                    <Organisation
                        updateTab={() => {}}
                        handlePrevClick={() => {}}
                        handleNextClick={() => {}}
                        previewDetails
                    />
                </div>
            </div>
            <div className={styles.rowFour}>
                <div className={styles.columnFourOne}>
                    <Simulation
                        updateTab={() => {}}
                        handlePrevClick={() => {}}
                        handleNextClick={() => {}}
                        previewDetails
                    />
                </div>
                <div className={styles.columnFourTwo}>
                    Trainings
                </div>
            </div>


        </div>


    );
};

export default connect(mapStateToProps, undefined)(Preview);
