import PropTypes from "prop-types";
import React, { Fragment, useState, useCallback, useEffect, useMemo } from "react";
import { isFalsy } from "@togglecorp/fujs";

import Confirm from "../../View/Modal/Confirm";
import TextInput from "../../Input/TextInput";

import styles from "./styles.module.scss";

const propTypes = {
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
	challengeValue: PropTypes.string,
	challengeLabel: PropTypes.string,
	challengePlaceholder: PropTypes.string,

	skipConfirmation: PropTypes.bool,
	confirmationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
	confirmationTitle: PropTypes.string,
	confirmationDisabled: PropTypes.bool,
	onMessageShown: PropTypes.func,
};

const defaultProps = {
	onClick: () => {},
	disabled: false,
	confirmationTitle: undefined,
	challengeValue: undefined,
	challengeLabel: "",
	challengePlaceholder: "",
	skipConfirmation: false,
	confirmationDisabled: false,
	onMessageShown: undefined,
};

const ConfirmOnClick = (WrappedComponent) => {
	const ConfirmComponent = (props) => {
		const {
			disabled,
			confirmationMessage,
			confirmationTitle,
			onClick,
			challengeValue,
			skipConfirmation,
			challengeLabel,
			challengePlaceholder,
			confirmationDisabled,
			onMessageShown,
			...otherProps
		} = props;

		const [showConfirm, setShowConfirm] = useState(false);
		const [challengeTextInputValue, setChallengeTextInputValue] = useState("");

		const hasChallenge = useMemo(() => !isFalsy(challengeValue), [challengeValue]);
		const isConfirmationMessageNode = React.isValidElement(confirmationMessage);
		const challengeSuccess = challengeTextInputValue === challengeValue;
		const confirmDisabled = (hasChallenge && !challengeSuccess) || confirmationDisabled;

		const handleModalOpen = useCallback(() => {
			if (skipConfirmation) {
				onClick?.();
			} else {
				setShowConfirm(true);
				onMessageShown?.();
			}
		}, [onClick, skipConfirmation, onMessageShown]);

		const handleModalClose = useCallback(
			(confirm) => {
				setShowConfirm(false);
				setChallengeTextInputValue("");
				if (confirm) {
					onClick?.();
				}
			},
			[onClick]
		);

		const handleChallengeInputChange = useCallback((value) => {
			setChallengeTextInputValue(value);
		}, []);

		return (
			<Fragment>
				<WrappedComponent
					disabled={disabled || showConfirm}
					onClick={handleModalOpen}
					{...otherProps}
				/>
				{showConfirm && (
					<Confirm
						show
						disabled={confirmDisabled}
						onClose={handleModalClose}
						title={confirmationTitle}
						autoFocus={!hasChallenge}>
						<div className={styles.confirmContent}>
							{isConfirmationMessageNode ? confirmationMessage : <p>{confirmationMessage}</p>}

							{hasChallenge && (
								<div className={styles.challengeForm}>
									<span>{challengeLabel}</span>
									<TextInput
										className={styles.challengeText}
										value={challengeTextInputValue}
										placeholder={challengePlaceholder}
										onChange={handleChallengeInputChange}
										autoFocus
									/>
								</div>
							)}
						</div>
					</Confirm>
				)}
			</Fragment>
		);
	};

	ConfirmComponent.propTypes = propTypes;
	ConfirmComponent.defaultProps = defaultProps;

	return ConfirmComponent;
};

export default ConfirmOnClick;
