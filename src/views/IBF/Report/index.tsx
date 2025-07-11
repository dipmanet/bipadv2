/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import Loader from "react-loader";
import Modal from "#rscv/Modal";
import ModalHeader from "#rscv/Modal/Header";
import ModalBody from "#rscv/Modal/Body";
import DangerButton from "#rsca/Button/DangerButton";
import {
	ibfPageSelector,
	districtsSelector,
	municipalitiesSelector,
	wardsSelector,
} from "#selectors";
import { setIbfPageAction } from "#actionCreators";
import { createConnectedRequestCoordinator, createRequestClient, methods } from "#request";
import style from "./styles.module.scss";
import Header from "./Header";
import Map from "./Map";
import ForecastDetail from "./ForecastDetail";
import SummaryTable from "./SummaryTable";
import Exposed from "./Exposed";
import ExposedSummary from "./ExposedSummary";
import Existing from "./Existing";
import Impacted from "./Impacted";

import * as utils from "../utils";

const mapStateToProps = (state: AppState): PropsFromAppState => ({
	ibfPage: ibfPageSelector(state),
	district: districtsSelector(state),
	municipality: municipalitiesSelector(state),
	ward: wardsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setIbfPage: (params) => dispatch(setIbfPageAction(params)),
});

interface OwnProps {
	handleModalClose: () => void;
}

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	floodHazard: {
		url: "/osm-meteor-flood-hazard/",
		method: methods.GET,
		onMount: true,
		query: ({ params }) => ({
			format: "json",
			summary: true,
			returnPeriod: params.returnPeriod,
			district: params.district,
			municipality: params.municipality,
		}),
		onSuccess: ({ response, params }) => {
			params.setSummary([response]);
			params.setPending(false);
		},
	},
};

