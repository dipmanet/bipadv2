import React from "react";
import { connect } from "react-redux";

import { TitleContext } from "#components/TitleContext";
import {
	districtsSelector,
	hazardTypesSelector,
	languageSelector,
	municipalitiesSelector,
	provincesSelector,
	regionLevelSelector,
	regionsSelector,
	wardsSelector,
} from "#selectors";
import { getSanitizedIncidents, metricMap } from "../common";
import Map from "../Map";
import { generateOverallDataset } from "../utils/utils";

import styles from "./styles.module.scss";

// import LeftPane from './LeftPane';

const propTypes = {};

const defaultProps = {};

const mapStateToProps = (state, props) => ({
	provinces: provincesSelector(state),
	districts: districtsSelector(state),
	municipalities: municipalitiesSelector(state),
	wards: wardsSelector(state),
	regionLevel: regionLevelSelector(state, props),
	hazardTypes: hazardTypesSelector(state),
	regions: regionsSelector(state),
	language: languageSelector(state),
});

class Overview extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	constructor(props) {
		super(props);
		this.state = {};
	}

	static contextType = TitleContext;

	componentDidUpdate(prevProps) {
		const { startDate, endDate, currentSelection } = this.props;

		const selectedMetric = metricMap[currentSelection.key];
		const { setDamageAndLoss } = this.context;

		if (setDamageAndLoss) {
			const changed =
				prevProps.startDate !== startDate ||
				prevProps.endDate !== endDate ||
				prevProps.currentSelection.key !== currentSelection.key;

			if (changed) {
				setDamageAndLoss((prevState) => {
					if (
						prevState.mainModule !== selectedMetric.label ||
						prevState.startDate !== startDate ||
						prevState.endDate !== endDate
					) {
						return {
							...prevState,
							mainModule: selectedMetric.label,
							startDate,
							endDate,
						};
					}
					return prevState;
				});
			}
		}
	}

	render() {
		const {
			lossAndDamageList,
			provinces,
			districts,
			municipalities,
			wards,

			regions,
			hazardTypes,
			startDate,
			endDate,
			currentSelection,
			radioSelect,
			pending,
			language: { language },
			incidentData,
		} = this.props;
		// const {
		//     selectedMetricKey = 'count',
		// } = this.state;

		const sanitizedList = getSanitizedIncidents(lossAndDamageList, regions, hazardTypes);

		const { mapping, aggregatedStat } = generateOverallDataset(sanitizedList, radioSelect.id);

		const obj = {};

		const objectCreation =
			incidentData &&
			incidentData.data &&
			incidentData.data.map((item, i) => {
				obj[`${item.federalId}`] = { count: item.count, key: item.federalId };
				return null;
			});

		const maxDataValue = incidentData?.data?.length
			? Math.max(...incidentData.data.map((item) => item.count))
			: 1;

		const selectedMetric = metricMap[currentSelection.key];
		const maxValue = Math.max(selectedMetric.metricFn(aggregatedStat), 1);

		const geoareas =
			(radioSelect.id === 4 && wards) ||
			(radioSelect.id === 3 && municipalities) ||
			(radioSelect.id === 2 && districts) ||
			(radioSelect.id === 1 && provinces);

		return (
			<Map
				geoareas={geoareas}
				mapping={obj}
				maxValue={maxDataValue}
				sourceKey="loss-and-damage-overview"
				metric={selectedMetric.metricFn}
				metricName={selectedMetric.label}
				metricKey={selectedMetric.key}
				radioSelect={radioSelect.id}
				currentSelection={currentSelection.name}
				pending={pending}
				language={language}
				// onMetricChange={(m) => {
				//     this.setState({ selectedMetricKey: m });
				// }}
			/>
		);
	}
}

export default connect(mapStateToProps)(Overview);
