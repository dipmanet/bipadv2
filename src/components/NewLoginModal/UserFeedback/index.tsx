import React from "react";
import DangerButton from "#rsca/Button/DangerButton";
import styles from "./styles.module.scss";

const UserFeedback = (props) => {
	const { closeModal, feedback } = props;
	const handleConfirm = () => {
		closeModal();
		window.location.reload();
	};
	return (
		<div className={styles.feedbackContainer}>
			{/* <h1>{feedback}</h1> */}
			<h1>Success! Please check your email for password reset</h1>
			<div className={styles.cancelAgreeBtns}>
				<DangerButton type="button" className={styles.agreeBtn} onClick={handleConfirm}>
					Ok
				</DangerButton>
			</div>
		</div>
	);
};

export default UserFeedback;