const handleBtnClick = () => {
	const divToDisplay = document.getElementById("report");
	const pdf = new JsPDF("p", "mm", "a4");
	html2canvas(divToDisplay).then((canvas) => {
		const divImage = canvas.toDataURL("image/png");
		const imgWidth = 210;
		const pageHeight = 297;
		const imgHeight = (canvas.height * imgWidth) / canvas.width;
		let heightLeft = imgHeight;
		let position = 0;
		pdf.addImage(divImage, "PNG", 0, position, imgWidth, imgHeight, "", "FAST");
		heightLeft -= pageHeight;

		while (heightLeft >= 0) {
			position = heightLeft - imgHeight;
			pdf.addPage();
			pdf.addImage(divImage, "PNG", 0, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;
		}
		pdf.save("Report.pdf");
	});
};
const myStyle = {
	position: "relative",
	top: "50",
	left: "100",
	width: "85%",
	height: "400px",
	marginLeft: "50px",
};
const Report = (props) => {
	const {
		ibfPage: { selectedStation, stationDetail, returnPeriod, stations, leadTime },
		handleModalClose,
		district,
	} = props;

	const mystationdata = stationDetail.results.filter((item) => item.station === selectedStation.id);
	const [summary, setSummary] = useState();
	const [pending, setPending] = useState(false);

	let page = 0;

	const getNewPage = () => {
		page += 1;
		return page;
	};

	const getBuilding = (summarys) => utils.countBuilding(summarys[0].types.building);
	const getHighway = (summarys) => utils.countHighway(summarys[0].types.highway);
	const getLanduse = (summarys) => utils.countLand(summarys[0].types.landuse);

	const totalMunicipality = utils.uniquePlace(mystationdata, "municipality");
	const totalDistrict = district.filter((item) => item.id === Number(mystationdata[0].district));
	const selectedDistrict = totalDistrict[0];

	let filteredStation;
	if (Object.keys(selectedStation).length > 0) {
		filteredStation = stations.features.filter((item) => item.id === selectedStation.id);
	} else {
		filteredStation = stations.features.filter((item) => item.properties.is_activated === true);
	}

	let producedDate;
	if (filteredStation.length > 0) {
		producedDate = filteredStation[0].properties.calculation[0].recorded_date;
	}
	const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
	const forecastDate = new Date(producedDate).toLocaleString("en-NP", options);
	const mydate = new Date(producedDate);
	const effectiveDate = new Date(mydate.setDate(mydate.getDate() + leadTime)).toLocaleString(
		"en-NP",
		options
	);

	const firstTwoMun = totalMunicipality.slice(0, 2);
	const restMun = totalMunicipality.slice(2, totalMunicipality.length);

	useEffect(() => {
		setPending(true);
		props.requests.floodHazard.do({
			returnPeriod,
			district: selectedDistrict.id,
			setSummary,
			setPending,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Modal className={style.modal}>
			{pending && (
				<div className={style.loader}>
					<Loader color="white" />
				</div>
			)}
			<ModalHeader
				title={`${selectedStation.properties.station_name} Station`}
				rightComponent={
					<>
						<button className={style.download} onClick={handleBtnClick} type="button">
							Download
						</button>
						<DangerButton transparent iconName="close" onClick={handleModalClose} />
					</>
				}
			/>
			<ModalBody>
				<div id="report" className={style.report}>
					<div className={style.page}>
						<Header page={getNewPage()} />
						<div className={style.title}>
							{`Impact Based Forecast (IBF) for ${selectedStation.properties.station_name} Station`}
						</div>
						<Map myStyle={myStyle} effectedDristict={totalDistrict} />
						<ForecastDetail effectiveDate={effectiveDate} forecastDate={forecastDate} />
						<SummaryTable />
					</div>
					<div className={style.page}>
						<Header page={getNewPage()} />
						<Exposed />
						<Map
							myStyle={myStyle}
							effectedDristict={totalDistrict}
							effectedMunicipality={totalMunicipality}
						/>
						<div className={style.title}>Summary</div>
						<div className={style.table}>
							<div className={style.header}>
								<div className={style.col1}>District</div>
								<div className={style.col1}>Buildings</div>
								<div className={style.col1}>Roads (Km)</div>
								<div className={style.col1}>Land Use (SqKm)</div>
							</div>
							<div className={style.body}>
								<div className={style.col1}>
									{utils.getDistrictName(district, mystationdata[0].district)}
								</div>
								<div className={style.col1}>{summary && getBuilding(summary)}</div>
								<div className={style.col1}>
									{summary && Number(getHighway(summary) / 1000).toFixed(2)}
								</div>
								<div className={style.col1}>
									{summary && Number(getLanduse(summary) * 1e-6).toFixed(2)}
								</div>
							</div>
						</div>
						<div className={style.title}>Details</div>
						<div className={style.summary}>
							{firstTwoMun.map((item) => (
								<ExposedSummary muni={item} />
							))}
						</div>
					</div>
					{restMun.length > 0 ? (
						<div className={style.page}>
							<Header page={getNewPage()} />
							{restMun.map((item) => (
								<ExposedSummary muni={item} />
							))}
						</div>
					) : (
						""
					)}
					{totalMunicipality.map((item, index) => {
						if (index === 0) {
							return (
								<div className={style.page}>
									<Header page={getNewPage()} />
									<div className={style.section}>
										<div className={style.sectionNo}>03</div>
										<div className={style.content}>
											<div className={style.title}>Existing Risk</div>
										</div>
									</div>
									<Existing mun={item} />
								</div>
							);
						}
						return (
							<div className={style.page}>
								<Header page={getNewPage()} />
								<Existing mun={item} />
							</div>
						);
					})}
					{totalMunicipality.map((item, index) => {
						if (index === 0) {
							return (
								<>
									<div className={style.page}>
										<Header page={getNewPage()} />
										<div className={style.section}>
											<div className={style.sectionNo}>04</div>
											<div className={style.content}>
												<div className={style.title}>Potentially Imapcted</div>
											</div>
										</div>
										<div className={style.matrixMain}>
											<div className={style.xaxis}>
												<div className={style.label}>Risk Score</div>
												<div className={style.secondaryLabel}>
													<div>Very High</div>
													<div>High</div>
													<div>Medium</div>
													<div>Low</div>
													<div>Very Low</div>
												</div>
											</div>
											<div className={style.matrixInner}>
												<div className={style.matrix}>
													<div className={style.orange}>5</div>
													<div className={style.red}>10</div>
													<div className={style.red}>15</div>
													<div className={style.yellow}>4</div>
													<div className={style.orange}>8</div>
													<div className={style.red}>12</div>
													<div className={style.yellow}>3</div>
													<div className={style.orange}>6</div>
													<div className={style.orange}>9</div>
													<div className={style.green}>2</div>
													<div className={style.yellow}>4</div>
													<div className={style.orange}>6</div>
													<div className={style.green}>1</div>
													<div className={style.green}>2</div>
													<div className={style.yellow}>3</div>
												</div>
												<div className={style.yaxis}>
													<div className={style.secondaryLabel}>
														<div>{"< 1"}</div>
														<div>1 - 2</div>
														<div>{"> 2"}</div>
													</div>
													<div className={style.label}>Flood depth</div>
												</div>
											</div>
										</div>
										<Impacted mun={item} />
									</div>
								</>
							);
						}
						return (
							<div className={style.page}>
								<Header page={getNewPage()} />
								<Impacted mun={item} />
							</div>
						);
					})}
				</div>
			</ModalBody>
		</Modal>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createConnectedRequestCoordinator<ReduxProps>()(createRequestClient(requests)(Report)));
