/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState, useEffect } from "react";
import Redux from "redux";
import { connect } from "react-redux";
import Icon from "#rscg/Icon";
import { setIbfPageAction } from "#actionCreators";
import { ibfPageSelector } from "#selectors";
import { AppState } from "#types";
import style from "./styles.module.scss";
import { PropsFromDispatch, PropsFromState } from "..";

interface OwnProps {}
type Props = OwnProps & PropsFromDispatch & PropsFromState;

const mapStateToProps = (state: AppState): PropsFromState => ({
	ibfPage: ibfPageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setIbfPage: (params) => dispatch(setIbfPageAction(params)),
});

const Legend = (props: Props) => {
	const [dynamicLegendData, setDynamicLegendData] = useState([]);
	const {
		ibfPage: { stations, filter, selectedIndicator, leadTime, selectedStation, returnPeriod },
	} = props;

	const setSelectedLegend = (legend) => {
		props.setIbfPage({ selectedLegend: legend });
	};

	const dynamicLegend = (timeLead, stationLists) => {
		const forLegend =
			stationLists &&
			stationLists.features.map((feature) => {
				if (feature && feature.properties && feature.properties.calculation) {
					const calValue = feature.properties.calculation[timeLead];
					if (calValue.exceed_twenty) {
						return 20;
					}
					if (calValue.exceed_five) {
						return 5;
					}
					if (calValue.exceed_two) {
						return 2;
					}
				}
			});

		const filteredRP = forLegend.filter((item) => {
			if (item) {
				return item;
			}
		});
		return [...new Set(filteredRP)];
	};

	useEffect(() => {
		if (leadTime) {
			const legendData = dynamicLegend(leadTime, stations);
			if (legendData.length > 0) {
				setDynamicLegendData(legendData);
			}
		}
	}, [leadTime, stations]);

	return (
		<div className={style.legendContainer}>
			{Object.keys(selectedStation).length === 0 && filter.municipality === "" && leadTime === 0 ? (
				<div className={style.legendStationsContainer}>
					<div className={style.titleNoHover}>HOUSEHOLD LEVEL DATA</div>
					<div>
						{"Available "}
						<div className={style.available} />
					</div>
					<div>
						{"Not Available "}
						<div className={style.notAvailable} />
					</div>
				</div>
			) : (
				<>
					{/* Kuch To Gadbadh Hey??? */}
					{Object.keys(selectedStation).length === 0 &&
					leadTime !== 0 &&
					filter.municipality === "" ? (
						<>
							<div className={style.legendStationsContainer}>
								<div className={style.titleNoHover}>HOUSEHOLD LEVEL DATA</div>
								<div>
									{"Available "}
									<div className={style.available} />
								</div>
								<div>
									{"Not Available "}
									<div className={style.notAvailable} />
								</div>
							</div>
							{leadTime !== 1 && (
								<div className={style.legendReturnContainer}>
									<div className={style.titleNoHover}>Flood Alert</div>
									{dynamicLegendData.map((legendRP) => (
										<div>
											{`${legendRP} Year return period `}
											<div
												className={
													legendRP === 20 ? style.twenty : legendRP === 5 ? style.five : style.two
												}
											/>
										</div>
									))}
								</div>
							)}
						</>
					) : Object.keys(selectedStation).length !== 0 &&
					  leadTime === 0 &&
					  filter.municipality === "" ? (
						<div className={style.legendStationsContainer}>
							<div className={style.titleNoHover}>HOUSEHOLD LEVEL DATA</div>
							<div>
								{"Available "}
								<div className={style.available} />
							</div>
							<div>
								{"Not Available "}
								<div className={style.notAvailable} />
							</div>
						</div>
					) : Object.keys(selectedStation).length !== 0 &&
					  leadTime !== 0 &&
					  filter.municipality === "" &&
					  returnPeriod !== 0 ? (
						<>
							<div className={style.legendStationsContainer}>
								<div className={style.titleNoHover}>HOUSEHOLD LEVEL DATA</div>
								<div>
									{"Available "}
									<div className={style.available} />
								</div>
								<div>
									{"Not Available "}
									<div className={style.notAvailable} />
								</div>
							</div>
							<div className={style.legendReturnContainer}>
								<div className={style.titleNoHover}>Flood Alert</div>
								{dynamicLegendData.map((legendRP) => (
									<div>
										{`${legendRP} Year return period `}
										<div
											className={
												legendRP === 20 ? style.twenty : legendRP === 5 ? style.five : style.two
											}
										/>
									</div>
								))}
							</div>
						</>
					) : filter.municipality && selectedIndicator === "risk" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Risk Score
								<Icon className={style.reset} name="refresh" />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("riskVeryHigh")}>
								{"Very High (6.5 - 10) "}
								<div className={style.critical} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("riskHigh")}>
								{"High (5 - 6.4) "}
								<div className={style.high} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("riskMedium")}>
								{"Medium (3.5 - 4.9) "}
								<div className={style.moderate} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("riskLow")}>
								{"Low (2 - 3.4) "}
								<div className={style.low} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("riskVeryLow")}>
								{"Very Low (0 - 1.9) "}
								<div className={style.normal} />
							</div>
						</div>
					) : selectedIndicator === "hazard" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Hazard Exposure
								<Icon className={style.reset} name="refresh" />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("hazardVeryHigh")}>
								{"Very High (6.5 - 10) "}
								<div className={style.critical} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("hazardHigh")}>
								{"High (5 - 6.4) "}
								<div className={style.high} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("hazardMedium")}>
								{"Medium (3.5 - 4.9) "}
								<div className={style.moderate} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("hazardLow")}>
								{"Low (2 - 3.4) "}
								<div className={style.low} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("hazardVeryLow")}>
								{"Very Low (0 - 1.9) "}
								<div className={style.normal} />
							</div>
						</div>
					) : selectedIndicator === "vulnerability" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Vulnerability
								<Icon className={style.reset} name="refresh" />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("vulnerabilityVeryHigh")}>
								{"Very High (6.5 - 10) "}
								<div className={style.critical} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("vulnerabilityHigh")}>
								{"High (5 - 6.4) "}
								<div className={style.high} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("vulnerabilityMedium")}>
								{"Medium (3.5 - 4.9) "}
								<div className={style.moderate} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("vulnerabilityLow")}>
								{"Low (2 - 3.4) "}
								<div className={style.low} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("vulnerabilityVeryLow")}>
								{"Very Low (0 - 1.9) "}
								<div className={style.normal} />
							</div>
						</div>
					) : selectedIndicator === "lackOfCopingCapacity" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Lack of coping capacity
								<Icon className={style.reset} name="refresh" />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("lackofcopingVeryHigh")}>
								{"Very High (6.5 - 10) "}
								<div className={style.critical} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("lackofcopingHigh")}>
								{"High (5 - 6.4) "}
								<div className={style.high} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("lackofcopingMedium")}>
								{"Medium (3.5 - 4.9) "}
								<div className={style.moderate} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("lackofcopingLow")}>
								{"Low (2 - 3.4) "}
								<div className={style.low} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("lackofcopingVeryLow")}>
								{"Very Low (0 - 1.9) "}
								<div className={style.normal} />
							</div>
						</div>
					) : selectedIndicator === "historicalImpactsAndDamage" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Historical
								<Icon className={style.reset} name="refresh" />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("historicalAndLoss")}>
								{"Human AND Economic Loss "}
								<div className={style.critical} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("historicalOrLoss")}>
								{"Human OR Economic Loss "}
								<div className={style.moderate} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("historicalNoLoss")}>
								{"No Loss "}
								<div className={style.low} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("noHistoricalLossData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "vicinityToRivers" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Vicinity
								<Icon className={style.reset} name="refresh" />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("vicinityLessthan100")}>
								{"HHs distance from river < 100 m "}
								<div className={style.critical} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("vicinityBetween100and500")}>
								{"HHs distance from river 100 to 500 m "}
								<div className={style.moderate} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("vicinityMorethan500")}>
								{"HHs distance from river > 500 m "}
								<div className={style.low} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("noVicinityData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "numberOfDependentPop" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								No. of dependent population
								<Icon className={style.reset} name="refresh" />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("numberOfDependentMorethan2")}>
								{"> 2 dependent people "}
								<div className={style.critical} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("numberOfDependentBetween1and2")}>
								{"1 to 2 dependent people "}
								<div className={style.moderate} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("numberOfDependentNone")}>
								{"None "}
								<div className={style.low} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("noNumberOfDependentData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "femaleHeadedHousehold" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Head of household
								<Icon className={style.reset} name="refresh" />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("femaleHeadedHousehold")}>
								{"Female Headed HHs "}
								<div className={style.critical} />
							</div>
							{/* <div className={style.legend} onClick={() => setSelectedLegend('maleHeadedHousehold')}>
                                                {'Male Headed HHs '}
                                                <div className={style.low} />
                                            </div> */}
							<div className={style.legend} onClick={() => setSelectedLegend("noFemaleHeadedData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "incomeSource" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Income source
								<Icon className={style.reset} name="refresh" />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("incomeSourceSingle")}>
								{"HHs single occupation "}
								<div className={style.critical} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("incomeSourceMultiple")}>
								{"HHs multiple occupation "}
								<div className={style.low} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("noIncomeSourceTypeData")}>
								{"Data not available "}
								<div className={style.noValue} />
							</div>
						</div>
					) : selectedIndicator === "annualIncome" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Annual Income
								<Icon className={style.reset} name="refresh" />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("annualIncomeMorethan100000")}>
								{"> NPR 100,000 "}
								<div className={style.low} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("annualIncomeBetween40000and100000")}>
								{"NPR 40,000 - 100,000 "}
								<div className={style.moderate} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("annualIncomeLessthan40000")}>
								{"< NPR 40,000 "}
								<div className={style.critical} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("noAnnualIncomeData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "houseType" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								House type
								<Icon className={style.reset} name="refresh" />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("houseTypeLocal")}>
								{"Made from local stone "}
								<div className={style.critical} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("houseTypePrefab")}>
								{"Block and prefab "}
								<div className={style.moderate} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("houseTypeRcc")}>
								{"Well made (RCC) "}
								<div className={style.low} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("noHouseTypeData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "floodImpactInHouse" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Flood impact in house
								<Icon className={style.reset} name="refresh" />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("floodImpactInHouseMorethan5")}>
								{"> 5 times "}
								<div className={style.critical} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("floodImpactInHouseBetween3and5")}>
								{"3 to 5 times "}
								<div className={style.moderate} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("floodImpactInHouseLessthan2")}>
								{"< 2 times "}
								<div className={style.low} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("noFloodImpactData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "accessToDrinkingWater" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Access to drinking water
								<Icon className={style.reset} name="refresh" />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("accessToDrinkingWater")}>
								{"Access to drinking water "}
								<div className={style.low} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("noAccessToDrinkingWater")}>
								{"No access to drinking water "}
								<div className={style.critical} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("noAccessToDrinkingWaterData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "earlyWarningInformationAccess" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								EWS access
								<Icon className={style.reset} name="refresh" />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("earlyWarningInformationAccess")}>
								{"Access to EWS "}
								<div className={style.low} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("earlyWarningInformationNoAccess")}>
								{"No access to EWS "}
								<div className={style.critical} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("noEarlyWarningData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "involvementOfFamily" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Involvement of family
								<Icon className={style.reset} name="refresh" />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("involvementOfFamily")}>
								{"Engagement in CG "}
								<div className={style.low} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("noInvolvementOfFamily")}>
								{"No engagement in CG "}
								<div className={style.critical} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("noFamilyInvolvementData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "accessToFinancial" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Access to Financial
								<Icon className={style.reset} name="refresh" />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("accessToFinancial")}>
								{"Access to finance "}
								<div className={style.low} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("noAccessToFinancial")}>
								{"No access to finance "}
								<div className={style.critical} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("noFinancialData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "educationLevel" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Education level
								<Icon className={style.reset} name="refresh" />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("educationLevelIlliterate")}>
								{"Illiterate "}
								<div className={style.critical} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("educationLevelFormal")}>
								{"Formal Education "}
								<div className={style.moderate} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("educationLevelLiterate")}>
								{"Literate "}
								<div className={style.low} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("noEducationData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "availabilityOfSocialSecurity" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Availability of social security
								<Icon className={style.reset} name="refresh" />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("accessToSocial")}>
								{"Access to social security "}
								<div className={style.low} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("noAccessToSocial")}>
								{"No access to social security "}
								<div className={style.critical} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("noSocialData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "distanceToSafeShelter" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Distance to safe shelter
								<Icon className={style.reset} name="refresh" />
							</div>
							{/* <div className={style.legend} onClick={() => setSelectedLegend('noAccessToSafeShelter')}>
                                                {'No access '}
                                                <div className={style.critical} />
                                            </div> */}
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("thirtyminsToSafeShelter")}>
								{"< 30 mins "}
								<div className={style.moderate} />
							</div>
							<div
								className={style.legend}
								onClick={() => setSelectedLegend("morethan30minsToSafeShelter")}>
								{"> 30 mins "}
								<div className={style.low} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("noSafeShelterData")}>
								{"Data not available"}
								<div className={style.noImpact} />
							</div>
						</div>
					) : selectedIndicator === "impactScore" ? (
						<div className={style.legendIndicatorContainer}>
							<div onClick={() => setSelectedLegend("")} className={style.title}>
								Impacted Score
								<Icon className={style.reset} name="refresh" />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("veryHighImpact")}>
								{"Very High (10 - 15) "}
								<div className={style.veryHighImpact} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("highImpact")}>
								{"High (5 - 9) "}
								<div className={style.highImpact} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("mediumImpact")}>
								{"Medium (3 - 4) "}
								<div className={style.mediumImpact} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("lowImpact")}>
								{"Low (1 - 2) "}
								<div className={style.lowImpact} />
							</div>
							<div className={style.legend} onClick={() => setSelectedLegend("noImpact")}>
								{"No impact "}
								<div className={style.noImpact} />
							</div>
						</div>
					) : (
						""
					)}
				</>
			)}

			{/* {
                Object.keys(selectedStation).length > 0
                    ? (
                        <div className={style.fdContainer}>
                            <div className={style.titleNoHover}>
Flood depth (in meters)
                                <div style={{ fontSize: '0.6rem', textAlign: 'right' }}>20 year flood return period</div>
                                <div style={{ fontSize: '0.6rem', textAlign: 'right' }}>
Source: METEOR project
                                </div>
                            </div>
                            <div className={style.floodDepthContainer}>
                                <div className={style.floodDepth}>
                                    <div className={style.floodIndicator1}>
                                        {'> 2m'}
                                    </div>
                                    <div className={style.floodText}>High</div>
                                </div>
                                <div className={style.floodDepth}>

                                    <div className={style.floodIndicator2}>
                                        {'1m - 2m'}
                                    </div>
                                    <div className={style.floodText}>Medium</div>
                                </div>
                                <div className={style.floodDepth}>
                                    <div className={style.floodIndicator3}>
                                        {'< 1m'}
                                    </div>
                                    <div className={style.floodText}>
                                        Low
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ''
                    )
            } */}
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Legend);
