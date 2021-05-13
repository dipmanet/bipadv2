/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import * as ReachRouter from '@reach/router';
import Loader from 'react-loader';
// import { NepaliDatePicker } from 'datepicker-nepali-reactjs';
import styles from './styles.scss';
import NextPrevBtns from '../../NextPrevBtns';
import 'nepali-datepicker-reactjs/dist/index.css';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import {
    setCarKeysAction,
    setGeneralDataAction,
    setPalikaRedirectAction,
} from '#actionCreators';
import {
    generalDataSelector,
    userSelector,
} from '#selectors';

import Icon from '#rscg/Icon';


const mapStateToProps = state => ({
    generalData: generalDataSelector(state),
    user: userSelector(state),

});

const mapDispatchToProps = dispatch => ({
    setGeneralDatapp: params => dispatch(setGeneralDataAction(params)),
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
    setCarKeys: params => dispatch(setCarKeysAction(params)),

});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    MunContacts: {
        url: '/municipality-contact/',
        query: ({ params, props }) => {
            if (params && params.user) {
                return {
                    province: params.user.profile.province,
                    district: params.user.profile.district,
                    municipality: params.user.profile.municipality,
                    limit: params.page,
                    meta: params.meta,

                };
            }


            return { limit: params.page,
                offset: params.offset,


                meta: params.meta };
        },
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            let citizenReportList: CitizenReport[] = [];
            const citizenReportsResponse = response as MultiResponse<CitizenReport>;
            citizenReportList = citizenReportsResponse.results;

            if (params && params.organisation) {
                params.organisation(citizenReportList);
            }
            if (params && params.paginationParameters) {
                params.paginationParameters(response);
            }
        },
    },
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


