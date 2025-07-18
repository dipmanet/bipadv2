import React from "react";
import { connect } from "react-redux";
import { _cs, isDefined } from "@togglecorp/fujs";
import memoize from "memoize-one";
import PropTypes from "prop-types";

import HazardsLegend from "#components/HazardsLegend";
import Numeral from "#rscv/Numeral";
import DonutChart from "#rscz/DonutChart";
import HorizontalBar from "#rscz/HorizontalBar";
import { hazardTypesSelector } from "#selectors";
import { groupList, sum } from "#utils/common";
import { hazardTypesList } from "#utils/domain";
import styles from "./styles.module.scss";

const propTypes = {
	className: PropTypes.string,
};

const defaultProps = {
	className: undefined,
};

const emptyList = [];

const peopleDeathChartColorScheme = ["#f95d6a"];

const estimatedLossChartColorScheme = ["#ffa600"];

const estimatedLossValueSelector = (d) => d.estimatedLoss;
const estimatedLossValueFormatter = (d) => {
	const numeral = Numeral.getNormalizedNumber({
		value: d,
		normal: true,
		precision: 0,
		lang: "ne",
	});

	const { number, normalizeSuffix } = numeral;

	if (normalizeSuffix) {
		return `${number}${normalizeSuffix}`;
	}

	return number;
};
const estimatedLossLabelSelector = (d) => d.label;

const deathCountValueSelector = (d) => d.peopleDeathCount;
const deathCountLabelSelector = (d) => d.label;

const donutChartValueSelector = (d) => d.value;
const donutChartLabelSelector = (d) => d.label;
const donutChartColorSelector = (d) => d.color;

const estimatedMonetaryLossLabelModifier = (label, value) =>
	`<div>${label}</div>` +
	`<div>${Numeral.renderText({ prefix: "Rs. ", value, precision: 0 })}</div>`;
const deathsLabelModifier = (label, value) => `<div>${label}</div>` + `<div>${value}</div>`;

const mapStateToProps = (state) => ({
	hazardTypes: hazardTypesSelector(state),
});

const barChartMargins = {
	left: 32,
	top: 12,
	right: 12,
	bottom: 32,
};

class Visualizations extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	getHazardTypes = memoize((lossAndDamageList) => {
		const { hazardTypes } = this.props;
		return hazardTypesList(lossAndDamageList, hazardTypes);
	});

	getHazardPeopleDeathCount = memoize((lossAndDamageList) => {
		const { hazardTypes } = this.props;
		return groupList(
			lossAndDamageList.filter((v) => isDefined(v.loss) && isDefined(v.loss.peopleDeathCount)),
			(loss) => loss.hazard
		)
			.map(({ key, value }) => ({
				// FIXME: potentially unsafe
				label: hazardTypes[key].title,
				color: hazardTypes[key].color,
				value: sum(value.map((val) => val.loss.peopleDeathCount)),
			}))
			.filter(({ value }) => value > 0)
			.sort((a, b) => a.value - b.value);
	});

	getHazardLossEstimation = memoize((lossAndDamageList) => {
		const { hazardTypes } = this.props;
		return groupList(
			lossAndDamageList.filter((v) => isDefined(v.loss) && isDefined(v.loss.estimatedLoss)),
			(loss) => loss.hazard
		)
			.map(({ key, value }) => ({
				// FIXME: potentially unsafe
				label: hazardTypes[key].title,
				color: hazardTypes[key].color,
				value: sum(value.map((val) => val.loss.estimatedLoss)),
			}))
			.filter(({ value }) => value > 0)
			.sort((a, b) => a.value - b.value);
	});

	getLossSummary = memoize((lossAndDamageList) =>
		groupList(
			lossAndDamageList.filter((v) => isDefined(v.loss)),
			(item) => new Date(item.incidentOn).getFullYear()
		).map(({ key, value }) => ({
			label: key,
			peopleDeathCount: sum(value.map((val) => val.loss.peopleDeathCount)),
			estimatedLoss: sum(value.map((val) => val.loss.estimatedLoss)),
		}))
	);

	render() {
		const { className, lossAndDamageList = emptyList } = this.props;

		const hazardLossEstimate = this.getHazardLossEstimation(lossAndDamageList);
		const filteredHazardTypesList = this.getHazardTypes(lossAndDamageList);
		const hazardDeaths = this.getHazardPeopleDeathCount(lossAndDamageList);
		const lossSummary = this.getLossSummary(lossAndDamageList);

		return (
			<div className={_cs(className, styles.visualizationsContainer)}>
				<div className={styles.barChartContainer}>
					<header className={styles.header}>
						<h4 className={styles.heading}>People death count</h4>
					</header>
					<HorizontalBar
						className={styles.chart}
						data={lossSummary}
						labelSelector={deathCountLabelSelector}
						valueSelector={deathCountValueSelector}
						colorScheme={peopleDeathChartColorScheme}
						tiltLabels
						margins={barChartMargins}
						bandPadding={0.1}
					/>
				</div>
				<div className={styles.barChartContainer}>
					<header className={styles.header}>
						<h4 className={styles.heading}>Estimated Monetary Loss</h4>
					</header>
					<HorizontalBar
						className={styles.chart}
						data={lossSummary}
						labelSelector={estimatedLossLabelSelector}
						valueSelector={estimatedLossValueSelector}
						valueLabelFormat={estimatedLossValueFormatter}
						colorScheme={estimatedLossChartColorScheme}
						tiltLabels
						margins={barChartMargins}
						bandPadding={0.1}
					/>
				</div>
				<div className={styles.donutContainer}>
					<header className={styles.header}>
						<h4 className={styles.heading}>Total people death by hazard</h4>
					</header>
					<DonutChart
						sideLengthRatio={0.4}
						className={styles.chart}
						data={hazardDeaths}
						labelSelector={donutChartLabelSelector}
						valueSelector={donutChartValueSelector}
						labelModifier={deathsLabelModifier}
						colorSelector={donutChartColorSelector}
						hideLabel
					/>
				</div>
				<div className={styles.donutContainer}>
					<header className={styles.header}>
						<h4 className={styles.heading}>Estimated monetary loss by hazard</h4>
					</header>
					<DonutChart
						sideLengthRatio={0.4}
						className={styles.chart}
						data={hazardLossEstimate}
						labelSelector={donutChartLabelSelector}
						valueSelector={donutChartValueSelector}
						labelModifier={estimatedMonetaryLossLabelModifier}
						colorSelector={donutChartColorSelector}
						hideLabel
					/>
				</div>
				<div className={styles.legendContainer}>
					<HazardsLegend
						filteredHazardTypes={filteredHazardTypesList}
						className={styles.legend}
						itemClassName={styles.legendItem}
					/>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps)(Visualizations);
