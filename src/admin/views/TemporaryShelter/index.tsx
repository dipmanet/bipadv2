/* eslint-disable @typescript-eslint/member-delimiter-style */

/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react/jsx-one-expression-per-line */

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/camelcase */

import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { navigate } from "@reach/router";
import Navbar from "src/admin/components/Navbar";
import Footer from "src/admin/components/Footer";
import MenuCommon from "src/admin/components/MenuCommon";
import Modal from "src/admin/components/Modal";
import Select from "react-select";
import Page from "#components/Page";
import { districtsSelector, municipalitiesSelector, wardsSelector, userSelector } from "#selectors";
import { SetEpidemicsPageAction } from "#actionCreators";
import ADToBS from "#utils/AdBSConverter/AdToBs";
import BSToAD from "#utils/AdBSConverter/BsToAd";
// import { ADToBS } from "bikram-sambat-js";
import {
	ClientAttributes,
	createConnectedRequestCoordinator,
	createRequestClient,
	methods,
} from "#request";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { englishToNepaliNumber, nepaliToEnglishNumber } from "nepali-number";
import "nepali-datepicker-reactjs/dist/index.css";
import close from "#resources/icons/close.svg";
import axios from "axios";
import { getAuthState } from "#utils/session";
import SwitchToggle from "react-switch";
import nepalify from "nepalify";
import { PageType } from "#store/atom/page/types";
import { PropsFromDispatch } from "#views/IBF";
import { ReduxProps } from "#views/VizRisk/RatnaNagar/interfaces";
import { Params } from "@fortawesome/fontawesome-svg-core";
import { AppState } from "#types";
import { ReactI18NextChild } from "react-i18next";
import styles from "./styles.module.scss";
import ListSvg from "../../resources/list.svg";
import Ideaicon from "../../resources/ideaicon.svg";

