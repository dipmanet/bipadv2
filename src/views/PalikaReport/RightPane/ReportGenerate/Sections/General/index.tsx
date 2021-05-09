import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { isDefined, _cs } from '@togglecorp/fujs';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import * as ReachRouter from '@reach/router';

// import { NepaliDatePicker } from 'datepicker-nepali-reactjs';
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
import Annex from '../Preview/Annex';

const mapStateToProps = state => ({
    generalData: generalDataSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
    setCarKeys: params => dispatch(setCarKeysAction(params)),

});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {

    FiscalYearFetch: {
        url: '/nepali-fiscal-year/?ordering=-id&offset=21',
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


const General = (props: Props) => {
    const {
        reportTitle: rt,
        fiscalYear: fy,
        formationDate: fd,
        committeeMembers: cm,
        localMembers: localMembersFromRedux,
    } = props.generalData;
    const { requests: { FiscalYearFetch }, setGeneralDatapp } = props;

    const [reportTitle, setreportTitle] = useState<string>(rt);
    const [fiscalYear, setfiscalYear] = useState<string>(fy);
    const [formationDate, setformationDate] = useState<string>(fd);
    const [committeeMembers, setcommitteeMembers] = useState<number>(cm);
    const [fiscalYearList, setFiscalYearList] = useState([]);
    const [showInfo, setShowInfo] = useState(false);
    // const [showFormErr, setShowErr] = useState(true);
    const [fyErr, setFyErr] = useState(false);
    const [dateErr, setDate] = useState(false);
    const [fiscalYearTitle, setFiscalYearTitle] = useState('');

    const handleReportTitle = (title: any) => {
        setreportTitle(title.target.value);
    };
    const handleFormationDate = (date: any) => {
        console.log(date);
        // setformationDate(date.target.value);
    };
    const handleMembers = (members: any) => {
        setcommitteeMembers(members.target.value);
    };
    const handleSelectChange = (fiscal: any) => {
        setfiscalYear(fiscal.target.value);
        const title = fiscalYearList
            .filter(data => Number(data.id) === Number(fiscal.target.value));
        setFiscalYearTitle(title[0].titleEn);
    };
    const handleFiscalYearList = (response) => {
        setFiscalYearList(response);
    };

    FiscalYearFetch.setDefaultParams({
        fiscalYearList: handleFiscalYearList,
    });


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
        showErr,
    } = props;

    useEffect(() => {
        if (!focalPerson || !mayor || !cao) {
            setShowInfo(true);
        }
    }, [cao, focalPerson, mayor]);
    const validationErrs = () => {
        const e = [fiscalYear, formationDate];
        const f = [setFyErr, setDate];
        const result = e.map((item) => {
            if (!item) {
                return true;
            }
            return false;
        });
        if (result.indexOf(true) > -1) {
            result.map((item, i) => {
                if (item === true) {
                    f[i](true);
                } else {
                    f[i](false);
                }

                return null;
            });
            return true;
        } return false;
    };

    const handleDataSave = () => {
        if (!validationErrs()) {
            console.log('fiscal year title', fiscalYearTitle);
            props.setGeneralDatapp({
                reportTitle,
                fiscalYear,
                mayor,
                cao,
                focalPerson,
                formationDate,
                committeeMembers,
                localMembers,
                fiscalYearTitle,
            });
            updateTab();
            props.handleShowErr(false);

            props.handleNextClick();
        } else {
            validationErrs();
            props.handleShowErr(true);
        }
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
            { props.annex
                ? ''
                : <h2>General Information</h2>
            }
            {
                !props.annex
                && (
                    <div className={styles.formColumn}>
                        <h5>DRRM report will be generated for each fiscal year.</h5>
                        <h3><strong>Fiscal Year</strong></h3>
                        <div className={styles.row}>
                            {/* <div className={styles.inputContainer}>
                        <input
                            type="text"
                            className={styles.inputElement}
                            placeholder="Disaster Risk Reduction and Management Report"
                            onChange={handleReportTitle}
                            value={reportTitle || ''}
                            disabled
                        />
                    </div> */}

                            <div className={styles.inputContainer}>
                                {fyErr
                                    ? (
                                        <div className={styles.errorMsg}>
                                 Please select fiscal year
                                        </div>
                                    )
                                    : ''}
                                <select
                                    value={fiscalYear}
                                    onChange={handleSelectChange}
                                    className={styles.inputElement}
                                >
                                    {/* objs.sort((a,b) => (a.last_nom > b.last_nom) */}


                                    <option value="select">Select Fiscal Year</option>
                                    {fiscalYearList && fiscalYearList
                                        // .sort((a, b) => b.id - a.id)
                                        // .filter(item => item.id < 19 && item.id > 7)
                                        .map(item => (
                                            <option value={item.id}>{item.titleEn}</option>
                                        ))}

                                </select>

                            </div>

                        </div>
                    </div>
                )}

            <div className={styles.formColumn}>
                {
                    !props.annex
                    && <h3><strong>Municipal DRR Leadership </strong></h3>
                }
                <div className={styles.personalDetailsrow}>
                    <div className={styles.personalDetails}>
                        {
                            !props.annex
                            && (
                                <table id="table-to-xls">
                                    <tbody>
                                        <tr>

                                            <th>Position</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                            { !props.annex
                                    && <th>{'Add/Edit Details'}</th>
                                            }


                                        </tr>
                                        <tr>
                                            <td>{'Mayor or Nagar Pramukh'}</td>
                                            <td>{mayor.split(',')[0] || '-'}</td>
                                            <td>{mayor.split(',')[1] || '-'}</td>
                                            <td>{mayor.split(',')[2] || '-'}</td>
                                            {
                                                !props.annex
                                        && (
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
                                        )}

                                        </tr>
                                        <tr>
                                            <td>{'Chief Administrative Officer'}</td>
                                            <td>{cao.split(',')[0] || '-'}</td>
                                            <td>{cao.split(',')[1] || '-'}</td>
                                            <td>{cao.split(',')[2] || '-'}</td>

                                            {
                                                !props.annex
                                        && (
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
                                        )}
                                        </tr>
                                        <tr>
                                            <td>{'DRR Focal Person'}</td>
                                            <td>{focalPerson.split(',')[0] || '-'}</td>
                                            <td>{focalPerson.split(',')[1] || '-'}</td>
                                            <td>{focalPerson.split(',')[2] || '-'}</td>
                                            {
                                                !props.annex
                                        && (
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
                                        )
                                            }

                                        </tr>
                                    </tbody>
                                </table>
                            )

                        }
                        {
                            showInfo && !props.annex && (
                                <h5>
                                    <i>
                            Please click on the add/edit
                        button to update the details
                                    </i>
                                </h5>
                            )
                        }
                    </div>
                </div>
                {
                    !props.annex
                    && <h3><strong>Local Disaster Management Committee</strong></h3>
                }

                <div className={styles.row}>
                    { !props.annex
                && (
                    <>
                        <div className={styles.inputContainer}>
                            {dateErr
                                ? (
                                    <div className={styles.errorMsg}>
                                     Please select Local DRRM committee formation date
                                    </div>
                                )
                                : ''}
                            <span className={styles.labelDate}>
                                Local Disaster Management Committee formation date
                            </span>
                            <NepaliDatePicker
                                inputClassName="form-control"
                                className={styles.datepicker}
                                value={formationDate}
                                onChange={(value: string) => setformationDate(value)}
                                options={{ calenderLocale: 'en', valueLocale: 'en' }}
                            />
                            {/* <NepaliDatePicker
                                className={styles.datepicker}
                                value={formationDate}
                                placeholder={'Select Date'}
                                onSelect={val => handleFormationDate(val)}
                                onChange={val => handleFormationDate(val)}
                                options={{ calenderLocale: 'en', valueLocale: 'en' }}
                            /> */}

                        </div>
                        <div className={styles.inputContainer}>

                            <span className={styles.labelDate}>
                            Number of members in  Local Disaster Management Committee


                            </span>
                            <input type="number" placeholder="Enter the number of members" />

                        </div>
                        <h3><strong>Committee Members </strong></h3>
                    </>
                )
                    }
                    {
                        props.annex
                        && <h3><strong>Local Disaster Management Committee</strong></h3>
                    }
                    <table className={styles.reportTable} id="table-to-xls">
                        <tbody>
                            <tr>
                                <th>SN</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                {
                                    !props.annex
                                    && <th>Add/Edit Details</th>
                                }

                            </tr>
                            {localMembers.length > 0

                                ? localMembers.map((item, i) => (
                                    <tr key={item.name}>
                                        <td>
                                            {i + 1}
                                        </td>
                                        <td>
                                            {item.name || '-'}
                                        </td>
                                        <td>
                                            {item.email || '-'}
                                        </td>

                                        <td>
                                            {item.mobileNumber || '-'}
                                        </td>

                                        {
                                            !props.annex
                                             && (
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
                                             )
                                        }
                                    </tr>
                                ))
                                : (
                                    <tr>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        {
                                            !props.annex
                                            && (
                                                <td>
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
                                                </td>
                                            )
                                        }
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {
                        !props.annex
                        && (
                            <h5>
                                {' '}
                                <i>Please click on the add/edit button to update the details</i>
                            </h5>
                        )
                    }
                </div>

            </div>

            {
                !props.annex
                && (
                    <NextPrevBtns
                        handlePrevClick={props.handlePrevClick}
                        handleNextClick={handleDataSave}
                        firstpage
                    />
                )
            }


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
