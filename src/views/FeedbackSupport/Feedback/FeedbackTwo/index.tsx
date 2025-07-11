/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react/prop-types */

/* eslint-disable css-modules/no-undef-class */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect, useRef, useState } from "react";
import { navigate } from "@reach/router";
import { connect } from "react-redux";
import { _cs } from "@togglecorp/fujs";
import Icon from "#rscg/Icon";
import Modal from "#rscv/Modal";
import ModalBody from "#rscv/Modal/Body";
import DangerButton from "#rsca/Button/DangerButton";
import { createConnectedRequestCoordinator, createRequestClient, methods } from "#request";
import Button from "../../../../vendor/react-store/v2/Action/Button";
import styles from "./styles.module.scss";

const requestOptions: { [key: string]: ClientAttributes<PropsWithRedux, Params> } = {
	TechnicalSupportPostRequest: {
		url: "/feedback/",
		method: methods.POST,
		body: ({ params }) => params && params.body,
		onSuccess: ({ response, params }) => {
			if (params && params.setSuccess) {
				params.setSuccess(true);
				params.setloader(response);
			}
		},
		onFailure: ({ error, params }) => {
			if (params && params.setResponse) {
				params.setResponse(error.response);
			}
			if (params && params.setFaramErrors) {
				// TODO: handle error
				console.warn("failure", error);
				params.setFaramErrors({
					$internal: ["Some problem occurred"],
				});
			}
		},
		onFatal: ({ error, params }) => {
			if (error) {
				params.setFailureResponse("Please check your internet connection and try again.");
				params.setloader(error);
				// params.setFaramErrors({
				//     $internal: ['Some problem occurred'],
				// });
			}
		},
		extras: { hasFile: true },
	},
};

