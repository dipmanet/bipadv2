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
import {
  ClientAttributes,
  createConnectedRequestCoordinator,
  createRequestClient,
  methods,
} from '#request';
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
      params.ErrorFetchData();
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
  const [errorFetchData, setErrorFetchData] = useState(false);
  const { pathname } = useLocation();
  let componentRef = useRef();
  const { districts, municipalities, wards } = props;

  const handleTableButton = () => {
    navigate(
      '/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table',
    );
  };

  const handleFetchedData = (finalData) => {
    setFetchedData(finalData);
  };

  useEffect(() => {
    const splittedRoute = pathname.split('/');
    const id = splittedRoute[splittedRoute.length - 1];
    if (id) {
      props.requests.getEarthquakeRequest.do({
        id,
        fetchedData: handleFetchedData,
        ErrorFetchData: () => setErrorFetchData(true),
      });
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
    }
    if (finalData.type === 'Submetropolitan City') {
      const municipality = `${finalData.title_ne} उप-महानगरपालिका`;
      return municipality;
    }
    if (finalData.type === 'Metropolitan City') {
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

  useEffect(() => {
    if (errorFetchData) {
      navigate(
        '/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data',
      );
    }
  }, [errorFetchData]);

  return (
      <>
          <Page hideFilter hideMap />
          <Navbar />
          <div className="container123">
              <h1 className="header123">अस्थायी आवास सम्झौता फारम</h1>
              <p className="dataReporting123">डाटा रिपोर्टिङ</p>
              <div className="twoSections123">
                  <div
                      className="reportingStatus123"
                      style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '10px 20px',
            }}
                  >
                      <div
                          className="reporting123"
                          style={{ cursor: 'pointer' }}
                          role="button"
                          onClick={() => {
                navigate(
                  `/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${routeId}`,
                );
              }}
                      >
                          <img className="listSvg123" src={ListSvg} alt="" />
                          <p className="reportingText123">पहिलो किस्ता फारम</p>
                          <p className="greenCircle123" />
                      </div>
                      <div
                          className="reporting123"
                          style={{ cursor: 'pointer' }}
                          role="button"
                          onClick={() => {
                navigate(
                  `/admin/temporary-shelter-enrollment-form/add-view-tranche1/${routeId}`,
                );
              }}
                      >
                          <img className="listSvg123" src={ListSvg} alt="" />
                          <p className="reportingText123">पहिलो किस्ता फारम अपलोड</p>
                          <p className="grayCircle123" />
                      </div>
                      <div
                          className="reporting123"
                          style={{ cursor: 'pointer' }}
                          role="button"
                          aria-disabled
                          onClick={() => {
                if (fetchedData.firstTrancheEnrollmentUpload) {
                  navigate(
                    `/admin/temporary-shelter-enrollment-form/add-view-tranche2/${routeId}`,
                  );
                }
              }}
                      >
                          <img className="listSvg123" src={ListSvg} alt="" />
                          <p className="reportingText123">दोस्रो किस्ता फारम</p>
                          <p className="grayCircle123" />
                      </div>
                      <div
                          className="reporting123"
                          style={{ cursor: 'pointer' }}
                          role="button"
                          onClick={() => {
                if (fetchedData.secondTrancheEnrollmentForm) {
                  navigate(
                    `/admin/temporary-shelter-enrollment-form/add-tranche2-file-upload/${routeId}`,
                  );
                }
              }}
                      >
                          <img className="listSvg123" src={ListSvg} alt="" />
                          <p className="reportingText123">दोस्रो किस्ता फारम अपलोड</p>
                          <p className="grayCircle123" />
                      </div>
                  </div>
                  <div className="mainForm123">
                      <div className="generalInfoAndTableButton123">
                          <h1 className="generalInfo">पहिलो किस्ता फारम</h1>
                          <button
                              className="DataTableClick123"
                              type="button"
                              onClick={handleTableButton}
                          >
                डाटा तालिका हेर्नुहोस्
                          </button>
                      </div>
                      {/* <div className="shortGeneralInfo123">
                            <img className="ideaIcon123" src={Ideaicon} alt="" />
                            <p className="ideaPara123">
                                अस्थायी आश्रय नामांकन फारममा भूकम्प प्रभावित क्षेत्रको विवरण र घरको विवरण समावेश हुन्छ।

                            </p>
                        </div> */}
                      {/* <div className='infoBar123'>
                            <p className='instInfo123'>
                                Reported Date and Location are required information
                            </p>
                        </div> */}
                      {!fetchedData ? (
                          <p>Loading...</p>
            ) : (
                <div
                    style={{
                  width: '8.3in',
                  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                  padding: '15px 0px',
                }}
                >
                    <div
                        className="mainDataEntrySection123"
                        ref={el => (componentRef = el)}
                        id="downloadDiv"
                    >
                        <div className="formGeneralInfo123">
                            <h2>अनुसूची ३</h2>
                            <h2>दफा ३(५) सँग सम्बन्धित</h2>
                            <h2 style={{ textDecoration: 'underline' }}>
                      विपद् प्रभावितको अस्थायी आवास निर्माणका लागि अनुदान
                      सम्झौता-पत्र
                            </h2>
                        </div>
                        <div
                            className="datePickerForm123"
                            style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '16px',
                    }}
                        >
                            <span>
                      दर्ता नम्बर:
                                <span style={{ fontWeight: 'bold' }}>
                                    {' '}
                                    {fetchedData.registrationNumber}
                                </span>
                            </span>
                            <span>
                      मितिः
                                <span style={{ fontWeight: 'bold' }}>
                                    {' '}
                                    {dateFormatter(fetchedData.entryDateBs)}
                                </span>
                            </span>
                        </div>
                        <div className="countData123">
                            <div className="countDataIndividual123">
                                <span>
                        लाभग्राही क्रम संंख्याः{' '}
                                    <span style={{ fontWeight: 'bold' }}>
                                        {englishToNepaliNumber(fetchedData.id)}
                                    </span>
                                </span>
                            </div>
                            <div className="countDataIndividual123">
                                <span>
                        सम्झौता क्रमााङ्क संंख्याः{' '}
                                    <span style={{ fontWeight: 'bold' }}>
                                        {englishToNepaliNumber(fetchedData.paNumber) || '-'}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="formDetails123">
                            <p style={{ margin: 0, lineHeight: '25px' }}>
                      विपद् प्रभावितको अस्थायी आवास निर्माणका लागि{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {districtNameConverter(fetchedData.beneficiaryDistrict)}
                                </span>{' '}
                      जिल्ला{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {municipalityNameConverter(
                          fetchedData.beneficiaryMunicipality,
                        )}
                                </span>{' '}
                      वडा नंं.{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {' '}
                                    {englishToNepaliNumber(
                          wardNameConverter(fetchedData.beneficiaryWard),
                        )}
                                </span>{' '}
                      गाउँँ/टोल{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {fetchedData.toleName}
                                </span>{' '}
                      बस्ने श्री{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {fetchedData.grandParentName}
                                </span>{' '}
                      को{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {fetchedData.grandChildRelation}
                                </span>{' '}
                      श्री{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {fetchedData.parentName}
                                </span>{' '}
                      को{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {fetchedData.childRelation}
                                </span>{' '}
                      बर्ष{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {englishToNepaliNumber(fetchedData.beneficiaryAge)}
                                </span>{' '}
                      को लाभग्राही श्री{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {fetchedData.beneficiaryNameNepali}
                                </span>{' '}
                      (यसपछि प्रथम पक्ष भनिने) र{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {municipalityNameConverter(
                          fetchedData.operatingMunicipality,
                        )}
                                </span>{' '}
                      कार्यालय (यसपछि दोश्रो पक्ष भनिने) बीच देहाय बमोजिमका
                      शर्तहरुको अधिनमा रही विपदबाट प्रभावित घरपरिवारलाई अस्थायी
                      आवास निर्माण अनुदान मापदण्ड,२०८१ बमोजिम अस्थायी आवास
                      निर्माण गर्न यो अनुदान सम्झौता-पत्रमा सहीछाप गरेका छौंं ।
                            </p>
                        </div>
                        <div className="mainTempAddress123">
                            <h2 style={{ textDecoration: 'underline' }}>
                      अस्थायी आवास निर्माण हुने जग्गाको विवरण
                            </h2>
                            <div className="tempAddress123">
                                <div className="tempAddressIndividualDiv123">
                        जिल्ला{' '}
                                    <span style={{ fontWeight: 'bold' }}>
                                        {districtNameConverter(
                            fetchedData.temporaryShelterLandDistrict,
                          )}
                                    </span>
                                </div>
                                <div className="tempAddressIndividualDiv123">
                                    <span style={{ fontWeight: 'bold' }}>
                                        {municipalityNameConverter(
                            fetchedData.temporaryShelterLandMunicipality,
                          )}
                                    </span>
                                </div>
                                <div className="tempAddressIndividualDiv123">
                        वडा नंं.{' '}
                                    <span style={{ fontWeight: 'bold' }}>
                                        {englishToNepaliNumber(
                            wardNameConverter(
                              fetchedData.temporaryShelterLandWard,
                            ),
                          )}
                                    </span>
                                </div>
                                <div className="tempAddressIndividualDiv123">
                        टोल:{' '}
                                    <span style={{ fontWeight: 'bold' }}>
                                        {fetchedData.temporaryShelterLandTole}
                                    </span>
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
                                <div
                                    style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                                >
                                    <div>
                                        <h2 style={{ textDecoration: 'underline' }}>
                            क. प्रथम पक्ष (लाभग्राही)
                                        </h2>
                                        <span
                                            style={{ fontWeight: 'bold', fontSize: '16px' }}
                                        >
                            १. व्यक्तिगत विवरण
                                        </span>
                                    </div>
                                    <div
                                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                          }}
                                    >
                                        {fetchedData.beneficiaryPhoto ? (
                                            <img
                                                style={{
                                objectFit: 'cover',
                                objectPosition: 'top',
                              }}
                                                height={130}
                                                width={130}
                                                src={fetchedData.beneficiaryPhoto}
                                                alt="img"
                                            />
                          ) : (
                            ''
                          )}
                                    </div>
                                </div>
                                <div
                                    className="firstPartContainer123"
                                    style={{ marginTop: '20px' }}
                                >
                                    <div className="formElements123">
                                        <div className="freeText123">
                                            <span>
                              नाम, थर नेेपालीमाः{' '}
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {fetchedData.beneficiaryNameNepali}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="freeText123">
                                            <span>
                              नाम, थर अंंग्रेजीमाः{' '}
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {fetchedData.beneficiaryNameEnglish}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="locationDetails123">
                                            <div>
                                                <span>
                                जिल्लाः{' '}
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {districtNameConverter(
                                    fetchedData.beneficiaryDistrict,
                                  )}
                                                    </span>
                                                </span>
                                            </div>
                                            <div>
                                                <span>
                                गा.पा./न.पाः{' '}
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {municipalityNameConverter(
                                    fetchedData.beneficiaryMunicipality,
                                  )}
                                                    </span>
                                                </span>
                                            </div>
                                            <div>
                                                <span>
                                वडा नंं.{' '}
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {englishToNepaliNumber(
                                    wardNameConverter(
                                      fetchedData.beneficiaryWard,
                                    ),
                                  )}
                                                    </span>
                                                </span>
                                            </div>
                                            <div>
                                                <span>
                                ना.प्र.न.{' '}
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {englishToNepaliNumber(
                                    fetchedData.beneficiaryCitizenshipNumber,
                                  )}
                                                    </span>
                                                </span>
                                            </div>
                                            <div>
                                                <span>
                                सम्पर्क नंं.{' '}
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {englishToNepaliNumber(
                                    fetchedData.beneficiaryContactNumber,
                                  )}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                              lineHeight: '25px',
                              gap: '5px',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                                        >
                                            <p
                                                style={{
                                lineHeight: '25px',
                                margin: 0,
                                fontWeight: 'bold',
                              }}
                                            >
                              सम्झौता-पत्रमा हस्ताक्षर गर्न अधिकार/मञ्जुरी
                              प्राप्त व्यक्तिको विवरण (लाभग्राही उपस्थित हुन
                              नसकेको अवस्थामा मात्र) संंरक्षक/अधिकार
                              प्राप्त/मञ्जुरी प्राप्त व्यक्तिको विवरण
                                            </p>
                                            <div className="freeText123">
                                                <span>
                                नाम, थर नेपालीमाः{' '}
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {
                                    fetchedData.beneficiaryRepresentativeNameNepali
                                  }
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="locationDetails123">
                                                <div>
                                                    <span>
                                  जिल्लाः{' '}
                                                        {fetchedData.beneficiaryRepresentativeDistrict ? (
                                                            <span style={{ fontWeight: 'bold' }}>
                                                                {districtNameConverter(
                                        fetchedData.beneficiaryRepresentativeDistrict,
                                      )}
                                                            </span>
                                  ) : (
                                    ''
                                  )}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span>
                                  गा.पा./न.पाः{' '}
                                                        {fetchedData.beneficiaryRepresentativeMunicipality ? (
                                                            <span style={{ fontWeight: 'bold' }}>
                                                                {municipalityNameConverter(
                                        fetchedData.beneficiaryRepresentativeMunicipality,
                                      )}
                                                            </span>
                                  ) : (
                                    ''
                                  )}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span>
                                  वडा नंं:{' '}
                                                        {fetchedData.beneficiaryRepresentativeWard ? (
                                                            <span style={{ fontWeight: 'bold' }}>
                                                                {englishToNepaliNumber(
                                        wardNameConverter(
                                          fetchedData.beneficiaryRepresentativeWard,
                                        ),
                                      )}
                                                            </span>
                                  ) : (
                                    ''
                                  )}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span>
                                  ना.प्र.न:{' '}
                                                        {fetchedData.beneficiaryRepresentativeCitizenshipNumber ? (
                                                            <span style={{ fontWeight: 'bold' }}>
                                                                {englishToNepaliNumber(
                                        fetchedData.beneficiaryRepresentativeCitizenshipNumber,
                                      )}
                                                            </span>
                                  ) : (
                                    ''
                                  )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="freeText123">
                                                <span>
                                बाजेको नाम, थर:{' '}
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {
                                    fetchedData.beneficiaryRepresentativeGrandfatherName
                                  }
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="freeText123">
                                                <span>
                                बाबु/आमाको नाम, थर:{' '}
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {
                                    fetchedData.beneficiaryRepresentativeParentName
                                  }
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="freeTextTable123"
                                    style={{ pageBreakBefore: 'always' }}
                                >
                                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          ४. लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको
                          औठांंछाप
                                    </span>
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
                                            <th
                                                style={{
                                border: '1px solid black',
                                borderCollapse: 'collapse',
                                textAlign: 'center',
                              }}
                                            >
                              दायाँ
                                            </th>
                                            <th
                                                style={{
                                border: '1px solid black',
                                borderCollapse: 'collapse',
                                textAlign: 'center',
                              }}
                                            >
                              बायाँ
                                            </th>
                                        </tr>
                                        <tr style={{ background: 'none' }}>
                                            <td
                                                style={{
                                border: '1px solid black',
                                borderCollapse: 'collapse',
                                textAlign: 'center',
                                height: '150px',
                                width: '200px',
                              }}
                                            />
                                            <td
                                                style={{
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
                                    <span style={{ fontWeight: 'bold' }}>
                          २. बैंंक/वित्तीय संंस्थामा रहेको खाताको विवरण
                                    </span>
                                    <div className="formElements123">
                                        <div className="freeText123">
                                            <span>
                              खातावालाको नाम, थरः{' '}
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {fetchedData.bankAccountHolderName}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="freeText123">
                                            <span>
                              खाता नम्बरः{' '}
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {englishToNepaliNumber(
                                  fetchedData.bankAccountNumber,
                                )}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="freeText123">
                                            <span>
                              बैंंक/वित्तीय संंस्थाको नामः{' '}
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {fetchedData.bankName}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="freeText123">
                                            <span>
                              शाखाः{' '}
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {fetchedData.bankBranchName}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="firstPartContainer123">
                                    <span
                                        style={{ fontWeight: 'bold', lineHeight: '30px' }}
                                    >
                          ३. स्थायी ठेगाना र नागरिकतामा उल्लिखित ठेगाना फरक भएमा
                          (बसाइँसराइको विवरण उल्लेख गर्ने)
                                    </span>
                                    <div className="formElements123">
                                        <div className="freeText123">
                                            <span>
                              बसाइँसराइ प्रमाण-पत्र नंः{' '}
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {englishToNepaliNumber(
                                  fetchedData.migrationCertificateNumber,
                                )}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="freeText123">
                                            <span>
                              बसाइँसराइको मितिः{' '}
                                                {fetchedData.migrationCertificateNumber ? (
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {dateFormatter(fetchedData.migrationDateBs)}
                                                    </span>
                              ) : (
                                ''
                              )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="firstPartContainer123"
                                    style={{ marginBottom: '58px' }}
                                >
                                    <span
                                        style={{ fontWeight: 'bold', lineHeight: '30px' }}
                                    >
                          ४. लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको औंठा
                          छाप लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको
                          हस्ताक्षर
                                    </span>
                                    <div className="formElements123">
                                        <div className="freeText123">
                                            <span>
                                                {
                                'लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको हस्ताक्षर: .................................... '
                              }
                                            </span>
                                        </div>
                                        <div className="freeText123">
                                            <span>
                              मितिः{' '}
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {dateFormatter(fetchedData.signedDate)}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="freeText123">
                                            <span>
                              साक्षीको नाम, थर:{' '}
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {fetchedData.withnessNameNepali}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="freeText123">
                                            <span>
                                                {'हस्ताक्षर: ................................. '}
                                            </span>
                                        </div>
                                        <div className="freeText123">
                                            <span>
                              लाभग्राहीसँगको नाता:{' '}
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {fetchedData.withnessRelation}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="freeText123">
                                            <span>
                              सम्पर्क नंं.{' '}
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {englishToNepaliNumber(
                                  fetchedData.withnessContactNumber,
                                )}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="firstPartDetails123"
                                    style={{ pageBreakBefore: 'always' }}
                                >
                                    <h2 style={{ textDecoration: 'underline' }}>
                          ख. दोश्रो पक्ष
                                    </h2>
                                    <div
                                        className="firstPartContainer123"
                                        style={{ gap: '20px' }}
                                    >
                                        <div className="formElements123">
                                            <div className="freeTextPart2">
                              (<span>कार्यपालिका कार्यालयको छाप</span>
                                                <input
                                                    type="text"
                                                    disabled
                                                    className="inputClassName123"
                                                    style={{ width: '48%' }}
                                                />
                              )
                                            </div>
                                            <div className="freeText123">
                              (
                                                <span
                                                    style={{ fontWeight: 'bold' }}
                                                >{`${municipalityNameConverter(
                                fetchedData.operatingMunicipality,
                              )}`}
                                                </span>
                              )
                                            </div>
                                            <div className="freeText123">
                                                <span>
                                हस्ताक्षरः
                                ...........................................
                                                </span>
                                            </div>
                                            <div className="freeText123">
                                                <span>
                                नामः{' '}
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {fetchedData.operatingMunicipalityOfficerName}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="freeText123">
                                                <span>पदः प्रमुख प्रशासकीय अधिकृत</span>
                                            </div>
                                            <div className="freeText123">
                                                <span>
                                मितिः{' '}
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {dateFormatter(
                                    fetchedData.operatingMunicipalitySignedDate,
                                  )}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2>प्रथम पक्ष लाभग्राहीले मञ्जुर गरेका शर्तहरुः</h2>
                            <div>
                                <h3 style={{ fontWeight: 'normal' }}>
                                    {' '}
                                    {`${englishToNepaliNumber(
                          1,
                        )}. मैले विपदबाट प्राभाावित घरपरिवारलाई अस्थायी आवास निर्माण अनुदान मापदण्ड, २०८१ एबंं यस सम्झौता-पत्र अनुरुप बनाउनेे छु ।`}
                                </h3>
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 'normal' }}>
                                    {' '}
                                    {`${englishToNepaliNumber(
                          2,
                        )}. निर्माण सामग्रीको खरिद गर्ने तथा डकर्मी, सिकर्मी, प्लम्बर, इलेेक्ट्रिसियन, तथा अन्य निर्माण कार्य गर्न तथा श्रमिक
जुटाउनेे र काममा लगाउनेे जिम्मेेवारी मेेरो हुनेछ ।`}
                                </h3>
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 'normal' }}>
                                    {' '}
                                    {`${englishToNepaliNumber(
                          3,
                        )}. मैले प्राप्त गर्ने अस्थायी आवास निर्माण अनुदान रकम अस्थायी आवास निर्माणका लागि मात्र गर्नेछु ।`}
                                </h3>
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 'normal' }}>
                                    {' '}
                                    {`${englishToNepaliNumber(
                          4,
                        )}. उपलब्ध अनुदान नपुग भएमा अतिरिक्त ‍‍लागत म आफैलेे थप गरी अस्थायी आवास निर्माण सम्पन्न गर्नेछु।`}
                                </h3>
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 'normal' }}>
                                    {`${englishToNepaliNumber(
                          5,
                        )}. परिवारको व्यक्तिगत सरसफाई ध्यानमा राखी संंरचना निर्माण गर्नेछु।`}
                                </h3>
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 'normal' }}>
                                    {`${englishToNepaliNumber(
                          6,
                        )}. अस्थायी आवासको अनुदान लिएपश्चात जोखिमयुक्त घरमा बस्ने छैन।`}
                                </h3>
                            </div>
                        </div>
                        <div>
                            <h3>
                      दोश्रो पक्ष (स्थानीय तह) लेे मञ्जुरी गरेेका शर्तहरुः
                            </h3>
                            <div>
                                <h3 style={{ fontWeight: 'normal' }}>
                                    {`${englishToNepaliNumber(
                          1,
                        )}. प्रथम पक्षबाट यस मापदण्ड अनुसार अस्थायी आवास निर्मााणको कार्य भएमा अनुदान रकम सरकारको तर्फ बाट दफा
५ बमोजिम उपलब्ध गराइनेे छ ।`}
                                </h3>
                            </div>
                        </div>
                        <div>
                            <h3>प्राप्त कागजातहरुः</h3>
                            {fetchedData.identityDocument ? (
                                <div>
                                    <h3 style={{ fontWeight: 'normal' }}>
                                        {' '}
                                        {`${englishToNepaliNumber(
                            1,
                          )}. नागरिकता प्रमाण-पत्रको प्रतिलिपि वा राष्ट्रिय परिचयपत्रको प्रतिलिपि वा मतदाता परिचयपत्रको प्रतिलिपि वा वडाको सिफारिस`}
                                    </h3>
                                    {/* <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                                <span style={{ fontSize: '20px' }}>फोटो:</span>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                                    {
                                                                        fetchedData.identityDocument ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.identityDocument} alt="img" /> : ''
                                                                    }
                                                                </div>


                                                            </div> */}
                                </div>
                    ) : (
                      ''
                    )}
                            {fetchedData.infrastructurePhoto ? (
                                <div>
                                    <h3 style={{ fontWeight: 'normal' }}>
                                        {' '}
                                        {`${englishToNepaliNumber(
                            2,
                          )}. पूर्ण रूपलेे क्षति भएको वा आंंशिक क्षति भएता पनि बसोवास गर्न योग्य नरहेेको संंरचनाको फोटो`}
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
                    ) : (
                      ''
                    )}

                            {fetchedData.applicationDocument ? (
                                <div>
                                    <h3 style={{ fontWeight: 'normal' }}>
                                        {' '}
                                        {`${englishToNepaliNumber(
                            3,
                          )}. घरमूली उपस्थित नभएको अवस्थामा, मञ्जुरीनामा सहितको निवेेदन`}
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
                    ) : (
                      ''
                    )}
                            {fetchedData.policeReport ? (
                                <div>
                                    <h3
                                        style={{ fontWeight: 'normal' }}
                                    >{`${englishToNepaliNumber(
                          fetchedData.applicationDocument ? 4 : 3,
                        )}. प्रहरीको मुचुल्का (प्रत्येेक घरधुरीको मुचुल्का नभएको अवस्थामा सामुहिक मुचुल्का पनि मान्य हुनेे)`}
                                    </h3>
                                    {/* <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                                                <span style={{ fontSize: '20px' }}>फोटो:</span>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

                                                                    {
                                                                        fetchedData.policeReport ? <img style={{ objectFit: 'cover', objectPosition: 'top' }} height={150} width={150} src={fetchedData.policeReport} alt="img" /> : ''
                                                                    }
                                                                </div>


                                                            </div> */}
                                </div>
                    ) : (
                      ''
                    )}
                        </div>
                        <div
                            style={{
                      display: 'flex',
                      gap: '10px',
                      flexDirection: 'column',
                      pageBreakBefore: 'always',
                    }}
                        >
                            <h3>प्राप्त कागजातका फोटोहरुः</h3>

                            <div
                                style={{
                        display: 'flex',
                        gap: '10px',
                        flexDirection: 'column',
                      }}
                            >
                                <h3 style={{ fontWeight: 'normal' }}>
                                    {' '}
                                    {`${englishToNepaliNumber(
                          1,
                        )}. नागरिकता प्रमाण-पत्रको प्रतिलिपि वा राष्ट्रिय परिचयपत्रको प्रतिलिपि वा मतदाता परिचयपत्रको प्रतिलिपि वा वडाको सिफारिस`}
                                </h3>
                                <div
                                    style={{
                          display: 'flex',
                          gap: '5px',
                          alignItems: 'flex-start',
                        }}
                                >
                                    {/* <span style={{ fontSize: '20px' }}>फोटो:</span> */}
                                    <div
                                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                          }}
                                    >
                                        {fetchedData.identityDocument ? (
                                            <img
                                                style={{
                                objectFit: 'cover',
                                objectPosition: 'top',
                              }}
                                                height={150}
                                                width={150}
                                                src={fetchedData.identityDocument}
                                                alt="img"
                                            />
                          ) : (
                            ''
                          )}
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                        display: 'flex',
                        gap: '10px',
                        flexDirection: 'column',
                      }}
                            >
                                <h3 style={{ fontWeight: 'normal' }}>
                                    {' '}
                                    {`${englishToNepaliNumber(
                          2,
                        )}. पूर्ण रूपलेे क्षति भएको वा आंंशिक क्षति भएता पनि बसोवास गर्न योग्य नरहेेको संंरचनाको फोटो`}
                                </h3>
                                <div
                                    style={{
                          display: 'flex',
                          gap: '5px',
                          alignItems: 'flex-start',
                        }}
                                >
                                    {/* <span style={{ fontSize: '20px' }}>फोटो:</span> */}
                                    <div
                                        style={{
                            display: 'flex',
                            gap: '20px',
                            flexWrap: 'wrap',
                          }}
                                    >
                                        {fetchedData.infrastructurePhoto.length
                            ? fetchedData.infrastructurePhoto.map(i => (
                                <img
                                    style={{
                                    objectFit: 'cover',
                                    objectPosition: 'top',
                                  }}
                                    height={150}
                                    width={150}
                                    src={i}
                                    alt="img"
                                />
                              ))
                            : ''}
                                    </div>
                                </div>
                            </div>
                            {fetchedData.applicationDocument ? (
                                <div
                                    style={{
                          display: 'flex',
                          gap: '10px',
                          flexDirection: 'column',
                        }}
                                >
                                    <h3 style={{ fontWeight: 'normal' }}>
                                        {' '}
                                        {`${englishToNepaliNumber(
                            3,
                          )}. घरमूली उपस्थित नभएको अवस्थामा, मञ्जुरीनामा सहितको निवेेदन`}
                                    </h3>
                                    <div
                                        style={{
                            display: 'flex',
                            gap: '5px',
                            alignItems: 'flex-start',
                          }}
                                    >
                                        {/* <span style={{ fontSize: '20px' }}>फोटो:</span> */}
                                        <div
                                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '5px',
                            }}
                                        >
                                            {fetchedData.applicationDocument ? (
                                                <img
                                                    style={{
                                  objectFit: 'cover',
                                  objectPosition: 'top',
                                }}
                                                    height={150}
                                                    width={150}
                                                    src={fetchedData.applicationDocument}
                                                    alt="img"
                                                />
                            ) : (
                              ''
                            )}
                                        </div>
                                    </div>
                                </div>
                    ) : (
                      ''
                    )}

                            <div
                                style={{
                        display: 'flex',
                        gap: '10px',
                        flexDirection: 'column',
                      }}
                            >
                                <h3
                                    style={{ fontWeight: 'normal' }}
                                >{`${englishToNepaliNumber(
                        fetchedData.applicationDocument ? 4 : 3,
                      )}. प्रहरीको मुचुल्का (प्रत्येेक घरधुरीको मुचुल्का नभएको अवस्थामा सामुहिक मुचुल्का पनि मान्य हुनेे)`}
                                </h3>
                                <div
                                    style={{
                          display: 'flex',
                          gap: '5px',
                          alignItems: 'flex-start',
                        }}
                                >
                                    {/* <span style={{ fontSize: '20px' }}>फोटो:</span> */}
                                    <div
                                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                          }}
                                    >
                                        {fetchedData.policeReport ? (
                                            <img
                                                style={{
                                objectFit: 'cover',
                                objectPosition: 'top',
                              }}
                                                height={150}
                                                width={150}
                                                src={fetchedData.policeReport}
                                                alt="img"
                                            />
                          ) : (
                            ''
                          )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className="ValidationErrors123">{validationError}</span>
                    <div className="saveOrAddButtons123">
                        <ReactToPrint
                            trigger={() => (
                                <button
                                    className="submitButtons123"
                                    onClick={handlePrint}
                                    type="submit"
                                >
                                    {loadPrint ? 'Printing...' : 'प्रिन्ट'}
                                </button>
                    )}
                            content={() => componentRef}
                            pageStyle={` @page {
                                                    size: A4;
                                                    margin: 1cm; /* You can adjust the margin values as needed */
                                                  }`}
                        />
                    </div>
                </div>
            )}
                  </div>
              </div>
          </div>
          <Footer />
      </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  createConnectedRequestCoordinator<ReduxProps>()(
    createRequestClient(requests)(TemporaryShelterPreview),
  ),
);
