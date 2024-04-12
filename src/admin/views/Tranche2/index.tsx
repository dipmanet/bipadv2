/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-indent */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable quotes */
/* eslint-disable arrow-parens */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
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
import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { navigate, useLocation } from "@reach/router";
import Navbar from "src/admin/components/Navbar";
import Footer from "src/admin/components/Footer";
import MenuCommon from "src/admin/components/MenuCommon";
import Modal from "src/admin/components/Modal";
import Select from "react-select";
import close from "#resources/icons/close.svg";
import Page from "#components/Page";
import nepalify from "nepalify";
import ReactToPrint from "react-to-print";
import SwitchToggle from "react-switch";
import {
  districtsSelector,
  municipalitiesSelector,
  wardsSelector,
  userSelector,
} from "#selectors";
import { SetEpidemicsPageAction } from "#actionCreators";
import ADToBS from '#utils/AdBSConverter/AdToBs';
import BSToAD from '#utils/AdBSConverter/BsToAd';
// import { ADToBS } from "bikram-sambat-js";
import {
  ClientAttributes,
  createConnectedRequestCoordinator,
  createRequestClient,
  methods,
} from "#request";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { englishToNepaliNumber } from "nepali-number";
import "nepali-datepicker-reactjs/dist/index.css";
import { getAuthState } from "#utils/session";
import axios from "axios";
import { PageType } from "#store/atom/page/types";
import { PropsFromDispatch } from "#views/IBF";
import { ReduxProps } from "#views/VizRisk/RatnaNagar/interfaces";
import { Params } from "@fortawesome/fontawesome-svg-core";
import Ideaicon from "../../resources/ideaicon.svg";
import ListSvg from "../../resources/list.svg";
import styles from "./styles.module.scss";

const mapStateToProps = (state, props) => ({
  districts: districtsSelector(state),
  municipalities: municipalitiesSelector(state),
  wards: wardsSelector(state),
  user: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
  setEpidemicsPage: (params) => dispatch(SetEpidemicsPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
  addEarthquakePostRequest: {
    url: "/temporary-shelter-enrollment-form/",
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
        const errorKey = Object.keys(error.response).find((i) => i === "ward");

        if (errorKey) {
          const errorList = error.response;
          errorList.location = errorList.ward;
          delete errorList.ward;

          params.setFaramErrors(errorList);
        } else {
          const data = error.response;
          const resultError = {};
          const keying = Object.keys(data);
          const valuing = Object.values(data).map((item) => item[0]);
          const outputError = () => {
            const outputFinalError = keying.map(
              (item, i) => (resultError[`${item}`] = valuing[i])
            );
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
          $internal: ["Some problem occurred"],
        });
      }
    },
    extras: { hasFile: true },
  },
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
        console.warn("failure", error);
      }
    },
    onFatal: ({ error, params }) => {
      console.warn("failure", error);
    },
  },
  getEarthquakeTranche2Response: {
    url: ({ params }) =>
      `/second-tranche-enrollment-form/?temp_shelter_entrollment_form=${params.id}`,
    method: methods.GET,
    onMount: false,
    onSuccess: ({ response, props, params }) => {
      params.fetchedData(response);
    },
    onFailure: ({ error, params }) => {
      if (params && params.setEpidemicsPage) {
        // TODO: handle error
        console.warn("failure", error);
      }
    },
    onFatal: ({ error, params }) => {
      console.warn("failure", error);
    },
  },
};