const SupportTwo = (props) => {
	const [checked, setChecked] = useState(false);
	const [success, setsucess] = useState(false);
	const [loader, setloader] = useState(true);
	const [response, setresponse] = useState([]);
	const [failureResponse, setFailureResponse] = useState(false);
	const [screenshotMessage, setScreenshotMessage] = useState(false);
	const [onSubmit, setOnSubmit] = useState(false);
	const screenShotRef = useRef(null);

	const {
		requests: { TechnicalSupportPostRequest },
		className,
		onPreviousClick,
		data,
		setData,
		error,
		setError,
		setPosition,
		closeModal,
	} = props;

	const fileHandler = (e: any) => {
		setData({ ...data, screenshot: e.target.files[0] });
	};

	useEffect(() => {
		if (response && Object.keys(response).length > 0) {
			setloader(true);
			if (Object.keys(response).filter((item) => item === "screenshot")) {
				Object.values(response).map((i) => setScreenshotMessage(i));
			}
		}
	}, [response]);

	const handleSubmit = () => {
		setOnSubmit(true);
		const inputError = { ...error };
		if (data.feedback === "") {
			inputError.feedbackError = "* This field cannot be empty";
		} else {
			inputError.feedbackError = "";
		}
		if (!data.screenshot) {
			inputError.screenshotError = "* Please choose a file";
			setScreenshotMessage(false);
		} else {
			inputError.screenshotError = "";
		}
		setError(inputError);
	};

	useEffect(() => {
		if (success) {
			setData({
				fullName: "",
				designation: "",
				nameOfTheInstitution: "",
				email: "",
				isAnonymous: false,
				feedback: "",
				screenshot: "",
			});
			setError({
				fullNameError: "",
				designationError: "",
				nameOfTheInstitutionError: "",
				emailError: "",
				feedbackError: "",
				screenshotError: "",
			});
		}
	}, [success]);
	useEffect(() => {
		if (screenshotMessage || error.screenshotError) {
			setOnSubmit(false);
		}
	}, [screenshotMessage, error.screenshotError]);

	useEffect(() => {
		if (error) {
			setOnSubmit(false);
		}
	}, [error]);

	useEffect(() => {
		if (onSubmit) {
			if (!data.isAnonymous) {
				if (
					data.screenshot &&
					data.feedback &&
					data.fullName &&
					data.designation &&
					data.nameOfTheInstitution &&
					data.email &&
					!error.feedbackError &&
					!error.screenshotError
				) {
					setloader(false);
					setFailureResponse(false);
					TechnicalSupportPostRequest.do({
						body: data,
						setSuccess: setsucess,
						setloader,
						setResponse: setresponse,
						setFailureResponse,
					});
				}
			}

			if (data.isAnonymous) {
				if (
					data.screenshot &&
					data.feedback &&
					!data.fullName &&
					!data.designation &&
					!data.nameOfTheInstitution &&
					!data.email &&
					!error.feedbackError &&
					!error.screenshotError
				) {
					setloader(false);
					setFailureResponse(false);
					TechnicalSupportPostRequest.do({
						body: data,
						setSuccess: setsucess,
						setloader,
						setResponse: setresponse,
						setFailureResponse,
					});
				}
			}
		}
	}, [data, error, onSubmit]);

	return (
		<>
			<Modal className={_cs(success ? styles.login_modal_submit : styles.loginModal, className)}>
				<ModalBody className={styles.content}>
					<DangerButton
						transparent
						iconName="close"
						onClick={() => closeModal()}
						title="Close Modal"
						className={styles.closeButton}
					/>
					<div className={styles.container_leave_support}>
						<div className={styles.wrapper_leave_support}>
							<div className={styles.feedback_container}>
								<div className={styles.feedback_wrapper}>
									<div className={styles.feed_head_container}>
										<div className={styles.feed_head_wrapper}>technical support request</div>
									</div>
									<div className={styles.feed_desc}>
										To request for technical support regarding BIPAD portal
									</div>
									<div className={styles.feedback_button}>
										<Button className={styles.feedback_btn} onClick={() => setPosition(0)}>
											TECHNICAL SUPPORT REQUEST FORM
										</Button>
									</div>
								</div>
							</div>
							<div className={styles.tech_support_container}>
								<div
									className={styles.tech_support_wrapper}
									style={success ? { display: "none" } : null}>
									<div className={styles.tech_support_head}>Leave Feedback</div>

									<div className={styles.comment}>
										<div className={styles.comment_head}>Kindly specify Your Feedback:</div>
										<div className={styles.comment_input}>
											<textarea
												type="text"
												name="feedback"
												placeholder="Please Specify.."
												className={
													error.feedbackError ? styles.error_comment : styles.input_comment
												}
												value={data ? data.feedback : ""}
												onChange={(e) =>
													setData({
														...data,
														feedback: e.target.value,
													})
												}
											/>
										</div>
									</div>

									{error.feedbackError ? (
										<div className={styles.error_text}>{error.feedbackError}</div>
									) : null}

									<div className={styles.screenshot}>
										<div className={styles.screenshot_head}>Attach the screenshot</div>
										<div
											className={
												screenshotMessage
													? styles.error_screenshot_container
													: styles.screenshot_container
											}>
											<div className={styles.choose_button}>
												<input
													name="screenshot"
													type="file"
													placeholder="Photo "
													className={styles.choose_btn}
													ref={screenShotRef}
													onChange={(e) => fileHandler(e)}
												/>
											</div>
										</div>
									</div>
									{error.screenshotError ? (
										<div className={styles.error_text}>{error.screenshotError}</div>
									) : null}

									<div className={styles.tech_support_file_choose}>
										<Icon
											name="info"
											className={screenshotMessage ? styles.info_icon_error : styles.info_icon}
										/>

										<span className={screenshotMessage ? styles.info_text_red : styles.info_text}>
											{screenshotMessage || "Please choose a file less than 2MB."}
										</span>
									</div>

									<div className={styles.input_checkbox}>
										<div className="checkbox">
											<input
												type="checkbox"
												id="verify"
												className={styles.verify}
												name="verify"
												onChange={(e) => setChecked(e.target.checked)}
											/>
										</div>
										<label htmlFor="verify" className={styles.verify_text}>
											I hereby give my consent to store my personal details in BIPAD portal.
										</label>
									</div>

									<div className={styles.back_submit_button}>
										<Button className={styles.back_btn} onClick={onPreviousClick}>
											Back
										</Button>
										<Button
											className={styles.submit_btn}
											disabled={!checked}
											onClick={handleSubmit}>
											Submit
										</Button>
									</div>
								</div>

								{!loader && <div className={styles.loader} />}

								{failureResponse ? (
									<div className={styles.loaderTimeOut}>
										<span className={styles.timeOutText}>{failureResponse}</span>
									</div>
								) : null}

								{success && (
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
	createConnectedRequestCoordinator()(createRequestClient(requestOptions)(SupportTwo))
);
