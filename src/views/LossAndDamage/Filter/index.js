import React from "react";
import { connect } from "react-redux";
import Faram from "@togglecorp/faram";
import { _cs } from "@togglecorp/fujs";
import PropTypes from "prop-types";

import { setLossAndDamageFiltersAction } from "#actionCreators";
import CollapsibleView from "#components/CollapsibleView";
import HazardSelectionInput from "#components/HazardSelectionInput";
import RegionSelectInput from "#components/RegionSelectInput";
import { iconNames } from "#constants";
import Button from "#rsca/Button";
import DateInput from "#rsci/DateInput";
import SelectInput from "#rsci/SelectInput";
import { languageSelector, lossAndDamageFiltersSelector } from "#selectors";
import styles from "./styles.module.scss";

const propTypes = {
	// hazardTypeList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
	setFilters: PropTypes.func.isRequired,
	filters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	className: PropTypes.string,
};

const defaultProps = {
	className: "",
};

const mapStateToProps = (state) => ({
	// hazardTypeList: hazardTypeListSelector(state),
	filters: lossAndDamageFiltersSelector(state),
	language: languageSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
	setFilters: (params) => dispatch(setLossAndDamageFiltersAction(params)),
});

class LossAndDamageFilter extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	constructor(props) {
		super(props);

		this.state = {
			showFilters: true,
		};
	}

	static schema = {
		fields: {
			dateRange: [],
			region: [],
			hazard: [],
			metric: "count",
		},
	};

	handleShowFiltersButtonClick = () => {
		const { onExpandChange } = this.props;
		this.setState({ showFilters: true });

		if (onExpandChange) {
			onExpandChange(true);
		}
	};

	handleHideFiltersButtonClick = () => {
		const { onExpandChange } = this.props;
		this.setState({ showFilters: false });

		if (onExpandChange) {
			onExpandChange(false);
		}
	};

	handleFaramChange = (faramValues, faramErrors) => {
		this.props.setFilters({
			faramValues,
			faramErrors,
			pristine: false,
		});
	};

	render() {
		const {
			className,
			filters,
			onMetricChange,
			metricOptions,
			isTimeline,
			disabledRegionSelect,
			disabledMetricSelect,
			hideRegionSelect,
			hideMetricSelect,
			language: { language },
		} = this.props;

		const { faramValues, faramErrors } = filters;

		const { showFilters } = this.state;

		return (
			<CollapsibleView
				className={_cs(styles.filter, className, isTimeline && styles.timeline)}
				expanded={showFilters}
				collapsedViewContainerClassName={styles.showFilterButtonContainer}
				collapsedView={
					<Button
						onClick={this.handleShowFiltersButtonClick}
						iconName={iconNames.filter}
						title="Show filters"
					/>
				}
				expandedViewContainerClassName={styles.filtersContainer}
				expandedView={
					<React.Fragment>
						<header className={styles.header}>
							<h4 className={styles.heading}>Filters</h4>
							<Button
								onClick={this.handleHideFiltersButtonClick}
								iconName={iconNames.chevronUp}
								title="Hide Filters"
								transparent
							/>
						</header>
						<Faram
							className={styles.filterForm}
							onChange={this.handleFaramChange}
							onValidationFailure={this.handleFaramValidationFailure}
							onValidationSuccess={this.handleFaramValidationSuccess}
							schema={LossAndDamageFilter.schema}
							value={faramValues}
							error={faramErrors}>
							{!hideRegionSelect && (
								<RegionSelectInput
									className={styles.regionSelectionInput}
									faramElementName="region"
									disabled={disabledRegionSelect}
								/>
							)}
							{!hideMetricSelect && (
								<SelectInput
									className={styles.metricSelectionInput}
									label="Metric"
									faramElementName="metric"
									options={metricOptions}
									hideClearButton
									disabled={disabledMetricSelect}
								/>
							)}
							<DateInput
								className={styles.startDateInput}
								label="Start Date"
								faramElementName="start"
								language={language}
								// autoFocus
							/>
							<DateInput
								className={styles.endDateInput}
								label="End Date"
								faramElementName="end"
								language={language}
							/>
							<HazardSelectionInput
								className={styles.hazardSelectionInput}
								faramElementName="hazard"
							/>
						</Faram>
					</React.Fragment>
				}
			/>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LossAndDamageFilter);
