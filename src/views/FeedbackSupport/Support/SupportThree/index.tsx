/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */

/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { _cs } from "@togglecorp/fujs";
import Icon from "#rscg/Icon";
import Modal from "#rscv/Modal";
import ModalBody from "#rscv/Modal/Body";
import DangerButton from "#rsca/Button/DangerButton";
import { createConnectedRequestCoordinator, createRequestClient, methods } from "#request";
import Button from "../../../../vendor/react-store/v2/Action/Button";
import styles from "./styles.module.scss";

const requestOptions: {
	[key: string]: ClientAttributes<PropsWithRedux, Params>;
} = {
	FeedbackPostRequest: {
		url: "/technical-support/",
		method: methods.POST,
		body: ({ params }) => params && params.body,
		onSuccess: ({ response, params }) => {
			if (params && params.setChecked) {
				params.setSucessResponse(response);
				params.setLoader(response);
			}
		},
		onFailure: ({ error, params }) => {
			if (error) {
				// TODO: handle error
				console.warn("failure", error);
				// params.setFaramErrors({
				//     $internal: ['Some problem occurred'],
				// });
			}
		},
		onFatal: ({ error, params }) => {
			if (error) {
				params.setFailureResponse("Please check your internet connection and try again.");
				params.setLoader(error);
				// params.setFaramErrors({
				//     $internal: ['Some problem occurred'],
				// });
			}
		},
		// extras: { hasFile: true },
	},
};

