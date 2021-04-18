import React from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { connect } from 'react-redux';
import styles from './styles.scss';

import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';


import govtlogo from '../../../../govtLogo.svg';


import {
    generalDataSelector,
    budgetDataSelector,
    budgetActivityDataSelector,
    programAndPolicySelector,

} from '#selectors';

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

    console.log('chart data ', budgetChartData);

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
                            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                            width={400}
                            height={400}
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
                    Section 2
                </div>
            </div>
            <div className={styles.rowTwo}>
                <div className={styles.columnTwoOne}>
                    Section 3
                </div>
                <div className={styles.columnTwoTwo}>
                    <div className={styles.title}>
                        Section 4
                    </div>
                </div>
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
