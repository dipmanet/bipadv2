/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { _cs } from '@togglecorp/fujs';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import Select from 'react-select';
import styles from './styles.scss';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import 'nepali-datepicker-reactjs/dist/index.css';


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

const BudgetActivity = (props: Props) => {
    const [municipality, setMunicipality] = useState<number>(27010);
    const [district, setDistrict] = useState<number>(27);
    const [province, setProvince] = useState<number>(3);
    const [date, setDate] = useState('');
    const [datefrom, setDateFrom] = useState<string>('');

    const [municipalBudget, setmunicipalBudget] = useState<string>('');

    const handleFormRegion = (location: Location) => {
        setMunicipality(location.municipalityId);
        setDistrict(location.districtId);
        setProvince(location.provinceId);
    };

    const handleAddContact = () => {
        console.log('goto contacts add');
    };

    const handleDateChange = (dateObj) => {
        setDate(dateObj);
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

    const {
        reportTitle,
        mayor,
        cao,
        focalPerson,
        formationDate,
        memberCount,
        setreportTitle,
        setmayor,
        setcao,
        setformationDate,
        setmemberCount,

    } = props;
    return (
        <div className={styles.mainPageDetailsContainer}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>Please enter Disaster Profile details</h2>
                <div className={styles.formColumn}>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>
                                 Muicipal Budget
                            <input
                                type="text"
                                className={styles.inputElement}
                                onChange={(val: string) => setmunicipalBudget(val)}
                                value={municipalBudget}
                            />

                        </label>

                    </div>
                    <div className={styles.inputContainer}>

                        <label className={styles.label}>
                                 Muicipal Budget
                            <input
                                type="text"
                                className={styles.inputElement}
                                onChange={(val: string) => setmunicipalBudget(val)}
                                value={municipalBudget}
                            />

                        </label>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default BudgetActivity;
