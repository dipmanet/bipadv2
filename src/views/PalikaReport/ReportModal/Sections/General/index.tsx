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
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
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
const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {

    FiscalYearFetch: {
        url: '/nepali-fiscal-year/',
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let fiscalYearList: CitizenReport[] = [];
            const fiscalYearListResponse = response as MultiResponse<CitizenReport>;
            fiscalYearList = fiscalYearListResponse.results;
            params.fiscalYearList(fiscalYearList);
        },
    },

};
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
    const { requests: { FiscalYearFetch } } = props;

    const [reportTitle, setreportTitle] = useState<string>(rt);
    const [fiscalYear, setfiscalYear] = useState<string>(fy);
    const [formationDate, setformationDate] = useState<string>(fd);
    const [committeeMembers, setcommitteeMembers] = useState<number>(cm);
    const [fiscalYearList, setFiscalYearList] = useState([]);
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
    const handleFiscalYearList = (response) => {
        setFiscalYearList(response);
    };
    useEffect(() => {
        props.setCarKeys('null');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    FiscalYearFetch.setDefaultParams({
        fiscalYearList: handleFiscalYearList,
    });
    console.log('this is fiscal year list>>>', fiscalYear);

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

        props.handleNextClick();
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
                            placeholder="Report Title"
                            onChange={handleReportTitle}
                            value={reportTitle || ''}
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <select
                            value={fiscalYear}
                            onChange={handleSelectChange}
                            className={styles.inputElement}
                        >
                            <option value="select">Select Fiscal Year</option>
                            {fiscalYearList && fiscalYearList.map(item => (
                                <option value={item.id}>{item.titleEn}</option>
                            ))}

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
                        {/* <ul>
                            <li>
                                <span className={styles.titlePersonal}>
                                Mayor or Nagar Pramukh:
                                </span>
                                {' '}
                                {mayor || 'Data Unavailable'}
                            </li>

                        </ul> */}


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
                    <div className={styles.inputContainer}>

                        <input
                            type="number"
                            className={styles.inputElement}
                            placeholder={'Number of DRRM committee members'}
                            value={committeeMembers || ''}
                            onChange={handleMembers}
                        />


                    </div>
                </div>

            </div>
            <NextPrevBtns
                handlePrevClick={props.handlePrevClick}
                handleNextClick={handleDataSave}
                firstpage
            />


        </div>

    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            General,
        ),
    ),
);
