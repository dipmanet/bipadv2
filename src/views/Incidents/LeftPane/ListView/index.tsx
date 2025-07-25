import React from "react";
import { Translation } from "react-i18next";
import { _cs } from "@togglecorp/fujs";
import PropTypes from "prop-types";

import VirtualizedListView from "#rscv/VirtualizedListView";
import IncidentItem from "../IncidentItem";

import styles from "./styles.module.scss";

const propTypes = {
	className: PropTypes.string,
	incidentList: PropTypes.arrayOf(PropTypes.object),
	recentDay: PropTypes.number.isRequired,
	hoveredIncidentId: PropTypes.number,
	onIncidentHover: PropTypes.func.isRequired,
};

const defaultProps = {
	className: undefined,
	hoveredIncidentId: undefined,
	incidentList: [],
};

const incidentKeySelector = (d) => d.id;

const EmptyComponent = () => (
	<Translation>
		{(t) => (
			<div className={styles.incidentEmpty}>{t("There are no incidents at the moment.")}</div>
		)}
	</Translation>
);

export default class IncidentListView extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	getIncidentRendererParams = (_, d) => {
		const { hazardTypes, recentDay, onIncidentHover, hoveredIncidentId } = this.props;

		return {
			data: d,
			hazardTypes,
			recentDay,
			onHover: onIncidentHover,
			isHovered: d.id === hoveredIncidentId,
		};
	};

	render() {
		const { className, incidentList } = this.props;

		return (
			<VirtualizedListView
				className={_cs(styles.incidentList, className)}
				data={incidentList}
				renderer={IncidentItem}
				rendererParams={this.getIncidentRendererParams}
				keySelector={incidentKeySelector}
				emptyComponent={EmptyComponent}
			/>
		);
	}
}
