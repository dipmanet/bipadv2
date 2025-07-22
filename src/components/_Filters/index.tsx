import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { _cs } from "@togglecorp/fujs";
import { setFiltersActionDP } from "#actionCreators";
import { AppState } from "#store/types";
import { Region, Event } from "#store/atom/page/types";
import { filtersSelectorDP, eventListSelector } from "#selectors";
import SelectInput from "#rsci/SelectInput";
import Button from "#rsca/Button";
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
		faramValues: { region: Region; event?: number };
		faramErrors: {};
	};
	eventList: Event[];
}

interface PropsFromDispatch {
	setFilters: typeof setFiltersActionDP;
}

type Props = OwnProps & PropsFromAppState & PropsFromDispatch;

const eventKeySelector = (d: Event) => d.id;
const eventLabelSelector = (d: Event) => d.title;

const DashboardFilter: React.FC<Props> = ({
	className,
	showEvent,
	eventList = [],
	filters: { faramValues, faramErrors },
	setFilters,
	showMetricSelect,
	showDateRange,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleRegionChange = useCallback(
		(newRegionValue: Region) => {
			setFilters({
				faramValues: { ...faramValues, region: newRegionValue },
				faramErrors,
				pristine: false,
			});
		},
		[faramValues, faramErrors, setFilters]
	);

	const handleEventChange = useCallback(
		(newEventValue: number) => {
			setFilters({
				faramValues: { ...faramValues, event: newEventValue },
				faramErrors,
				pristine: false,
			});
		},
		[faramValues, faramErrors, setFilters]
	);

	const handleFaramChange = useCallback(
		(newFaramValues: typeof faramValues, newFaramErrors: typeof faramErrors) => {
			setFilters({
				faramValues: newFaramValues,
				faramErrors: newFaramErrors,
				pristine: false,
			});
		},
		[setFilters]
	);

	return (
		<div className={_cs(styles.filters, className)}>
			<RegionSelectInput
				className={styles.regionSelectInput}
				value={faramValues.region}
				onChange={handleRegionChange}
			/>
			{showEvent && (
				<SelectInput
					className={styles.eventSelectInput}
					label="event"
					onChange={handleEventChange}
					value={faramValues.event}
					options={eventList}
					showHintAndError={false}
					keySelector={eventKeySelector}
					labelSelector={eventLabelSelector}
				/>
			)}
			<Button iconName="filter" onClick={() => setIsModalOpen(true)} />
			{isModalOpen && (
				<FilterModal
					onFaramChange={handleFaramChange}
					faramValues={faramValues}
					faramErrors={faramErrors}
					showMetricSelect={showMetricSelect}
					showDateRange={showDateRange}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
};

const mapStateToProps = (state: AppState) => ({
	filters: filtersSelectorDP(state),
	eventList: eventListSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setFilters: (params) => dispatch(setFiltersActionDP(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardFilter);
