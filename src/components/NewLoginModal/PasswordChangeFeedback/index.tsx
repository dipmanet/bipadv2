import React from "react";
import DangerButton from "#rsca/Button/DangerButton";
import styles from "./styles.module.scss";

const PasswordChangeFeedback = (props) => {
	const { closeModal, feedback, loginAndReload } = props;
	const handleConfirm = () => loginAndReload(true);
	return (
		<div className={styles.feedbackContainer}>
			<h1>{feedback}</h1>
			<div className={styles.cancelAgreeBtns}>
				<DangerButton type="button" className={styles.agreeBtn} onClick={handleConfirm}>
					Ok
				</DangerButton>
			</div>
		</div>
	);
};

export default PasswordChangeFeedback;
