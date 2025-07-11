import React from "react";
import { connect } from "react-redux";

import { _cs } from "@togglecorp/fujs";
import DataTableModal from "#components/DataTableModal";

import { districtsMapSelector, languageSelector } from "#selectors";
import styles from "./styles.module.scss";

interface Props {
	className?: string;
	title: string;
	closeModal?: boolean;
}

const headers = (language) => [
	{
		key: "year",
		label: language === "en" ? "year" : "वर्ष",
	},
	{
		key: "district",
		label: language === "en" ? "District" : "जिल्‍ला",
	},
	{
		key: "rcp45",
		label: language === "en" ? "RCP 4.5" : "RCP ४.५",
	},
	{
		key: "sdRcp45",
		label: language === "en" ? "S.D. RCP 4.5" : "S.D. RCP ४.५",
	},
	{
		key: "rcp85",
		label: language === "en" ? "RCP 8.5" : "RCP ८.५",
	},
	{
		key: "sdRcp85",
		label: language === "en" ? "S.D. RCP 8.5" : "S.D. RCP ८.५",
	},
];

const mapStateToProps = (state) => ({
	districts: districtsMapSelector(state),
	language: languageSelector(state),
});

const keySelector = (d) => d.id;

class ClimateChangeTable extends React.PureComponent<Props> {
	private getRenderData = (data) =>
		data.map((d, i) => ({
			id: i,
			...d,
			district: (this.props.districts[d.district] || {}).title,
		}));

	public render() {
		const {
			className,
			data,
			title,
			closeModal,
			language: { language },
		} = this.props;

		const renderData = this.getRenderData(data);
		return (
			<DataTableModal
				className={_cs(className, language === "np" && styles.languageFont)}
				closeModal={closeModal}
				headers={headers(language)}
				data={renderData}
				title={title}
				keySelector={keySelector}
			/>
		);
	}
}

export default connect(mapStateToProps)(ClimateChangeTable);
