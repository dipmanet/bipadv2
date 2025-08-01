import React, { useState, useEffect } from "react";
import { Translation } from "react-i18next";
import Icon from "#rscg/Icon";

import DangerButton from "#rsca/Button/DangerButton";
import PrimaryButton from "#rsca/Button/PrimaryButton";

import { setAuthAction, setUserDetailAction } from "#actionCreators";

import { NewProps } from "#request";
import styles from "./styles.module.scss";

interface FaramValues {
	username?: string;
	password?: string;
}

interface State {
	faramErrors: object;
	faramValues: FaramValues;
}

interface Params {
	username?: string;
	password?: string;
	setFaramErrors?: (error: object) => void;
}

interface OwnProps {
	className?: string;
	closeModal?: () => void;
}

interface PropsFromDispatch {
	setAuth: typeof setAuthAction;
	setUserDetail: typeof setUserDetailAction;
}

type ReduxProps = OwnProps & PropsFromDispatch;

type Props = NewProps<ReduxProps, Params>;

const DetailsPage = (props: Props) => {
	const [errFullName, setErrFullName] = useState(false);
	const [errDesignation, setErrDesignation] = useState(false);
	const [errPhone, setErrPhone] = useState(false);
	const [errEmail, setErrEmail] = useState(false);
	const [showErr, setShowErr] = useState(false);

	const {
		pending,
		closeModal,
		updatePage,
		handleFullName,
		handleDesignation,
		handlePhone,
		handleEmail,
		phoneprop,
		nameprop,
		designationprop,
		emailprop,
	} = props;

	const handleDetails = () => updatePage("tncPage");

	useEffect(() => {
		if (!phoneprop) {
			setErrPhone(true);
		}
		if (!nameprop) {
			setErrFullName(true);
		}
		if (!designationprop) {
			setErrDesignation(true);
		}
		if (!emailprop) {
			setErrEmail(true);
		}
	}, [designationprop, emailprop, nameprop, phoneprop]);

	const handleAgreeBtn = (value) => {
		if (!errFullName && !errDesignation && !errPhone && !errEmail) {
			updatePage(value);
		} else {
			setShowErr(true);
		}
	};

	const handleCancelBtn = () => updatePage("loginPage");

	const handleFullnameChange = (e) => {
		const fullname = e.target.value;
		if (fullname === "") {
			setErrFullName(true);
		} else {
			setErrFullName(false);
		}
		handleFullName(fullname);
	};

	const handleDesignationChange = (e) => {
		const desig = e.target.value;
		if (desig === "") {
			setErrDesignation(true);
		} else {
			setErrDesignation(false);
		}
		handleDesignation(desig);
	};

	const handlePhoneChange = (e) => {
		const ph = e.target.value;
		const pattern = new RegExp(/^[0-9\b]+$/);
		if (!pattern.test(ph)) {
			setErrPhone(true);
		} else {
			setErrPhone(false);
		}
		handlePhone(ph);
	};

	const handleEmailChange = (e) => {
		const mail = e.target.value;
		const pattern = new RegExp(
			/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
		);
		if (!pattern.test(mail)) {
			setErrEmail(true);
		} else {
			setErrEmail(false);
		}
		handleEmail(mail);
	};

	return (
		<Translation>
			{(t) => (
				<div className={styles.mainPageDetailsContainer}>
					<div className={styles.welcomeBack}>
						<h1>{t("Welcome Back")}</h1>
						<p>{t("To login to BIPAD Portal, please use your credentials.")}</p>
						<div className={styles.loginBtn}>
							<PrimaryButton type="button" className={styles.newsignIn} onClick={handleCancelBtn}>
								{t("Sign in")}
							</PrimaryButton>
						</div>
					</div>

					<div className={styles.detailsFormContainer}>
						<div className={styles.closeBtn}>
							<DangerButton className={styles.dangerbtn} onClick={closeModal}>
								<Icon name="times" className={styles.closeIcon} />
							</DangerButton>
						</div>
						<div className={styles.formContainer}>
							<h2>{t("Please provide the following details")}</h2>
							<div className={styles.newSignupForm}>
								{showErr && errFullName ? (
									<span className={styles.errMsg}>{t("Full Name is required")}</span>
								) : (
									""
								)}
								<div className={styles.inputContainer}>
									<input
										type="text"
										className={styles.inputElement}
										placeholder={t("Full Name")}
										onChange={handleFullnameChange}
										value={nameprop || ""}
									/>
								</div>
								{showErr && errDesignation ? (
									<span className={styles.errMsg}>{t("Designation is required")}</span>
								) : (
									""
								)}
								<div className={styles.inputContainer}>
									<input
										type="text"
										className={styles.inputElement}
										placeholder={t("Desingation (eg. IT Officer)")}
										onChange={handleDesignationChange}
										value={designationprop || ""}
									/>
								</div>
								{showErr && errPhone ? (
									<span className={styles.errMsg}>{t("Valid Phone no. is required")}</span>
								) : (
									""
								)}
								<div className={styles.multinputContainer}>
									<div className={styles.smallElements}>
										<input
											type="tel"
											className={styles.smallElement}
											placeholder={t("+977")}
											disabled
										/>
									</div>
									<div className={styles.biggerElements}>
										<input
											type="tel"
											className={styles.biggerElement}
											placeholder={t("Phone No.")}
											onChange={handlePhoneChange}
											value={phoneprop || ""}
										/>
									</div>
								</div>
								{showErr && errEmail ? (
									<span className={styles.errMsg}>{t("Valid Official Email is required")}</span>
								) : (
									""
								)}
								<div className={styles.inputContainer}>
									<input
										type="text"
										className={styles.inputElement}
										placeholder={t("Official Email")}
										onChange={handleEmailChange}
										value={emailprop || ""}
									/>
								</div>
								<p className={styles.moreInfo}>
									<Icon name="info" className={styles.infoIcon} />
									{t(
										"The official email will be registered in the system and will be used as the primary email for any official correspondence."
									)}
								</p>
							</div>
						</div>
						<div className={styles.cancelAgreeBtns}>
							<PrimaryButton type="button" className={styles.cancelBtn} onClick={handleDetails}>
								{t("Back")}
							</PrimaryButton>

							<PrimaryButton
								type="button"
								className={styles.agreeBtn}
								onClick={() => handleAgreeBtn("detailsFirstPage")}>
								{t("Next")}
							</PrimaryButton>
						</div>
					</div>
				</div>
			)}
		</Translation>
	);
};

export default DetailsPage;
