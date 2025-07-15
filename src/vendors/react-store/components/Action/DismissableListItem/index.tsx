import React, { useCallback } from "react";
import PropTypes from "prop-types";
import ListItem from "../../View/ListItem";
import DangerButton from "../Button/DangerButton";
import WarningButton from "../Button/WarningButton";

import styles from "./styles.module.scss";

const propTypes = {
	className: PropTypes.string,
	onDismiss: PropTypes.func,
	onEdit: PropTypes.func,
	itemKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	disabled: PropTypes.bool,
};

const defaultProps = {
	className: "",
	itemKey: undefined,
	disabled: false,
	onEdit: undefined,
	onDismiss: undefined,
};

const DismissableListItem = (props) => {
	const {
		className: classNameFromProps,
		onDismiss,
		onEdit,
		itemKey,
		disabled,
		...otherProps
	} = props;

	const handleEditButtonClick = useCallback(() => {
		if (onEdit) {
			onEdit(itemKey);
		}
	}, [onEdit, itemKey]);

	const handleDismissButtonClick = useCallback(() => {
		if (onDismiss) {
			onDismiss(itemKey);
		}
	}, [onDismiss, itemKey]);

	const className = `
        ${classNameFromProps}
        ${styles.dismissableListItem}
    `;

	return (
		<div className={className}>
			<ListItem className={styles.listItem} {...otherProps} />
			<div className={styles.actions}>
				{onEdit && (
					<WarningButton
						disabled={disabled}
						className={styles.editButton}
						onClick={handleEditButtonClick}
						transparent
						iconName="edit"
						smallVerticalPadding
						smallHorizontalPadding
					/>
				)}
				{onDismiss && (
					<DangerButton
						disabled={disabled}
						className={styles.dismissButton}
						onClick={handleDismissButtonClick}
						transparent
						iconName="close"
						smallVerticalPadding
						smallHorizontalPadding
					/>
				)}
			</div>
		</div>
	);
};

DismissableListItem.propTypes = propTypes;
DismissableListItem.defaultProps = defaultProps;

export default DismissableListItem;
