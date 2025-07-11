/* eslint-disable no-nested-ternary */
import React from "react";
import { Translation } from "react-i18next";
import { _cs } from "@togglecorp/fujs";
import PropTypes from "prop-types";

import DistanceOutput from "#components/DistanceOutput";
import TextOutput from "#components/TextOutput";
import { iconNames } from "#constants";
import styles from "./styles.module.scss";
import resourceAttributes from "../resourceAttributes";

const propTypes = {
	className: PropTypes.string,
	title: PropTypes.string.isRequired,
	contactNumber: PropTypes.string,
	distance: PropTypes.number,
	// eslint-disable-next-line react/forbid-prop-types
	point: PropTypes.object.isRequired,
	resourceType: PropTypes.string.isRequired,
	inventories: PropTypes.arrayOf(PropTypes.object),
	showDetails: PropTypes.bool,
};

const defaultProps = {
	className: undefined,
	distance: 0,
	contactNumber: undefined,
	showDetails: false,
	inventories: [],
};

const emptyObject = {};
export default class ResourceItem extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	renderDetails = () => {
		const { resourceType, inventories } = this.props;

		const attributes = resourceAttributes[resourceType] || [];

		return (
			<div className={styles.additionalDetails}>
				<div className={styles.attributes}>
					{attributes.map((x) => (
						<TextOutput
							key={x.key}
							className={styles.info}
							label={x.label}
							value={this.props[x.key]}
						/>
					))}
				</div>
				{inventories.length > 0 && (
					<React.Fragment>
						<hr />
						<div className={styles.hr} />
						<div>
							<b> Inventories </b>
						</div>
						{inventories.map((inventory) => (
							<TextOutput
								key={inventory.id}
								label={inventory.item.title}
								value={inventory.quantity}
								isNumericValue
								suffix={` ${inventory.item.unit}`}
							/>
						))}
					</React.Fragment>
				)}
			</div>
		);
	};

	render() {
		const {
			className,
			title,
			titleNe,
			distance,
			contactNumber = "N/A",
			showDetails,
			// FIXME: point = emptyobject is a hack. point should be present
			// due to mapbox stringifying objects and so on
			point: { coordinates } = emptyObject,
			language,
		} = this.props;

		const googleLink =
			coordinates &&
			`https://www.google.com/maps/?q=${coordinates[1]},${coordinates[0]}&ll=${coordinates[1]},${coordinates[0]}&=13z`;

		return (
			<Translation>
				{(t) => (
					<div className={_cs(styles.resource, className)}>
						<h4 className={styles.heading}>
							{language === "en" ? title : titleNe === undefined ? title : titleNe}
						</h4>
						<div className={styles.basicInformation}>
							<DistanceOutput
								className={styles.distance}
								value={distance / 1000}
								language={language}
							/>
							<TextOutput
								className={styles.contactNumber}
								label={iconNames.telephone}
								value={contactNumber}
								iconLabel
							/>
						</div>
						{googleLink && (
							<div className={styles.googleLinkContainer}>
								<a
									className={styles.link}
									href={googleLink}
									target="_blank"
									rel="noopener noreferrer">
									{t("Get direction")}
								</a>
							</div>
						)}
						{showDetails && this.renderDetails()}
					</div>
				)}
			</Translation>
		);
	}
}
