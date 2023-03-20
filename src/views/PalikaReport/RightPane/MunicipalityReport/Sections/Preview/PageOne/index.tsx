/* eslint-disable no-tabs */
import React from 'react';
import { connect } from 'react-redux';
import {
    generalDataSelector,
    budgetDataSelector,
    budgetActivityDataSelector,
    programAndPolicySelector,
} from '#selectors';
import styles from './styles.scss';
import Organisation from '../../Organisation';
import Inventory from '../../Inventory';
import Budget from '../../Budget';
import Header from './Header';
import BudgetActivity from '../../BudgetActivity';
import CriticalInfra from '../../CriticalInfra';
import ProgrammeAndPolicies from '../../ProgrammeAndPolicies';
import Simulation from '../../Simulation';
import Contacts from '../../Contacts';

const mapStateToProps = state => ({
    generalData: generalDataSelector(state),
    programAndPolicyData: programAndPolicySelector(state),
    budgetData: budgetDataSelector(state),
    budgetActivityData: budgetActivityDataSelector(state),
});

interface Props {
    reportData: Element[];
}

export interface GeneralData {
    reportTitle?: string;
    fiscalYear: string;
    mayor: string;
    cao: string;
    focalPerson: string;
    formationDate: string;
    committeeMembers: number;
}

export interface BudgetData {
    totMunBudget: number;
    totDrrBudget: number;
    additionalDrrBudget: number;
}

export interface ProgramAndPolicyData {
    pointOne: string;
    pointTwo: string;
    pointThree: string;
}

export interface BudgetActivityData {
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

const Preview = () => (
    <div className={styles.previewContainer}>
        <Header />

        <div className={styles.row}>
            <div className={styles.columnOne}>

                <Budget
                    previewDetails
                    reportData={''}
                    tableHeader={() => { }}
                    updateTab={() => { }}
                    page={-1}
                    handlePrevClick={() => { }}
                    handleNextClick={() => { }}
                />
                <BudgetActivity
                    updateTab={() => { }}
                    page={-1}
                    handlePrevClick={() => { }}
                    handleNextClick={() => { }}
                    previewDetails
                />
                <BudgetActivity
                    updateTab={() => { }}
                    page={-1}
                    handlePrevClick={() => { }}
                    handleNextClick={() => { }}
                    monitoringDetails
                />
                <ProgrammeAndPolicies
                    updateTab={() => { }}
                    page={-1}
                    handlePrevClick={() => { }}
                    handleNextClick={() => { }}
                    previewDetails
                />


            </div>
            <div className={styles.columntwo}>

                <CriticalInfra
                    previewDetails
                    handleNextClick={() => { }}
                    updateTab={() => { }}
                />
                <Inventory
                    updateTab={() => { }}
                    page={-1}
                    handlePrevClick={() => { }}
                    handleNextClick={() => { }}
                    previewDetails
                />


                <Organisation
                    updateTab={() => { }}
                    handlePrevClick={() => { }}
                    handleNextClick={() => { }}
                    previewDetails
                />
                <Simulation
                    updateTab={() => { }}
                    handlePrevClick={() => { }}
                    handleNextClick={() => { }}
                    previewDetails
                />
                <Contacts
                    updateTab={() => { }}
                    handlePrevClick={() => { }}
                    handleNextClick={() => { }}
                    previewDetails
                />
            </div>
        </div>
    </div>
);

export default connect(mapStateToProps, undefined)(Preview);
