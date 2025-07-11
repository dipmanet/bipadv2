import React from "react";

import DateRangeInfo from "#components/DateRangeInfo";
import modalize from "#rscg/Modalize";
import Button from "#rsca/Button";
import * as PageType from "#store/atom/page/types";
import RainModal from "../Modal";

import styles from "./styles.module.scss";

const ModalButton = modalize(Button);

interface Props {
	startDate?: string;
	endDate?: string;
	rainList: PageType.DataArchiveRain[];
}

const TopBar = (props: Props) => {
	const { rainList, startDate, endDate } = props;

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
				modal={<RainModal dataArchiveRain={rainList} />}
			/>
		</div>
	);
};

export default TopBar;
