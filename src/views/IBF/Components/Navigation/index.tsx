import React, { useState } from "react";
import Redux from "redux";
import { connect } from "react-redux";
import previousIcon from "#resources/icons/Previous-item.svg";

import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import {
	districtsSelector,
	ibfPageSelector,
	municipalitiesSelector,
	provincesSelector,
	userSelector,
	wardsSelector,
} from "#selectors";
import { setIbfPageAction } from "#actionCreators";

// import Icon from '#rscg/Icon';
import IbfChart from "#resources/icons/ibf-chart.svg";
import { AppState } from "#types";
import { PropsFromDispatch } from "#views/IBF";
import { User } from "#store/atom/auth/types";
import { District, IbfPage, Municipality, Province, Ward } from "#store/atom/page/types";
import { convertJsonToCsv } from "#utils/common";
import { saveAs } from "file-saver";
import BoxModal from "../Modals";
import Report from "../../Report";
import style from "./styles.module.scss";

interface OwnProps {
	setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PropsFromState {
	ibfPage: IbfPage;
	province: Province[];
	district: District[];
	municipality: Municipality[];
	ward: Ward[];
	user: User | undefined;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;

type Props = ReduxProps;

const mapStateToProps = (state: AppState): PropsFromState => ({
	ibfPage: ibfPageSelector(state),
	province: provincesSelector(state),
	district: districtsSelector(state),
	municipality: municipalitiesSelector(state),
	ward: wardsSelector(state),
	user: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setIbfPage: (params) => dispatch(setIbfPageAction(params)),
});

const Navigation = (props: Props) => {
	const [modal, setModal] = useState(false);
	const [reports, setReport] = useState(false);
	const {
		ibfPage: { selectedStation, stationDetail, filter, houseCsv },
		setFormOpen,
		user,
		district,
		province,
		municipality,
		ward,
	} = props;
	const handleBtnClick = () => {
		props.setIbfPage({
			selectedStation: {},
			calendarData: [],
			returnPeriod: 0,
			leadTime: 0,
			overallFloodHazard: [],
			filter: { district: "", municipality: "", ward: [] },
			showHouseHold: 0,
			selectedIndicator: "",
			selectedLegend: "",
			householdJson: [],
			householdTemp: [],
			houseCsv: [],
			indicators: [],
			wtChange: 0,
			weights: [],
		});
		setFormOpen(false);
	};

	const mystationdata =
		stationDetail &&
		stationDetail.results > 0 &&
		stationDetail.results.filter((item) => item.station === selectedStation.id);

	function showModal() {
		setModal(true);
	}
	function showReport() {
		setReport(true);
	}
	const handleModalClose = () => {
		setModal(false);
	};
	const handleReportClose = () => {
		setReport(false);
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const getFederal = (houseFederal: any, federal: string) => {
		switch (true) {
			case federal === "district":
				return district.find((data: any) => data.id === houseFederal).title;
			case federal === "province":
				return province.find((data: any) => data.id === houseFederal).title;
			case federal === "ward":
				return ward.find((data: any) => data.id === houseFederal).title;
		}
	};

	const getPrecedence = (precedenceValue: number) => {
		switch (true) {
			case precedenceValue >= 0 && precedenceValue < 2:
				return "Very low";
			case precedenceValue >= 2 && precedenceValue < 3.5:
				return "Low";
			case precedenceValue >= 3.5 && precedenceValue < 5:
				return "Medium";
			case precedenceValue >= 5 && precedenceValue < 6.5:
				return "High";
			case precedenceValue >= 6.5:
				return "Very high";
		}
	};

	const handleHouseDataTransformation = React.useMemo(() => {
		const householdArray = houseCsv.map((houseObj: any) => {
			const transformedArr = {
				Id: houseObj.id,
				// 'Local unit': houseObj.localUnit,
				// Province: houseObj.province,
				// District: getDistrict(houseObj.district),
				// Municipality: houseObj.municipality,
				// Ward: houseObj.ward,
				Province: getFederal(houseObj.province, "province"),
				District: getFederal(houseObj.district, "district"),
				Municipality: houseObj.localUnit,
				// Municipality: houseObj.municipality,
				Ward: getFederal(houseObj.ward, "ward"),

				// ...(user && {
				//     'House id': houseObj.houseId,
				//     'Household name': houseObj.householdName,
				//     'Household contact number': houseObj.householdContactNumber,
				// }),
				"House id": houseObj.houseId,
				"Household name": houseObj.householdName,
				"Household contact number": houseObj.householdContactNumber,
				"Normalized risk score": houseObj.normalized_risk_score,
				"Normalized hazard and exposure": houseObj.normalized_hazard_and_exposure,
				"Normalized vulnerability": houseObj.normalized_vulnerability,
				"Normalized lack of coping capacity": houseObj.normalized_lack_of_coping_capacity,
				"Precedence of risk": getPrecedence(houseObj.normalized_risk_score),
				"Precedence of hazard and exposure": getPrecedence(houseObj.normalized_hazard_and_exposure),
				"Precedence of lack of coping capacity": getPrecedence(
					houseObj.normalized_lack_of_coping_capacity
				),
				"Precedence of vulnerability": getPrecedence(houseObj.normalized_vulnerability),
				Male: houseObj.male,
				Female: houseObj.female,
				"Less than five": houseObj.lessThanFive,
				"Five to twelve": houseObj.fiveToTwelve,
				"Thirteen to eighteen": houseObj.thirteenToEighteen,
				"Nineteen to thirty": houseObj.nineteenToThirty,
				"Thirty to fifty": houseObj.thirtyToFifty,
				"Fiftyone to seventy": houseObj.fiftyoneToSeventy,
				"Greater than seventy": houseObj.greaterThanSeventy,
				"Number of children": houseObj.numberOfChildren,
				"Number of elderly": houseObj.numberOfElderly,
				"Number of disabled": houseObj.numberOfDisabled,
				"Number of pregnant lactating": houseObj.numberOfPregnantLactating,
				"Income source": houseObj.incomeSource,
				"Annual income": houseObj.annualIncome,
				Business: houseObj.isBusiness,
				"Foreign employment": houseObj.isForeignEmployment,
				Labour: houseObj.isLabour,
				"Agriculture livestock": houseObj.hasAgricultureLivestock,
				"Other job": houseObj.otherJob,
				"Female headed household": houseObj.isFemaleHeadedHousehold,
				"Distance to safe shelter": houseObj.distanceOfSafeShelter,
				"Education level": houseObj.educationLevel,
				"Access to drinking water": houseObj.hasAccessToDrinkingWater,
				"Access to drinking water during flood": houseObj.hasAccessToDrinkingWaterDuringFlood,
				"Access to early warning information": houseObj.hasAccessToEarlyWarningInformation,
				"Access to financial services": houseObj.hasAccessToFinancialServices,
				"Availability of social security": houseObj.hasAvailabilityOfSocialSecurity,
				"House damage": houseObj.hasHouseDamage,
				"Involvment to community group": houseObj.hasInvolvmentToCommunityGroup,
				"Livelihood affect": houseObj.hasLivelihoodAffect,
				"Loss of family members": houseObj.hasLossOfFamilyMembers,
				"House type roof": houseObj.houseTypeRoof,
				"House type wall": houseObj.houseTypeWall,
				"Vicinity to rivers": houseObj.vicinityToRivers,
				Altitude: houseObj.altitude,
				Precision: houseObj.precision,
				"Flood depth": houseObj.floodDepth,
				"Flood impact in thirty years": houseObj.floodImpactInThirtyYears,
				"Flood return period": houseObj.floodReturnPeriod,
			};
			// if (user && houseObj.houseId) {
			//     transformedArr['House id'] = houseObj.houseId;
			// }

			// if (user && houseObj.householdName) {
			//     transformedArr['Household name'] = houseObj.householdName;
			// }

			// if (user && houseObj.householdContactNumber) {
			//     transformedArr['Household contact number'] = houseObj.householdContactNumber;
			// }
			return transformedArr;
		});
		return householdArray;
	}, [getFederal, houseCsv]);

	const handleDownloadCsv = (title: string) => {
		const transformedData = handleHouseDataTransformation;
		const csv = convertJsonToCsv(transformedData);
		const blob = new Blob([csv], { type: "text/csv" });

		const currentTimestamp = new Date().getTime();
		const fileName = `${title}-${currentTimestamp}.csv`;
		saveAs(blob, fileName);
	};

	return (
		<>
			<div className={style.container}>
				{Object.keys(selectedStation).length > 0 ? (
					<div className={style.menu}>
						<div className={style.nav}>
							<button type="button" onClick={() => handleBtnClick()}>
								<ScalableVectorGraphics className={style.previousIcon} src={previousIcon} />
							</button>
							{`${selectedStation.properties.station_name.toUpperCase()} STATION`}
							{filter.municipality && (
								<span>
									{" "}
									{" ("}
									{
										<span>
											{municipality.filter((item: any) => item.id === filter.municipality)[0].title}
										</span>
									}
									{")"}
								</span>
							)}
						</div>
						<div className={style.icons}>
							{user && filter.municipality && (
								<div
									className={style.household}
									role="presentation"
									onClick={() => {
										setFormOpen(true);
									}}>
									<span>&#43;</span>
									Add Household Level Data
								</div>
							)}
							<div
								className={style.chart}
								onClick={() => showModal()}
								role="presentation"
								title="View discharge hydrograaph">
								<img src={IbfChart} alt="chart" />
							</div>
							{/* {
                                    returnPeriod && returnPeriod !== 0 && mystationdata.length > 0
                                        ? (
                                            <div
                                                className={style.download}
                                                onClick={() => showReport()}b
                                                role="presentation"
                                                title="Preview and download Report"
                                            >
                                                <Icon name="filePdf" />
                                            </div>
                                        )
                                        : ''
                                } */}
						</div>
					</div>
				) : (
					<>
						<div className={style.title}>IBF DASHBOARD</div>
					</>
				)}
				{user && filter.municipality && (
					<button type="button" onClick={() => handleDownloadCsv("Households")}>
						Download CSV
					</button>
				)}
				{modal ? <BoxModal handleModalClose={handleModalClose} /> : ""}
				{reports ? <Report handleModalClose={handleReportClose} /> : ""}
			</div>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
