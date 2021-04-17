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


const mapStateToProps = state => ({
    generalData: generalDataSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
});

export interface GeneralData{
    reportTitle?: string;
    fiscalYear: string;
    mayor: string;
    cao: string;
    focalPerson: string;
    formationDate: string;
    committeeMembers: number;
}

interface Props{
    reportTitle: string;
    datefrom: string;
    dateTo: string;
    mayor: string;
    cao: string;
    focalPerson: string;
    formationDate: string;
    memberCount: string;
    // setreportTitle: React.ChangeEventHandler<HTMLInputElement>;
    // setdatefrom: React.ChangeEventHandler<HTMLInputElement>;
    // setdateTo: React.ChangeEventHandler<HTMLInputElement>;
    // setmayor: React.ChangeEventHandler<HTMLInputElement>;
    // setcao: React.ChangeEventHandler<HTMLInputElement>;
    // setfocalPerson: React.ChangeEventHandler<HTMLInputElement>;
    // setformationDate: React.ChangeEventHandler<HTMLInputElement>;
    // setmemberCount: React.ChangeEventHandler<HTMLInputElement>;
    // setGeneralData: GeneralData;
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


const General = (props: Props) => {
    const {
        reportTitle: rt,
        fiscalYear: fy,
        formationDate: fd,
        committeeMembers: cm,
    } = props.generalData;
    console.log(options);
    const [reportTitle, setreportTitle] = useState<string>(rt);
    const [fiscalYear, setfiscalYear] = useState<string>(fy);
    const [formationDate, setformationDate] = useState<string>(fd);
    const [committeeMembers, setcommitteeMembers] = useState<number>(cm);

    const handleReportTitle = (title: any) => {
        setreportTitle(title.target.value);
    };
    const handleFormationDate = (date: any) => {
        setformationDate(date.target.value);
    };
    const handleMembers = (members: any) => {
        setcommitteeMembers(members.target.value);
    };
    const handleSelectChange = (fiscal: any) => {
        console.log(fiscal.value);
        setfiscalYear(fiscal.value);
    };

    const {
        mayor,
        cao,
        focalPerson,
        generalData,
        updateTab,
    } = props;

    const handleDataSave = () => {
        props.setGeneralDatapp({
            reportTitle,
            fiscalYear,
            mayor,
            cao,
            focalPerson,
            formationDate,
            committeeMembers,
        });
        updateTab();
    };

    // const handleFormRegion = (location: Location) => {
    //     setMunicipality(location.municipalityId);
    //     setDistrict(location.districtId);
    //     setProvince(location.provinceId);
    // };


    const handleAddContact = () => {
        console.log('goto contacts add');

        console.log(props);
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
                {/* <div className={styles.inputContainer}>
                    <StepwiseRegionSelectInput
                        className={styles.stepwiseRegionSelectInput}
                        faramElementName="region"
                        wardsHidden
                        onChange={handleFormRegion}
                        initialLoc={{ municipality,
                            district,
                            province }}
                        disabled
                        provinceInputClassName={styles.snprovinceinput}
                        districtInputClassName={styles.sndistinput}
                        municipalityInputClassName={styles.snmuniinput}
                    />
                </div> */}
                <div className={styles.newSignupForm}>
                    <div className={styles.formColumn}>
                        <p><strong>General Information</strong></p>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                className={styles.inputElement}
                                placeholder="Report Title"
                                onChange={handleReportTitle}
                                value={reportTitle || ''}
                            />
                        </div>


                        <div className={styles.inputContainer}>
                            <Select
                                className={styles.select}
                                options={options}
                                placeholder={'Select Fiscal Year'}
                                onChange={handleSelectChange}

                            />
                        </div>

                    </div>
                    <div className={styles.formColumn}>
                        <p><strong>Municipal DRR Leadership </strong></p>
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>
                                 Mayor or Nagar Pramukh
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    placeholder="Mayor or Chairperson"
                                // onChange={setmayor}
                                    value={mayor || 'Data Unavailable'}
                                    disabled
                                />

                            </label>


                            {mayor
                                ? (
                                    <button
                                        type="button"
                                        onClick={handleAddContact}
                                        className={styles.addEditBtn}
                                    >
                                        <Icon
                                            name="edit"
                                            className={styles.addEditIcon}
                                        />
                                    </button>
                                )
                                : (
                                    <button
                                        type="button"
                                        className={styles.addEditBtn}
                                        onClick={handleAddContact}
                                    >
                                        <Icon
                                            name="plus"
                                            className={styles.addEditIcon}
                                        />
                                    </button>
                                )

                            }
                        </div>
                        <div className={styles.inputContainer}>

                            <label className={styles.label}>
                                 Chief Administrative Officer
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    placeholder="Chief Administrative Officer"
                                // onChange={setcao}
                                    value={cao || 'Data Unavailable'}
                                    disabled
                                />
                            </label>


                            {cao
                                ? (
                                    <button
                                        type="button"
                                        onClick={handleAddContact}
                                        className={styles.addEditBtn}
                                    >
                                        <Icon
                                            name="edit"
                                            className={styles.addEditIcon}
                                        />
                                    </button>
                                )
                                : (
                                    <button
                                        type="button"
                                        className={styles.addEditBtn}
                                        onClick={handleAddContact}
                                    >
                                        <Icon
                                            name="plus"
                                            className={styles.addEditIcon}
                                        />
                                    </button>
                                )

                            }

                        </div>

                        <div className={styles.inputContainer}>
                            <label className={styles.label}>
                                DRR Focal Person
                                <input
                                    type="text"
                                    className={styles.inputElement}
                                    placeholder="DRR Focal Person"
                                // onChange={setfocalPerson}
                                    value={focalPerson || 'Data Unavailable'}
                                    disabled
                                />
                            </label>

                            {focalPerson
                                ? (
                                    <button
                                        type="button"
                                        onClick={handleAddContact}
                                        className={styles.addEditBtn}
                                    >
                                        <Icon
                                            name="edit"
                                            className={styles.addEditIcon}
                                        />
                                    </button>
                                )
                                : (
                                    <button
                                        type="button"
                                        className={styles.addEditBtn}
                                        onClick={handleAddContact}
                                    >
                                        <Icon
                                            name="plus"
                                            className={styles.addEditIcon}
                                        />
                                    </button>
                                )

                            }
                        </div>
                        <div className={styles.inputContainer}>
                            {/* <input
                                type="text"
                                className={styles.inputElement}
                                placeholder="Formation date of DRRM Committee"
                                onChange={setformationDate}
                                value={formationDate || ''}
                                disabled
                            /> */}
                            <label className={styles.label}>
                            Formation date of DRRM Committee
                                <NepaliDatePicker
                                    inputClassName="form-control"
                                    className={styles.datepicker}
                                    value={formationDate}
                                    onChange={(value: string) => setformationDate(value)}
                                    options={{ calenderLocale: 'ne', valueLocale: 'en' }}

                                />
                            </label>


                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>
                            Number of DRRM committee members
                                <input
                                    type="number"
                                    className={styles.inputElement}
                                    placeholder={'Enter Number'}
                                    value={committeeMembers || ''}
                                    onChange={handleMembers}
                                />
                            </label>


                        </div>
                        <button
                            type="button"
                            onClick={handleDataSave}
                            className={styles.savebtn}
                        >
                Save
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(General);