const General = (props: Props) => {
    const {
        generalData,
        updateTab,
        localMembers,
        showErr,
        requests: { FiscalYearFetch, MunContacts },
        setGeneralDatapp,
        user,
    } = props;

    const {
        reportTitle: rt,
        fiscalYear: fy,
        formationDate: fd,
        committeeMembers: cm,

    } = generalData;

    const [reportTitle, setreportTitle] = useState<string>(rt);
    const [fiscalYear, setfiscalYear] = useState<string>(fy);
    const [formationDate, setformationDate] = useState<string>(fd);
    const [committeeMembers, setcommitteeMembers] = useState<number>(cm);
    const [fiscalYearList, setFiscalYearList] = useState([]);
    const [showInfo, setShowInfo] = useState(false);
    const [fyErr, setFyErr] = useState(false);
    const [dateErr, setDate] = useState(false);
    const [fiscalYearTitle, setFiscalYearTitle] = useState('');
    const [fetchedData, setFetechedData] = useState([]);

    const [mayor, setmayor] = useState('');
    const [cao, setcao] = useState('');
    const [focalPerson, setfocalPerson] = useState('');
    const [loader, setLoader] = useState(true);

    const handleSelectChange = (fiscal: any) => {
        setfiscalYear(fiscal.target.value);
        const title = fiscalYearList
            .filter(data => Number(data.id) === Number(fiscal.target.value));
        setFiscalYearTitle(title[0].titleEn);
        console.log('title', title);
    };
    const handleFiscalYearList = (response) => {
        setFiscalYearList(response);
    };

    FiscalYearFetch.setDefaultParams({
        fiscalYearList: handleFiscalYearList,
    });

    const handleEditContacts = (contactItem) => {
        const { setPalikaRedirect } = props;
        setPalikaRedirect({
            showForm: true,
            contactItem,
            showModal: 'contact',
            contactID: contactItem.id,
            redirectTo: 0,
        });
        ReachRouter.navigate('/profile/',
            { state: { showForm: true }, replace: true });
    };
    const handleAddContact = () => {
        const { setPalikaRedirect } = props;
        setPalikaRedirect({
            showForm: true,
            showModal: 'contact',
            redirectTo: 0,
        });
        ReachRouter.navigate('/profile/',
            { state: { showForm: true }, replace: true });
    };
    const handleFetchedData = (response) => {
        setFetechedData(response);
        setLoader(false);
        const mayorData = response.filter(contact => contact.position === 'Mayor');
        const caoData = response.filter(item => item.position === 'Chief Administrative Officer');
        const focalPersonData = response.filter(item => item.isDrrFocalPerson === true);
        if (mayorData.length > 0) {
            console.log('mayorData: ', mayorData[0]);
            setmayor(mayorData[0]);
        }
        if (caoData.length > 0) {
            setcao(caoData[0]);
        }
        if (focalPersonData.length > 0) {
            setfocalPerson(focalPersonData[0]);
        }
    };

    MunContacts.setDefaultParams({
        organisation: handleFetchedData,
        user,
    });

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


    return (

        <div className={styles.mainPageDetailsContainer}>
            {loader ? (
                <>
                    <Loader left="60%" top="50%" />
                    <p className={styles.loaderInfo}>Loading...Please Wait</p>
                </>

            ) : (
                <>
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
                                            {
                                                fetchedData
                                                && fetchedData
                                                    .filter(item => item.position === 'Mayor').length > 0
                                                    ? fetchedData
                                                        .filter(item => item.position === 'Mayor').map(item => (
                                                            <>
                                                                <td>{'Mayor or Nagar Pramukh'}</td>
                                                                <td>{item.name || '-'}</td>
                                                                <td>{item.email || '-'}</td>
                                                                <td>{item.mobileNumber || '-'}</td>
                                                                {
                                                                    !props.annex
                                                                                && (
                                                                                    <td>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => handleEditContacts(item)}
                                                                                            className={styles.addEditBtn}
                                                                                        >
                                                                                            <Icon
                                                                                                name="edit"
                                                                                                className={styles.addEditIcon}
                                                                                            />
                                                                                        </button>


                                                                                    </td>
                                                                                )
                                                                }
                                                            </>
                                                        ))
                                                    : (
                                                        <>
                                                            <td>{'Mayor or Nagar Pramukh'}</td>
                                                            <td>{'-'}</td>
                                                            <td>{'-'}</td>
                                                            <td>{'-'}</td>
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
                                                        </>
                                                    )
                                            }


                                        </tr>
                                        <tr>
                                            {
                                                fetchedData
                                                && fetchedData
                                                    .filter(item => item.position === 'Chief Administrative Officer').length > 0
                                                    ? fetchedData
                                                        .filter(item => item.position === 'Chief Administrative Officer').map(item => (
                                                            <>
                                                                <td>{'Chief Administrative Officer'}</td>
                                                                <td>{item.name || '-'}</td>
                                                                <td>{item.email || '-'}</td>
                                                                <td>{item.mobileNumber || '-'}</td>
                                                                {
                                                                    !props.annex
                                                                                && (
                                                                                    <td>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => handleEditContacts(item)}
                                                                                            className={styles.addEditBtn}
                                                                                        >
                                                                                            <Icon
                                                                                                name="edit"
                                                                                                className={styles.addEditIcon}
                                                                                            />
                                                                                        </button>


                                                                                    </td>
                                                                                )
                                                                }
                                                            </>
                                                        ))
                                                    : (
                                                        <>
                                                            <td>{'Chief Administrative Officer'}</td>
                                                            <td>{'-'}</td>
                                                            <td>{'-'}</td>
                                                            <td>{'-'}</td>
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
                                                        </>
                                                    )
                                            }


                                        </tr>

                                        <tr>
                                            {
                                                fetchedData
                                                && fetchedData
                                                    .filter(item => item.isDrrFocalPerson === true).length > 0
                                                    ? fetchedData
                                                        .filter(item => item.isDrrFocalPerson === true).map(item => (
                                                            <>
                                                                <td>{'DRR Focal Person'}</td>
                                                                <td>{item.name || '-'}</td>
                                                                <td>{item.email || '-'}</td>
                                                                <td>{item.mobileNumber || '-'}</td>
                                                                {
                                                                    !props.annex
                                                                                && (
                                                                                    <td>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => handleEditContacts(item)}
                                                                                            className={styles.addEditBtn}
                                                                                        >
                                                                                            <Icon
                                                                                                name="edit"
                                                                                                className={styles.addEditIcon}
                                                                                            />
                                                                                        </button>


                                                                                    </td>
                                                                                )
                                                                }
                                                            </>
                                                        ))
                                                    : (
                                                        <>
                                                            <td>{'DRR Focal Person'}</td>
                                                            <td>{'-'}</td>
                                                            <td>{'-'}</td>
                                                            <td>{'-'}</td>
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
                                                        </>
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
                                placeholder="sdfsdfs"
                                options={{ closeOnSelect: true, calenderLocale: 'en', valueLocale: 'en' }}
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

                                    {
                                        fetchedData
                                    && fetchedData
                                        .filter(member => member.committee === 'LDMC').length > 0
                                            ? fetchedData
                                                .filter(availableMembers => availableMembers.committee === 'LDMC').map((mem, i) => (
                                                    <tr key={mem.id}>
                                                        <td>{i + 1}</td>
                                                        <td>{mem.name || '-'}</td>
                                                        <td>{mem.email || '-'}</td>
                                                        <td>{mem.mobileNumber || '-'}</td>
                                                        {
                                                            !props.annex
                                                        && (
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEditContacts(mem)}
                                                                    className={styles.addEditBtn}
                                                                >
                                                                    <Icon
                                                                        name="edit"
                                                                        className={styles.addEditIcon}
                                                                    />
                                                                </button>


                                                            </td>
                                                        )
                                                        }
                                                    </tr>
                                                ))
                                            : (
                                                <tr>
                                                    <td>{'-'}</td>
                                                    <td>{'-'}</td>
                                                    <td>{'-'}</td>
                                                    <td>{'-'}</td>
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
                            <>
                                <h5>
                                    {' '}
                                    <i>Please click on the add/edit button to update the details</i>
                                </h5>
                                <button
                                    type="button"
                                    className={styles.savebtn}
                                    onClick={handleAddContact}
                                >
                                    <Icon
                                        name="plus"
                                        className={styles.plusIcon}
                                    />
                                         Add Member
                                    {/* Add */}
                                </button>

                            </>
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
                </>
            )}

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
