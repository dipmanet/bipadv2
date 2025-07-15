import React from "react";
import PropTypes from "prop-types";

import Icon from "../../../General/Icon";

import styles from "./styles.module.scss";

const ActionButtons = ({
	disabled,
	readOnly,
	onClearButtonClick,
	onTodayButtonClick,
	// onCalendarButtonClick,
	className,
}) => {
	const classNames = [className, "action-buttons"];

	const clearButtonClassName = ["button", styles.button, "clear", styles.clear].join(" ");

	return (
		<div className={classNames.join(" ")}>
			<button
				className={clearButtonClassName}
				type="button"
				onClick={onClearButtonClick}
				title="Clear time"
				tabIndex="-1"
				disabled={disabled || readOnly}>
				<Icon name="closeRound" />
			</button>
			<button
				onClick={onTodayButtonClick}
				className={styles.button}
				type="button"
				title="Set time to now"
				tabIndex="-1"
				disabled={disabled || readOnly}>
				<Icon name="clock" />
			</button>
			{/*
            <button
                onClick={onCalendarButtonClick}
                className={styles.button}
                type="button"
                title="Open date picker"
                tabIndex="-1"
                disabled={disabled}
            >
                <Icon name="calendar" />
            </button>
            */}
		</div>
	);
};

ActionButtons.propTypes = {
	onClearButtonClick: PropTypes.func.isRequired,
	onTodayButtonClick: PropTypes.func.isRequired,
	// onCalendarButtonClick: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	readOnly: PropTypes.bool,
	className: PropTypes.string,
};

ActionButtons.defaultProps = {
	disabled: false,
	readOnly: false,
	className: "",
};

export default ActionButtons;