const mapStateToProps = (state: AppState, props: any) => ({
	districts: districtsSelector(state),
	municipalities: municipalitiesSelector(state),
	wards: wardsSelector(state),
	user: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setEpidemicsPage: (params: any) => dispatch(SetEpidemicsPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	addEarthquakePostRequest: {
		url: "/temporary-shelter-enrollment-form/",
		method: methods.POST,
		query: { meta: true },
		onMount: false,
		body: ({ params: { body } = { body: {} } }) => body,
		onSuccess: ({ params: { onSuccess } = { onSuccess: undefined }, response }) => {
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
						const outputFinalError = keying.map((item, i) => (resultError[`${item}`] = valuing[i]));
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
};
const checkCSRFToken = getAuthState();

const TemporaryShelter = (props: {
	user: any;
	districts: any;
	municipalities: any;
	wards: any;
	uri: any;
	requests: { addEarthquakePostRequest: any };
}) => {
	const [added, setAdded] = useState(false);
	const [updated, setUpdated] = useState(false);
	const [fetchIncident, setFetchIncident] = useState([]);
	const [data, setData] = useState({
		entry_date_bs: "",
		pa_number: "",
		tole_name: "",
		registration_number: "",
		grand_parent_title: "श्री",
		grand_parent_name: "",
		grand_child_relation: "",
		parent_title: "श्री",
		parent_name: "",
		child_relation: "",
		beneficiary_age: "",
		beneficiary_name_nepali: "",
		temporary_shelter_land_tole: "",
		beneficiary_name_english: "",
		beneficiary_citizenship_number: "",
		beneficiary_contact_number: "",
		beneficiary_photo: "",
		is_beneficiary_available_to_sign: false,
		beneficiary_representative_name_nepali: "",
		beneficiary_representative_citizenship_number: "",
		beneficiary_representative_grandfather_name: "",
		beneficiary_representative_parent_name: "",
		bank_account_holder_name: "",
		bank_account_number: "",
		bank_name: "",
		bank_branch_name: "",
		migration_certificate_number: "",
		migration_date_bs: "",
		signed_date: "",
		withness_name_nepali: "",
		withness_relation: "",
		withness_contact_number: "",
		operating_municipality_officer_name: "",
		operating_municipality_signed_date: "",
		identity_document: "",
		infrastructure_photo: [],
		application_document: "",
		police_report: "",
		beneficiary_district: "",
		beneficiary_municipality: "",
		beneficiary_ward: "",
		temporary_shelter_land_district: "",
		temporary_shelter_land_municipality: "",
		temporary_shelter_land_ward: "",
		beneficiary_representative_district: "",
		beneficiary_representative_municipality: "",
		beneficiary_representative_ward: "",
		operating_municipality: "",
		application_file: "",
		application_date: "",
		event: "",
	});

	const [errorFields, setErrorFields] = useState({
		application_date: false,
		application_file: false,
		entry_date_bs: false,
		pa_number: false,
		registration_number: false,
		tole_name: false,
		event: false,
		grand_parent_title: false,
		grand_parent_name: false,
		grand_child_relation: false,
		parent_title: false,
		parent_name: false,
		child_relation: false,
		beneficiary_age: false,
		beneficiary_name_nepali: false,
		temporary_shelter_land_tole: false,
		beneficiary_name_english: false,
		beneficiary_citizenship_number: false,
		beneficiary_contact_number: false,
		beneficiary_photo: false,
		is_beneficiary_available_to_sign: false,
		beneficiary_representative_name_nepali: false,
		beneficiary_representative_citizenship_number: false,
		beneficiary_representative_grandfather_name: false,
		beneficiary_representative_parent_name: false,
		beneficiary_representative_district: false,
		beneficiary_representative_municipality: false,
		beneficiary_representative_ward: false,
		bank_account_holder_name: false,
		bank_account_number: false,
		bank_name: false,
		bank_branch_name: false,
		migration_certificate_number: false,
		migration_date_bs: false,
		signed_date: false,
		withness_name_nepali: false,
		withness_relation: false,
		withness_contact_number: false,
		operating_municipality_officer_name: false,
		operating_municipality_signed_date: false,
		identity_document: false,
		infrastructure_photo: false,
		application_document: false,
		police_report: false,
		beneficiary_district: false,
		beneficiary_municipality: false,
		beneficiary_ward: false,
		temporary_shelter_land_district: false,
		temporary_shelter_land_municipality: false,
		temporary_shelter_land_ward: false,
		operating_municipality: false,
	});
	const [phoneNumberValidation, setPhoneNumberValidation] = useState({
		benificiaryContactValidation: false,
		witnessContactValidation: false,
	});

	const [imageOrFileValidation, setImageOrFileValidation] = useState({
		identity_document_validation: false,
		infrastructure_photo_validation: false,
		application_document_validation: false,
		police_report_validation: false,
		profilePic_validation: false,
		application_file: false,
	});
	const [loading, setLoading] = useState(false);
	const [backendError, setBackendError] = useState(false);
	const [isApplicationClicked, setIsApplicationClicked] = useState(false);
	const [toggleSwitchChecked, setToggleSwitchChecked] = useState(false);
	const [keyLayout, setKeyLayout] = useState("romanized");

	const [appendedNepalifyAttributes, setAppendedNepalifyAttributes] = useState([]);

	const fileInputRef = useRef(null);
	const {
		user,
		districts,
		municipalities,
		wards,
		uri,
		requests: { addEarthquakePostRequest },
	} = props;
	const nepalilanguageOption1 = {
		layout: "traditional",
		enable: true,
	};
	const nepalilanguageOption2 = {
		layout: "romanized",
		enable: true,
	};

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
			const finalAttributes = appendedNepalifyAttributes.filter((i) => i.el.id !== e.target.id);
			setAppendedNepalifyAttributes([...finalAttributes, attribute]);

			e.target.setAttribute("data-nepalify", "inialized");
		}
	};

	const handleInfrastructurePhoto = (e: { target: { name: any; files: any[] } }) => {
		setErrorFields({
			...errorFields,
			[e.target.name]: false,
		});

		const file = e.target.files[0];
		const imageValidation = {
			identity_document_validation: false,
			infrastructure_photo_validation: false,
			application_document_validation: false,
			police_report_validation: false,
			profilePic_validation: false,
		};
		const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf)$/i;
		if (!allowedExtensions.exec(file.name)) {
			imageValidation.infrastructure_photo_validation = true;
			setImageOrFileValidation(imageValidation);
			return;
		}
		imageValidation.infrastructure_photo_validation = false;
		setImageOrFileValidation(imageValidation);
		// console.log('is this infrastructure photo', data.infrastructure_photo);
		// data.infrastructure_photo.map((item) => {
		//     console.log('This is item', item);
		//     if (!allowedExtensions.exec(item.name)) {
		//         console.log('Entered here or not');
		//         imageValidation.infrastructure_photo_validation = true;
		//         setImageOrFileValidation(imageValidation);
		//     }
		// });
		// imageValidation.infrastructure_photo_validation = false;
		setData({ ...data, [e.target.name]: [...data.infrastructure_photo, file] });
	};

	const handleRemoveImage = (id: number) => {
		const filteredArray = data.infrastructure_photo.filter((i, idx) => idx !== id);

		setData({ ...data, infrastructure_photo: filteredArray });
	};

	const handleFileInputChange = (e: { target: { name: string; files: any[] } }) => {
		setErrorFields({
			...errorFields,
			[e.target.name]: false,
		});
		const file = e.target.files[0];

		const imageValidation = {
			identity_document_validation: false,
			infrastructure_photo_validation: false,
			application_document_validation: false,
			police_report_validation: false,
			profilePic_validation: false,
			application_file: false,
		};
		const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf)$/i;
		const profilePicValidation = /(\.jpg|\.jpeg|\.png)$/i;

		if (e.target.name === "beneficiary_photo" && !profilePicValidation.exec(file.name)) {
			imageValidation.profilePic_validation = true;
			setImageOrFileValidation(imageValidation);
			return;
		}
		imageValidation.profilePic_validation = false;

		if (e.target.name === "application_file" && !allowedExtensions.exec(file.name)) {
			imageValidation.application_file = true;
			setImageOrFileValidation(imageValidation);
			return;
		}
		imageValidation.application_file = false;

		if (e.target.name === "identity_document" && !allowedExtensions.exec(file.name)) {
			imageValidation.identity_document_validation = true;
			setImageOrFileValidation(imageValidation);
			return;
		}
		imageValidation.identity_document_validation = false;
		// console.log('is this infrastructure photo', data.infrastructure_photo);
		// data.infrastructure_photo.map((item) => {
		//     console.log('This is item', item);
		//     if (!allowedExtensions.exec(item.name)) {
		//         console.log('Entered here or not');
		//         imageValidation.infrastructure_photo_validation = true;
		//         setImageOrFileValidation(imageValidation);
		//     }
		// });
		// imageValidation.infrastructure_photo_validation = false;
		if (e.target.name === "application_document" && !allowedExtensions.exec(file.name)) {
			imageValidation.application_document_validation = true;
			setImageOrFileValidation(imageValidation);
			return;
		}
		imageValidation.application_document_validation = false;
		if (e.target.name === "police_report" && !allowedExtensions.exec(file.name)) {
			imageValidation.police_report_validation = true;
			setImageOrFileValidation(imageValidation);
			return;
		}
		imageValidation.police_report_validation = false;
		setImageOrFileValidation(imageValidation);

		setData({ ...data, [e.target.name]: file });
		// setSelectedFile(file);
		// setSelectedFile(file);
	};
	const handleShowImage = (file: string | Blob | MediaSource) => {
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			return imageUrl;
		}
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

	const checkForUnicode = (value) => {
		function hasUnicode(str: string) {
			for (let i = 0; i < str.length; i++) {
				if (str.charCodeAt(i) > 127) return true;
			}
			return false;
		}
		const test = nepaliToEnglishNumber(value);
		const validateUnicodeError = hasUnicode(test);
		return validateUnicodeError;
	};

	const handleFormData = (e: { target: { name: string; value: number } }) => {
		setErrorFields({
			...errorFields,
			[e.target.name]: false,
		});
		setPhoneNumberValidation({
			benificiaryContactValidation: false,
			witnessContactValidation: false,
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
		}
		// else if (e.target.name === "beneficiary_age") {
		//   if (Number(e.target.value > 0)) {
		//     setData({
		//       ...data,
		//       [e.target.name]: e.target.value,
		//     });
		//   } else {
		//     setData({
		//       ...data,
		//       [e.target.name]: "",
		//     });
		//   }
		// }
		else {
			setData({
				...data,
				[e.target.name]: e.target.value,
			});
		}
	};

	const selectedMunicipality = municipalities.filter(
		(i: { district: number }) => i.district === Number(data.beneficiary_district)
	);
	// const selectedWard =user&&user.profile&& wards.filter(i => i.municipality === Number(user.profile.municipality data.beneficiary_municipality));
	const selectedWard = user.isSuperuser
		? user &&
		  user.profile &&
		  wards
				.filter(
					(i: { municipality: number }) => i.municipality === Number(data.beneficiary_municipality)
				)
				.sort((a: { title: any }, b: { title: any }) => Number(a.title) - Number(b.title))
		: user &&
		  user.profile &&
		  wards
				.filter((i: { municipality: any }) => i.municipality === user.profile.municipality)
				.sort((a: { title: any }, b: { title: any }) => Number(a.title) - Number(b.title));
	const tempSelectedMunicipality = user.isSuperuser
		? user &&
		  user.profile &&
		  municipalities.filter(
				(i: { district: number }) => i.district === Number(data.temporary_shelter_land_district)
		  )
		: user &&
		  user.profile &&
		  municipalities.filter(
				(i: { district: number }) => i.district === Number(user.profile.district)
		  );
	// const tempSelectedWard = wards.filter(i => i.municipality === Number(data.temporary_shelter_land_municipality));
	const tempSelectedWard = user.isSuperuser
		? user &&
		  user.profile &&
		  wards
				.filter(
					(i: { municipality: number }) =>
						i.municipality === Number(data.temporary_shelter_land_municipality)
				)
				.sort((a: { title: any }, b: { title: any }) => Number(a.title) - Number(b.title))
		: user &&
		  user.profile &&
		  wards
				.filter(
					(i: { municipality: number }) =>
						i.municipality === Number(data.temporary_shelter_land_municipality)
				)
				.sort((a: { title: any }, b: { title: any }) => Number(a.title) - Number(b.title));
	const beneficiarySelectedMunicipality = municipalities.filter(
		(i: { district: number }) => i.district === Number(data.beneficiary_representative_district)
	);
	// const beneficiarySelectedWard = wards.filter(i => i.municipality === Number(data.beneficiary_representative_municipality));
	const beneficiarySelectedWard = user.isSuperuser
		? user &&
		  user.profile &&
		  wards
				.filter(
					(i: { municipality: number }) =>
						i.municipality === Number(data.beneficiary_representative_municipality)
				)
				.sort((a: { title: any }, b: { title: any }) => Number(a.title) - Number(b.title))
		: user &&
		  user.profile &&
		  wards
				.filter((i: { municipality: any }) => i.municipality === user.profile.municipality)
				.sort((a: { title: any }, b: { title: any }) => Number(a.title) - Number(b.title));

	const test = selectedWard.sort(
		(a: { title: any }, b: { title: any }) => Number(a.title) - Number(b.title)
	);

	const handleSuccessMessage = (d: { id: any }) => {
		navigate(
			`/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${d.id}`
		);
	};

	const handleClick = () => {
		setBackendError(false);
		const errorCheckingFields = Object.keys(data);

		const latestErrorUpdate = errorFields;
		errorCheckingFields.map((i) => {
			if (!data[i]) {
				if (!data.is_beneficiary_available_to_sign) {
					latestErrorUpdate.is_beneficiary_available_to_sign = false;
					latestErrorUpdate.beneficiary_representative_name_nepali = false;
					latestErrorUpdate.beneficiary_representative_citizenship_number = false;
					latestErrorUpdate.beneficiary_representative_grandfather_name = false;
					latestErrorUpdate.beneficiary_representative_ward = false;
					latestErrorUpdate.beneficiary_representative_parent_name = false;
					latestErrorUpdate.beneficiary_representative_district = false;
					latestErrorUpdate.beneficiary_representative_municipality = false;
				}
				if (!isApplicationClicked) {
					latestErrorUpdate.application_date = false;
					latestErrorUpdate.application_file = false;
				}

				if (i === "migration_certificate_number") {
					return (latestErrorUpdate[i] = false);
				}
				if (i === "registration_number") {
					return (latestErrorUpdate[i] = false);
				}
				if (i === "bank_account_holder_name") {
					return (latestErrorUpdate[i] = false);
				}
				if (i === "bank_account_number") {
					return (latestErrorUpdate[i] = false);
				}
				if (i === "bank_name") {
					return (latestErrorUpdate[i] = false);
				}
				if (i === "bank_branch_name") {
					return (latestErrorUpdate[i] = false);
				}
				if (i === "pa_number") {
					return (latestErrorUpdate[i] = false);
				}

				if (i === "application_document") {
					return (latestErrorUpdate[i] = false);
				}

				if (!user.isSuperuser) {
					if (i === "beneficiary_municipality") {
						return (latestErrorUpdate[i] = false);
					}
					if (i === "beneficiary_district") {
						return (latestErrorUpdate[i] = false);
					}
					if (i === "temporary_shelter_land_district") {
						return (latestErrorUpdate[i] = false);
					}
					// if (i === 'temporary_shelter_land_municipality') {
					//     return latestErrorUpdate[i] = false;
					// }
					if (i === "beneficiary_representative_district") {
						return (latestErrorUpdate[i] = false);
					}
					if (i === "beneficiary_representative_municipality") {
						return (latestErrorUpdate[i] = false);
					}
					if (i === "operating_municipality") {
						return (latestErrorUpdate[i] = false);
					}
				}

				return user.isSuperuser &&
					!data.is_beneficiary_available_to_sign &&
					i === "beneficiary_representative_ward"
					? (latestErrorUpdate[i] = false)
					: !data.is_beneficiary_available_to_sign && i === "beneficiary_representative_ward"
					? (latestErrorUpdate[i] = false)
					: (i === "application_file" || i === "application_date") && !isApplicationClicked
					? (latestErrorUpdate[i] = false)
					: (latestErrorUpdate[i] = true);
			}

			if (i === "withness_contact_number") {
				if (checkForUnicode(data[i])) {
					return (latestErrorUpdate[i] = true);
				}
			}
			if (i === "beneficiary_contact_number") {
				if (checkForUnicode(data[i])) {
					return (latestErrorUpdate[i] = true);
				}
			}
			if (i === "beneficiary_age") {
				if (checkForUnicode(data[i])) {
					return (latestErrorUpdate[i] = true);
				}
			}
			if (i === "infrastructure_photo") {
				if (data.infrastructure_photo.length === 0) {
					return (latestErrorUpdate[i] = true);
				}
			}
			latestErrorUpdate[i] = false;

			return null;
		});
		const phoneNumberRegex = /^\d{10}$/;

		setErrorFields({ ...latestErrorUpdate });
		if (Object.values(latestErrorUpdate).filter((i) => i === true).length) {
			return;
		}
		const phoneValidation = {
			benificiaryContactValidation: false,
			witnessContactValidation: false,
		};
		if (!phoneNumberRegex.test(nepaliToEnglishNumber(data.beneficiary_contact_number))) {
			phoneValidation.benificiaryContactValidation = true;

			setPhoneNumberValidation(phoneValidation);
			return;
		}
		phoneValidation.benificiaryContactValidation = false;
		if (!phoneNumberRegex.test(nepaliToEnglishNumber(data.withness_contact_number))) {
			phoneValidation.witnessContactValidation = true;
			setPhoneNumberValidation(phoneValidation);
			return;
		}
		phoneValidation.witnessContactValidation = false;
		setPhoneNumberValidation(phoneValidation);

		setLoading(true);
		const finalUpdateData = data;
		if (!finalUpdateData.migration_certificate_number) {
			finalUpdateData.migration_date_bs = "";
		}
		if (!isApplicationClicked) {
			finalUpdateData.application_date = "";
			finalUpdateData.application_file = "";
		}
		if (!user.isSuperuser) {
			finalUpdateData.beneficiary_municipality = user.profile.municipality;
			finalUpdateData.beneficiary_district = user.profile.district;

			finalUpdateData.temporary_shelter_land_district = user.profile.district;
			finalUpdateData.temporary_shelter_land_municipality = user.profile.municipality;
			finalUpdateData.beneficiary_representative_district = user.profile.district;
			finalUpdateData.beneficiary_representative_municipality = user.profile.municipality;
			finalUpdateData.operating_municipality = user.profile.municipality;
		}

		// addEarthquakePostRequest.do({
		//     body: finalUpdateData,
		//     onSuccess: datas => handleSuccessMessage(datas),
		//     setFaramErrors: (err) => {
		//         setBackendError(true);
		//         setLoading(false);
		//     },

		// });

		const finalFormData = new FormData();
		finalFormData.append("entry_date_bs", finalUpdateData.entry_date_bs);
		finalFormData.append("pa_number", finalUpdateData.pa_number);
		finalFormData.append("tole_name", finalUpdateData.tole_name);
		finalFormData.append("event", finalUpdateData.event);
		finalFormData.append("grand_parent_title", finalUpdateData.grand_parent_title);
		finalFormData.append("grand_parent_name", finalUpdateData.grand_parent_name);
		finalFormData.append("grand_child_relation", finalUpdateData.grand_child_relation);
		finalFormData.append("parent_title", finalUpdateData.parent_title);
		finalFormData.append("parent_name", finalUpdateData.parent_name);
		finalFormData.append("child_relation", finalUpdateData.child_relation);
		finalFormData.append(
			"beneficiary_age",
			Number(nepaliToEnglishNumber(finalUpdateData.beneficiary_age))
		);
		finalFormData.append("registration_number", finalUpdateData.registration_number);
		finalFormData.append("beneficiary_name_nepali", finalUpdateData.beneficiary_name_nepali);
		finalFormData.append(
			"beneficiary_citizenship_number",
			finalUpdateData.beneficiary_citizenship_number
		);
		finalFormData.append("beneficiary_name_english", finalUpdateData.beneficiary_name_english);
		finalFormData.append("beneficiary_contact_number", finalUpdateData.beneficiary_contact_number);
		finalFormData.append(
			"beneficiary_citizenship_number",
			finalUpdateData.beneficiary_citizenship_number
		);
		finalFormData.append("beneficiary_name_english", finalUpdateData.beneficiary_name_english);
		finalFormData.append("beneficiary_contact_number", finalUpdateData.beneficiary_contact_number);
		finalFormData.append("beneficiary_photo", finalUpdateData.beneficiary_photo);
		finalFormData.append(
			"beneficiary_representative_citizenship_number",
			finalUpdateData.beneficiary_representative_citizenship_number
		);
		finalFormData.append(
			"is_beneficiary_available_to_sign",
			finalUpdateData.is_beneficiary_available_to_sign
		);
		finalFormData.append(
			"beneficiary_representative_name_nepali",
			finalUpdateData.beneficiary_representative_name_nepali
		);
		finalFormData.append(
			"beneficiary_representative_grandfather_name",
			finalUpdateData.beneficiary_representative_grandfather_name
		);
		finalFormData.append(
			"beneficiary_representative_parent_name",
			finalUpdateData.beneficiary_representative_parent_name
		);
		finalFormData.append("bank_account_holder_name", finalUpdateData.bank_account_holder_name);
		finalFormData.append("bank_account_number", finalUpdateData.bank_account_number);
		finalFormData.append("bank_name", finalUpdateData.bank_name);
		finalFormData.append("bank_branch_name", finalUpdateData.bank_branch_name);
		finalFormData.append(
			"migration_certificate_number",
			finalUpdateData.migration_certificate_number
		);
		finalFormData.append("migration_date_bs", finalUpdateData.migration_date_bs);
		finalFormData.append("signed_date", finalUpdateData.signed_date);
		finalFormData.append("withness_name_nepali", finalUpdateData.withness_name_nepali);
		finalFormData.append("withness_relation", finalUpdateData.withness_relation);
		finalFormData.append("withness_contact_number", finalUpdateData.withness_contact_number);
		finalFormData.append(
			"operating_municipality_officer_name",
			finalUpdateData.operating_municipality_officer_name
		);
		finalFormData.append(
			"operating_municipality_signed_date",
			finalUpdateData.operating_municipality_signed_date
		);
		finalFormData.append("identity_document", finalUpdateData.identity_document);
		finalFormData.append("application_document", finalUpdateData.application_document);
		finalFormData.append("police_report", finalUpdateData.police_report);
		finalFormData.append("beneficiary_district", finalUpdateData.beneficiary_district);
		finalFormData.append("beneficiary_municipality", finalUpdateData.beneficiary_municipality);
		finalFormData.append("beneficiary_ward", finalUpdateData.beneficiary_ward);
		finalFormData.append(
			"temporary_shelter_land_district",
			finalUpdateData.temporary_shelter_land_district
		);
		finalFormData.append(
			"temporary_shelter_land_municipality",
			finalUpdateData.temporary_shelter_land_municipality
		);
		finalFormData.append(
			"temporary_shelter_land_ward",
			finalUpdateData.temporary_shelter_land_ward
		);
		finalFormData.append(
			"temporary_shelter_land_tole",
			finalUpdateData.temporary_shelter_land_tole
		);
		finalFormData.append(
			"beneficiary_representative_district",
			finalUpdateData.beneficiary_representative_district
		);
		finalFormData.append(
			"beneficiary_representative_municipality",
			finalUpdateData.beneficiary_representative_municipality
		);
		finalFormData.append(
			"beneficiary_representative_ward",
			finalUpdateData.beneficiary_representative_ward
		);
		finalFormData.append("operating_municipality", finalUpdateData.operating_municipality);
		finalFormData.append("application_date", finalUpdateData.application_date);
		finalFormData.append("application_file", finalUpdateData.application_file);

		finalUpdateData.infrastructure_photo.length
			? finalUpdateData.infrastructure_photo.map((i) =>
					finalFormData.append("infrastructure_photo", i, i.name)
			  )
			: null;
		const baseUrl = import.meta.env.VITE_APP_API_SERVER_URL;
		axios
			.post(`${baseUrl}/temporary-shelter-enrollment-form/`, finalFormData, {
				"Content-Type": "multipart/form-data",
				"X-CSRFToken": checkCSRFToken.csrftoken,
			})
			.then((res) => {
				handleSuccessMessage(res.data);
				setLoading(false);
			})
			.catch((error) => {
				setBackendError(true);
				setLoading(false);
			});
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
		const day = curDate.getDate() > 9 ? curDate.getDate() : `0${curDate.getDate()}`;
		const month =
			curDate.getMonth() + 1 > 9 ? curDate.getMonth() + 1 : `0${curDate.getMonth() + 1}`;
		const year = curDate.getFullYear();

		// This arrangement can be altered based on how we want the date's format to appear.
		const currentDate = ADToBS(`${year}-${month}-${day}`);
		setData({
			...data,
			entry_date_bs: currentDate,
			signed_date: currentDate,
			operating_municipality_signed_date: currentDate,
			migration_date_bs: currentDate,
			application_date: currentDate,
		});
	}, []);
	const handleDropdown = (name: string, value: any) => {
		if (name === "beneficiary_district") {
			setData({
				...data,
				[name]: value,
				beneficiary_municipality: "",
				beneficiary_ward: "",
			});
		} else if (name === "beneficiary_municipality") {
			setData({
				...data,
				[name]: value,
				beneficiary_ward: "",
			});
		} else if (name === "temporary_shelter_land_district") {
			setData({
				...data,
				[name]: value,
				temporary_shelter_land_municipality: "",
				temporary_shelter_land_ward: "",
			});
		} else if (name === "temporary_shelter_land_municipality") {
			setData({
				...data,
				[name]: value,
				temporary_shelter_land_ward: "",
			});
		} else if (name === "beneficiary_representative_district") {
			setData({
				...data,
				[name]: value,
				beneficiary_representative_municipality: "",
				beneficiary_representative_ward: "",
			});
		} else if (name === "beneficiary_representative_municipality") {
			setData({
				...data,
				[name]: value,
				beneficiary_representative_ward: "",
			});
		} else {
			setData({
				...data,
				[name]: value,
			});
		}

		// setErrorPersonal({ ...errorPersonal, [name]: false });
	};
	const districtNameConverter = (id: any) => {
		const finalData = id && districts.find((i: { id: number }) => i.id === Number(id)).title_ne;

		return finalData || "-";
	};

	const municipalityNameConverter = (id: any) => {
		// const finalData = fetchedData && municipalities.find(i => i.id === id).title_ne;
		const finalData = id && municipalities.find((i: { id: number }) => i.id === Number(id));
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

	const wardNameConverter = (id: any) => {
		const finalData = id && wards.find((i: { id: number }) => i.id === Number(id)).title;
		return finalData || "-";
	};
	const handleChange = (checked: boolean | ((prevState: boolean) => boolean)) => {
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

	useEffect(() => {
		fetch(`${import.meta.env.VITE_APP_API_SERVER_URL}/event/?fields=id,title`, {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((final_resp) => setFetchIncident(final_resp.results));
	}, []);

	return (
		<>
			<Page hideFilter hideMap />
			<Navbar />
			<MenuCommon layout="common" currentPage={"Epidemics"} uri={uri} />
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
						}}>
						<div className="reporting123" style={{ cursor: "pointer" }}>
							<img className="listSvg123" src={ListSvg} alt="" />
							<p className="reportingText123"> पहिलो किस्ता फारम</p>
							<p className="greenCircle123 " />
						</div>
						<div className="reporting123" style={{ cursor: "pointer" }}>
							<img className="listSvg123" src={ListSvg} alt="" />
							<p className="reportingText123">पहिलो किस्ता फारम अपलोड</p>
							<p className="grayCircle123" />
						</div>
						<div className="reporting123" style={{ cursor: "pointer" }}>
							<img className="listSvg123" src={ListSvg} alt="" />
							<p className="reportingText123">दोस्रो किस्ता फारम</p>
							<p className="grayCircle123" />
						</div>
						<div className="reporting123" style={{ cursor: "pointer" }}>
							<img className="listSvg123" src={ListSvg} alt="" />
							<p className="reportingText123">दोस्रो किस्ता फारम अपलोड</p>
							<p className="grayCircle123" />
						</div>
						<div className="reporting123" style={{ cursor: "pointer" }}>
							<img className="listSvg123" src={ListSvg} alt="" />
							<p className="reportingText123">अवस्था</p>
							<p className="grayCircle123" />
						</div>
					</div>
					<div className={styles.mainForm}>
						<div className={styles.generalInfoAndTableButton}>
							<h1 className={styles.generalInfo}> पहिलो किस्ता फारम</h1>
							<button className={styles.viewDataTable} type="button" onClick={handleTableButton}>
								डाटा तालिका हेर्नुहोस्
							</button>
						</div>
						<div className={styles.shortGeneralInfo}>
							<img className={styles.ideaIcon} src={Ideaicon} alt="" />
							<p className={styles.ideaPara}>
								विपद् प्रभावितको अस्थायी आवास निर्माणका लागि अनुदान सम्झौता-पत्र (दफा ३ को उपदफा ५
								सँँग सम्बन्धित)
							</p>
						</div>
						{/* <div className={styles.infoBar}>
                            <p className={styles.instInfo}>
                                Reported Date and Location are required information
                            </p>
                        </div> */}
						<label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
							<div style={{ flex: 1 }}>
								<div style={{ display: "flex", flexDirection: "column" }}>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "5px",
										}}>
										<span style={{ color: "red" }}>*</span>
										<h2 style={{ textDecoration: "underline" }}>बिपद्को घटना छान्नुहोस्</h2>
									</div>

									<select
										id="event"
										name="event"
										value={data.event}
										onChange={handleFormData}
										style={
											errorFields.event
												? {
														border: "1px solid red",
														height: "34px",
														width: "auto",
												  }
												: { height: "34px", width: "auto" }
										}>
										<option />
										{fetchIncident.map((i) => (
											<option value={i.id} key={i.id}>
												{i.title}
											</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<div className={styles.locationDetails}>
									<div
										style={{
											display: "flex",
											gap: "5px",
											alignItems: "flex-start",
											fontSize: "20px",
										}}>
										<span style={{ fontSize: "16px" }}>आवेदन उपलब्ध छ ?</span>

										<input
											style={{ cursor: "pointer", marginTop: "5px" }}
											type="checkbox"
											checked={isApplicationClicked}
											onChange={() => setIsApplicationClicked(!isApplicationClicked)}
										/>
									</div>
									{isApplicationClicked ? (
										<div style={{ display: "flex", marginTop: "20px" }}>
											<div
												style={{
													display: "flex",
													flexDirection: "column",
													gap: "10px",
													flex: 2,
													fontSize: "20px",
													alignItems: "flex-start",
												}}>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "5px",
													}}>
													<span style={{ color: "red" }}>*</span>
													<span style={{ fontSize: "14px" }}>आवेदनको फोटो वा pdf:</span>
												</div>

												<div
													style={{
														display: "flex",
														flexDirection: "column",
														gap: "5px",
													}}>
													<input
														type="file"
														accept=".pdf, image/*"
														id="file-input"
														// style={{ display: 'none' }}
														onChange={handleFileInputChange}
														name="application_file"
													/>
													{errorFields.application_file ? (
														<p
															style={{
																margin: "0",
																color: "red",
																fontSize: "14px",
															}}>
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
														<p style={{ margin: "0", color: "red" }}>कागजात फोटो वा pdf हुनुपर्छ</p>
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
												}}>
												<span span style={{ fontSize: "14px" }}>
													आवेदनको मितिः
												</span>

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
									justifyContent: "start",
									flexDirection: "column",
									alignItems: "flex-start",
									flex: 1,
								}}>
								<span style={{ fontSize: "14px" }}>दर्ता मितिः</span>
								{/* <input
                                    type="text"
                                    name="entry_date_bs"
                                    value={data.entry_date_bs}
                                    onChange={handleFormData}
                                    className={styles.inputClassName}
                                /> */}

								<NepaliDatePicker
									inputClassName="form-control"
									// className={styles.datePick}
									// value={ADToBS(dateAlt)}
									value={data.entry_date_bs}
									onChange={(value: string) => {
										setData({
											...data,
											entry_date_bs: value,
											operating_municipality_signed_date: value,
										});
									}}
									options={{
										calenderLocale: "ne",
										valueLocale: "en",
									}}
								/>
							</div>
							<div
								className={styles.datePickerForm}
								style={{
									display: "flex",
									justifyContent: "start",
									flexDirection: "column",
									alignItems: "flex-start",
									flex: 1,
								}}>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										gap: "5px",
									}}>
									<span style={{ fontSize: "14px" }}>दर्ता नम्बर:</span>
								</div>
								<input
									onBlur={handleFormData}
									// onFocus={nepaliInput}
									data-nepalify={"not inialized"}
									id="registration_number"
									type="text"
									name="registration_number"
									// value={data.registration_number}
									className={styles.inputClassName}
									// onChange={handleFormData}
									style={
										errorFields.registration_number
											? {
													border: "0.5px solid black",
													borderBottom: "2px dotted red",
													height: "34px",
													width: "100%",
											  }
											: {
													height: "34px",
													width: "100%",
													border: "0.5px solid black",
													background: "white",
											  }
									}
								/>
							</div>
							<h2 style={{ textDecoration: "underline" }}>क. प्रथम पक्ष (लाभग्राही)</h2>
							<span style={{ fontSize: "16px" }}>१. व्यक्तिगत विवरण</span>

							<div
								style={{
									fontSize: "20px",
									display: "flex",
									gap: "20px",
									flex: 1,
								}}>
								<div style={{ flex: 2 }}>
									<div style={{ display: "flex", flexDirection: "column" }}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<span style={{ color: "red" }}>*</span>
											<span style={{ fontSize: "14px" }}>हजुरबुबाको नाम</span>
										</div>

										<input
											onBlur={handleFormData}
											onFocus={nepaliInput}
											data-nepalify={"not inialized"}
											id="grand_parent_name"
											type="text"
											name="grand_parent_name"
											// value={data.grand_parent_name}
											className={styles.inputClassName}
											// onChange={handleFormData}
											style={
												errorFields.grand_parent_name
													? {
															borderBottom: "2px dotted red",
															height: "34px",
															width: "auto",
													  }
													: { height: "34px", width: "auto" }
											}
										/>
									</div>
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ display: "flex", flexDirection: "column" }}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<span style={{ color: "red" }}>*</span>
											<span style={{ fontSize: "14px" }}>नाती/नातीनी/बुुहारी</span>
										</div>

										<select
											id="grand_child_relation"
											name="grand_child_relation"
											value={data.grand_child_relation}
											onChange={handleFormData}
											style={
												errorFields.grand_child_relation
													? {
															border: "1px solid red",
															height: "34px",
															width: "auto",
													  }
													: { height: "34px", width: "auto" }
											}>
											<option />
											<option value="नाती">नाती</option>
											<option value="नातीनी">नातीनी</option>
											<option value="बुहारी">बुहारी</option>
										</select>
									</div>
								</div>
							</div>
							<div
								style={{
									fontSize: "20px",
									display: "flex",
									gap: "20px",
									flex: 1,
								}}>
								<div style={{ flex: 2 }}>
									<div style={{ display: "flex", flexDirection: "column" }}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<span style={{ color: "red" }}>*</span>
											<span style={{ fontSize: "14px" }}>आमा/बाबुको नाम</span>
										</div>

										<input
											data-nepalify={"not inialized"}
											id="parent_name"
											onBlur={handleFormData}
											onFocus={nepaliInput}
											type="text"
											className={styles.inputClassName}
											name="parent_name"
											// value={data.parent_name}
											style={
												errorFields.parent_name
													? {
															borderBottom: "2px dotted red",
															height: "34px",
															width: "auto",
													  }
													: { height: "34px", width: "auto" }
											}
										/>
									</div>
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ display: "flex", flexDirection: "column" }}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<span style={{ color: "red" }}>*</span>
											<span style={{ fontSize: "14px" }}>छोरा/छोरी/श्रीमती</span>
										</div>

										<select
											id="child_relation"
											name="child_relation"
											value={data.child_relation}
											onChange={handleFormData}
											style={
												errorFields.child_relation
													? {
															border: "1px solid red",
															height: "34px",
															width: "auto",
													  }
													: { height: "34px", width: "auto" }
											}>
											<option />
											<option value="छोरा">छोरा</option>
											<option value="छोरी">छोरी</option>
											<option value="श्रीमती">श्रीमती</option>
										</select>
									</div>
								</div>
							</div>
							<div style={{ display: "flex", gap: "20px", fontSize: "20px" }}>
								<div
									className={styles.freeText}
									style={{ flex: 1, flexDirection: "column", display: "flex" }}>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "5px",
										}}>
										<span style={{ color: "red" }}>*</span>
										<span style={{ fontSize: "14px" }}>नाम, थर नेेपालीमाः</span>
									</div>

									<input
										data-nepalify={"not inialized"}
										onBlur={handleFormData}
										onFocus={nepaliInput}
										id="beneficiary_name_nepali"
										type="text"
										name="beneficiary_name_nepali"
										// value={data.beneficiary_name_nepali}
										style={
											errorFields.beneficiary_name_nepali
												? { borderBottom: "2px dotted red", height: "34px" }
												: { height: "34px" }
										}
										className={styles.inputClassName}
									/>
								</div>
								<div
									className={styles.freeText}
									style={{ flex: 1, flexDirection: "column", display: "flex" }}>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "5px",
										}}>
										<span style={{ color: "red" }}>*</span>
										<span style={{ fontSize: "14px" }}>नाम, थर अंंग्रेजीमाः</span>
									</div>

									<input
										//  data-nepalify={'not inialized'}
										onChange={handleFormData}
										//  onFocus={nepaliInput}
										id="beneficiary_name_english"
										type="text"
										className={styles.inputClassName}
										name="beneficiary_name_english"
										value={data.beneficiary_name_english}
										style={
											errorFields.beneficiary_name_english
												? { borderBottom: "2px dotted red", height: "34px" }
												: { height: "34px" }
										}
									/>
								</div>
							</div>
							<div>
								<div
									style={{
										display: "flex",
										gap: "20px",
										fontSize: "20px",
										margin: "0px 0px",
									}}>
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											flex: 1,
										}}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<span style={{ color: "red" }}>*</span>
											<span style={{ fontSize: "14px" }}>उमेर</span>
										</div>

										<input
											data-nepalify={"not inialized"}
											onBlur={handleFormData}
											onFocus={nepaliInput}
											id="beneficiary_age"
											type="text"
											name="beneficiary_age"
											// value={data.beneficiary_age}
											className={styles.inputClassName}
											style={
												errorFields.beneficiary_age
													? {
															borderBottom: "2px dotted red",
															height: "34px",
															width: "auto",
													  }
													: { height: "34px", width: "auto" }
											}
										/>
										{errorFields.beneficiary_age && data.beneficiary_age ? (
											<p style={{ margin: "0", color: "red", fontSize: "14px" }}>
												उमेर नम्बरमा हुनुपर्छ
											</p>
										) : (
											""
										)}
									</div>

									<div
										style={{
											display: "flex",
											flexDirection: "column",
											flex: 1,
										}}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<span style={{ color: "red" }}>*</span>
											<span style={{ fontSize: "14px" }}>ना.प्र.न.</span>
										</div>

										<input
											data-nepalify={"not inialized"}
											id="beneficiary_citizenship_number"
											onBlur={handleFormData}
											onFocus={nepaliInput}
											type="text"
											name="beneficiary_citizenship_number"
											//  value={data.beneficiary_citizenship_number}

											className={styles.inputClassName}
											style={
												errorFields.beneficiary_citizenship_number
													? { borderBottom: "2px dotted red", height: "34px" }
													: { height: "34px" }
											}
										/>
									</div>
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											flex: 1,
										}}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<span style={{ color: "red" }}>*</span>
											<span style={{ fontSize: "14px" }}>सम्पर्क नंं.</span>
										</div>

										<input
											onBlur={handleFormData}
											onFocus={nepaliInput}
											data-nepalify={"not inialized"}
											id="beneficiary_contact_number"
											type="text"
											name="beneficiary_contact_number"
											// value={data.beneficiary_contact_number}
											style={
												errorFields.beneficiary_contact_number ||
												phoneNumberValidation.benificiaryContactValidation
													? { borderBottom: "2px dotted red", height: "34px" }
													: { height: "34px" }
											}
											className={styles.inputClassName}
										/>
										{errorFields.beneficiary_contact_number && data.beneficiary_contact_number ? (
											<p style={{ margin: "0", color: "red", fontSize: "14px" }}>
												सम्पर्क नम्बर नम्बरमा हुनुपर्छ
											</p>
										) : (
											""
										)}
									</div>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "5px",
										flex: 2,
										alignItems: "flex-start",
										marginTop: "20px",
									}}>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "5px",
										}}>
										<span style={{ color: "red" }}>*</span>
										<span style={{ fontSize: "14px" }}>लाभग्राहीको फोटो:</span>
									</div>

									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "5px",
										}}>
										<input
											type="file"
											accept="image/*"
											id="file-input"
											// style={{ display: 'none' }}
											onChange={handleFileInputChange}
											name="beneficiary_photo"
										/>
										{errorFields.beneficiary_photo ? (
											<p style={{ margin: "0", color: "red" }}>कृपया फोटो अपलोड गर्नुहोस्</p>
										) : (
											""
										)}
										{data.beneficiary_photo ? (
											<img
												height={100}
												width={100}
												src={handleShowImage(data.beneficiary_photo)}
												alt="img"
											/>
										) : (
											""
										)}
										{imageOrFileValidation.profilePic_validation ? (
											<p style={{ margin: "0", color: "red" }}>फोटो jpeg, jpg वा png हुनुपर्छ</p>
										) : (
											""
										)}
									</div>
								</div>
							</div>
							{/* <div>
                                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '20px' }}>
                                    <span>


                                        लाभग्राहीको नाम
                                    </span>
                                    <input
                                        type="text"
                                        name="beneficiary_name_nepali"
                                        value={data.beneficiary_name_nepali}
                                        onChange={handleFormData}
                                        className={styles.inputClassName}
                                        style={errorFields.beneficiary_name_nepali ? { borderBottom: '2px dotted red', height: '34px', width: 'auto' } : { height: '34px', width: 'auto' }}
                                    />
                                </div>
                            </div> */}

							<span style={{ fontSize: "16px" }}>{`${englishToNepaliNumber(2)}. ठेगाना`}</span>
							<div style={{ fontSize: "20px", display: "flex", gap: "20px" }}>
								<div style={{ flex: 1 }}>
									{user.isSuperuser ? (
										<div style={{ display: "flex", flexDirection: "column" }}>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "5px",
												}}>
												<span style={{ color: "red" }}>*</span>
												<span style={{ fontSize: "14px" }}>लाभग्राहीको जिल्ला</span>
											</div>

											<select
												name="beneficiary_district"
												value={data.beneficiary_district || ""}
												id="districts-benificery"
												onChange={handleFormData}
												style={
													errorFields.beneficiary_district
														? {
																border: "1px solid red",
																height: "34px",
																width: "auto",
														  }
														: { height: "34px", width: "auto" }
												}>
												<option>लाभग्राहीको जिल्ला</option>
												{districts.map(
													(item: {
														id: string | number | readonly string[] | undefined;
														title_ne:
															| boolean
															| React.ReactChild
															| React.ReactFragment
															| React.ReactPortal
															| Iterable<ReactI18NextChild>
															| null
															| undefined;
													}) => (
														<option value={item.id}>{item.title_ne}</option>
													)
												)}
											</select>
										</div>
									) : (
										<div style={{ display: "flex", flexDirection: "column" }}>
											<span style={{ fontSize: "14px" }}>लाभग्राहीको जिल्ला</span>
											<span style={{ fontSize: "14px" }}>
												{user && user.profile && districtNameConverter(user.profile.district)}
											</span>
										</div>
									)}
								</div>
								<div style={{ flex: 1 }}>
									{user.isSuperuser ? (
										<div style={{ display: "flex", flexDirection: "column" }}>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "5px",
												}}>
												<span style={{ color: "red" }}>*</span>
												<span style={{ fontSize: "14px" }}>लाभग्राहीको गा.पा/न.पा.</span>
											</div>

											<select
												id="beneficiary_municipality"
												name="beneficiary_municipality"
												value={data.beneficiary_municipality || ""}
												onChange={handleFormData}
												style={
													errorFields.beneficiary_municipality
														? {
																border: "1px solid red",
																height: "34px",
																width: "auto",
														  }
														: { height: "34px", width: "auto" }
												}>
												<option>लाभग्राहीको गा.पा/न.पा.</option>
												{selectedMunicipality.map(
													(item: {
														id: string | number | readonly string[] | undefined;
														title_ne:
															| boolean
															| React.ReactChild
															| React.ReactFragment
															| React.ReactPortal
															| Iterable<ReactI18NextChild>
															| null
															| undefined;
													}) => (
														<option value={item.id}>{item.title_ne}</option>
													)
												)}
											</select>
										</div>
									) : (
										<div style={{ display: "flex", flexDirection: "column" }}>
											<span style={{ fontSize: "14px" }}>लाभग्राहीको गा.पा/न.पा.</span>
											<span style={{ fontSize: "14px" }}>
												{user &&
													user.profile &&
													municipalityNameConverter(user.profile.municipality)}
											</span>
										</div>
									)}
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ display: "flex", flexDirection: "column" }}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<span style={{ color: "red" }}>*</span>
											<span style={{ fontSize: "14px" }}>लाभग्राहीको वडा नंं.</span>
										</div>

										<select
											id="beneficiary_ward"
											name="beneficiary_ward"
											value={data.beneficiary_ward || ""}
											onChange={handleFormData}
											style={
												errorFields.beneficiary_ward
													? {
															border: "1px solid red",
															height: "34px",
															width: "auto",
													  }
													: { height: "34px", width: "auto" }
											}>
											<option>लाभग्राहीको वडा नंं.</option>
											{selectedWard.map(
												(item: {
													id: string | number | readonly string[] | undefined;
													title: string | number;
												}) => (
													<option value={item.id}>{englishToNepaliNumber(item.title)}</option>
												)
											)}
										</select>
									</div>
								</div>
							</div>
							<div style={{ flex: 1 }}>
								<div style={{ display: "flex", flexDirection: "column" }}>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "5px",
										}}>
										<span style={{ color: "red" }}>*</span>
										<span style={{ fontSize: "14px" }}>लाभग्राहीको गाउँँ/टोल</span>
									</div>

									<input
										data-nepalify={"not inialized"}
										id="tole_name"
										onBlur={handleFormData}
										onFocus={nepaliInput}
										type="text"
										className={styles.inputClassName}
										name="tole_name"
										// value={data.tole_name}

										style={
											errorFields.tole_name
												? {
														borderBottom: "2px dotted red",
														height: "34px",
														width: "auto",
												  }
												: { height: "34px", width: "auto" }
										}
									/>
								</div>
							</div>

							<div className={styles.firstPartDetails}>
								<div className={styles.firstPartContainer}>
									<div className={styles.formElements}>
										<div className={styles.locationDetails}>
											<div
												style={{
													display: "flex",
													gap: "5px",
													alignItems: "flex-start",
												}}>
												<span style={{ fontSize: "14px" }}>
													लाभग्राही हस्ताक्षर गर्न उपलब्ध छैन?
												</span>

												<input
													style={{ cursor: "pointer", marginTop: "2px" }}
													type="checkbox"
													checked={data.is_beneficiary_available_to_sign}
													onChange={handleCheckboxChange}
												/>
											</div>
										</div>

										<div
											style={
												data.is_beneficiary_available_to_sign
													? { display: "block" }
													: { display: "none" }
											}>
											<h2
												style={{
													textDecoration: "underline",
													fontSize: "18px",
													marginBottom: "20px",
												}}>
												संंरक्षक/अधिकार प्राप्त/मञ्जुुरी प्राप्त व्यक्तिको विवरण
											</h2>
											<div style={{ display: "flex", gap: "20px" }}>
												<div
													// className={styles.freeText}
													style={{
														marginBottom: "10px",
														display: "flex",
														flexDirection: "column",
														alignItems: "flex-start",
														flex: 2,
													}}>
													<div
														style={{
															display: "flex",
															alignItems: "center",
															gap: "5px",
														}}>
														<span style={{ color: "red" }}>*</span>
														<span style={{ fontSize: "14px" }}>नाम, थर नेेपालीमाः</span>
													</div>

													<input
														onBlur={handleFormData}
														onFocus={nepaliInput}
														data-nepalify={"not inialized"}
														id="beneficiary_representative_name_nepali"
														type="text"
														name="beneficiary_representative_name_nepali"
														// value={data.beneficiary_representative_name_nepali}
														style={
															errorFields.beneficiary_representative_name_nepali
																? {
																		borderBottom: "2px dotted red",
																		height: "34px",
																		width: "100%",
																  }
																: { height: "34px", width: "100%" }
														}
														className={styles.inputClassName}
													/>
												</div>
												<div style={{ flex: 1 }}>
													{user.isSuperuser ? (
														<div
															style={{
																display: "flex",
																flexDirection: "column",
																alignItems: "flex-start",
															}}>
															<div
																style={{
																	display: "flex",
																	alignItems: "center",
																	gap: "5px",
																}}>
																<span style={{ color: "red" }}>*</span>
																<span style={{ fontSize: "14px" }}>जिल्ला:</span>
															</div>

															<select
																name="beneficiary_representative_district"
																value={data.beneficiary_representative_district || ""}
																onChange={handleFormData}
																id="beneficiary_representative_district1"
																style={
																	errorFields.beneficiary_representative_district
																		? {
																				border: "1px solid red",
																				height: "34px",
																				width: "100%",
																		  }
																		: { height: "34px", width: "100%" }
																}>
																<option>जिल्लाः</option>
																{districts.map(
																	(item: {
																		id: string | number | readonly string[] | undefined;
																		title_ne:
																			| boolean
																			| React.ReactChild
																			| React.ReactFragment
																			| React.ReactPortal
																			| Iterable<ReactI18NextChild>
																			| null
																			| undefined;
																	}) => (
																		<option value={item.id}>{item.title_ne}</option>
																	)
																)}
															</select>
														</div>
													) : (
														<div
															style={{
																display: "flex",
																flexDirection: "column",
																alignItems: "flex-start",
															}}>
															<span style={{ fontSize: "14px" }}>जिल्ला:</span>
															<span style={{ fontSize: "14px" }}>
																{user &&
																	user.profile &&
																	districtNameConverter(user.profile.district)}
															</span>
														</div>
													)}
												</div>
												<div style={{ flex: 1 }}>
													<div
														style={{
															display: "flex",
															flexDirection: "column",
															alignItems: "flex-start",
															flex: 1,
														}}>
														<div
															style={{
																display: "flex",
																alignItems: "center",
																gap: "5px",
															}}>
															<span style={{ color: "red" }}>*</span>
															<span style={{ fontSize: "14px" }}>गा.पा./न.पाः</span>
														</div>

														<select
															name="beneficiary_representative_municipality"
															value={data.beneficiary_representative_municipality || ""}
															onChange={handleFormData}
															id="beneficiary_representative_municipality1"
															style={
																errorFields.beneficiary_representative_municipality
																	? {
																			border: "1px solid red",
																			height: "34px",
																			width: "100%",
																	  }
																	: { height: "34px", width: "100%" }
															}>
															<option> गा.पा./न.पाः</option>
															{beneficiarySelectedMunicipality.map(
																(item: {
																	id: string | number | readonly string[] | undefined;
																	title_ne:
																		| boolean
																		| React.ReactChild
																		| React.ReactFragment
																		| React.ReactPortal
																		| Iterable<ReactI18NextChild>
																		| null
																		| undefined;
																}) => (
																	<option value={item.id}>{item.title_ne}</option>
																)
															)}
														</select>
													</div>
												</div>
											</div>
											<div style={{ display: "flex", gap: "20px" }}>
												<div
													style={{
														display: "flex",
														flexDirection: "column",
														alignItems: "flex-start",
														flex: 1,
													}}>
													<div
														style={{
															display: "flex",
															alignItems: "center",
															gap: "5px",
														}}>
														<span style={{ color: "red" }}>*</span>
														<span style={{ fontSize: "14px" }}>वडा नंं.</span>
													</div>

													<select
														name="beneficiary_representative_ward"
														value={data.beneficiary_representative_ward || ""}
														onChange={handleFormData}
														id="beneficiary_representative_ward1"
														style={
															errorFields.beneficiary_representative_ward
																? {
																		border: "1px solid red",
																		height: "34px",
																		width: "100%",
																  }
																: { height: "34px", width: "100%" }
														}>
														<option> वडा नंं.</option>
														{beneficiarySelectedWard.map(
															(item: {
																id: string | number | readonly string[] | undefined;
																title: string | number;
															}) => (
																<option value={item.id}>{englishToNepaliNumber(item.title)}</option>
															)
														)}
													</select>
												</div>
												<div>
													<div
														style={{
															display: "flex",
															flexDirection: "column",
															alignItems: "flex-start",
															flex: 1,
														}}>
														<div
															style={{
																display: "flex",
																alignItems: "center",
																gap: "5px",
															}}>
															<span style={{ color: "red" }}>*</span>
															<span style={{ fontSize: "14px" }}>ना.प्र.न.</span>
														</div>

														<input
															data-nepalify={"not inialized"}
															id="beneficiary_representative_citizenship_number"
															onBlur={handleFormData}
															onFocus={nepaliInput}
															type="text"
															name="beneficiary_representative_citizenship_number"
															// value={data.beneficiary_representative_citizenship_number}

															className={styles.inputClassName}
															style={
																errorFields.beneficiary_representative_citizenship_number
																	? {
																			borderBottom: "2px dotted red",
																			height: "34px",
																			width: "100%",
																	  }
																	: { height: "34px", width: "100%" }
															}
														/>
													</div>
												</div>
												<div
													className={styles.freeText}
													style={{
														marginBottom: "10px",
														display: "flex",
														flexDirection: "column",
														alignItems: "flex-start",
														flex: 2,
													}}>
													<div
														style={{
															display: "flex",
															alignItems: "center",
															gap: "5px",
														}}>
														<span style={{ color: "red" }}>*</span>
														<span style={{ fontSize: "14px" }}>बाजेेको नाम, थर:</span>
													</div>

													<input
														data-nepalify={"not inialized"}
														id="beneficiary_representative_grandfather_name"
														onBlur={handleFormData}
														onFocus={nepaliInput}
														type="text"
														// className={styles.inputClassName}
														name="beneficiary_representative_grandfather_name"
														// value={data.beneficiary_representative_grandfather_name}
														onChange={handleFormData}
														style={
															errorFields.beneficiary_representative_grandfather_name
																? {
																		borderBottom: "2px dotted red",
																		height: "34px",
																		width: "100%",
																  }
																: { height: "34px", width: "100%" }
														}
													/>
												</div>
											</div>
											<div>
												<div
													className={styles.freeText}
													style={{
														display: "flex",
														flexDirection: "column",
														alignItems: "flex-start",
														flex: 1,
													}}>
													<div
														style={{
															display: "flex",
															alignItems: "center",
															gap: "5px",
														}}>
														<span style={{ color: "red" }}>*</span>
														<span style={{ fontSize: "14px" }}>बाबुु/आमाको नाम, थर:</span>
													</div>

													<input
														data-nepalify={"not inialized"}
														id="beneficiary_representative_parent_name"
														onBlur={handleFormData}
														onFocus={nepaliInput}
														type="text"
														// className={styles.inputClassName}
														name="beneficiary_representative_parent_name"
														// value={data.beneficiary_representative_parent_name}

														style={
															errorFields.beneficiary_representative_parent_name
																? {
																		borderBottom: "2px dotted red",
																		height: "34px",
																		width: "100%",
																  }
																: { height: "34px", width: "100%" }
														}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className={styles.firstPartContainer}>
									<span style={{ fontSize: "16px" }}>
										{`${englishToNepaliNumber(3)}. बैंंक/वित्तीय संंस्थामा रहेेको खाताको विवरण`}
									</span>
									<div className={styles.formElements}>
										<div style={{ display: "flex", gap: "20px" }}>
											<div
												className={styles.freeText}
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "flex-start",
													flex: 2,
												}}>
												<span style={{ fontSize: "14px" }}>खातावालाको नाम, थरः</span>
												<input
													data-nepalify={"not inialized"}
													id="bank_account_holder_name"
													onBlur={handleFormData}
													onFocus={nepaliInput}
													type="text"
													// className={styles.inputClassName}
													name="bank_account_holder_name"
													// value={data.bank_account_holder_name}

													style={
														errorFields.bank_account_holder_name
															? {
																	borderBottom: "2px dotted red",
																	height: "34px",
																	width: "100%",
															  }
															: { height: "34px", width: "100%" }
													}
												/>
											</div>
											<div
												className={styles.freeText}
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "flex-start",
													flex: 2,
												}}>
												<span style={{ fontSize: "14px" }}>खाता नम्बरः</span>
												<input
													onFocus={null}
													type="text"
													// className={styles.inputClassName}
													onChange={handleFormData}
													name="bank_account_number"
													value={data.bank_account_number}
													style={
														errorFields.bank_account_number
															? {
																	borderBottom: "2px dotted red",
																	height: "34px",
																	width: "100%",
															  }
															: { height: "34px", width: "100%" }
													}
												/>
											</div>
										</div>
										<div style={{ display: "flex", gap: "20px" }}>
											<div
												className={styles.freeText}
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "flex-start",
													flex: 2,
												}}>
												<span style={{ fontSize: "14px" }}>बैंंक/वित्तीय संंस्थाको नामः</span>
												<input
													data-nepalify={"not inialized"}
													id="bank_name"
													onBlur={handleFormData}
													onFocus={nepaliInput}
													type="text"
													// className={styles.inputClassName}

													name="bank_name"
													// value={data.bank_name}
													style={
														errorFields.bank_name
															? {
																	borderBottom: "2px dotted red",
																	height: "34px",
																	width: "100%",
															  }
															: { height: "34px", width: "100%" }
													}
												/>
											</div>
											<div
												className={styles.freeText}
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "flex-start",
													flex: 2,
												}}>
												<span style={{ fontSize: "14px" }}>शाखाः</span>
												<input
													data-nepalify={"not inialized"}
													id="bank_branch_name"
													onBlur={handleFormData}
													onFocus={nepaliInput}
													type="text"
													// className={styles.inputClassName}

													name="bank_branch_name"
													// value={data.bank_branch_name}
													style={
														errorFields.bank_branch_name
															? {
																	borderBottom: "2px dotted red",
																	height: "34px",
																	width: "100%",
															  }
															: { height: "34px", width: "100%" }
													}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className={styles.firstPartContainer}>
									<span style={{ fontSize: "16px" }}>
										{`${englishToNepaliNumber(
											4
										)}. स्थायी ठेेगाना र नागरिकतामा उल्लिखित ठेेगाना फरक भएमा (बसाइँँसराइको विवरण उल्लेेख गर्नेे)`}
									</span>
									<div
										className={styles.formElements}
										style={{
											display: "flex",
											gap: "20px",
											flexDirection: "row",
										}}>
										<div
											className={styles.freeText}
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												flex: 2,
											}}>
											<span style={{ fontSize: "14px" }}>बसाइँँसराइ प्रमाण-पत्र नंः</span>
											<input
												data-nepalify={"not inialized"}
												id="migration_certificate_number"
												onBlur={handleFormData}
												onFocus={nepaliInput}
												type="text"
												// className={styles.inputClassName}

												name="migration_certificate_number"
												// value={data.migration_certificate_number}
												style={{ height: "34px", width: "100%" }}
											/>
										</div>
										<div
											className={styles.freeText}
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												flex: 2,
											}}>
											<span style={{ fontSize: "14px" }}>बसाइँँसराइको मितिः</span>
											{/* <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="migration_date_bs"
                                                value={data.migration_date_bs}
                                            /> */}
											<NepaliDatePicker
												inputClassName="form-control"
												// className={styles.datePick}
												// value={ADToBS(dateAlt)}
												value={data.migration_date_bs}
												onChange={(value: string) => {
													setData({
														...data,
														migration_date_bs: value,
													});
												}}
												options={{
													calenderLocale: "ne",
													valueLocale: "en",
												}}
											/>
										</div>
									</div>
								</div>
								<div className={styles.firstPartContainer}>
									<span style={{ fontSize: "16px" }}>
										{`${englishToNepaliNumber(
											5
										)}. लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको औंठा छाप लाभग्राही/संंरक्षक/अधिकार प्राप्त व्यक्तिको हस्ताक्षर`}
									</span>
									<div className={styles.formElements}>
										<div style={{ display: "flex", gap: "20px" }}>
											<div
												className={styles.freeText}
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "flex-start",
													flex: 1,
												}}>
												<span style={{ fontSize: "14px" }}>मितिः</span>
												{/* <input
                                                type="text"
                                                className={styles.inputClassName}
                                                onChange={handleFormData}
                                                name="signed_date"
                                                value={data.signed_date}
                                            /> */}

												<NepaliDatePicker
													inputClassName="form-control"
													// className={styles.datePick}
													// value={ADToBS(dateAlt)}
													value={data.signed_date}
													onChange={(value: string) => {
														setData({
															...data,
															signed_date: value,
														});
													}}
													options={{
														calenderLocale: "ne",
														valueLocale: "en",
													}}
												/>
											</div>
											<div
												className={styles.freeText}
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "flex-start",
													flex: 3,
												}}>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "5px",
													}}>
													<span style={{ color: "red" }}>*</span>
													<span style={{ fontSize: "14px" }}>साक्षीको नाम, थर</span>
												</div>

												<input
													data-nepalify={"not inialized"}
													id="withness_name_nepali"
													onBlur={handleFormData}
													onFocus={nepaliInput}
													type="text"
													// className={styles.inputClassName}

													name="withness_name_nepali"
													// value={data.withness_name_nepali}
													style={
														errorFields.withness_name_nepali
															? {
																	borderBottom: "2px dotted red",
																	height: "34px",
																	width: "100%",
															  }
															: { height: "34px", width: "100%" }
													}
												/>
											</div>
										</div>
										<div style={{ display: "flex", gap: "20px" }}>
											<div
												className={styles.freeText}
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "flex-start",
													flex: 2,
												}}>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "5px",
													}}>
													<span style={{ color: "red" }}>*</span>
													<span style={{ fontSize: "14px" }}>लाभग्राहीसँँगको नाता</span>
												</div>

												<input
													data-nepalify={"not inialized"}
													id="withness_relation"
													onBlur={handleFormData}
													onFocus={nepaliInput}
													type="text"
													// className={styles.inputClassName}

													name="withness_relation"
													// value={data.withness_relation}
													style={
														errorFields.withness_relation
															? {
																	borderBottom: "2px dotted red",
																	height: "34px",
																	width: "100%",
															  }
															: { height: "34px", width: "100%" }
													}
												/>
											</div>
											<div
												className={styles.freeText}
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "flex-start",
													flex: 2,
												}}>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "5px",
													}}>
													<span style={{ color: "red" }}>*</span>
													<span style={{ fontSize: "14px" }}>सम्पर्क नंं.</span>
												</div>

												<input
													data-nepalify={"not inialized"}
													id="withness_contact_number"
													onFocus={nepaliInput}
													type="text"
													// className={styles.inputClassName}
													onBlur={handleFormData}
													name="withness_contact_number"
													// value={data.withness_contact_number}
													style={
														errorFields.withness_contact_number ||
														phoneNumberValidation.witnessContactValidation
															? {
																	borderBottom: "2px dotted red",
																	height: "34px",
																	width: "100%",
															  }
															: { height: "34px", width: "100%" }
													}
												/>
												{errorFields.withness_contact_number && data.withness_contact_number ? (
													<p
														style={{
															margin: "0",
															color: "red",
															fontSize: "14px",
														}}>
														सम्पर्क नम्बर नम्बरमा हुनुपर्छ
													</p>
												) : (
													""
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "20px",
								}}>
								<span style={{ fontSize: "16px" }}>
									{`${englishToNepaliNumber(6)}.अस्थायी आवास निर्माण हुुनेे जग्गाको विवरण`}
								</span>
								<div style={{ display: "flex", fontSize: "20px", gap: "20px" }}>
									<div className={styles.tempAddressIndividualDiv} style={{ flex: 1 }}>
										{user.isSuperuser ? (
											<div style={{ display: "flex", flexDirection: "column" }}>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "5px",
													}}>
													<span style={{ color: "red" }}>*</span>
													<span style={{ fontSize: "14px" }}> जिल्ला </span>
												</div>

												<select
													id="temporary_shelter_land_district"
													name="temporary_shelter_land_district"
													value={data.temporary_shelter_land_district || ""}
													onChange={handleFormData}
													style={
														errorFields.temporary_shelter_land_district
															? {
																	border: "1px solid red",
																	height: "34px",
																	width: "auto",
															  }
															: { height: "34px", width: "auto" }
													}>
													<option> जिल्ला</option>
													{districts.map(
														(item: {
															id: string | number | readonly string[] | undefined;
															title_ne:
																| boolean
																| React.ReactChild
																| React.ReactFragment
																| React.ReactPortal
																| Iterable<ReactI18NextChild>
																| null
																| undefined;
														}) => (
															<option value={item.id}>{item.title_ne}</option>
														)
													)}
												</select>
											</div>
										) : (
											<div style={{ display: "flex", flexDirection: "column" }}>
												<span style={{ fontSize: "14px" }}> जिल्ला </span>
												<span style={{ fontSize: "14px" }}>
													{user && user.profile && districtNameConverter(user.profile.district)}
												</span>
											</div>
										)}
									</div>
									<div className={styles.tempAddressIndividualDiv} style={{ flex: 1 }}>
										<div style={{ display: "flex", flexDirection: "column" }}>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "5px",
												}}>
												<span style={{ color: "red" }}>*</span>
												<span style={{ fontSize: "14px" }}> गा.पा/न.पा </span>
											</div>

											<select
												id="temporary_shelter_land_municipality"
												name="temporary_shelter_land_municipality"
												value={data.temporary_shelter_land_municipality || ""}
												onChange={handleFormData}
												style={
													errorFields.temporary_shelter_land_municipality
														? {
																border: "1px solid red",
																height: "34px",
																width: "auto",
														  }
														: { height: "34px", width: "auto" }
												}>
												<option> गा.पा/न.पा.</option>
												{tempSelectedMunicipality.map(
													(item: {
														id: string | number | readonly string[] | undefined;
														title_ne:
															| boolean
															| React.ReactChild
															| React.ReactFragment
															| React.ReactPortal
															| Iterable<ReactI18NextChild>
															| null
															| undefined;
													}) => (
														<option value={item.id}>{item.title_ne}</option>
													)
												)}
											</select>
										</div>
									</div>

									<div className={styles.tempAddressIndividualDiv} style={{ flex: 1 }}>
										<div className={styles.tempAddressIndividualDiv}>
											<div style={{ display: "flex", flexDirection: "column" }}>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "5px",
													}}>
													<span style={{ color: "red" }}>*</span>
													<span style={{ fontSize: "14px" }}> वडा नंं:</span>
												</div>

												<select
													id="temporary_shelter_land_ward"
													name="temporary_shelter_land_ward"
													value={data.temporary_shelter_land_ward || ""}
													onChange={handleFormData}
													style={
														errorFields.temporary_shelter_land_ward
															? {
																	border: "1px solid red",
																	height: "34px",
																	width: "auto",
															  }
															: { height: "34px", width: "auto" }
													}>
													<option>वडा नंं.</option>
													{tempSelectedWard.map(
														(item: {
															id: string | number | readonly string[] | undefined;
															title: string | number;
														}) => (
															<option value={item.id}>{englishToNepaliNumber(item.title)}</option>
														)
													)}
												</select>
											</div>
										</div>
									</div>
								</div>
								<div className={styles.tempAddressIndividualDiv} style={{ flex: 1 }}>
									<div style={{ display: "flex", flexDirection: "column" }}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<span style={{ color: "red" }}>*</span>
											<span style={{ fontSize: "14px" }}>टोल</span>
										</div>

										<input
											data-nepalify={"not inialized"}
											id="temporary_shelter_land_tole"
											onBlur={handleFormData}
											onFocus={nepaliInput}
											type="text"
											name="temporary_shelter_land_tole"
											// value={data.temporary_shelter_land_tole}

											className={styles.inputClassName}
											style={
												errorFields.temporary_shelter_land_tole
													? {
															borderBottom: "2px dotted red",
															height: "34px",
															width: "auto",
													  }
													: { height: "34px", width: "auto" }
											}
										/>
									</div>
								</div>
							</div>
							<div className={styles.firstPartDetails}>
								<h2 style={{ textDecoration: "underline" }}>ख. दोश्रो पक्ष</h2>
								<div className={styles.firstPartContainer} style={{ gap: "20px" }}>
									<div className={styles.formElements}>
										{user.isSuperuser ? (
											<>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "5px",
													}}>
													<span style={{ color: "red" }}>*</span>
													<span style={{ fontSize: "16px" }}>गा.पा/न.पा:</span>
												</div>

												<select
													id="operating_municipality123"
													name="operating_municipality"
													value={data.operating_municipality || ""}
													onChange={handleFormData}
													style={
														errorFields.operating_municipality
															? { border: "1px solid red", height: "34px" }
															: { height: "34px" }
													}>
													<option>गा.पा/न.पा</option>
													{municipalities.map(
														(item: {
															id: string | number | readonly string[] | undefined;
															title_ne:
																| boolean
																| React.ReactChild
																| React.ReactFragment
																| React.ReactPortal
																| Iterable<ReactI18NextChild>
																| null
																| undefined;
														}) => (
															<option value={item.id}>{item.title_ne}</option>
														)
													)}
												</select>
											</>
										) : (
											<span style={{ fontSize: "14px" }}>
												{" "}
												{municipalityNameConverter(user.profile.municipality)}
											</span>
										)}

										<div className={styles.freeText}>
											{/* (
                                            <input type="text" className={styles.inputClassName} value={municipalityNameConverter(user.profile.municipality)} disabled />

                                            ) */}
										</div>
										<div style={{ display: "flex", gap: "20px" }}>
											<div
												className={styles.freeText}
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "flex-start",
													flex: 3,
												}}>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "5px",
													}}>
													<span style={{ color: "red" }}>*</span>
													<span style={{ fontSize: "14px" }}>प्रमुुख प्रशासकीय अधिकृृतको नामः</span>
												</div>

												<input
													id="operating_municipality_officer_name"
													data-nepalify={"not inialized"}
													onBlur={handleFormData}
													onFocus={nepaliInput}
													type="text"
													// className={styles.inputClassName}

													name="operating_municipality_officer_name"
													// value={data.operating_municipality_officer_name}
													style={
														errorFields.operating_municipality_officer_name
															? {
																	borderBottom: "2px dotted red",
																	height: "34px",
																	width: "100%",
															  }
															: { height: "34px", width: "100%" }
													}
												/>
											</div>
											<div
												className={styles.freeText}
												style={{
													flex: 1,
													display: "flex",
													flexDirection: "column",
													alignItems: "flex-start",
												}}>
												<span style={{ fontSize: "14px" }}>मितिः</span>

												<NepaliDatePicker
													inputClassName="form-control"
													// className={styles.datePick}
													// value={ADToBS(dateAlt)}
													value={data.operating_municipality_signed_date}
													onChange={(value: string) => {
														setData({
															...data,
															operating_municipality_signed_date: value,
														});
													}}
													options={{
														calenderLocale: "ne",
														valueLocale: "en",
													}}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div>
								<h2>आवश्यक कागजातहरुः</h2>
								<div
									style={{
										margin: "10px 0px",
										display: "flex",
										flexDirection: "column",
										gap: "20px",
									}}>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "5px",
										}}>
										<span style={{ color: "red" }}>*</span>
										<span style={{ fontSize: "16px" }}>
											{" "}
											{`${englishToNepaliNumber(
												1
											)}. नागरिकता प्रमाण-पत्रको प्रतिलिपि वा राष्ट्रिय परिचयपत्रको प्रतिलिपि वा मतदाता परिचयपत्रको प्रतिलिपि वा वडाको सिफारिस`}
										</span>
									</div>

									<div
										style={{
											display: "flex",
											gap: "5px",
											alignItems: "flex-start",
										}}>
										<span style={{ fontSize: "14px" }}>फोटो:</span>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												gap: "5px",
											}}>
											<input
												type="file"
												accept=".pdf, image/*"
												id="file-input"
												// style={{ display: 'none' }}
												onChange={handleFileInputChange}
												name="identity_document"
											/>
											{errorFields.identity_document ? (
												<p style={{ margin: 0, color: "red" }}>कृपया फोटो अपलोड गर्नुहोस्</p>
											) : (
												""
											)}

											{data.identity_document ? (
												<img
													height={100}
													width={100}
													src={handleShowImage(data.identity_document)}
													alt="img"
												/>
											) : (
												""
											)}
											{imageOrFileValidation.identity_document_validation ? (
												<p style={{ margin: 0, color: "red" }}>कागजात फोटो वा pdf हुनुपर्छ</p>
											) : (
												""
											)}
										</div>
									</div>
								</div>
								<div
									style={{
										margin: "10px 0px",
										display: "flex",
										flexDirection: "column",
										gap: "20px",
									}}>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "5px",
										}}>
										<span style={{ color: "red" }}>*</span>
										<span style={{ fontSize: "16px" }}>
											{" "}
											{`${englishToNepaliNumber(
												2
											)}. पूर्ण रूपलेे क्षति भएको वा आंंशिक क्षति भएता पनि बसोवास गर्न योग्य नरहेको संंरचनाको फोटो`}
										</span>
									</div>

									<div
										style={{
											display: "flex",
											gap: "5px",
											alignItems: "flex-start",
										}}>
										<span style={{ fontSize: "14px" }}>फोटो:</span>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												gap: "5px",
											}}>
											<input
												type="file"
												accept=".pdf, image/*"
												id="file-input"
												style={data.infrastructure_photo.length ? { display: "none" } : {}}
												onChange={handleInfrastructurePhoto}
												name="infrastructure_photo"
												ref={fileInputRef}
											/>
											{errorFields.infrastructure_photo ? (
												<p style={{ margin: 0, color: "red" }}>कृपया फोटो अपलोड गर्नुहोस्</p>
											) : (
												""
											)}
											{data.infrastructure_photo.length
												? data.infrastructure_photo.map((item, index) => (
														<div style={{ display: "flex" }}>
															<div
																style={{
																	display: "flex",
																	alignItems: "flex-start",
																	gap: "10px",
																}}>
																<img
																	height={100}
																	width={100}
																	src={handleShowImage(item)}
																	alt="img"
																/>
																<img
																	src={close}
																	alt="close"
																	role="button"
																	onClick={() => handleRemoveImage(index)}
																	style={{ cursor: "pointer" }}
																/>
															</div>
														</div>
												  ))
												: ""}
											{data.infrastructure_photo.length ? (
												<button type="button" onClick={() => fileInputRef.current.click()}>
													थप फोटो थप्नुहोस् +
												</button>
											) : (
												""
											)}

											{imageOrFileValidation.infrastructure_photo_validation ? (
												<p style={{ margin: 0, color: "red" }}>कागजात फोटो वा pdf हुनुपर्छ</p>
											) : (
												""
											)}
										</div>
									</div>
								</div>
								{data.is_beneficiary_available_to_sign ? (
									<div
										style={{
											margin: "10px 0px",
											display: "flex",
											flexDirection: "column",
											gap: "20px",
										}}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											{/* <span style={{ color: "red" }}>*</span> */}
											<span style={{ fontSize: "16px" }}>
												{" "}
												{`${englishToNepaliNumber(
													3
												)}. घरमूूली उपस्थित नभएको अवस्थामा, मञ्जुुरीनामा सहितको निवेेदन`}
											</span>
										</div>

										<div
											style={{
												display: "flex",
												gap: "5px",
												alignItems: "flex-start",
											}}>
											<span style={{ fontSize: "14px" }}>फोटो:</span>
											<div
												style={{
													display: "flex",
													flexDirection: "column",
													gap: "5px",
												}}>
												<input
													type="file"
													accept=".pdf, image/*"
													id="file-input"
													// style={{ display: 'none' }}
													onChange={handleFileInputChange}
													name="application_document"
												/>
												{errorFields.application_document ? (
													<p style={{ margin: 0, color: "red" }}>कृपया फोटो अपलोड गर्नुहोस्</p>
												) : (
													""
												)}
												{data.application_document ? (
													<img
														height={100}
														width={100}
														src={handleShowImage(data.application_document)}
														alt="img"
													/>
												) : (
													""
												)}
												{imageOrFileValidation.application_document_validation ? (
													<p style={{ margin: 0, color: "red" }}>कागजात फोटो वा pdf हुनुपर्छ</p>
												) : (
													""
												)}
											</div>
										</div>
									</div>
								) : (
									""
								)}
								<div
									style={{
										margin: "10px 0px",
										display: "flex",
										flexDirection: "column",
										gap: "20px",
									}}>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "5px",
										}}>
										<span style={{ color: "red" }}>*</span>
										<span style={{ fontSize: "16px" }}>
											{`${
												data.is_beneficiary_available_to_sign
													? englishToNepaliNumber(4)
													: englishToNepaliNumber(3)
											}. प्रहरीको मुचुल्का (प्रत्येेक घरधुरीको मुचुल्का नभएको अवस्थामा सामुहिक मुचुल्का पनि मान्य हुनेे)`}
										</span>
									</div>

									<div
										style={{
											display: "flex",
											gap: "5px",
											alignItems: "flex-start",
										}}>
										<span style={{ fontSize: "14px" }}>फोटो:</span>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												gap: "5px",
											}}>
											<input
												type="file"
												accept=".pdf, image/*"
												id="file-input"
												// style={{ display: 'none' }}
												onChange={handleFileInputChange}
												name="police_report"
											/>
											{errorFields.police_report ? (
												<p style={{ margin: 0, color: "red" }}>कृपया फोटो अपलोड गर्नुहोस्</p>
											) : (
												""
											)}
											{data.police_report ? (
												<img
													height={100}
													width={100}
													src={handleShowImage(data.police_report)}
													alt="img"
												/>
											) : (
												""
											)}
											{imageOrFileValidation.police_report_validation ? (
												<p style={{ margin: 0, color: "red" }}>कागजात फोटो वा pdf हुनुपर्छ</p>
											) : (
												""
											)}
										</div>
									</div>
								</div>
							</div>
							{Object.values(errorFields).filter((i) => i === true).length ? (
								<span className={styles.ValidationErrors}>
									रातो रङले संकेत गरेको माथिको फारममा केही फिल्ड भर्न बाँकी छ, कृपया फारम पूरा
									गर्नुहोस् र पुन: प्रयास गर्नुहोस्
								</span>
							) : (
								""
							)}
							{phoneNumberValidation.benificiaryContactValidation ? (
								<span className={styles.ValidationErrors}>
									लाभग्राहीको सम्पर्क नम्बर १० अंकको हुनुपर्दछ
								</span>
							) : (
								""
							)}
							{phoneNumberValidation.witnessContactValidation ? (
								<span className={styles.ValidationErrors}>
									साक्षीको सम्पर्क नम्बर १० अंकको हुनुपर्छ
								</span>
							) : (
								""
							)}
							{backendError ? (
								<span className={styles.ValidationErrors}>
									तपाईंको इन्टरनेट वा सर्भरमा समस्या छ कृपया पुन: प्रयास गर्नुहोस्
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
									disabled={!!loading}>
									{loading ? "पेश गरिँदै छ..." : "पेश गर्नुहोस्"}
								</button>
							</div>
						</div>
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
)(createConnectedRequestCoordinator<ReduxProps>()(createRequestClient(requests)(TemporaryShelter)));
