/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { navigate, useLocation } from '@reach/router';
import Navbar from 'src/admin/components/Navbar';
import Footer from 'src/admin/components/Footer';
import MenuCommon from 'src/admin/components/MenuCommon';
import Modal from 'src/admin/components/Modal';
import Select from 'react-select';
import Page from '#components/Page';
import {
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    userSelector,
} from '#selectors';
import { SetEpidemicsPageAction } from '#actionCreators';
import { ADToBS } from 'bikram-sambat-js';
import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import { englishToNepaliNumber } from 'nepali-number';
import 'nepali-datepicker-reactjs/dist/index.css';
import styles from './styles.module.scss';
import ListSvg from '../../resources/list.svg';
import Ideaicon from '../../resources/ideaicon.svg';


const mapStateToProps = (state, props) => ({
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    user: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEpidemicsPage: params => dispatch(SetEpidemicsPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {

    addEarthquakePostTranche1Request: {
        url: '/first-tranche-enrollment-upload/',
        method: methods.POST,
        query: { meta: true },
        onMount: false,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({
            params: { onSuccess } = { onSuccess: undefined },
            response,
        }) => {
            if (onSuccess) {
                onSuccess(response as PageType.Resource);
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                const errorKey = Object.keys(error.response).find(i => i === 'ward');

                if (errorKey) {
                    const errorList = error.response;
                    errorList.location = errorList.ward;
                    delete errorList.ward;

                    params.setFaramErrors(errorList);
                } else {
                    const data = error.response;
                    const resultError = {};
                    const keying = Object.keys(data);
                    const valuing = Object.values(data).map(item => item[0]);
                    const outputError = () => {
                        const outputFinalError = keying.map((item, i) => (
                            resultError[`${item}`] = valuing[i]
                        ));
                        return outputFinalError;
                    };
                    outputError();


                    params.setFaramErrors(resultError);
                }
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
        extras: { hasFile: true },
    },
    getEarthquakeTranche1Request: {
        url: ({ params }) => `/first-tranche-enrollment-upload/?temp_shelter_entrollment_form=${params.id}`,
        method: methods.GET,
        onMount: false,
        onSuccess: ({ response, props, params }) => {
            params.fetchedData(response);
        },
        onFailure: ({ error, params }) => {
            if (params && params.setEpidemicsPage) {
                // TODO: handle error
                console.warn('failure', error);
            }
        },
        onFatal: ({ error, params }) => {
            console.warn('failure', error);
        },
    },
    getEarthquakeRequest: {
        url: ({ params }) => `/temporary-shelter-enrollment-form/${params.id}/`,
        method: methods.GET,
        onMount: false,
        onSuccess: ({ response, props, params }) => {
            params.fetchedData(response);
        },
        onFailure: ({ error, params }) => {
            params.ErrorFetchData();
        },
        onFatal: ({ error, params }) => {
            console.warn('failure', error);
        },
    },

};

const Tranche1 = (props) => {
    const [added, setAdded] = useState(false);
    const [updated, setUpdated] = useState(false);

    const [data, setData] = useState(
        {
            signed_copy_file: '',
            amount: '25000',
            temp_shelter_entrollment_form: '',

        },
    );

    const [errorFields, setErrorFields] = useState({

        signed_copy_file: false,
        amount: false,
        temp_shelter_entrollment_form: false,

    });
    const [loading, setLoading] = useState(false);
    const [backendError, setBackendError] = useState(false);
    const [fetchedData, setFetchedData] = useState(null);
    const [fetchedDataWhole, setFetchedDataWhole] = useState(null);
    const { pathname } = useLocation();
    const [nofetchedTranche1DataError, setNofetchedTranche1DataError] = useState(false);
    const [errorFetchData, setErrorFetchData] = useState(false);
    const { user,
        districts,
        municipalities,
        wards,
        uri,
        requests: {
            addEarthquakePostTranche1Request,
            getEarthquakeTranche1Request,

        } } = props;

    const handleFetchedData = (finalData) => {
        setFetchedData(finalData.results);
        setLoading(false);
    };
    const handleFileInputChange = (e) => {
        setErrorFields({
            ...errorFields,
            [e.target.name]: false,
        });
        const file = e.target.files[0];
        setData({ ...data, [e.target.name]: file });
        // setSelectedFile(file);
        // setSelectedFile(file);
    };
    const handleShowImage = (file) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            return imageUrl;
        }
    };
    const handleUpdateSuccess = () => {
        setAdded(false);
        setUpdated(false);

        navigate('/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table');
    };
    const handleAddedSuccess = () => {
        setAdded(false);
        setUpdated(false);
    };
    const handleErrorClose = () => {
        setAdded(false);
        setUpdated(false);
    };
    const handleTableButton = () => {
        navigate('/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table');
    };
    const handleFormData = (e) => {
        setErrorFields({
            ...errorFields,
            [e.target.name]: false,
        });

        if (e.target.name === 'beneficiary_district') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                beneficiary_municipality: null,
                beneficiary_ward: null,
            });
        } else if (e.target.name === 'beneficiary_municipality') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                beneficiary_ward: null,
            });
        } else if (e.target.name === 'temporary_shelter_land_district') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                temporary_shelter_land_municipality: null,
                temporary_shelter_land_ward: null,
            });
        } else if (e.target.name === 'temporary_shelter_land_municipality') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                temporary_shelter_land_ward: null,
            });
        } else if (e.target.name === 'beneficiary_representative_district') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                beneficiary_representative_municipality: null,
                beneficiary_representative_ward: null,
            });
        } else if (e.target.name === 'beneficiary_representative_municipality') {
            setData({
                ...data,
                [e.target.name]: e.target.value,
                beneficiary_representative_ward: null,
            });
        } else {
            setData({
                ...data, [e.target.name]: e.target.value,
            });
        }
    };

    const splittedRouteId = pathname.split('/');
    const routeId = splittedRouteId[splittedRouteId.length - 1];


    const handleSuccessMessage = (d) => {
        const splittedRoute = pathname.split('/');
        const id = splittedRoute[splittedRoute.length - 1];
        if (id) {
            props.requests.getEarthquakeTranche1Request.do({ id, fetchedData: handleFetchedData });
        }
    };

    useEffect(() => {
        setLoading(true);
        props.requests.getEarthquakeTranche1Request.do({ id: routeId, fetchedData: handleFetchedData });
    }, []);
    const handleClick = () => {
        setBackendError(false);
        const errorCheckingFields = Object.keys(data);
        const latestErrorUpdate = errorFields;

        errorCheckingFields.map((i) => {
            if (!data[i]) {
                if (i === 'temp_shelter_entrollment_form') {
                    return latestErrorUpdate[i] = false;
                }
                return latestErrorUpdate[i] = true;
            } return null;
        });

        setErrorFields({ ...latestErrorUpdate });
        if (Object.values(latestErrorUpdate).filter(i => i === true).length) {
            return;
        }

        setLoading(true);
        const finalUpdateData = data;
        finalUpdateData.temp_shelter_entrollment_form = routeId;


        addEarthquakePostTranche1Request.do({
            body: finalUpdateData,
            onSuccess: datas => handleSuccessMessage(datas),
            setFaramErrors: (err) => {
                setBackendError(true);
                setLoading(false);
            },

        });
        // return errorCheck;
    };
    // Function to handle checkbox change
    const handleCheckboxChange = () => {
        // Update the state with the opposite value of the current state
        setData({
            ...data,
            is_beneficiary_available_to_sign: !data.is_beneficiary_available_to_sign,
        });
    };

    useEffect(() => {
        const curDate = new Date();
        const day = curDate.getDate();
        const month = curDate.getMonth() + 1;
        const year = curDate.getFullYear();

        // This arrangement can be altered based on how we want the date's format to appear.
        const currentDate = ADToBS(`${year}-${month}-${day}`);
        setData({
            ...data,
            entry_date_bs: currentDate,
            signed_date: currentDate,
            operating_municipality_signed_date: currentDate,
            migration_date_bs: currentDate,
        });
    }, []);
    const handleDropdown = (name, value) => {
        if (name === 'beneficiary_district') {
            setData({
                ...data,
                [name]: value,
                beneficiary_municipality: '',
                beneficiary_ward: '',

            });
        } else if (name === 'beneficiary_municipality') {
            setData({
                ...data,
                [name]: value,
                beneficiary_ward: '',

            });
        } else if (name === 'temporary_shelter_land_district') {
            setData({
                ...data,
                [name]: value,
                temporary_shelter_land_municipality: '',
                temporary_shelter_land_ward: '',

            });
        } else if (name === 'temporary_shelter_land_municipality') {
            setData({
                ...data,
                [name]: value,
                temporary_shelter_land_ward: '',

            });
        } else if (name === 'beneficiary_representative_district') {
            setData({
                ...data,
                [name]: value,
                beneficiary_representative_municipality: '',
                beneficiary_representative_ward: '',

            });
        } else if (name === 'beneficiary_representative_municipality') {
            setData({
                ...data,
                [name]: value,
                beneficiary_representative_ward: '',

            });
        } else {
            setData({
                ...data,
                [name]: value,


            });
        }

        // setErrorPersonal({ ...errorPersonal, [name]: false });
    };
    const districtNameConverter = (id) => {
        const finalData = id && districts.find(i => i.id === Number(id)).title_ne;

        return finalData || '-';
    };

    const municipalityNameConverter = (id) => {
        // const finalData = fetchedData && municipalities.find(i => i.id === id).title_ne;
        const finalData = id && municipalities.find(i => i.id === Number(id));
        if (finalData && finalData.type === 'Rural Municipality') {
            const municipality = `${finalData.title_ne} गाउँपालिका`;
            return municipality;
        } if (finalData && finalData.type === 'Submetropolitan City') {
            const municipality = `${finalData.title_ne} उप-महानगरपालिका`;
            return municipality;
        } if (finalData && finalData.type === 'Metropolitan City') {
            const municipality = `${finalData.title_ne} महानगरपालिका`;
            return municipality;
        } if (finalData) {
            return `${finalData.title_ne} नगरपालिका`;
        }
        return '-';
    };

    const wardNameConverter = (id) => {
        const finalData = id && wards.find(i => i.id === Number(id)).title;
        return finalData || '-';
    };
    const handleFetchedDataWhole = (finalReceivedData) => {
        setFetchedDataWhole(finalReceivedData);
    };
    useEffect(() => {
        const splittedRoute = pathname.split('/');
        const id = splittedRoute[splittedRoute.length - 1];
        if (id) {
            props.requests.getEarthquakeRequest.do({ id, fetchedData: handleFetchedDataWhole, ErrorFetchData: () => setErrorFetchData(true) });
        }
    }, [pathname, fetchedData]);

    useEffect(() => {
        if (errorFetchData) {
            navigate('/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data');
        }
    }, [errorFetchData]);


    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            {/* <MenuCommon layout="common" currentPage={'Epidemics'} uri={uri} /> */}
            <div className={styles.container}>

                <h1 className={styles.header}>अस्थायी आवास सम्झौता फारम</h1>
                <p className={styles.dataReporting}>डाटा रिपोर्टिङ</p>
                <div className={styles.twoSections}>
                    <div
                        className="reportingStatus123"
                        style={{ display: 'flex', flexDirection: 'column', padding: '10px 20px' }}


                    >
                        <div
                            className="reporting123"
                            style={{ cursor: 'pointer' }}
                            role="button"
                            onClick={() => navigate(`/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${routeId}`)}
                        >
                            <img className="listSvg123" src={ListSvg} alt="" />
                            <p className="reportingText123"> पहिलो किस्ता फारम</p>
                            <p className="grayCircle123" />
                        </div>
                        <div
                            className="reporting123"
                            style={{ cursor: 'pointer' }}

                        >
                            <img className="listSvg123" src={ListSvg} alt="" />
                            <p className="reportingText123">
                                पहिलो किस्ता फारम अपलोड
                            </p>
                            <p className="greenCircle123" />
                        </div>
                        <div
                            className="reporting123"
                            style={{ cursor: 'pointer' }}
                            role="button"
                            onClick={() => {
                                if (fetchedDataWhole.firstTrancheEnrollmentUpload) {
                                    navigate(`/admin/temporary-shelter-enrollment-form/add-view-tranche2/${routeId}`);
                                }
                            }}
                        >
                            <img className="listSvg123" src={ListSvg} alt="" />
                            <p className="reportingText123">
                                दोस्रो किस्ता फारम
                            </p>
                            <p className="grayCircle123" />
                        </div>
                        <div
                            className="reporting123"
                            style={{ cursor: 'pointer' }}
                            role="button"
                            onClick={() => {
                                if (fetchedDataWhole.secondTrancheEnrollmentForm) {
                                    navigate(`/admin/temporary-shelter-enrollment-form/add-tranche2-file-upload/${routeId}`);
                                }
                            }}
                        >
                            <img className="listSvg123" src={ListSvg} alt="" />
                            <p className="reportingText123">
                                दोस्रो किस्ता फारम अपलोड
                            </p>
                            <p className="grayCircle123" />
                        </div>
                    </div>
                    {/* <div className={styles.reportingStatus}>
                        <div className={styles.reporting}>
                            <img className={styles.listSvg} src={ListSvg} alt="" />
                            <p className={styles.reportingText}>जानकारी</p>
                            <p className={styles.greenCircle} />
                        </div>
                    </div> */}
                    <div className={styles.mainForm}>
                        <div className={styles.generalInfoAndTableButton}>
                            <h1 className={styles.generalInfo}> पहिलो किस्ता फारम अपलोड</h1>
                            <button className={styles.viewDataTable} type="button" onClick={handleTableButton}>डाटा तालिका हेर्नुहोस्</button>
                        </div>
                        {/* <div className={styles.shortGeneralInfo}>
                            <img className={styles.ideaIcon} src={Ideaicon} alt="" />
                            <p className={styles.ideaPara}>
                                अस्थायी आश्रय नामांकन फारममा भूकम्प प्रभावित क्षेत्रको विवरण र घरको विवरण समावेश हुन्छ।

                            </p>
                        </div> */}
                        {
                            loading ? <p>Loading...</p>

                                : (
                                    <div className={styles.mainDataEntrySection}>
                                        <div className={styles.formGeneralInfo}>
                                            <h1>अनुुसूूची ३</h1>
                                            <h1>दफा ३(५) सँँग सम्बन्धित</h1>
                                            <h1 style={{ textDecoration: 'underline' }}>भूूकम्प प्रभावितको अस्थायी आवास निर्माणका लागि अनुुदान किस्ता १</h1>
                                        </div>


                                        <div className={styles.firstPartDetails}>

                                            <div className={styles.firstPartContainer}>

                                                <div className={styles.formElements}>
                                                    <div className={styles.freeText}>
                                                        <span>
                                                            {`रकम: रु.${fetchedData && fetchedData.length ? englishToNepaliNumber(fetchedData[0].amount) : englishToNepaliNumber(data.amount)}`}
                                                        </span>

                                                    </div>

                                                    {
                                                        fetchedData && fetchedData.length
                                                            ? (
                                                                <div className={styles.locationDetails}>

                                                                    <div style={{
                                                                        display: 'flex',
                                                                        gap: '5px',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'flex-start',
                                                                    }}
                                                                    >

                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>


                                                                            {
                                                                                fetchedData[0].signedCopyFile
                                                                                    ? <a href={fetchedData[0].signedCopyFile} style={{ textDecoration: 'underline' }} target="__blank">पहिलो किस्ताको हस्ताक्षरित प्रतिलिपि कागजात हेर्न यहाँ क्लिक गर्नुहोस्</a>
                                                                                    // <img height={100} width={100} src={fetchedData[0].signedCopyFile} alt="img" />
                                                                                    : ''
                                                                            }
                                                                        </div>


                                                                    </div>


                                                                </div>
                                                            )
                                                            : (
                                                                <div className={styles.locationDetails}>

                                                                    <div style={{
                                                                        display: 'flex',
                                                                        gap: '5px',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'flex-start',
                                                                    }}
                                                                    >
                                                                        <span>
                                                                            कृपया हस्ताक्षरित प्रतिलिपि कागजात अपलोड गर्नुहोस्
                                                                        </span>
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                                            <input
                                                                                type="file"
                                                                                accept="*"
                                                                                id="file-input"
                                                                                // style={{ display: 'none' }}
                                                                                onChange={handleFileInputChange}
                                                                                name="signed_copy_file"
                                                                            />
                                                                            {errorFields.signed_copy_file
                                                                                ? <p style={{ margin: '0', color: 'red' }}>कृपया फोटो अपलोड गर्नुहोस्</p> : ''
                                                                            }
                                                                            {/* {
                                                                                data.signed_copy_file ? <img height={100} width={100} src={handleShowImage(data.signed_copy_file)} alt="img" /> : ''
                                                                            } */}
                                                                        </div>


                                                                    </div>


                                                                </div>
                                                            )
                                                    }


                                                </div>
                                            </div>


                                        </div>


                                        {
                                            Object.values(errorFields).filter(i => i === true).length
                                                ? <span className={styles.ValidationErrors}>रातो रङले संकेत गरेको माथिको फारममा केही फिल्ड भर्न बाँकी छ, कृपया फारम पूरा गर्नुहोस् र पुन: प्रयास गर्नुहोस्</span>
                                                : ''
                                        }
                                        {
                                            backendError
                                                ? <span className={styles.ValidationErrors}>तपाईंको इन्टरनेट वा सर्भरमा समस्या छ कृपया पुन: प्रयास गर्नुहोस्</span>
                                                : ''
                                        }
                                        {
                                            nofetchedTranche1DataError
                                                ? 'फाइल अपलोड गर्नको लागि कृपया किस्ता १ फारम भर्नुहोस्' : ''
                                        }
                                        {
                                            fetchedData && fetchedData.length ? ''
                                                : (
                                                    <div className={styles.saveOrAddButtons}>
                                                        <button className={styles.submitButtons} onClick={handleClick} type="submit" disabled={!!loading}>{loading ? 'पेश गरिँदै छ...' : 'पेश गर्नुहोस्'}</button>
                                                    </div>
                                                )}
                                    </div>
                                )}
                    </div>
                </div>
            </div>
            <Footer />

        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Tranche1,
        ),
    ),
);
