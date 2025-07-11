import React from "react";

import DateRangeInfo from "#components/DateRangeInfo";
import modalize from "#rscg/Modalize";
import Button from "#rsca/Button";

import { pastDaysToDateRange } from "#utils/transformations";
import { DAEarthquakeFiltersElement } from "#types";
import * as PageType from "#store/atom/page/types";
import PollutionModal from "../Modal";

import styles from "./styles.module.scss";

const ModalButton = modalize(Button);

const getDates = (eqFilters: DAEarthquakeFiltersElement) => {
	const { dataDateRange } = eqFilters;
	const { rangeInDays } = dataDateRange;
	let startDate;
	let endDate;
	if (rangeInDays !== "custom") {
		({ startDate, endDate } = pastDaysToDateRange(rangeInDays));
	} else {
		({ startDate, endDate } = dataDateRange);
	}
	return [startDate, endDate];
};

interface Props {
	eqFilters: DAEarthquakeFiltersElement;
	earthquakeList: PageType.DataArchiveEarthquake[];
}

const TopBar = (props: Props) => {
	const { eqFilters, earthquakeList } = props;
	const [startDate, endDate] = getDates(eqFilters);

	return (
		<div className={styles.topBar}>
			<DateRangeInfo
				className={styles.dateRange}
				startDate={startDate || "N/A"}
				endDate={endDate || "N/A"}
			/>
			<ModalButton
				className={styles.showDetailsButton}
				transparent
				iconName="table"
				title="Show all data"
				modal={<PollutionModal dataArchiveEarthquake={earthquakeList} />}
			/>
		</div>
	);
};

export default TopBar;
