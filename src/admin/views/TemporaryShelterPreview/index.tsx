/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable consistent-return */
/* eslint-disable no-const-assign */
/* eslint-disable no-return-assign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { navigate, useLocation } from '@reach/router';
import Navbar from 'src/admin/components/Navbar';
import Footer from 'src/admin/components/Footer';
import ReactToPrint from 'react-to-print';
import Page from '#components/Page';
import {
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    userSelector,
} from '#selectors';
import { SetEpidemicsPageAction } from '#actionCreators';
import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
// import styles from './styles.module.scss';
import { englishToNepaliNumber } from 'nepali-number';
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

    getEarthquakeRequest: {
        url: ({ params }) => `/temporary-shelter-enrollment-form/${params.id}/`,
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


};

const TemporaryShelterPreview = (props) => {
    const [validationError, setvalidationError] = useState(null);

    const [loadPrint, setLoadPrint] = useState(false);


    // const [formError, setFormError] = useState(ErrorObj);


    const [fetchedData, setFetchedData] = useState(null);
    const { pathname } = useLocation();
    let componentRef = useRef();
    const {

        districts,
        municipalities,
        wards,
    } = props;


    const handleTableButton = () => {
        navigate('/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table');
    };

    const handleFetchedData = (finalData) => {
        setFetchedData(finalData);
    };


    useEffect(() => {
        const splittedRoute = pathname.split('/');
        const id = splittedRoute[splittedRoute.length - 1];
        if (id) {
            props.requests.getEarthquakeRequest.do({ id, fetchedData: handleFetchedData });
        }
    }, [pathname]);

    const districtNameConverter = (id) => {
        const finalData = fetchedData && districts.find(i => i.id === id).title_ne;

        return finalData;
    };

    const municipalityNameConverter = (id) => {
        // const finalData = fetchedData && municipalities.find(i => i.id === id).title_ne;
        const finalData = fetchedData && municipalities.find(i => i.id === id);
        if (finalData.type === 'Rural Municipality') {
            const municipality = `${finalData.title_ne} गाउँपालिका`;
            return municipality;
        } if (finalData.type === 'Submetropolitan City') {
            const municipality = `${finalData.title_ne} उप-महानगरपालिका`;
            return municipality;
        } if (finalData.type === 'Metropolitan City') {
            const municipality = `${finalData.title_ne} महानगरपालिका`;
            return municipality;
        }
        return `${finalData.title_ne} नगरपालिका`;
    };

    const wardNameConverter = (id) => {
        const finalData = fetchedData && wards.find(i => i.id === id).title;
        return finalData;
    };
    const handlePrint = () => {
        setLoadPrint(true);
    };

    useEffect(() => {
        if (loadPrint) {
            const timer = setTimeout(() => {
                setLoadPrint(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [loadPrint]);

    const dateFormatter = (date) => {
        const slicedDate = date.split('-');
        const year = englishToNepaliNumber(slicedDate[0]);
        const month = englishToNepaliNumber(slicedDate[1]);
        const day = englishToNepaliNumber(slicedDate[2]);
        const finalDate = `${year}/${month}/${day}`;
        return finalDate;
    };
    const splittedRouteId = pathname.split('/');
    const routeId = splittedRouteId[splittedRouteId.length - 1];

    return (
        <>
            <Page hideFilter hideMap />
            <Navbar />
            <div className="container123">
                <h1 className="header123">अस्थायी आश्रय नामांकन डाटा संरचना</h1>
                <p className="dataReporting123">डाटा रिपोर्टिङ</p>
                <div className="twoSections123">

                    <div
                        className="reportingStatus123"
                        style={{ display: 'flex', flexDirection: 'column', padding: '10px 20px' }}

                    >
                        <div
                            className="reporting123"
                            style={{ cursor: 'pointer' }}
                            role="button"
                            onClick={() => {
                                navigate(`/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${routeId}`);
                            }}
                        >
                            <img className="listSvg123" src={ListSvg} alt="" />
                            <p className="reportingText123">जानकारी</p>
                            <p className="greenCircle123" />
                        </div>
                        <div
                            className="reporting123"
                            style={{ cursor: 'pointer' }}
                            role="button"
                            onClick={() => {
                                navigate(`/admin/temporary-shelter-enrollment-form/add-view-tranche1/${routeId}`);
                            }}
                        >
                            <img className="listSvg123" src={ListSvg} alt="" />
                            <p className="reportingText123">
                                किस्ता १
                            </p>
                            <p className="grayCircle123" />
                        </div>
                        <div
                            className="reporting123"
                            style={{ cursor: 'pointer' }}
                            role="button"
                            onClick={() => {
                                navigate(`/admin/temporary-shelter-enrollment-form/add-view-tranche2/${routeId}`);
                            }}
                        >
                            <img className="listSvg123" src={ListSvg} alt="" />
                            <p className="reportingText123">
                                किस्ता २
                            </p>
                            <p className="grayCircle123" />
                        </div>
                    </div>
                    <div className="mainForm123">
                        <div className="generalInfoAndTableButton123">
                            <h1 className="generalInfo">जानकारी</h1>
                            <button
                                className="DataTableClick123"
                                type="button"
                                onClick={handleTableButton}
                            >डाटा तालिका हेर्नुहोस्
                            </button>
                        </div>
                        <div className="shortGeneralInfo123">
                            <img className="ideaIcon123" src={Ideaicon} alt="" />
                            <p className="ideaPara123">
                                अस्थायी आश्रय नामांकन फारममा भूकम्प प्रभावित क्षेत्रको विवरण र घरको विवरण समावेश हुन्छ।

                            </p>
                        </div>
                        {/* <div className='infoBar123'>
                            <p className='instInfo123'>
                                Reported Date and Location are required information
                            </p>
                        </div> */}
                        {
                            !fetchedData ? <p>Loading...</p>

                                : (
                                    <div style={{ width: '8.3in', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', padding: '15px 0px' }}>
                                        <div className="mainDataEntrySection123" ref={el => (componentRef = el)} id="downloadDiv">
                                            <div className="formGeneralInfo123">
                                                <h2>अनुुसूूची ३</h2>
                                                <h2>दफा ३(५) सँँग सम्बन्धित</h2>
                                                <h2 style={{ textDecoration: 'underline' }}>भूूकम्प प्रभावितको अस्थायी आवास निर्माणका लागि अनुुदान सम्झौता-पत्र</h2>
                                            </div>
                                            <div
                                                className="datePickerForm123"
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    fontSize: '16px',
                                                }}
                                            >
                                                <span>{`मितिः ${dateFormatter(fetchedData.entryDateBs)}`}</span>
                                            </div>
                                            <div className="countData123">
                                                <div className="countDataIndividual123">
                                                    <span>{`लाभग्राही क्रम संंख्याः ${englishToNepaliNumber(fetchedData.id)}`}</span>

                                                </div>
                                                {/* <div className="countDataIndividual123">
                                                    <span>{`सम्झौता क्रमााङ्क संंख्याः ${fetchedData.id}`}</span>

                                                </div> */}
                                            </div>
                                            <div className="formDetails123">
                                                <p style={{ margin: 0 }}>
                                                    {`भूूकम्प प्रभावितको अस्थायी आवास निर्माणका लागि ${districtNameConverter(fetchedData.beneficiaryDistrict)}
                                                  जिल्ला ${municipalityNameConverter(fetchedData.beneficiaryMunicipality)} वडा नंं. ${englishToNepaliNumber(wardNameConverter(fetchedData.beneficiaryWard))} गाउँँ/टोल ${fetchedData.toleName} बस्नेे श्री ${fetchedData.grandParentName} को ${fetchedData.grandChildRelation} श्री ${fetchedData.parentName}
                                                  को ${fetchedData.childRelation} बर्ष ${englishToNepaliNumber(fetchedData.beneficiaryAge)} को लाभग्राही श्री ${fetchedData.beneficiaryNameNepali}
                                                  (यसपछि प्रथम पक्ष भनिनेे) र ${municipalityNameConverter(fetchedData.operatingMunicipality)} कार्यालय (यसपछि दोश्रो पक्ष भनिनेे) बीच देेहाय बमोजिमका शर्तहरुको अधिनमा रही भूूकम्पबाट प्रभावित
                                                  घरपरिवारलाई अस्थायी आवास निर्माण अनुुदान कार्यविधि,२०८०, बमोजिम अस्थायी आवास निर्माण गर्न यो अनुुदान
                                                  सम्झौता-पत्रमा सहीछाप गरेेका छौंं । 
                                                `}
                                                </p>
                                            </div>
                                            <div className="mainTempAddress123">
                                                <h2 style={{ textDecoration: 'underline' }}>अस्थायी आवास निर्माण हुुनेे जग्गाको विवरण</h2>
                                                <div className="tempAddress123">
                                                    <div className="tempAddressIndividualDiv123">
                                                        {`जिल्ला ${districtNameConverter(fetchedData.temporaryShelterLandDistrict)}`}
                                                    </div>
                                                    <div className="tempAddressIndividualDiv123">
                                                        {`${municipalityNameConverter(fetchedData.temporaryShelterLandMunicipality)}`}
                                                    </div>
                                                    <div className="tempAddressIndividualDiv123">
                                                        {`वडा नंं. ${englishToNepaliNumber(wardNameConverter(fetchedData.temporaryShelterLandWard))}`}
                                                    </div>
                                                    <div className="tempAddressIndividualDiv123">
                                                        {`टोल: ${(fetchedData.temporaryShelterLandTole)}`}
                                                    </div>
                                                    {/* <div className="tempAddressIndividualDiv123">
                                                        {`कित्ता नंं. ${englishToNepaliNumber(fetchedData.temporaryShelterLandKittaNumber)}`}
                                                    </div>
                                                    <div className="tempAddressIndividualDiv123">
                                                        {`क्षेेत्रफल ${fetchedData.temporaryShelterLandArea}`}
                                                    </div>
                                                    <div className="tempAddressIndividualDiv123">
                                                        {`नक्सा सिट नंं ${fetchedData.temporaryShelterLandMapSheetNumber}`}.
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ flex: 1, paddingRight: '5px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <h2 style={{ textDecoration: 'underline' }}>क. प्रथम पक्ष (लाभग्राही)</h2>
                                                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>१. व्यक्तिगत विवरण</span>
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                            {
                                                                fetchedData.beneficiaryPhoto ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={130} width={130} src={fetchedData.beneficiaryPhoto} alt="img" /> : ''
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="firstPartContainer123" style={{ marginTop: '20px' }}>
                                                        <div className="formElements123">
                                                            <div className="freeText123">
                                                                <span>{`नाम, थर नेेपालीमाः ${fetchedData.beneficiaryNameNepali}`}</span>
                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`नाम, थर अंंग्रेजीमाः ${fetchedData.beneficiaryNameEnglish}`}</span>
                                                            </div>
                                                            <div className="locationDetails123">
                                                                <div>
                                                                    <span>{`जिल्लाः ${districtNameConverter(fetchedData.beneficiaryDistrict)}`}</span>
                                                                </div>
                                                                <div>
                                                                    <span>{`गा.पा./न.पाः ${municipalityNameConverter(fetchedData.beneficiaryMunicipality)}`}</span>
                                                                </div>
                                                                <div>
                                                                    <span>{`वडा नंं. ${englishToNepaliNumber(wardNameConverter(fetchedData.beneficiaryWard))}`}</span>
                                                                </div>
                                                                <div>
                                                                    <span>{`ना.प्र.न. ${fetchedData.beneficiaryCitizenshipNumber}`}</span>
                                                                </div>
                                                                <div>
                                                                    <span>{`सम्पर्क नंं. ${englishToNepaliNumber(fetchedData.beneficiaryContactNumber)}`}</span>

                                                                </div>
                                                            </div>
                                                            {
                                                                fetchedData.isBeneficiaryAvailableToSign
                                                                    ? (
                                                                        <div>
                                                                            <p style={{ lineHeight: '30px' }}>
                                                                                सम्झौता-पत्रमा हस्ताक्षर गर्न अधिकार/मञ्जुुरी प्राप्त व्यक्तिको
                                                                                विवरण (लाभग्राही उपस्थित हुुन नसकेेको अवस्थामा मात्र)
                                                                                संंरक्षक/अधिकार प्राप्त/मञ्जुुरी प्राप्त व्यक्तिको विवरण

                                                                            </p>
                                                                            <div style={{ marginBottom: '10px' }} className="freeText123">
                                                                                <span>{`नाम, थर नेेपालीमाः ${fetchedData.beneficiaryRepresentativeNameNepali}`}</span>

                                                                            </div>
                                                                            <div className="locationDetails123">

                                                                                <div>
                                                                                    <span>{`जिल्लाः ${districtNameConverter(fetchedData.beneficiaryRepresentativeDistrict)}`}</span>


                                                                                </div>
                                                                                <div>
                                                                                    <span>{`गा.पा./न.पाः ${municipalityNameConverter(fetchedData.beneficiaryRepresentativeMunicipality)}`}</span>


                                                                                </div>
                                                                                <div>
                                                                                    <span>{`गा.पा./न.पाः ${englishToNepaliNumber(wardNameConverter(fetchedData.beneficiaryRepresentativeWard))}`}</span>

                                                                                </div>
                                                                                <div>
                                                                                    <span>{`ना.प्र.न. ${fetchedData.beneficiaryRepresentativeCitizenshipNumber}`}</span>

                                                                                </div>

                                                                            </div>
                                                                            <div className="freeText123" style={{ marginTop: '10px' }}>
                                                                                <span>{`बाजेेको नाम, थर: ${fetchedData.beneficiaryRepresentativeGrandfatherName}`}</span>


                                                                            </div>
                                                                            <div className="freeText123" style={{ marginTop: '10px' }}>
                                                                                <span>{`बाबुु/आमाको नाम, थर: ${fetchedData.beneficiaryRepresentativeParentName}`}</span>

                                                                            </div>
                                                                        </div>
                                                                    ) : ''
                                                            }


                                                        </div>

                                                    </div>
                                                    <div className="freeTextTable123" style={{ pageBreakBefore: 'always' }}>
                                                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>४. लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको औठांंछाप</span>
                                                        <table
                                                            className="lyapcheTable"
                                                            style={{
                                                                width: '96%',
                                                                border: '1px solid black',
                                                                borderCollapse: 'collapse',
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            <tr style={{ background: 'none' }}>
                                                                <th style={{
                                                                    border: '1px solid black',
                                                                    borderCollapse: 'collapse',
                                                                    textAlign: 'center',
                                                                }}
                                                                >दायाँँ
                                                                </th>
                                                                <th style={{
                                                                    border: '1px solid black',
                                                                    borderCollapse: 'collapse',
                                                                    textAlign: 'center',
                                                                }}
                                                                >बायाँँ
                                                                </th>

                                                            </tr>
                                                            <tr style={{ background: 'none' }}>
                                                                <td style={{
                                                                    border: '1px solid black',
                                                                    borderCollapse: 'collapse',
                                                                    textAlign: 'center',
                                                                    height: '150px',
                                                                    width: '200px',
                                                                }}
                                                                />
                                                                <td style={{
                                                                    border: '1px solid black',
                                                                    borderCollapse: 'collapse',
                                                                    textAlign: 'center',
                                                                    height: '150px',
                                                                    width: '200px',
                                                                }}
                                                                />

                                                            </tr>

                                                        </table>
                                                    </div>
                                                </div>
                                                <div style={{ flex: 1, paddingLeft: '5px' }}>
                                                    <div className="firstPartContainer123">
                                                        <span style={{ fontWeight: 'bold' }}>२. बैंंक/वित्तीय संंस्थामा रहेेको खाताको विवरण</span>
                                                        <div className="formElements123">
                                                            <div className="freeText123">
                                                                <span>{`खातावालाको नाम, थरः ${fetchedData.bankAccountHolderName}`}</span>
                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`खाता नम्बरः ${fetchedData.bankAccountNumber}`}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`बैंंक/वित्तीय संंस्थाको नामः ${fetchedData.bankName}`}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`शाखाः ${fetchedData.bankBranchName}`}</span>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="firstPartContainer123">
                                                        <span style={{ fontWeight: 'bold', lineHeight: '30px' }}>३. स्थायी ठेेगाना र नागरिकतामा उल्लिखित ठेेगाना फरक भएमा (बसाइँँसराइको विवरण उल्लेेख गर्नेे)</span>
                                                        <div className="formElements123">
                                                            <div className="freeText123">
                                                                <span>{`बसाइँँसराइ प्रमाण-पत्र नंः ${fetchedData.migrationCertificateNumber}`}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`बसाइँँसराइको मितिः ${fetchedData.migrationCertificateNumber ? dateFormatter(fetchedData.migrationDateBs) : ''}`}</span>

                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="firstPartContainer123" style={{ marginBottom: '58px' }}>
                                                        <span style={{ fontWeight: 'bold', lineHeight: '30px' }}>४. लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको औंठा छाप लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको हस्ताक्षर</span>
                                                        <div className="formElements123">
                                                            <div className="freeText123">
                                                                <span>{'लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको हस्ताक्षर: .................................... '}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`मितिः ${dateFormatter(fetchedData.signedDate)}`}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`साक्षीको नाम, थर: ${fetchedData.withnessNameNepali}`}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{'हस्ताक्षर: ................................. '}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`लाभग्राहीसँँगको नाता: ${fetchedData.withnessRelation}`}</span>

                                                            </div>
                                                            <div className="freeText123">
                                                                <span>{`सम्पर्क नंं. ${fetchedData.withnessContactNumber}`}</span>

                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="firstPartDetails123" style={{ pageBreakBefore: 'always' }}>
                                                        <h2 style={{ textDecoration: 'underline' }}>ख. दोश्रो पक्ष</h2>
                                                        <div className="firstPartContainer123" style={{ gap: '20px' }}>
                                                            <div className="formElements123">
                                                                <div className="freeTextPart2">
                                                                    (<input type="text" disabled className="inputClassName123" style={{ width: '48%' }} />
                                                                    <span>कार्यपालिका कार्यालयको छाप</span>)
                                                                </div>
                                                                <div className="freeText123">
                                                                    (

                                                                    <span>{`${municipalityNameConverter(fetchedData.operatingMunicipality)}`}</span>
                                                                    )
                                                                </div>
                                                                <div className="freeText123">
                                                                    <span>हस्ताक्षरः ...........................................</span>

                                                                </div>
                                                                <div className="freeText123">
                                                                    <span>{`नामः ${fetchedData.operatingMunicipalityOfficerName}`}</span>
                                                                </div>
                                                                <div className="freeText123">
                                                                    <span>पदः प्रमुुख प्रशासकीय अधिकृृत</span>

                                                                </div>
                                                                <div className="freeText123">
                                                                    <span>{`मितिः ${dateFormatter(fetchedData.operatingMunicipalitySignedDate)}`}</span>

                                                                </div>


                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h2>प्रथम पक्ष लाभग्राहीलेे मञ्जुुर गरेेका शर्तहरुः</h2>
                                                <div>
                                                    <h3> {`${englishToNepaliNumber(1)}. मैैलेे भूूकम्पबाट प्राभाावित घरपरिवारलाई अस्थायी आवास निर्माण अनुुदान कार्ययविधि, २०८० एबंं यस सम्झौता-पत्र अनुुरुप बनाउनेे छुु ।`}</h3>
                                                </div>
                                                <div>
                                                    <h3> {`${englishToNepaliNumber(2)}. निर्माण सामग्रीको खरिद गर्नेे तथा डकर्मी, सिकर्मी, प्लम्बर, इलेेक्ट्रिसियन, तथा अन्य निर्माण कार्य गर्न तथा श्रमिक
जुुटाउनेे र काममा लगाउनेे जिम्मेेवारी मेेरो हुुनेेछ ।`}
                                                    </h3>
                                                </div>
                                                <div>
                                                    <h3>  {`${englishToNepaliNumber(3)}. मैैलेे प्राप्त गर्नेे अस्थायी आवास निर्माण अनुुदान रकम अस्थायी आवास निर्माणका लागि मात्र गर्नेेछुु ।`}
                                                    </h3>
                                                </div>
                                                <div>
                                                    <h3> {`${englishToNepaliNumber(4)}. उपलब्ध अनुुदान नपुुग भएमा अतिरिक्त ‍‍लागत म आफैँँलेे थप गरी अस्थायी आवास निर्माण सम्पन्न गर्नेेछुु।`}</h3>
                                                </div>
                                                <div>
                                                    <h3>
                                                        {`${englishToNepaliNumber(5)}. परिवारको व्यक्तिगत सरसफाई ध्यानमा राखी संंरचना निर्माण गर्नेेछुु।`}
                                                    </h3>
                                                </div>


                                            </div>
                                            <div>
                                                <h3>दोश्रो पक्ष (स्थानीय तह) लेे मञ्जुुरी गरेेका शर्तहरुः</h3>
                                                <div>
                                                    <h3>
                                                        {`${englishToNepaliNumber(1)}. प्रथम पक्षबाट यस कार्यविधि अनुुसार अस्थायी आवास निर्मााणको कार्य भएमा अनुुदान रकम सरकारको तर्फ बाट दफा
५ बमोजिम उपलब्ध गराइनेे छ ।`}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div>
                                                <h3>प्राप्त कागजातहरुः</h3>
                                                {
                                                    fetchedData.identityDocument ? (
                                                        <div>
                                                            <h3> {`${englishToNepaliNumber(1)}. नागरिकता प्रमाण-पत्रको प्रतिलिपि वा राष्ट्रिय परिचयपत्रको प्रतिलिपि वा मतदाता परिचयपत्रको प्रतिलिपि वा वडाको सिफारिस`}</h3>
                                                            {/* <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                                <span style={{ fontSize: '20px' }}>फोटो:</span>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                                    {
                                                                        fetchedData.identityDocument ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.identityDocument} alt="img" /> : ''
                                                                    }
                                                                </div>


                                                            </div> */}
                                                        </div>
                                                    ) : ''
                                                }
                                                {
                                                    fetchedData.infrastructurePhoto ? (
                                                        <div>
                                                            <h3> {`${englishToNepaliNumber(2)}. पूूर्ण रूपलेे क्षति भएको वा आंंशिक क्षति भएता पनि बसोवास गर्न योग्य नरहेेको संंरचनाको फोटो`}
                                                            </h3>
                                                            {/* <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                                <span style={{ fontSize: '20px' }}>फोटो:</span>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                                    {
                                                                        fetchedData.infrastructurePhoto ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.infrastructurePhoto} alt="img" /> : ''
                                                                    }
                                                                </div>


                                                            </div> */}
                                                        </div>
                                                    ) : ''

                                                }

                                                {
                                                    fetchedData.applicationDocument ? (
                                                        <div>
                                                            <h3> {`${englishToNepaliNumber(3)}. घरमूूली उपस्थित नभएको अवस्थामा, मञ्जुुरीनामा सहितको निवेेदन`}
                                                            </h3>
                                                            {/* <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                                <span style={{ fontSize: '20px' }}>फोटो:</span>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                                    {
                                                                        fetchedData.applicationDocument ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.applicationDocument} alt="img" /> : ''
                                                                    }
                                                                </div>


                                                            </div> */}
                                                        </div>
                                                    ) : ''

                                                }
                                                {
                                                    fetchedData.policeReport ? (
                                                        <div>
                                                            <h3>{`${englishToNepaliNumber(fetchedData.applicationDocument ? 4 : 3)}. प्रहरीको मुुचुल्का (प्रत्येेक घरधुुरीको मुुचुल्का नभएको अवस्थामा सामुुहिक मुुचुल्का पनि मान्य हुुनेे)`}</h3>
                                                            {/* <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                                <span style={{ fontSize: '20px' }}>फोटो:</span>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                                    {
                                                                        fetchedData.policeReport ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.policeReport} alt="img" /> : ''
                                                                    }
                                                                </div>


                                                            </div> */}
                                                        </div>
                                                    ) : ''

                                                }


                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', pageBreakBefore: 'always' }}>
                                                <h3>प्राप्त कागजातका फोटोहरुः</h3>

                                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                                    <h3> {`${englishToNepaliNumber(1)}. नागरिकता प्रमाण-पत्रको प्रतिलिपि वा राष्ट्रिय परिचयपत्रको प्रतिलिपि वा मतदाता परिचयपत्रको प्रतिलिपि वा वडाको सिफारिस`}</h3>
                                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                        {/* <span style={{ fontSize: '20px' }}>फोटो:</span> */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                            {
                                                                fetchedData.identityDocument ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.identityDocument} alt="img" /> : ''
                                                            }
                                                        </div>


                                                    </div>
                                                </div>


                                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                                    <h3> {`${englishToNepaliNumber(2)}. पूूर्ण रूपलेे क्षति भएको वा आंंशिक क्षति भएता पनि बसोवास गर्न योग्य नरहेेको संंरचनाको फोटो`}
                                                    </h3>
                                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                        {/* <span style={{ fontSize: '20px' }}>फोटो:</span> */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                            {
                                                                fetchedData.infrastructurePhoto ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.infrastructurePhoto} alt="img" /> : ''
                                                            }
                                                        </div>


                                                    </div>
                                                </div>
                                                {
                                                    fetchedData.applicationDocument


                                                        ? (
                                                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                                                <h3> {`${englishToNepaliNumber(3)}. घरमूूली उपस्थित नभएको अवस्थामा, मञ्जुुरीनामा सहितको निवेेदन`}
                                                                </h3>
                                                                <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                                    {/* <span style={{ fontSize: '20px' }}>फोटो:</span> */}
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                                        {
                                                                            fetchedData.applicationDocument ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.applicationDocument} alt="img" /> : ''
                                                                        }
                                                                    </div>


                                                                </div>

                                                            </div>
                                                        )
                                                        : ''}


                                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                                    <h3>{`${englishToNepaliNumber(fetchedData.applicationDocument ? 4 : 3)}. प्रहरीको मुुचुल्का (प्रत्येेक घरधुुरीको मुुचुल्का नभएको अवस्थामा सामुुहिक मुुचुल्का पनि मान्य हुुनेे)`}</h3>
                                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                        {/* <span style={{ fontSize: '20px' }}>फोटो:</span> */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                            {
                                                                fetchedData.policeReport ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.policeReport} alt="img" /> : ''
                                                            }
                                                        </div>


                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                        <span className="ValidationErrors123">{validationError}</span>
                                        <div className="saveOrAddButtons123">
                                            <ReactToPrint
                                                trigger={() => <button className="submitButtons123" onClick={handlePrint} type="submit">{loadPrint ? 'Printing...' : 'प्रिन्ट'}</button>}
                                                content={() => componentRef}

                                            />

                                        </div>
                                    </div>
                                )
                        }
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
            TemporaryShelterPreview,
        ),
    ),
);
