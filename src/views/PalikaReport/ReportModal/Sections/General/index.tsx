import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import * as ReachRouter from '@reach/router';

import Select from 'react-select';
import styles from './styles.scss';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import NextPrevBtns from '../../NextPrevBtns';
import 'nepali-datepicker-reactjs/dist/index.css';

import {
    setCarKeysAction,
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
    setCarKeys: params => dispatch(setCarKeysAction(params)),

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
}

interface Location{
    municipalityId: number;
    districtId: number;
    provinceId: number;
}

const currentFiscalYear = new Date().getFullYear() + 56;

const options = Array.from(Array(10).keys()).map(item => ({
    value: currentFiscalYear - item,
}));


const General = (props: Props) => {
    const {
        reportTitle: rt,
        fiscalYear: fy,
        formationDate: fd,
        committeeMembers: cm,
    } = props.generalData;


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
        setfiscalYear(fiscal.target.value);
    };

    useEffect(() => {
        props.setCarKeys('null');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddContact = () => {
        const { setCarKeys } = props;
        setCarKeys('contact');
        ReachRouter.navigate('/profile', { state: { showForm: true }, replace: true });
    };
    const {
        mayor,
        cao,
        focalPerson,
        generalData,
        updateTab,
        localMembers,
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
            <h2 className={styles.title}>Disaster Profile details</h2>
            <div className={styles.formColumn}>
                <h3><strong>General Information</strong></h3>
                <div className={styles.row}>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            className={styles.inputElement}
                            placeholder="Disaster Risk Reduction and Management Report"
                            onChange={handleReportTitle}
                            value={reportTitle || ''}
                            disabled
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <select
                            value={fiscalYear}
                            onChange={handleSelectChange}
                            className={styles.inputElement}
                        >
                            <option value="select">Select Fiscal Year</option>
                            <option value="2077/2078">2077/2078</option>
                            <option value="2076/2077">2076/2077</option>
                            <option value="2075/2076">2075/2076</option>
                            <option value="2074/2075">2074/2075</option>
                            <option value="2073/2074">2073/2074</option>
                            <option value="2072/2073">2072/2073</option>
                            <option value="2071/2072">2071/2072</option>
                            <option value="2070/2071">2070/2071</option>
                            <option value="2069/2070">2069/2070</option>
                            <option value="2068/2069">2068/2069</option>
                            <option value="2067/2068">2067/2068</option>
                        </select>
                    </div>

                </div>
            </div>
            <div className={styles.formColumn}>
                <h3><strong>Municipal DRR Leadership </strong></h3>
                <div className={styles.personalDetailsrow}>
                    <div className={styles.personalDetails}>

                        <table id="table-to-xls">
                            <tbody>
                                <tr>

                                    <th>Position</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>{'Add/Edit Details'}</th>


                                </tr>
                                <tr>
                                    <td>{'Mayor or Nagar Pramukh'}</td>
                                    <td>{mayor.split(',')[0] || 'No Data'}</td>
                                    <td>{mayor.split(',')[1] || 'No Data'}</td>
                                    <td>{mayor.split(',')[2] || 'No Data'}</td>
                                    <td>
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

                                    </td>

                                </tr>
                                <tr>
                                    <td>{'Chief Administrative Officer'}</td>
                                    <td>{cao || 'No Data'}</td>
                                    <td>{'No Data'}</td>
                                    <td>{'No Data'}</td>
                                    <td>
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

                                    </td>
                                </tr>
                                <tr>
                                    <td>{'DRR Focal Person'}</td>
                                    <td>{focalPerson || 'No Data'}</td>
                                    <td>{'No Data'}</td>
                                    <td>{'No Data'}</td>
                                    <td>
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

                                    </td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.inputContainer}>
                        <span className={styles.labelDate}>Formation date of DRRM Committee</span>
                        <NepaliDatePicker
                            inputClassName="form-control"
                            className={styles.datepicker}
                            value={formationDate}
                            onChange={(value: string) => setformationDate(value)}
                            options={{ calenderLocale: 'ne', valueLocale: 'en' }}

                        />
                    </div>
                    <h3><strong>Committee Members </strong></h3>

                    <table id="table-to-xls">
                        <tbody>
                            <tr>
                                <th>SN</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Add/Edit Details</th>

                            </tr>
                            {localMembers

                                 && localMembers.map((item, i) => (
                                     <tr key={item.name}>
                                         <td>
                                             {i + 1}
                                         </td>
                                         <td>
                                             {item.name || 'No Data'}
                                         </td>
                                         <td>
                                             {item.email || 'No Data'}
                                         </td>
                                         <td>
                                             {item.mobileNumber || 'No Data'}
                                         </td>
                                         <td>
                                             {item.name
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
                                         </td>
                                     </tr>
                                 ))
                            }


                        </tbody>
                    </table>
                </div>

            </div>
            <NextPrevBtns
                handlePrevClick={props.handlePrevClick}
                handleNextClick={props.handleNextClick}
                firstpage
            />


        </div>

    );
};

export default connect(mapStateToProps, mapDispatchToProps)(General);
