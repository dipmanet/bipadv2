/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { _cs } from '@togglecorp/fujs';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import Select from 'react-select';
import styles from './styles.scss';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import 'nepali-datepicker-reactjs/dist/index.css';

import {
    setGeneralDataAction,
} from '#actionCreators';
import {
    generalDataSelector,
} from '#selectors';


import Icon from '#rscg/Icon';


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

const currentFiscalYear = new Date().getFullYear() + 56;

const options = Array.from(Array(10).keys()).map(item => ({
    value: currentFiscalYear - item,
    label: `${currentFiscalYear - item}/${currentFiscalYear + 1 - item}`,
}));

const mapStateToProps = state => ({
    generalData: generalDataSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
});

const BudgetActivity = (props: Props) => {
    const { generalData: { fiscalYear } } = props;

    const [municipalBudget, setmunicipalBudget] = useState<string>('');


    const handleMunicipalBudget = (budgetVal) => {
        setmunicipalBudget(budgetVal.target.value);
    };
    const handleDRRFund = (fundVal) => {
        setmunicipalBudget(fundVal.target.value);
    };
    const handleAddFund = (addFundVal) => {
        setmunicipalBudget(addFundVal.target.value);
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
            <div className={styles.formContainer}>
                <h2 className={styles.title}>Please enter Disaster Profile details</h2>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>
                                 Muicipal Budget of FY
                        {' '}
                        { `${fiscalYear}/${fiscalYear + 1}`}
                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleMunicipalBudget}
                            placeholder={'Enter Amount'}
                            value={municipalBudget}
                        />

                    </label>

                </div>
                <div className={styles.inputContainer}>

                    <label className={styles.label}>
                                 DRR Fund for FY
                        { `${fiscalYear}/${fiscalYear + 1}`}
                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleDRRFund}
                            value={municipalBudget}
                            placeholder={'Enter Amount'}
                        />

                    </label>

                </div>
                <div className={styles.inputContainer}>

                    <label className={styles.label}>
                            Additional DRR Fund for FY
                        { `${fiscalYear}/${fiscalYear + 1}`}

                        <input
                            type="text"
                            className={styles.inputElement}
                            onChange={handleAddFund}
                            placeholder={'Enter Amount'}
                            value={municipalBudget}
                        />

                    </label>

                </div>
            </div>

        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetActivity);
