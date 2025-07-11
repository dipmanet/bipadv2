/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {
	ibfPageSelector,
	districtsSelector,
	municipalitiesSelector,
	wardsSelector,
} from "#selectors";
import { createConnectedRequestCoordinator, createRequestClient, methods } from "#request";
import * as utils from "#views/IBF/utils";
import Map from "../Map";
import style from "./styles.module.scss";

const mapStateToProps = (state: AppState): PropsFromAppState => ({
	ibfPage: ibfPageSelector(state),
	district: districtsSelector(state),
	municipality: municipalitiesSelector(state),
	ward: wardsSelector(state),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	householdJson: {
		url: "/ibf-household/",
		method: methods.GET,
		onMount: false,
		query: ({ params }) => ({
			format: "json",
			municipality: params.mun,
			limit: -1,
		}),
		onSuccess: ({ response, params }) => {
			params.setHousehold({ response });
		},
	},

	householdDistrictAverage: {
		url: "/ibf-household/",
		method: methods.GET,
		onMount: false,
		query: ({ params }) => ({
			format: "json",
			summary: "true",
			municipality: params.mun,
			limit: -1,
		}),
		onSuccess: ({ response, params }) => {
			params.setScore({ response });
		},
	},
};

const myStyle = {
	position: "relative",
	top: "50",
	left: "100",
	width: "85%",
	height: "400px",
	marginLeft: "50px",
};
const countImpactedHouse = (max, min, household, returnPeriod) => {
	let count;
	if (returnPeriod === 5) {
		count = household.response.results.filter(
			(item) => item.impact_score_five <= max && item.impact_score_five >= min
		).length;
	} else if (returnPeriod === 20) {
		count = household.response.results.filter(
			(item) => item.impact_score_twenty <= max && item.impact_score_twennty >= min
		).length;
	}
	return count;
};
const Impacted = (props) => {
	const {
		ibfPage: { selectedStation, stationDetail, returnPeriod },
		district,
		municipality,
	} = props;

	const [score, setScore] = useState();
	const [household, setHousehold] = useState();
	const mystationdata = stationDetail.results.filter((item) => item.station === selectedStation.id);

	const munName = utils.getMunicipalityName(municipality, props.mun);
	useEffect(() => {
		props.requests.householdDistrictAverage.do({ setScore, mun: props.mun });
		props.requests.householdJson.do({ setHousehold, mun: props.mun });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const totalDistrict = district.filter((item) => item.id === Number(mystationdata[0].district));

	return (
		<>
			<Map myStyle={myStyle} effectedDristict={totalDistrict} effectedMunicipality={[props.mun]} />
			<div className={style.section}>
				{household && (
					<>
						<div className={style.title}>
							{`Impact Level at ${munName} Municipality, ${utils.getDistrictName(
								district,
								mystationdata[0].district
							)}`}
						</div>
						<div className={style.tableContainer}>
							<table className={style.table} id={`impacted-table-${props.mun}`}>
								<thead className={style.header}>
									<th className={style.col1}>Impact Level</th>
									<th className={style.col2}>Number of Household</th>
								</thead>
								<tbody className={style.body}>
									<tr className={style.row}>
										<td className={style.col1}>Very High (5-6.4)</td>
										<td className={style.col2}>
											{countImpactedHouse(15, 10, household, returnPeriod)}
										</td>
									</tr>
									<tr className={style.row}>
										<td className={style.col1}>High (3.5-4.9)</td>
										<td className={style.col2}>
											{countImpactedHouse(9, 5, household, returnPeriod)}
										</td>
									</tr>
									<tr className={style.row}>
										<td className={style.col1}>Medium (2-3.4)</td>
										<td className={style.col2}>
											{countImpactedHouse(4, 3, household, returnPeriod)}
										</td>
									</tr>
									<tr className={style.row}>
										<td className={style.col1}>Low (1.9-0)</td>
										<td className={style.col2}>
											{countImpactedHouse(2, 1, household, returnPeriod)}
										</td>
									</tr>
								</tbody>
							</table>
							<div className={style.export} data-html2canvas-ignore="true">
								<ReactHTMLTableToExcel
									id="impacted-button"
									className="download-table-xls-button"
									table={`impacted-table-${props.mun}`}
									filename={`impacted-table-${props.mun}`}
									sheet={`impacted-table-${props.mun}`}
									buttonText="Export"
								/>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default connect(
	mapStateToProps,
	undefined
)(createConnectedRequestCoordinator<ReduxProps>()(createRequestClient(requests)(Impacted)));