const FeedbackThree = (props) => {
	const [checked, setchecked] = useState(false);
	const [submit, setSubmit] = useState(false);
	const [sucessResponse, setSucessResponse] = useState(false);
	const [failureResponse, setFailureResponse] = useState(false);
	const [loader, setloader] = useState(true);
	const [clicked, setClicked] = useState(false);
	const {
		requests: { FeedbackPostRequest },
		className,
		onPreviousClick,
		data,
		setData,
		error,
		setError,
		setPosition,
		closeModal,
	} = props;

	const formHandler = (e: any) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const phoneNumberHandler = (e: any) => {
		if (e.target.value.length <= 10) {
			setData({
				...data,
				phoneNumber: e.target.value,
			});
		}
	};

	const inputValidation = () => {
		setClicked(true);
		setSubmit(true);
		const emailMessage = "* Please provide a valid email address.";
		const invalidMessage = "* Please provide a valid input";
		const newerror = { ...error };
		const validEmailRegex = RegExp(
			/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
		);
		const validNameRegex = new RegExp(/^(?![ .]+$)[a-zA-Z .]*$/);
		if (!validEmailRegex.test(data.email) || data.email === "") {
			newerror.emailError = emailMessage;
		} else {
			newerror.emailError = "";
		}
		if (!validNameRegex.test(data.fullName) || data.fullName === "") {
			newerror.fullNameError = invalidMessage;
		} else {
			newerror.fullNameError = "";
		}
		if (!validNameRegex.test(data.designation) || data.designation === "") {
			newerror.designationError = invalidMessage;
		} else {
			newerror.designationError = "";
		}

		if (!validNameRegex.test(data.nameOfTheInstitution) || data.nameOfTheInstitution === "") {
			newerror.nameOfTheInstitutionError = invalidMessage;
		} else {
			newerror.nameOfTheInstitutionError = "";
		}

		if (data.phoneNumber.length < 10) {
			newerror.phoneNumberError = "* Please enter valid phone no";
		} else {
			newerror.phoneNumberError = "";
		}

		setError(newerror);
	};

	const mainData = [
		{ name: "Technical Troubleshoot", value: data.technicalTroubleshoot },
		{ name: "Overview of BIPAD Portal", value: data.overviewOfBipadPortal },
		{ name: "Data Entry in BIPAD Portal", value: data.dataEntryInBipadPortal },
		{ name: "BIPAD Data Use", value: data.bipadDataUse },
		{ name: "BIPAD's Technical Specification", value: data.bipadTechnicalSpecification },
		{ name: "Others (Specify)", value: data.othersSpecify },
	];

	useEffect(() => {
		const filteredData = mainData
			.filter((item) => item.value === true)
			.map((itemName) => itemName.name);
		if (filteredData.length > 0) {
			setData({ ...data, typeOfTechSupport: filteredData });
		}
	}, []);

	useEffect(() => {
		if (error) {
			setSubmit(false);
		}
	}, [error]);

	useEffect(() => {
		if (submit) {
			if (
				data.fullName &&
				data.designation &&
				data.nameOfTheInstitution &&
				data.email &&
				data.phoneNumber &&
				!error.fullNameError &&
				!error.designationError &&
				!error.nameOfTheInstitutionError &&
				!error.emailError &&
				!error.phoneNumberError
			) {
				setloader(false);
				setFailureResponse(false);
				FeedbackPostRequest.do({
					body: data,
					setSucessResponse,
					setFailureResponse,
					setChecked: setchecked,
					setLoader: setloader,
				});
			}
		}
	}, [submit, data, error]);

	useEffect(() => {
		if (sucessResponse) {
			setData({
				institutionType: "",
				typeOfTechSupport: null,
				technicalTroubleshoot: false,
				overviewOfBipadPortal: false,
				dataEntryInBipadPortal: false,
				bipadDataUse: false,
				bipadTechnicalSpecification: false,
				othersSpecify: false,
				otherTechSupport: "",
				priorityLevel: "",
				description: "",
				appointmentDateTime: null,
				date: "",
				time: "",
				fullName: "",
				designation: "",
				nameOfTheInstitution: "",
				email: "",
				phoneNumber: "",
			});

			setError({
				institutionError: "",
				techSupportError: "",
				otherSpecifyError: "",
				priorityLevelError: "",
				descriptionError: "",
				dateError: "",
				timeError: "",
				firstNameError: "",
				designationError: "",
				institutionNameError: "",
				phoneNumberError: "",
				emailError: "",
			});
		}
	}, [sucessResponse]);

	return (
		<>
			<Modal
				className={_cs(sucessResponse ? styles.login_modal_submit : styles.loginModal, className)}>
				<ModalBody className={styles.content}>
					<DangerButton
						transparent
						iconName="close"
						onClick={() => closeModal()}
						title="Close Modal"
						className={styles.closeButton}
					/>
					<div className={styles.container_tech_support}>
						<div className={styles.wrapper_tech_support}>
							<div className={styles.feedback_container_first}>
								<div className={styles.feedback_wrapper}>
									<div className={styles.feed_head_container}>
										<div className={styles.feed_head_wrapper}>Leave Feedback</div>
									</div>
									<div className={styles.feedback_intro}>
										To send feedback/comments for the improvement of the BIPAD portal
									</div>
									<div className={styles.feedback_button}>
										<Button onClick={() => setPosition(1)} className={styles.feed_btn}>
											FEEDBACK FORM
										</Button>
									</div>
								</div>
							</div>
							<div className={styles.feedback_container_second}>
								<div
									className={styles.tech_support_wrapper}
									style={sucessResponse ? { display: "none" } : null}>
									<div className={styles.tech_support_head}>
										Please provide the following details
									</div>
									<div className={styles.tech_support_input}>
										<div className={error.fullNameError ? styles.input_error : styles.input}>
											<input
												name="fullName"
												type="text"
												autoComplete="off"
												className={styles.fname}
												placeholder="Full Name"
												value={data ? data.fullName : ""}
												onChange={formHandler}
											/>
										</div>
										{error.fullNameError && (
											<div className={styles.error_text}>{error.fullNameError}</div>
										)}
										<div className={error.designationError ? styles.input_error : styles.input}>
											<input
												name="designation"
												type="text"
												autoComplete="off"
												className={styles.designation}
												placeholder="Designation(eg.IT Officer)"
												value={data ? data.designation : ""}
												onChange={formHandler}
											/>
										</div>
										{error.designationError && (
											<div className={styles.error_text}>{error.designationError}</div>
										)}{" "}
										<div
											className={
												error.nameOfTheInstitutionError ? styles.input_error : styles.input
											}>
											<input
												name="nameOfTheInstitution"
												type="text"
												autoComplete="off"
												className={styles.insname}
												placeholder="Name of the Institution"
												value={data ? data.nameOfTheInstitution : ""}
												onChange={formHandler}
											/>
										</div>
										{error.nameOfTheInstitutionError && (
											<div className={styles.error_text}>{error.nameOfTheInstitutionError}</div>
										)}
										<div
											className={
												error.phoneNumberError ? styles.input_number_error : styles.input_number
											}>
											<span className={styles.country_code}>+977</span>

											<input
												name="phoneNumber"
												type="number"
												className={styles.phone_no}
												id="phone-no"
												autoComplete="off"
												value={data ? data.phoneNumber : ""}
												onChange={phoneNumberHandler}
												placeholder="Phone No"
											/>
										</div>
										{error.phoneNumberError && (
											<div className={styles.error_text}>{error.phoneNumberError}</div>
										)}
										<div className={error.emailError ? styles.input_error : styles.input}>
											<input
												name="email"
												type="email"
												autoComplete="off"
												placeholder="Official Email"
												className={styles.email}
												value={data ? data.email : ""}
												onChange={formHandler}
											/>
										</div>
										{error.emailError && (
											<div className={styles.error_text}>{error.emailError}</div>
										)}
									</div>

									<div className={styles.checkbox_items}>
										<input
											type="checkbox"
											id="verify"
											className={styles.verify}
											name="verify"
											onChange={(e: any) => setchecked(e.target.checked)}
										/>
										<label htmlFor="verify" className={styles.verify_text}>
											I hereby give my consent to store my personal details in BIPAD portal.
										</label>
									</div>

									<div className={styles.back_submit_button}>
										<Button className={styles.back_btn} onClick={onPreviousClick}>
											back
										</Button>
										<Button
											className={styles.submit_btn}
											disabled={!checked}
											onClick={inputValidation}>
											submit
										</Button>
									</div>
								</div>
								{!loader && <div className={styles.loader} />}

								{failureResponse ? (
									<div className={styles.loaderTimeOut}>
										<span className={styles.timeOutText}>{failureResponse}</span>
									</div>
								) : (
									""
								)}

								{sucessResponse && (
									<div className={styles.submit_div}>
										<div className={styles.tickWrapper}>
											<svg
												className={styles.checkmark}
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 52 52">
												<circle
													className={styles.checkmark__circle}
													cx="26"
													cy="26"
													r="25"
													fill="none"
												/>
												<path
													className={styles.checkmark__check}
													fill="none"
													d="M14.1 27.2l7.1 7.2 16.7-16.8"
												/>
											</svg>
										</div>
										<p className={styles.submit_text}>Your form has been submitted</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</ModalBody>
			</Modal>
		</>
	);
};

export default connect()(
	createConnectedRequestCoordinator()(createRequestClient(requestOptions)(FeedbackThree))
);