const Tranche2 = (props) => {
  const [added, setAdded] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [toggleSwitchChecked, setToggleSwitchChecked] = useState(false);
  const [keyLayout, setKeyLayout] = useState("romanized");
  const [appendedNepalifyAttributes, setAppendedNepalifyAttributes] = useState(
    []
  );
  const [data, setData] = useState({
    entry_date_bs: "",
    engineer_name: "",
    engineer_post: "",
    engineer_signed_date: "",
    ward_officer_name: "",
    ward_officer_signed_date: "",
    temp_shelter_entrollment_form: "",
    // temporary_shelter_photo: [],
    temporary_shelter_photo_front: "",
    temporary_shelter_photo_back: "",
    temporary_shelter_damaged_house: "",
    application_file: "",
    application_date: "",
  });

  const [errorFields, setErrorFields] = useState({
    entry_date_bs: false,
    engineer_name: false,
    engineer_post: false,
    engineer_signed_date: false,
    ward_officer_name: false,
    ward_officer_signed_date: false,
    temp_shelter_entrollment_form: false,
    temporary_shelter_damaged_house: false,
    // temporary_shelter_photo: false,
    temporary_shelter_photo_front: false,
    temporary_shelter_photo_back: false,
    application_date: false,
    application_file: false,
  });
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [fetchedTranche2Data, setFetchedTranche2Data] = useState(null);
  const [isApplicationClicked, setIsApplicationClicked] = useState(false);
  const { pathname } = useLocation();
  const fileInputRef = useRef(null);

  const [imageOrFileValidation, setImageOrFileValidation] = useState({
    temporary_shelter_photo_front: false,
    temporary_shelter_photo_back: false,
    application_file: false,
    temporary_shelter_damaged_house: false
  });
  const {
    user,
    districts,
    municipalities,
    wards,
    uri,
    requests: { addEarthquakePostRequest },
  } = props;
  let componentRef = useRef();
  const splittedRouteId = pathname.split("/");
  const routeId = splittedRouteId[splittedRouteId.length - 1];
  const handleFileInputChange = (e) => {
    setErrorFields({
      ...errorFields,
      [e.target.name]: false,
    });
    const file = e.target.files[0];
    const imageValidation = {

      temporary_shelter_photo_front: false,
      temporary_shelter_photo_back: false,
      application_file: false,
      temporary_shelter_damaged_house: false
    };
    const allowedExtensionsFile = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf)$/i;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (
      e.target.name === "temporary_shelter_damaged_house" &&
      !allowedExtensions.exec(file.name)
    ) {
      imageValidation.temporary_shelter_damaged_house = true;
      setImageOrFileValidation(imageValidation);
      return;
    }
    imageValidation.temporary_shelter_damaged_house = false;
    setImageOrFileValidation(imageValidation);
    if (
      e.target.name === "temporary_shelter_photo_front" &&
      !allowedExtensions.exec(file.name)
    ) {
      imageValidation.temporary_shelter_photo_front = true;
      setImageOrFileValidation(imageValidation);
      return;
    }
    imageValidation.temporary_shelter_photo_front = false;
    setImageOrFileValidation(imageValidation);
    if (
      e.target.name === "temporary_shelter_photo_back" &&
      !allowedExtensions.exec(file.name)
    ) {
      imageValidation.temporary_shelter_photo_back = true;
      setImageOrFileValidation(imageValidation);
      return;
    }
    if (
      e.target.name === "application_file" &&
      !allowedExtensionsFile.exec(file.name)
    ) {
      imageValidation.application_file = true;
      setImageOrFileValidation(imageValidation);
      return;
    }
    imageValidation.application_file = false;
    imageValidation.temporary_shelter_photo_back = false;
    setImageOrFileValidation(imageValidation);
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

  const handleChange = (
    checked: boolean | ((prevState: boolean) => boolean)
  ) => {
    if (checked) {
      setKeyLayout("romanized");
      //   const test = nepalify.interceptElementById(e.target.id, { layout: keyLayout, enabled: true });
      //   test.disabled();
    } else {
      setKeyLayout("traditional");
    }
    appendedNepalifyAttributes.map((i) => {
      const element = i.el;

      element.setAttribute("data-nepalify", "not inialized");

      i.disable();
      // i.target.setAttribute('data-nepalify', 'data-nepalify');
    });
    setToggleSwitchChecked(checked);
  };
  const handleUpdateSuccess = () => {
    setAdded(false);
    setUpdated(false);

    navigate(
      "/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table"
    );
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
    navigate(
      "/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table"
    );
  };
  const handleFormData = (e) => {
    setErrorFields({
      ...errorFields,
      [e.target.name]: false,
    });

    if (e.target.name === "beneficiary_district") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        beneficiary_municipality: null,
        beneficiary_ward: null,
      });
    } else if (e.target.name === "beneficiary_municipality") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        beneficiary_ward: null,
      });
    } else if (e.target.name === "temporary_shelter_land_district") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        temporary_shelter_land_municipality: null,
        temporary_shelter_land_ward: null,
      });
    } else if (e.target.name === "temporary_shelter_land_municipality") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        temporary_shelter_land_ward: null,
      });
    } else if (e.target.name === "beneficiary_representative_district") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        beneficiary_representative_municipality: null,
        beneficiary_representative_ward: null,
      });
    } else if (e.target.name === "beneficiary_representative_municipality") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        beneficiary_representative_ward: null,
      });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleInfrastructurePhoto = (e) => {
    setErrorFields({
      ...errorFields,
      [e.target.name]: false,
    });
    const file = e.target.files[0];
    setData({
      ...data,
      [e.target.name]: [...data.temporary_shelter_photo, file],
    });
  };
  const handleRemoveImage = (id) => {
    const filteredArray = data.temporary_shelter_photo.filter(
      (i, idx) => idx !== id
    );

    setData({ ...data, temporary_shelter_photo: filteredArray });
  };
  const handleSuccessMessage = (d) => {
    navigate(
      `/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${d.id}`
    );
  };
  const handleFetchedTranche2Data = (finalData) => {
    setFetchedTranche2Data(finalData.results);
    // setLoading(false);
  };
  const handleClick = () => {
    setBackendError(false);
    const errorCheckingFields = Object.keys(data);
    const latestErrorUpdate = errorFields;

    errorCheckingFields.map((i) => {
      if (!data[i]) {
        if (!isApplicationClicked) {
          latestErrorUpdate.application_date = false;
          latestErrorUpdate.application_file = false;
        }
        if (i === "temp_shelter_entrollment_form") {
          return (latestErrorUpdate[i] = false);
        }
        return (i === "application_file" || i === "application_date") &&
          !isApplicationClicked
          ? (latestErrorUpdate[i] = false)
          : (latestErrorUpdate[i] = true);
      }
      if (i === "temporary_shelter_photo") {
        if (data.temporary_shelter_photo.length === 0) {
          return (latestErrorUpdate[i] = true);
        }
      }
      latestErrorUpdate[i] = false;
      return null;
    });

    setErrorFields({ ...latestErrorUpdate });
    if (Object.values(latestErrorUpdate).filter((i) => i === true).length) {
      return;
    }
    setLoading(true);
    const finalUpdateData = data;
    finalUpdateData.temp_shelter_entrollment_form = routeId;
    const finalFormData = new FormData();
    finalFormData.append("entry_date_bs", finalUpdateData.entry_date_bs);
    finalFormData.append("engineer_name", finalUpdateData.engineer_name);
    finalFormData.append("engineer_post", finalUpdateData.engineer_post);
    finalFormData.append(
      "engineer_signed_date",
      finalUpdateData.engineer_signed_date
    );
    finalFormData.append(
      "ward_officer_name",
      finalUpdateData.ward_officer_name
    );
    finalFormData.append(
      "ward_officer_signed_date",
      finalUpdateData.ward_officer_signed_date
    );
    finalFormData.append(
      "temp_shelter_entrollment_form",
      finalUpdateData.temp_shelter_entrollment_form
    );
    finalFormData.append(
      "temporary_shelter_photo_front",
      finalUpdateData.temporary_shelter_photo_front
    );
    finalFormData.append(
      "temporary_shelter_photo_back",
      finalUpdateData.temporary_shelter_photo_back
    );
    finalFormData.append(
      "temporary_shelter_damaged_house",
      finalUpdateData.temporary_shelter_damaged_house
    );
    finalFormData.append("application_date", finalUpdateData.application_date);
    finalFormData.append("application_file", finalUpdateData.application_file);

    // finalUpdateData.temporary_shelter_photo.length
    //     ? finalUpdateData.temporary_shelter_photo.map(i => finalFormData.append('temporary_shelter_photo', i, i.name))
    //     : null;
    const checkCSRFToken = getAuthState();
    const baseUrl = process.env.REACT_APP_API_SERVER_URL;
    axios
      .post(`${baseUrl}/second-tranche-enrollment-form/`, finalFormData, {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": checkCSRFToken.csrftoken,
      })
      .then((res) => {
        props.requests.getEarthquakeTranche2Response.do({
          id: routeId,
          fetchedData: handleFetchedTranche2Data,
        });
        setLoading(false);
      })
      .catch((error) => {
        setBackendError(true);
        setLoading(false);
      });

    // addEarthquakePostRequest.do({
    //     body: finalUpdateData,
    //     onSuccess: datas => handleSuccessMessage(datas),
    //     setFaramErrors: (err) => {
    //         setBackendError(true);
    //         setLoading(false);
    //     },

    // });
    // return errorCheck;
  };

  // Function to handle checkbox change
  useEffect(() => {
    // setLoading(true);
    props.requests.getEarthquakeTranche2Response.do({
      id: routeId,
      fetchedData: handleFetchedTranche2Data,
    });
  }, []);
  const nepaliInput = (e: {
    target: {
      getAttribute: (arg0: string) => any;
      id: any;
      setAttribute: (arg0: string, arg1: string) => void;
    };
  }) => {
    const isNepalifyEnabled = e.target.getAttribute("data-nepalify");

    if (isNepalifyEnabled === "not inialized") {
      const attribute = nepalify.interceptElementById(e.target.id, {
        layout: keyLayout,
        enabled: true,
      });
      const finalAttributes = appendedNepalifyAttributes.filter(
        (i) => i.el.id !== e.target.id
      );
      setAppendedNepalifyAttributes([...finalAttributes, attribute]);

      e.target.setAttribute("data-nepalify", "inialized");
    }
  };
  useEffect(() => {
    const curDate = new Date();
    const day = curDate.getDate() > 9 ? curDate.getDate() : `0${curDate.getDate()}`;
    const month = curDate.getMonth() + 1 > 9 ? curDate.getMonth() + 1 : `0${curDate.getMonth() + 1}`;
    const year = curDate.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    const currentDate = ADToBS(`${year}-${month}-${day}`);

    setData({
      ...data,
      entry_date_bs: currentDate,
      engineer_signed_date: currentDate,
      ward_officer_signed_date: currentDate,
      application_date: currentDate,
    });
  }, []);
  const handleFetchedData = (finalData) => {
    setFetchedData(finalData);
    // setLoading(false);
  };

  useEffect(() => {
    const splittedRoute = pathname.split("/");
    const id = splittedRoute[splittedRoute.length - 1];
    if (id) {
      props.requests.getEarthquakeRequest.do({
        id,
        fetchedData: handleFetchedData,
      });
    }
  }, [pathname, fetchedTranche2Data]);

  const districtNameConverter = (id) => {
    const finalData = id && districts.find((i) => i.id === Number(id)).title_ne;

    return finalData || "-";
  };

  const municipalityNameConverter = (id) => {
    // const finalData = fetchedData && municipalities.find(i => i.id === id).title_ne;
    const finalData = id && municipalities.find((i) => i.id === Number(id));
    if (finalData && finalData.type === "Rural Municipality") {
      const municipality = `${finalData.title_ne} गाउँपालिका`;
      return municipality;
    }
    if (finalData && finalData.type === "Submetropolitan City") {
      const municipality = `${finalData.title_ne} उप-महानगरपालिका`;
      return municipality;
    }
    if (finalData && finalData.type === "Metropolitan City") {
      const municipality = `${finalData.title_ne} महानगरपालिका`;
      return municipality;
    }
    if (finalData) {
      return `${finalData.title_ne} नगरपालिका`;
    }
    return "-";
  };

  const wardNameConverter = (id) => {
    const finalData = id && wards.find((i) => i.id === Number(id)).title;
    return finalData || "-";
  };

  const dateFormatter = (date) => {
    const slicedDate = date.split("-");
    const year = englishToNepaliNumber(slicedDate[0]);
    const month = englishToNepaliNumber(slicedDate[1]);
    const day = englishToNepaliNumber(slicedDate[2]);
    const finalDate = `${year}/${month}/${day}`;
    return finalDate;
  };
  useEffect(() => {
    if (fetchedData && !fetchedData.firstTrancheEnrollmentUpload) {
      navigate(
        `/admin/temporary-shelter-enrollment-form/add-view-tranche1/${routeId}`
      );
    }
  }, [fetchedData]);

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
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "10px 20px",
            }}
          >
            <div
              className="reporting123"
              style={{ cursor: "pointer" }}
              role="button"
              onClick={() =>
                navigate(
                  `/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${routeId}`
                )
              }
            >
              <img className="listSvg123" src={ListSvg} alt="" />
              <p className="reportingText123">पहिलो किस्ता फारम</p>
              <p className="grayCircle123" />
            </div>
            <div
              className="reporting123"
              style={{ cursor: "pointer" }}
              role="button"
              onClick={() =>
                navigate(
                  `/admin/temporary-shelter-enrollment-form/add-view-tranche1/${routeId}`
                )
              }
            >
              <img className="listSvg123" src={ListSvg} alt="" />
              <p className="reportingText123">पहिलो किस्ता फारम अपलोड</p>
              <p className="grayCircle123" />
            </div>
            <div className="reporting123" style={{ cursor: "pointer" }}>
              <img className="listSvg123" src={ListSvg} alt="" />
              <p className="reportingText123">दोस्रो किस्ता फारम</p>
              <p className="greenCircle123" />
            </div>
            <div
              className="reporting123"
              style={{ cursor: "pointer" }}
              role="button"
              onClick={() => {
                if (fetchedData.secondTrancheEnrollmentForm) {
                  navigate(
                    `/admin/temporary-shelter-enrollment-form/add-tranche2-file-upload/${routeId}`
                  );
                }
              }}
            >
              <img className="listSvg123" src={ListSvg} alt="" />
              <p className="reportingText123">दोस्रो किस्ता फारम अपलोड</p>
              <p className="grayCircle123" />
            </div>
          </div>

          <div className={styles.mainForm}>
            <div className={styles.generalInfoAndTableButton}>
              <h1 className={styles.generalInfo}>दोस्रो किस्ता फारम</h1>
              <button
                className={styles.viewDataTable}
                type="button"
                onClick={handleTableButton}
              >
                डाटा तालिका हेर्नुहोस्
              </button>
            </div>
            {/* <div className={styles.shortGeneralInfo}>
                            <img className={styles.ideaIcon} src={Ideaicon} alt="" />
                            <p className={styles.ideaPara}>
                                अस्थायी आश्रय नामांकन फारममा भूकम्प प्रभावित क्षेत्रको विवरण र घरको विवरण समावेश हुन्छ।

                            </p>
                        </div> */}
            {/* <AdditionForm /> */}

            {fetchedData ? (
              fetchedData &&
              fetchedTranche2Data &&
              fetchedTranche2Data.length &&
              fetchedTranche2Data.length !== 0 ? (
                <div
                  style={{
                    width: "8.3in",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    padding: "15px 0px",
                  }}
                >
                  <div
                    className="mainDataEntrySection123"
                    ref={(el) => (componentRef = el)}
                  >
                    <div className="formGeneralInfo123">
                      <h2>अनुुसूूची ४</h2>
                      <h2>दफा ४ को उपदफा(२) सँँग सम्बन्धित</h2>
                      <h2 style={{ textDecoration: "underline" }}>
                        भूूकम्प प्रभावितको अस्थायी आवासको दोस्रो किस्ता पाउन
                        गरेेको निवेेदन
                      </h2>
                    </div>
                    <div
                      className="datePickerForm123"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        fontSize: "16px",
                      }}
                    >
                      <span>{`मितिः ${dateFormatter(
                        fetchedTranche2Data[0].entryDateBs
                      )}`}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: "16px",
                        lineHeight: "30px",
                      }}
                    >
                      <span>श्रीमान प्रमुुख प्रशासकीय अधिकृृतज्यूू,</span>
                      <span>
                        {fetchedData &&
                          municipalityNameConverter(
                            fetchedData.operatingMunicipality
                          )}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "16px",
                        lineHeight: "30px",
                      }}
                    >
                      <span>
                        विषयः भूूकम्प प्रभावितको अस्थायी आवासको दोस्रो किस्ता
                        पाऊँँ ।
                      </span>
                    </div>
                    <div className="countData123">
                      <div className="countDataIndividual123">
                        <span>{`लाभग्राही क्रम संंख्याः ${englishToNepaliNumber(
                          fetchedData.id
                        )}`}</span>
                      </div>
                      <div className="countDataIndividual123">
                        <span>{`सम्झौता क्रमााङ्क संंख्याः ${
                          englishToNepaliNumber(fetchedData.paNumber) || "-"
                        }`}</span>
                      </div>
                    </div>
                    <div className="formDetails123">
                      <p style={{ margin: 0 }}>
                        {`भूूकम्प प्रभावितको अस्थायी आवास निर्माणका लाागि ${districtNameConverter(
                          fetchedData.beneficiaryDistrict
                        )} जिल्ला
                                                             ${municipalityNameConverter(
                                                               fetchedData.beneficiaryMunicipality
                                                             )}  वडा नंं. ${englishToNepaliNumber(
                          wardNameConverter(fetchedData.beneficiaryWard)
                        )}
                                                              गाउँँ/टोल ${
                                                                fetchedData.toleName
                                                              } बस्नेे श्री ${
                          fetchedData.grandParentName
                        } को ${fetchedData.grandChildRelation} श्री ${
                          fetchedData.parentName
                        }
                                                              को ${
                                                                fetchedData.childRelation
                                                              } बर्ष ${englishToNepaliNumber(
                          fetchedData.beneficiaryAge
                        )}  को म र यस पालिका बीच
                                                                 `}
                        मिति {dateFormatter(fetchedData.entryDateBs)} मा भएको
                        अस्थायी आवास निर्मााण सम्झौता बमोजिम प्रथम किस्ता रकमबाट
                        आवास निर्मााण भइरहेेको/सम्पन्न भएकोलेे सो को फोटो यसैै
                        साथ संंलग्न गरी दोस्रो किस्ता भुक्तानी पाउनको लागि
                        निवेेदन पेेश गरेेको छुु ।
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "20px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            textAlign: "center",
                            fontSize: "16px",
                            lineHeight: "30px",
                          }}
                        >
                          <span>निवेेदक</span>
                          <span>
                            ......................................................................
                          </span>
                          <span>(नाम र सहीछाप)</span>
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            lineHeight: "30px",
                            marginTop: "20px",
                            fontWeight: "bold",
                          }}
                        >
                          <span>
                            नोटः अस्थायी आवासको दुुई तर्फका मोहोडाको फोटो यसैै
                            निवेेदनका साथ संंलग्न गर्नेे ।
                          </span>
                        </div>
                      </div>
                      <div>
                        <table>
                          <tr style={{ background: "none" }}>
                            <th
                              style={{
                                border: "1px solid black",
                                borderCollapse: "collapse",
                                textAlign: "center",
                              }}
                            >
                              दायाँँ
                            </th>
                            <th
                              style={{
                                border: "1px solid black",
                                borderCollapse: "collapse",
                                textAlign: "center",
                              }}
                            >
                              बायाँँ
                            </th>
                          </tr>
                          <tr style={{ background: "none" }}>
                            <td
                              style={{
                                border: "1px solid black",
                                borderCollapse: "collapse",
                                textAlign: "center",
                                width: "200px",
                                height: "140px",
                              }}
                            />
                            <td
                              style={{
                                border: "1px solid black",
                                borderCollapse: "collapse",
                                textAlign: "center",
                                width: "200px",
                                height: "140px",
                              }}
                            />
                          </tr>
                        </table>
                      </div>
                    </div>
                    <div className={styles.mainTempAddress}>
                      <h2
                        style={{
                          textDecoration: "underline",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        दोस्रो किस्ता भुक्तानी सिफारिस
                      </h2>
                      <div
                        className="formDetails123"
                        style={{ fontSize: "16px", lineHeight: "30px" }}
                      >
                        <p style={{ margin: 0 }}>
                          {`भूूकम्प प्रभावितको अस्थायी आवास निर्मााणका लाागि लाभग्राही श्री ${
                            fetchedData.beneficiaryNameNepali
                          }लेे दोसरो किस्ता भुक्तानीको
                                                लाागि निवेेदन पेेश गरेेकोलेे अस्थायी आवासको प्राविधिकको स्थलगत निरीक्षणबाट भूूकम्प प्रभावित घरपरिवारलाई अस्थायी
                                                आवास निर्मााण अनुुदान कार्यविधि, २०८० तथा मिति ${dateFormatter(
                                                  fetchedData.entryDateBs
                                                )} `}
                          मा भएको सम्झौता बमोजिम नैै अस्थायी आवास निमाण
                          भइरहेेको/समपन्न भएको देेखिएको हुँँदा निजलाई दोस्रो
                          किस्ता भुक्तानी दिन उपयुुक्त छ भनी सिफाारिस गर्दछौंं।
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          fontSize: "20px",
                          lineHeight: "40px",
                        }}
                      >
                        <h2
                          style={{
                            textDecoration: "underline",
                            textAlign: "center",
                            fontSize: "20px",
                            lineHeight: "30px",
                            fontWeight: "bold",
                          }}
                        >
                          प्राविधिक/इन्जिनियर
                        </h2>
                        <div
                          className={styles.freeText}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <span>{`नाम: ${fetchedTranche2Data[0].engineerName}`}</span>
                        </div>
                        <div
                          className={styles.freeText}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <span>हस्ताक्षरः....................</span>
                        </div>
                        <div
                          className={styles.freeText}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <span>{`पदः ${fetchedTranche2Data[0].engineerPost}`}</span>
                        </div>
                        <div
                          style={{
                            width: "fit-content",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span>{`मितिः ${dateFormatter(
                            fetchedTranche2Data[0].engineerSignedDate
                          )}`}</span>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          fontSize: "20px",
                          lineHeight: "40px",
                        }}
                      >
                        <h2
                          style={{
                            textDecoration: "underline",
                            textAlign: "center",
                            fontSize: "20px",
                            lineHeight: "30px",
                            fontWeight: "bold",
                          }}
                        >
                          वडा अध्यक्ष
                        </h2>
                        <div
                          className={styles.freeText}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <span>{`नाम: ${fetchedTranche2Data[0].wardOfficerName}`}</span>
                        </div>
                        <div
                          className={styles.freeText}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <span>हस्ताक्षरः...................</span>
                        </div>

                        <div
                          style={{
                            width: "fit-content",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span>{`मितिः ${dateFormatter(
                            fetchedTranche2Data[0].wardOfficerSignedDate
                          )}`}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexDirection: "column",
                        pageBreakBefore: "always",
                      }}
                    >
                      <h3>भत्किएको घरको फोटो</h3>
                      <div style={{ display: "flex", gap: "60px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "flex-start",
                            flexDirection: "column",
                          }}
                        >

                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              flexWrap: "wrap",
                            }}
                          >
                            <img
                              style={{
                                objectFit: "cover",
                                objectPosition: "top",
                              }}
                              height={150}
                              width={150}
                              src={
                                fetchedTranche2Data[0]
                                  .temporaryShelterDamagedHouse
                              }
                              alt="img"
                            />
                          </div>
                        </div>

                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexDirection: "column",
                        pageBreakBefore: "always",
                      }}
                    >
                      <h3>अस्थायी आवासको दुुई तर्फका मोहोडाको फोटो</h3>
                      <div style={{ display: "flex", gap: "60px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "flex-start",
                            flexDirection: "column",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>
                            पहिलो मोहोडाको फोटो
                          </span>
                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              flexWrap: "wrap",
                            }}
                          >
                            <img
                              style={{
                                objectFit: "cover",
                                objectPosition: "top",
                              }}
                              height={150}
                              width={150}
                              src={
                                fetchedTranche2Data[0]
                                  .temporaryShelterPhotoFront
                              }
                              alt="img"
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "flex-start",
                            flexDirection: "column",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>
                            दोस्रो मोहोडाको फोटो
                          </span>
                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              flexWrap: "wrap",
                            }}
                          >
                            <img
                              style={{
                                objectFit: "cover",
                                objectPosition: "top",
                              }}
                              height={150}
                              width={150}
                              src={
                                fetchedTranche2Data[0].temporaryShelterPhotoBack
                              }
                              alt="img"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {Object.values(errorFields).filter((i) => i === true)
                      .length ? (
                      <span className={styles.ValidationErrors}>
                        रातो रङले संकेत गरेको माथिको फारममा केही फिल्ड भर्न
                        बाँकी छ, कृपया फारम पूरा गर्नुहोस् र पुन: प्रयास
                        गर्नुहोस्
                      </span>
                    ) : (
                      ""
                    )}
                    {backendError ? (
                      <span className={styles.ValidationErrors}>
                        तपाईंको इन्टरनेट वा सर्भरमा समस्या छ कृपया पुन: प्रयास
                        गर्नुहोस्
                      </span>
                    ) : (
                      ""
                    )}
                    {/* <span className={styles.ValidationErrors}>{validationError}</span> */}
                    {/* <div className={styles.saveOrAddButtons}>
                                                        <button className={styles.submitButtons} onClick={handleClick} type="submit" disabled={!!loading}>{loading ? 'पेश गरिँदै छ...' : 'पेश गर्नुहोस्'}</button>
                                                    </div> */}
                  </div>
                  <div className="saveOrAddButtons123">
                    <ReactToPrint
                      trigger={() => (
                        <button className="submitButtons123" type="submit">
                          {"प्रिन्ट"}
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
              ) : (
                <>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span>परम्परागत</span>
                    <SwitchToggle
                      checked={toggleSwitchChecked}
                      onChange={handleChange}
                      offColor="#86d3ff"
                      onColor="#86d3ff"
                      onHandleColor="#2693e6"
                      offHandleColor="#2693e6"
                      handleDiameter={30}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      height={20}
                      width={48}
                      className="react-switch"
                      id="material-switch"
                    />
                    <span>रोमनीकृत</span>
                  </label>

                  <div className={styles.mainDataEntrySection}>
                    <div className={styles.formGeneralInfo}>
                      <h1>अनुुसूूची ४</h1>
                      <h1>दफा ४(२) सँँग सम्बन्धित</h1>
                      <h1 style={{ textDecoration: "underline" }}>
                        भूूकम्प प्रभावितको अस्थायी आवासको दोस्रो किस्ता पाउन
                        गरेेको निवेेदन
                      </h1>
                    </div>
                    <div>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "flex-start",
                            fontSize: "20px",
                          }}
                        >
                          <span style={{ textDecoration: "underline" }}>
                            आवेदन उपलब्ध छ ?
                          </span>

                          <input
                            style={{ cursor: "pointer", marginTop: "7px" }}
                            type="checkbox"
                            checked={isApplicationClicked}
                            onChange={() =>
                              setIsApplicationClicked(!isApplicationClicked)
                            }
                          />
                        </div>
                        {isApplicationClicked ? (
                          <div style={{ display: "flex" }}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                flex: 2,
                                fontSize: "20px",
                                alignItems: "flex-start",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <span style={{ color: "red" }}>*</span>
                                <span>आवेदनको फोटो वा pdf:</span>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "5px",
                                }}
                              >
                                <input
                                  type="file"
                                  accept=".pdf, image/*"
                                  id="file-input"
                                  // style={{ display: 'none' }}
                                  onChange={handleFileInputChange}
                                  name="application_file"
                                />
                                {errorFields.application_file ? (
                                  <p style={{ margin: "0", color: "red" }}>
                                    कृपया कागजात अपलोड गर्नुहोस्
                                  </p>
                                ) : (
                                  ""
                                )}
                                {data.application_file ? (
                                  <img
                                    height={100}
                                    width={100}
                                    src={handleShowImage(data.application_file)}
                                    alt="img"
                                  />
                                ) : (
                                  ""
                                )}
                                {imageOrFileValidation.application_file ? (
                                  <p style={{ margin: "0", color: "red" }}>
                                    कागजात फोटो वा pdf हुनुपर्छ
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            <div
                              className={styles.datePickerForm}
                              style={{
                                display: "flex",
                                justifyContent: "start",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                flex: 1,
                              }}
                            >
                              <span>आवेदनको मितिः</span>

                              <NepaliDatePicker
                                inputClassName="form-control"
                                // className={styles.datePick}
                                // value={ADToBS(dateAlt)}
                                value={data.application_date}
                                onChange={(value: string) => {
                                  setData({
                                    ...data,
                                    application_date: value,
                                  });
                                }}
                                options={{
                                  calenderLocale: "ne",
                                  valueLocale: "en",
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div
                      className={styles.datePickerForm}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        width: "20%",
                      }}
                    >
                      <span>मितिः</span>
                      <NepaliDatePicker
                        inputClassName="form-control"
                        value={data.entry_date_bs}
                        onChange={(value: string) => {
                          setData({
                            ...data,
                            entry_date_bs: value,
                            ward_officer_signed_date: value,
                            engineer_signed_date: value
                          });
                        }}
                        options={{
                          calenderLocale: "ne",
                          valueLocale: "en",
                        }}
                      />
                    </div>
                    <div
                      style={{ display: "flex", gap: "20px", fontSize: "20px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <span style={{ color: "red" }}>*</span>
                          <span>प्राविधिक/इन्जिनियरको नाम</span>
                        </div>
                        <input
                          type="text"
                          onBlur={handleFormData}
                          // onChange={handleFormData}
                          onFocus={nepaliInput}
                          data-nepalify={"not inialized"}
                          id="engineer_name"
                          name="engineer_name"
                          // value={data.engineer_name}
                          style={
                            errorFields.engineer_name
                              ? {
                                  borderBottom: "2px dotted red",
                                  height: "34px",
                                  background: "white",
                                }
                              : {
                                  height: "34px",
                                  background: "white",
                                  border: "1px solid black",
                                }
                          }
                          className={styles.inputClassName}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <span style={{ color: "red" }}>*</span>
                          <span>पदः</span>
                        </div>

                        <input
                          type="text"
                          onBlur={handleFormData}
                          onFocus={nepaliInput}
                          data-nepalify={"not inialized"}
                          id="engineer_post"
                          name="engineer_post"
                          // value={data.engineer_post}
                          style={
                            errorFields.engineer_post
                              ? {
                                  borderBottom: "2px dotted red",
                                  height: "34px",
                                  background: "white",
                                }
                              : {
                                  height: "34px",
                                  background: "white",
                                  border: "1px solid black",
                                }
                          }
                          className={styles.inputClassName}
                        />
                      </div>
                      <div
                        style={{
                          width: "fit-content",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: "4px",
                        }}
                      >
                        <span>मितिः</span>
                        <NepaliDatePicker
                          inputClassName="form-control"
                          value={data.engineer_signed_date}
                          onChange={(value: string) => {
                            setData({
                              ...data,
                              engineer_signed_date: value,
                            });
                          }}
                          options={{
                            calenderLocale: "ne",
                            valueLocale: "en",
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", gap: "20px", fontSize: "20px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <span style={{ color: "red" }}>*</span>
                          <span>वडा अध्यक्षको नाम</span>
                        </div>

                        <input
                          type="text"
                          onBlur={handleFormData}
                          onFocus={nepaliInput}
                          data-nepalify={"not inialized"}
                          id="ward_officer_name"
                          name="ward_officer_name"
                          // value={data.ward_officer_name}
                          style={
                            errorFields.ward_officer_name
                              ? {
                                  borderBottom: "2px dotted red",
                                  height: "34px",
                                  background: "white",
                                }
                              : {
                                  height: "34px",
                                  background: "white",
                                  border: "1px solid black",
                                }
                          }
                          className={styles.inputClassName}
                        />
                      </div>
                      <div
                        style={{
                          width: "fit-content",
                          display: "flex",
                          alignItems: "flex-start",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <span>मितिः</span>
                        <NepaliDatePicker
                          inputClassName="form-control"
                          value={data.ward_officer_signed_date}
                          onChange={(value: string) => {
                            setData({
                              ...data,
                              ward_officer_signed_date: value,
                            });
                          }}
                          options={{
                            calenderLocale: "ne",
                            valueLocale: "en",
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        margin: "10px 0px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <h2>
                        {" "}
                        {`${englishToNepaliNumber(
                          1
                        )}. भत्किएको घर`}
                      </h2>
                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <span style={{ color: "red" }}>*</span>
                            <span style={{ fontSize: "20px" }}>
                               फोटो:
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "5px",
                            }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              id="file-input"
                              // style={{ display: 'none' }}
                              onChange={handleFileInputChange}
                              name="temporary_shelter_damaged_house"
                              ref={fileInputRef}
                            />

                            {errorFields.temporary_shelter_damaged_house ? (
                              <p style={{ margin: 0, color: "red" }}>
                                कृपया फोटो अपलोड गर्नुहोस्
                              </p>
                            ) : (
                              ""
                            )}
                            {data.temporary_shelter_damaged_house ? (
                              <div style={{ display: "flex" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                  }}
                                >
                                  <img
                                    height={100}
                                    width={100}
                                    src={handleShowImage(
                                      data.temporary_shelter_damaged_house
                                    )}
                                    alt="img"
                                  />
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {imageOrFileValidation.temporary_shelter_damaged_house ? (
                              <p style={{ margin: 0, color: "red" }}>
                                भत्किएको घरको फोटो Jpg,jpeg वा png हुनुपर्छ
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                    <div
                      style={{
                        margin: "10px 0px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <h2>
                        {" "}
                        {`${englishToNepaliNumber(
                          2
                        )}. अस्थायी आवासको दुुई तर्फका मोहोडाको फोटो`}
                      </h2>
                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <span style={{ color: "red" }}>*</span>
                            <span style={{ fontSize: "20px" }}>
                              पहिलो मोहोडाको फोटो:
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "5px",
                            }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              id="file-input"
                              // style={{ display: 'none' }}
                              onChange={handleFileInputChange}
                              name="temporary_shelter_photo_front"
                              ref={fileInputRef}
                            />

                            {errorFields.temporary_shelter_photo_front ? (
                              <p style={{ margin: 0, color: "red" }}>
                                कृपया फोटो अपलोड गर्नुहोस्
                              </p>
                            ) : (
                              ""
                            )}
                            {data.temporary_shelter_photo_front ? (
                              <div style={{ display: "flex" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                  }}
                                >
                                  <img
                                    height={100}
                                    width={100}
                                    src={handleShowImage(
                                      data.temporary_shelter_photo_front
                                    )}
                                    alt="img"
                                  />
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {imageOrFileValidation.temporary_shelter_photo_front ? (
                              <p style={{ margin: 0, color: "red" }}>
                                पहिलो मोहोडाको फोटो Jpg,jpeg वा png हुनुपर्छ
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <span style={{ color: "red" }}>*</span>
                            <span style={{ fontSize: "20px" }}>
                              दोस्रो मोहोडाको फोटो:
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "5px",
                            }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              id="file-input"
                              // style={{ display: 'none' }}
                              onChange={handleFileInputChange}
                              name="temporary_shelter_photo_back"
                              ref={fileInputRef}
                            />

                            {errorFields.temporary_shelter_photo_back ? (
                              <p style={{ margin: 0, color: "red" }}>
                                कृपया फोटो अपलोड गर्नुहोस्
                              </p>
                            ) : (
                              ""
                            )}
                            {data.temporary_shelter_photo_back ? (
                              <div style={{ display: "flex" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                  }}
                                >
                                  <img
                                    height={100}
                                    width={100}
                                    src={handleShowImage(
                                      data.temporary_shelter_photo_back
                                    )}
                                    alt="img"
                                  />
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {imageOrFileValidation.temporary_shelter_photo_back ? (
                              <p style={{ margin: 0, color: "red" }}>
                                दोस्रो मोहोडाको फोटो Jpg,jpeg वा png हुनुपर्छ
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {Object.values(errorFields).filter((i) => i === true)
                      .length ? (
                      <span className={styles.ValidationErrors}>
                        रातो रङले संकेत गरेको माथिको फारममा केही फिल्ड भर्न
                        बाँकी छ, कृपया फारम पूरा गर्नुहोस् र पुन: प्रयास
                        गर्नुहोस्
                      </span>
                    ) : (
                      ""
                    )}
                    {backendError ? (
                      <span className={styles.ValidationErrors}>
                        तपाईंको इन्टरनेट वा सर्भरमा समस्या छ कृपया पुन: प्रयास
                        गर्नुहोस्
                      </span>
                    ) : (
                      ""
                    )}
                    {/* <span className={styles.ValidationErrors}>{validationError}</span> */}
                    <div className={styles.saveOrAddButtons}>
                      <button
                        className={styles.submitButtons}
                        onClick={handleClick}
                        type="submit"
                        disabled={!!loading}
                      >
                        {loading ? "पेश गरिँदै छ..." : "पेश गर्नुहोस्"}
                      </button>
                    </div>
                  </div>
                </>
              )
            ) : (
              <p>Loading...</p>
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
  mapDispatchToProps
)(
  createConnectedRequestCoordinator<ReduxProps>()(
    createRequestClient(requests)(Tranche2)
  )
);
