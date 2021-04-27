import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import styles from './styles.scss';
import 'nepali-datepicker-reactjs/dist/index.css';

import {
    setGeneralDataAction,
    setBudgetDataAction,
} from '#actionCreators';
import {
    generalDataSelector,
    budgetDataSelector,
} from '#selectors';
import NextPrevBtns from '../../NextPrevBtns';


interface Props{
    reportTitle: string;
    datefrom: string;
    dateTo: string;
    mayor: string;
    cao: string;
    focalPerson: string;
    formationDate: string;
    memberCount: string;
    setreportTitle: React.ChangeEventHandler<HTMLInputElement>;
    setdatefrom: React.ChangeEventHandler<HTMLInputElement>;
    setdateTo: React.ChangeEventHandler<HTMLInputElement>;
    setmayor: React.ChangeEventHandler<HTMLInputElement>;
    setcao: React.ChangeEventHandler<HTMLInputElement>;
    setfocalPerson: React.ChangeEventHandler<HTMLInputElement>;
    setformationDate: React.ChangeEventHandler<HTMLInputElement>;
    setmemberCount: React.ChangeEventHandler<HTMLInputElement>;
}

interface Location{
    municipalityId: number;
    districtId: number;
    provinceId: number;
}

const mapStateToProps = state => ({
    generalData: generalDataSelector(state),
    budgetData: budgetDataSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
    setBudgetDatapp: params => dispatch(setBudgetDataAction(params)),
});

const currentFiscalYear = new Date().getFullYear() + 56;

const options = Array.from(Array(10).keys()).map(item => ({
    value: currentFiscalYear - item,
}));


const Budget = (props: Props) => {
    const {
        generalData: { fiscalYear },
        budgetData,
        updateTab,
        setBudgetDatapp,
    } = props;

    const {
        municipalBudget: mb,
        drrFund: df,
        additionalFund: af,
    } = budgetData;

    const [municipalBudget, setmunicipalBudget] = useState(mb);
    const [drrFund, setdrrFund] = useState(df);
    const [additionalFund, setadditionalFund] = useState(af);


    const handleMunicipalBudget = (budgetVal) => {
        setmunicipalBudget(budgetVal.target.value);
    };
    const handleDRRFund = (fundVal) => {
        setdrrFund(fundVal.target.value);
    };
    const handleAddFund = (addFundVal) => {
        setadditionalFund(addFundVal.target.value);
    };

    const handleDataSave = () => {
        setBudgetDatapp({
            municipalBudget,
            drrFund,
            additionalFund,
        });
        updateTab();
    };

    const selectStyles = {
        option: (provided, state) => ({
            ...provided,
            borderBottom: '1px dotted gray',
            color: state.isSelected ? 'white' : 'gray',
            padding: 10,
        }),
        control: () => ({
            // none of react-select's styles are passed to <Control />
            width: 200,
        }),
        singleValue: (provided, state) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = 'opacity 900ms';

            return { ...provided, opacity, transition };
        },
    };


    return (
        <div className={styles.mainPageDetailsContainer}>
            <div className={styles.formColumn}>
                <h2 className={styles.title}>Please enter Disaster Profile details</h2>
                <div className={styles.row}>

                    <div className={styles.inputContainer}>
                        <span className={styles.dpText}>Total Municipal Budget of FY</span>
                        {' '}
                        { `${fiscalYear}`}
                        <input
                            type="number"
                            className={styles.inputElement}
                            onChange={handleMunicipalBudget}
                            placeholder={'Kindly specify total municipal budget in numbers (NPR)'}
                            value={municipalBudget}
                        />


                    </div>
                    <div className={styles.inputContainer}>

                        <span className={styles.dpText}>Total DRR Fund for FY</span>
                        { `${fiscalYear}`}
                        <input
                            type="number"
                            className={styles.inputElement}
                            onChange={handleDRRFund}
                            value={drrFund}
                            placeholder={'Kindly specify total DRR fund for FY in numbers (NPR)'}
                        />


                    </div>
                    <div className={styles.inputContainer}>

                        <span className={styles.dpText}>Other DRR related funding</span>
                        { `${fiscalYear}`}

                        <input
                            type="number"
                            className={styles.inputElement}
                            onChange={handleAddFund}
                            placeholder={'Kindly specify other DRR related funding in numbers (NPR)'}
                            value={additionalFund}
                        />


                    </div>
                    <NextPrevBtns
                        handlePrevClick={props.handlePrevClick}
                        handleNextClick={props.handleNextClick}
                    />

                </div>
            </div>


        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Budget);
