import React from "react";

import { _cs } from "@togglecorp/fujs";
import { Translation } from "react-i18next";
import { connect } from "react-redux";
import Icon from "#rscg/Icon";
import FormattedDate from "#rscv/FormattedDate";

import { languageSelector } from "#selectors";
import { convertDateAccToLanguage } from "#utils/common";
import styles from "./styles.module.scss";

interface Props {
	className?: string;
	startDate: number | string | Date;
	endDate: number | string | Date;
}
interface State {}

const mapStateToProps = (state) => ({
	language: languageSelector(state),
});

class DateRangeInfo extends React.PureComponent<Props, State> {
	public render() {
		const {
			className,
			startDate,
			endDate,
			language: { language },
		} = this.props;

		return (
			<div className={_cs(className, styles.dateDetails, "date-range-tour")}>
				<div className={styles.infoIconContainer}>
					<Icon className={styles.infoIcon} name="info" />
				</div>
				<div className={styles.label}>
					<Translation>{(t) => <span>{t("DateRangeInfo")}</span>}</Translation>
				</div>
				<FormattedDate className={styles.startDate} mode="yyyy-MM-dd" value={startDate} />

				{language === "np" && (
					<div className={styles.label}>
						<span>देखि</span>
					</div>
				)}

				{language === "en" && (
					<div className={styles.label}>
						<span>to</span>
					</div>
				)}

				<FormattedDate className={styles.endDate} mode="yyyy-MM-dd" value={endDate} />
				{language === "np" && (
					<div className={styles.label}>
						<span>सम्‍म</span>
					</div>
				)}
			</div>
		);
	}
}

export default connect(mapStateToProps)(DateRangeInfo);
