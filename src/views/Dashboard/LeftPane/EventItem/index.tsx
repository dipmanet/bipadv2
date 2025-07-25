import React from "react";
import { _cs } from "@togglecorp/fujs";
import PropTypes from "prop-types";

import Cloak from "#components/Cloak";
import DateOutput from "#components/DateOutput";
import alertIcon from "#resources/icons/Alert.svg";
import Button from "#rsca/Button";
import DangerConfirmButton from "#rsca/ConfirmButton/DangerConfirmButton";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import styles from "./styles.module.scss";

const propTypes = {
	className: PropTypes.string,
};

const defaultProps = {
	className: undefined,
};

const emptyObject = {};

export default class EventItem extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	handleEditButtonClick = () => {
		const { onEditButtonClick, event } = this.props;

		if (!onEditButtonClick) {
			return;
		}

		onEditButtonClick(event);
	};

	handleDeleteButtonClick = () => {
		const { onDeleteButtonClick, event } = this.props;

		if (!onDeleteButtonClick) {
			return;
		}

		onDeleteButtonClick(event);
	};

	handleMouseEnter = () => {
		const { onHover, event } = this.props;

		if (onHover) {
			onHover(event.id);
		}
	};

	handleMouseLeave = () => {
		const { onHover } = this.props;

		if (onHover) {
			onHover();
		}
	};

	render() {
		const { event = emptyObject, className, hazardTypes, isHovered } = this.props;

		const { title, createdOn, hazard } = event;

		return (
			<div
				className={_cs(className, styles.eventItem, isHovered && styles.hovered)}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}>
				<ScalableVectorGraphics
					className={styles.icon}
					src={(hazardTypes[hazard] ? hazardTypes[hazard].icon : undefined) || alertIcon}
					style={{
						color: (hazardTypes[hazard] ? hazardTypes[hazard].color : undefined) || "#4666b0",
					}}
				/>
				<div className={styles.right}>
					<div className={styles.top}>
						<h3 className={styles.title}>{title}</h3>
						<Cloak hiddenIf={(p) => !p.change_event}>
							<Button
								transparent
								className={styles.editButton}
								onClick={this.handleEditButtonClick}
								iconName="edit">
								Edit
							</Button>
						</Cloak>
						<Cloak hiddenIf={(p) => !p.delete_alert}>
							<DangerConfirmButton
								iconName="delete"
								transparent
								className={styles.deleteButton}
								onClick={this.handleDeleteButtonClick}
								confirmationMessage="Are you sure to delete the Alert?">
								Delete
							</DangerConfirmButton>
						</Cloak>
					</div>
					<div className={styles.bottom}>
						<DateOutput className={styles.createdOn} value={createdOn} />
					</div>
				</div>
			</div>
		);
	}
}
