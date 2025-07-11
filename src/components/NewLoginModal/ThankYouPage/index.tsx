import React, { useState } from "react";
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

interface OwnProps {
	className?: string;
	closeModal?: () => void;
	updatePage: () => string;
}

interface PropsFromDispatch {
	setAuth: typeof setAuthAction;
	setUserDetail: typeof setUserDetailAction;
}

type ReduxProps = OwnProps & PropsFromDispatch;

type Props = NewProps<ReduxProps, Params>;

const DetailsSecondPage = (props: Props) => {
	const { pending, closeModal, updatePage } = props;

	const handleCancelBtn = () => updatePage("loginPage");

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
						<h1>{t("Thank you")}</h1>
						<p>
							{t(
								"For requesting the login credential.Following the submission, you will receive a confirmation email with a confirmation code.Our technical team will review your details and provide you a username and password."
							)}
						</p>
						{/* <p>
                    Please check your email for submission confirmation.
                    Our technical team will review your details and provide
                    you with a username and password.
                </p> */}
						<div className={styles.cancelAgreeBtns}>
							<PrimaryButton type="button" className={styles.agreeBtn} onClick={closeModal}>
								{t("Close")}
							</PrimaryButton>
						</div>
					</div>
				</div>
			)}
		</Translation>
	);
};

export default DetailsSecondPage;
