/* eslint-disable no-tabs */
import React from 'react';
import { connect } from 'react-redux';
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Scatter,
} from 'recharts';
import styles from './styles.scss';
import {
    generalDataSelector,
    budgetDataSelector,
    budgetActivityDataSelector,
    programAndPolicySelector,

} from '#selectors';
import Relief from '../../Relief';
import Leadership from './Leadership';
import Footer from './Footer';
import style from '#mapStyles/rasterStyle';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';

import moneyBag from '../../../Icons/loss.svg';
import family from '../../../Icons/family.svg';
import male from '../../../Icons/male.svg';
import female from '../../../Icons/female.svg';

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
    const data = [
        {
            name: 'Jan',
            'Relief Amount Distributed': 590,
            'Number of Beneficiiaries': 800,
        },
        {
            name: 'Feb',
            'Relief Amount Distributed': 868,
            'Number of Beneficiiaries': 967,
        },
        {
            name: 'Mar',
            'Relief Amount Distributed': 1397,
            'Number of Beneficiiaries': 1098,
        },
        {
            name: 'Apr',
            'Relief Amount Distributed': 1480,
            'Number of Beneficiaries': 1200,
        },
        {
            name: 'May',
            'Relief Amount Distributed': 1520,
            'Number of Beneficiiaries': 1108,
        },
        {
            name: 'Jun',
            'Relief Amount Distributed': 1400,
            'Number of Beneficiiaries': 680,
        },
        {
            name: 'Jul',
            'Relief Amount Distributed': 1100,
            'Number of Beneficiiaries': 470,
        },
        {
            name: 'Aug',
            'Relief Amount Distributed': 800,
            'Number of Beneficiiaries': 380,
        },
        {
            name: 'Sep',
            'Relief Amount Distributed': 1300,
            'Number of Beneficiiaries': 180,
        },
        {
            name: 'Oct',
            'Relief Amount Distributed': 1400,
            'Number of Beneficiiaries': 200,
        },
        {
            name: 'Nov',
            'Relief Amount Distributed': 1400,
            'Number of Beneficiiaries': 680,
        },
        {
            name: 'Dec',
            'Relief Amount Distributed': 1400,
            'Number of Beneficiiaries': 680,
        },
    ];

    return (
        <div className={styles.previewContainer}>
            {/* <Header /> */}
            <div className={styles.rowOne}>

                <Relief
                    previewDetails
                    reportData={''}
                    tableHeader={() => {}}
                    updateTab={() => {}}
                    page={-1}
                    handlePrevClick={() => {}}
                    handleNextClick={() => {}}
                />

            </div>
            <div className={styles.rowTwo}>
                <Relief
                    hazardwiseImpact
                    reportData={''}
                    tableHeader={() => {}}
                    updateTab={() => {}}
                    page={-1}
                    handlePrevClick={() => {}}
                    handleNextClick={() => {}}
                />
            </div>
            <div className={styles.rowThree}>
                <ComposedChart
                    width={500}
                    height={250}
                    data={data}
                    margin={{
                        top: 5,
                        right: 5,
                        bottom: 5,
                        left: 5,
                    }}
                >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" scale="band" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Number of Beneficiiaries" barSize={20} fill="rgb(0,177,117)" />
                    <Line type="monotone" dataKey="Relief Amount Distributed" stroke="rgb(165,0,21)" />
                </ComposedChart>
                <div className={styles.reliefDataMainContainer}>
                    <div className={styles.reliefDistribution}>

                        <div className={styles.distItem}>
                            <ScalableVectorGraphics
                                className={styles.reliefIcon}
                                src={moneyBag}
                                alt="Relief"
                            />
                            <ul>
                                <li>
                                    <span className={styles.biggerText}>Rs 33,00,000</span>
                                </li>
                                <li>
                                    <span className={styles.smallerText}>Relief Amount</span>
                                </li>
                            </ul>
                        </div>
                        <div className={styles.distItem}>
                            <ScalableVectorGraphics
                                className={styles.reliefIcon}
                                src={family}
                                alt="Relief"
                            />
                            <ul>
                                <li>
                                    <span className={styles.biggerText}>35</span>
                                </li>
                                <li>
                                    <span className={styles.smallerText}>
                                        Number of Beneficiay Families
                                    </span>
                                </li>
                            </ul>
                        </div>

                    </div>
                    <div className={styles.peopleBenefited}>

                        <div className={styles.benefitedRow}>
                            <div className={styles.distItem}>
                                <ScalableVectorGraphics
                                    className={styles.reliefIcon}
                                    src={male}
                                    alt="Relief"
                                />
                                <ul>
                                    <li>
                                        <span className={styles.biggerText}>17</span>
                                    </li>
                                    <li>
                                        <span className={styles.smallerText}>Male</span>
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.distItem}>
                                <ScalableVectorGraphics
                                    className={styles.reliefIcon}
                                    src={female}
                                    alt="Relief"
                                />
                                <ul>
                                    <li>
                                        <span className={styles.biggerText}>18</span>
                                    </li>
                                    <li>
                                        <span className={styles.smallerText}>Female</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.lastRow}>
                            <ul>
                                <li>
                                    <span className={styles.darkerSmText}>
                                        3
                                    </span>
                                </li>
                                <li>
                                    <span className={styles.lighterSmText}>
                                         JANAJATI
                                    </span>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <span className={styles.darkerSmText}>
                                        2
                                    </span>
                                </li>
                                <li>
                                    <span className={styles.lighterSmText}>
                                         MADEHESI
                                    </span>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <span className={styles.darkerSmText}>
                                        15
                                    </span>
                                </li>
                                <li>
                                    <span className={styles.lighterSmText}>
                                         MINORITY
                                    </span>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <span className={styles.darkerSmText}>
                                        15
                                    </span>
                                </li>
                                <li>
                                    <span className={styles.lighterSmText}>
                                         DALITS
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            <div className={styles.rowfour}>
                <Leadership />
            </div>
            <div className={styles.rowFive}>


                <Footer />

                <ul>
                    <li>
                        This report has been generated in the BIPAD Portal (https://bipadportal.gov.np/).
                    </li>
                    <li>
                        BIPAD portal an integrated Disaster Information Management System of Nepal,
                        administered by the National Disaster
                        Risk Reduction and Management Authority (NDRRMA)
                    </li>
                    <li className={styles.smallNote}>
                         Note: Please refer to the Annexes for details on each section
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default connect(mapStateToProps, undefined)(Preview);
