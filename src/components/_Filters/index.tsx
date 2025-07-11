import React from "react";
import Redux from "redux";
import { connect } from "react-redux";
import { _cs } from "@togglecorp/fujs";

import { setFiltersActionDP } from "#actionCreators";
import { AppState } from "#store/types";
import { Region, Event } from "#store/atom/page/types";
import { filtersSelectorDP, eventListSelector } from "#selectors";

import SelectInput from "#rsci/SelectInput";
import Button from "#rsca/Button";
import modalize from "#rscg/Modalize";
import RegionSelectInput from "#components/RegionSelectInput";
import FilterModal from "./FilterModal";

import styles from "./styles.module.scss";

interface OwnProps {
	className?: string;
	showEvent?: boolean;
	eventList?: Event[];
	showMetricSelect?: boolean;
	showDateRange?: boolean;
}

interface PropsFromAppState {
	filters: {
		faramValues: {
			region: Region;
		};
		faramErrors: {};
	};
}

interface PropsFromDispatch {
	setFilters: typeof setFiltersActionDP;
}

type Props = OwnProps & PropsFromAppState & PropsFromDispatch;

interface State {}

const ShowFilterButton = modalize(Button);

const mapStateToProps = (state: AppState) => ({
	filters: filtersSelectorDP(state),
	eventList: eventListSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setFilters: (params) => dispatch(setFiltersActionDP(params)),
});

interface FaramValues {
	region: Region;
}

interface FaramErrors {}

const eventKeySelector = (d: Event) => d.id;
const eventLabelSelector = (d: Event) => d.title;

class DashboardFilter extends React.PureComponent<Props, State> {
	private handleRegionChange = (newRegionValue: Region) => {
		const {
			filters: { faramValues, faramErrors },
			setFilters,
		} = this.props;

		setFilters({
			faramValues: {
				...faramValues,
				region: newRegionValue,
			},
			faramErrors,
			pristine: false,
		});
	};

	private handleEventChange = (newEventValue: number) => {
		const {
			filters: { faramValues, faramErrors },
			setFilters,
		} = this.props;

		setFilters({
			faramValues: {
				...faramValues,
				event: newEventValue,
			},
			faramErrors,
			pristine: false,
		});
	};

	private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
		this.props.setFilters({
			faramValues,
			faramErrors,
			pristine: false,
		});
	};

	public render() {
		const {
			className,
			showEvent,
			eventList,
			filters: { faramValues, faramErrors },
			showMetricSelect,
			showDateRange,
		} = this.props;

		return (
			<div className={_cs(styles.filters, className)}>
				<RegionSelectInput
					className={styles.regionSelectInput}
					value={faramValues.region}
					onChange={this.handleRegionChange}
				/>
				{showEvent && (
					<SelectInput
						// faramElementName="event"
						className={styles.eventSelectInput}
						label="event"
						onChange={this.handleEventChange}
						value={faramValues.event}
						options={eventList}
						showHintAndError={false}
						keySelector={eventKeySelector}
						labelSelector={eventLabelSelector}
					/>
				)}
				<ShowFilterButton
					iconName="filter"
					modal={
						<FilterModal
							onFaramChange={this.handleFaramChange}
							faramValues={faramValues}
							faramErrors={faramErrors}
							showMetricSelect={showMetricSelect}
							showDateRange={showDateRange}
						/>
					}
				/>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardFilter);
