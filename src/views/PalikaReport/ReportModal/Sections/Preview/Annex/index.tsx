/* eslint-disable no-tabs */
import React, { useEffect } from 'react';
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
import Leadership from './Leadership';
import General from '../../General';

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

const Annex = (props: Props) => {
    const {
        generalData,
        programAndPolicyData,
        budgetData,
        budgetActivityData,
        url,
        localMembers,
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

            <h1>Annex A</h1>
            <div className={styles.rowOne}>
                <General
                    annex
                    mayor={mayor}
                    cao={cao}
                    focalPerson={focalPerson}
                    updateTab={() => {}}
                    handlePrevClick={() => {}}
                    handleNextClick={() => {}}
                    localMembers={localMembers}
                />

            </div>

            <h1>Annex B</h1>
            <div className={styles.rowOne}>
                <Budget
                    annex
                    handlePrevClick={() => {}}
                    handleNextClick={() => {}}
                />

            </div>
            <h1>Annex H</h1>

            <div className={styles.rowOne}>

                <Relief
                    // AnnexDetails
                    reportData={''}
                    tableHeader={() => {}}
                    updateTab={() => {}}
                    page={-1}
                    handlePrevClick={() => {}}
                    handleNextClick={() => {}}
                    annex
                />

            </div>

        </div>
    );
};

export default connect(mapStateToProps, undefined)(Annex);
