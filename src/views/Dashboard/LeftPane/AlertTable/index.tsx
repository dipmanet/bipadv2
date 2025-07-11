import React from "react";
import { Translation } from "react-i18next";
import { connect } from "react-redux";
import { _cs, compareBoolean, compareDate, compareString } from "@togglecorp/fujs";
import memoize from "memoize-one";
import PropTypes from "prop-types";

import DownloadButton from "#components/DownloadButton";
import TableDateCell from "#components/TableDateCell";
import NormalTaebul from "#rscv/Taebul";
import ColumnWidth from "#rscv/Taebul/ColumnWidth";
import Sortable from "#rscv/Taebul/Sortable";
import { languageSelector } from "#selectors";
import { convertTableToCsv, defaultState, prepareColumns } from "#utils/table";
import styles from "./styles.module.scss";

const mapStateToProps = (state) => ({
	language: languageSelector(state),
});

const Taebul = Sortable(ColumnWidth(NormalTaebul));

const propTypes = {
	alertList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
	emptyComponent: PropTypes.func,
	className: PropTypes.string,
};

const defaultProps = {
	alertList: [],
	className: undefined,
	emptyComponent: undefined,
};

// eslint-disable-next-line react/no-multi-comp
class AlertTable extends React.PureComponent {
	static tableKeySelector = (data) => data.id;

	static propTypes = propTypes;

	static defaultProps = defaultProps;

	constructor(props) {
		super(props);

		const getHazardTitle = ({ hazardInfo: { title } = {} }) => title;
		const {
			language: { language },
		} = this.props;

		this.columns = prepareColumns(
			[
				{
					key: "verified",
					value: { title: language === "en" ? "Verified" : "प्रमाणित" },

					comparator: (a, b, d) => compareBoolean(a.verified, b.verified, d),

					transformer: (value) => (value ? "Yes" : "No"),
				},
				{
					key: "title",
					value: { title: language === "en" ? "Title" : "शीर्षक" },

					comparator: (a, b, d) => compareString(a.title, b.title, d),
				},
				{
					key: "description",
					value: { title: language === "en" ? "Description" : "विवरण" },
					comparator: (a, b, d) => compareString(a.description, b.description, d),
				},
				{
					key: "source",
					value: { title: language === "en" ? "Source" : "स्रोत" },
					comparator: (a, b, d) => compareString(a.source, b.source, d),
				},
				{
					key: "hazardInfo",
					value: { title: language === "en" ? "Hazard" : "प्रकोप" },
					comparator: (a, b, d) => compareString(getHazardTitle(a), getHazardTitle(b), d),

					transformer: getHazardTitle,
				},
				{
					key: "createdOn",
					value: { title: language === "en" ? "Started on" : "सुरु भएको" },
					comparator: (a, b, d) => compareDate(a.createdOn, b.createdOn, d),

					cellRenderer: TableDateCell,
				},
				{
					key: "expireOn",
					value: { title: language === "en" ? "Expires on" : "अलर्ट जारी रहेको समय" },
					comparator: (a, b, d) => compareDate(a.expireOn, b.expireOn, d),

					cellRenderer: TableDateCell,
				},
			],
			styles
		);

		this.state = {
			settings: defaultState,
		};
	}

	handleSettingsChange = (val) => {
		this.setState({ settings: val });
	};

	convertValues = memoize(convertTableToCsv);

	render() {
		const { className, alertList, emptyComponent } = this.props;

		const alertListForExport = this.convertValues(alertList, this.columns);

		return (
			<div className={_cs(className, styles.tabularView)}>
				<div className={styles.tableContainer}>
					<Taebul
						className={styles.alertsTable}
						headClassName={styles.head}
						data={alertList}
						keySelector={AlertTable.tableKeySelector}
						columns={this.columns}
						settings={this.state.settings}
						onChange={this.handleSettingsChange}
						rowHeight={30}
						emptyComponent={emptyComponent}
					/>
				</div>
				<div className={styles.downloadLinkContainer}>
					<Translation>
						{(t) => (
							<DownloadButton value={alertListForExport} name="alerts">
								{t("Download csv")}
							</DownloadButton>
						)}
					</Translation>
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps)(AlertTable);
