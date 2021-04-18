/* eslint-disable no-tabs */
import React from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import styles from './styles.scss';

import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';


import govtlogo from '../../../../govtLogo.svg';


import {
    generalDataSelector,
    budgetDataSelector,
    budgetActivityDataSelector,
    programAndPolicySelector,

} from '#selectors';
import Organisation from '../../Organisation';
import Inventory from '../../Inventory';

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


    console.log('PAP DATA ', programAndPolicyData);

    return (
        <div className={styles.previewContainer}>
            <div className={styles.header}>


                <div className={styles.address}>
                    <ScalableVectorGraphics
                        className={styles.bulletPoint}
                        src={govtlogo}
                        alt="Nepal Government"
                    />

                    <div className={styles.desc}>
                        <ul>
                            <li className={styles.pageOneTitle}>Rajapur Municipality</li>
                            <li>Bardiya District, Lumbini Province</li>

                        </ul>

                    </div>

                </div>
                <div className={styles.location}>
                    <ul>
                        <li className={styles.pageOneTitle}>{reportTitle}</li>
                        <li>
                            FY
                            {fiscalYear}
                        </li>
                    </ul>
                </div>


            </div>
            <div className={styles.rowOne}>
                <div className={styles.columnOneOne}>
                    <div className={styles.mainTitle}>
                        TOTAL MUNICIPAL BUDGET
                        {' '}
                        {municipalBudget}
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart
                            width={250}
                            height={250}
                        >
                            <Pie
                                dataKey="value"
                                isAnimationActive={false}
                                data={budgetChartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            />
                            <Tooltip />
                            <Legend align="right" />

                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.columnOneTwo}>
                    <Table striped bordered hover size="md">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Source of Fund</th>
                                <th>Budget Code</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgetActivityData && budgetActivityData.length > 0
                                ? budgetActivityData.map(
                                    data => (
                                        <tr key={Math.random()}>

                                            {activityTableData.map(item => (
                                                <td key={Math.random()}>
                                                    {data[item]}
                                                </td>
                                            ))}
                                        </tr>
                                    ),
                                ) : ''
                            }


                        </tbody>
                    </Table>
                </div>
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
                <div className={styles.columnTwoTwo}>

                    sth else needs to go here
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


            <div className={styles.rowInventory}>
                {/* <Inventory rows={5} width={'100%'} height={'40%'} /> */}
                <div className={styles.mainTitle}>
                 DRR related inventories in Municipal Government
                </div>
                <Table striped bordered hover size="md">
                    <thead>
                        <tr>
                            <th>S.N</th>
                            <th>Name of Resource</th>
                            <th>Quantity</th>
                            <th>Gender(M/F)</th>
                            <th>Type of Organization</th>
                            <th>Added Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1	</td>
                            <td>Plastic Roll	</td>
                            <td>1	</td>
                            <td>Police station, Bhimmapur-09	</td>
                            <td>Government	</td>
                            <td>2021-01-15</td>
                        </tr>

                        <tr>
                            <td>2	</td>
                            <td>Life Vest	</td>
                            <td>4	</td>
                            <td>Police station, Bhimmapur-09	</td>
                            <td>Government	</td>
                            <td>2021-01-15</td>
                        </tr>
                        <tr>
                            <td>3	</td>
                            <td>Plastic Roll</td>
                            <td>1	</td>
                            <td>Police station, Khairichandanpur Rajapur-10	</td>
                            <td>Government	</td>
                            <td>2021-01-15</td>
                        </tr>
                        <tr>
                            <td>2	</td>
                            <td>Life Vest	</td>
                            <td>5	</td>
                            <td>Police station, Khairichandanpur Rajapur-10	</td>
                            <td>Government	</td>
                            <td>2021-01-15</td>
                        </tr>
                    </tbody>
                </Table>

            </div>

            <div className={styles.rowCI}>
                {/* <Inventory rows={5} width={'100%'} height={'40%'} /> */}
                <div className={styles.mainTitle}>
                 DRR related critical infrastructures in municipality
                </div>
                <Table striped bordered hover size="md">
                    <thead>
                        <tr>
                            <th>S.N	</th>
                            <th>Resource Name	</th>
                            <th>Resource Type	</th>
                            <th>Operator Type	</th>
                            <th>Number Of male Employee	</th>
                            <th>Number Of female Employee	</th>
                            <th>Total Employee</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1	</td>
                            <td>Radio Sathi FM	</td>
                            <td>communication	</td>
                            <td>Private	</td>
                            <td>8	</td>
                            <td>4	</td>
                            <td>12</td>

                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Kothiyaghat Online News Paper	</td>
                            <td>communication	</td>
                            <td>Private	</td>
                            <td>3		</td>
                            <td>No Data</td>
                            <td>3</td>

                        </tr>
                        <tr>
                            <td>3	</td>
                            <td>Janata Express Ratriya Daily News Paper	</td>
                            <td>communication	</td>
                            <td>Private	</td>
                            <td>4		</td>
                            <td>No Data</td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>4	</td>
                            <td>NTC Rajapur Office	</td>
                            <td>communication	</td>
                            <td>Government	</td>
                            <td>4		</td>
                            <td>No Data</td>
                            <td>4</td>

                        </tr>
                    </tbody>
                </Table>

            </div>


            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                   Section 5
                </div>
                <div className={styles.columnThreeTwo}>
                    Section 6
                </div>
            </div>
            <div className={styles.rowFour}>
                <div className={styles.columnFourOne}>
                    Section 7
                </div>
                <div className={styles.columnFourTwo}>
                    Section 8
                </div>
            </div>


        </div>


    );
};

export default connect(mapStateToProps, undefined)(Preview);
