/* eslint-disable no-tabs */
import React from 'react';
import { connect } from 'react-redux';
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
import Contacts from '../../Contacts';
import Relief from '../../Relief';

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
                    <Contacts
                        updateTab={() => {}}
                        handlePrevClick={() => {}}
                        handleNextClick={() => {}}
                        previewDetails
                    />
                </div>
            </div>
        </div>
    );
};

export default connect(mapStateToProps, undefined)(Preview);
