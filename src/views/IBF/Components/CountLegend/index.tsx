/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from "react";
import Redux from "redux";
import { connect } from "react-redux";
import { AppState } from "#types";
import { ibfPageSelector } from "#selectors";
import { getTotalCounts } from "#views/IBF/utils";
import { setIbfPageAction } from "#actionCreators";
import { PropsFromDispatch, PropsFromState } from "#views/IBF";
import style from "./styles.module.scss";
import { riskScoreParams, existingRiskRange } from "../../Constants/CountExpressions";
import { valueToScore } from "./util";

interface OwnProps {
	isActive: string;
	getImpactedValue: (indicatorValue: string, countValue: number) => void;
}

type Props = OwnProps & PropsFromDispatch & PropsFromState;

const mapStateToProps = (state: AppState): PropsFromState => ({
	ibfPage: ibfPageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setIbfPage: (params) => dispatch(setIbfPageAction(params)),
});

const CountLegend = (props: Props) => {
	const { ibfPage, isActive, getImpactedValue, setIbfPage } = props;
	const { selectedIndicator, householdJson } = ibfPage;

	const setSelectedLegend = (legend) => {
		setIbfPage({ selectedLegend: legend });
	};

	const riskScore = riskScoreParams.filter((param) => param.id === selectedIndicator);

	const householdRisk = householdJson.map((household) => {
		const {
			hasLivelihoodAffect,
			hasHouseDamage,
			hasLossOfFamilyMembers,
			numberOfChildren,
			numberOfElderly,
			numberOfPregnantLactating,
			numberOfDisabled,
			houseTypeWall,
			floodImpactInThirtyYears,
			distanceOfSafeShelter,
			vicinityToRivers,
			educationLevel,
			annualIncome,
			isFemaleHeadedHousehold,
			hasAccessToDrinkingWater,
			hasAccessToEarlyWarningInformation,
			hasInvolvmentToCommunityGroup,
			hasAccessToFinancialServices,
			hasAvailabilityOfSocialSecurity,
			incomeSource,
			impactScore,
		} = household;

		const historicalImpactsandDamage = [
			{ name: "hasLivelihoodAffect", value: hasLivelihoodAffect },
			{ name: "hasHouseDamage", value: hasHouseDamage },
			{ name: "hasLossOfFamilyMembers", value: hasLossOfFamilyMembers },
		];
		const NumberOfDependentPop = [
			{ name: "numberOfChildren", value: numberOfChildren },
			{ name: "numberOfElderly", value: numberOfElderly },
			{ name: "numberOfPregnantLactating", value: numberOfPregnantLactating },
			{ name: "numberOfDisabled", value: numberOfDisabled },
		];

		const HistoricalImpactsAndDamage = valueToScore(
			"historicalImpactssndDamage",
			historicalImpactsandDamage
		);
		const NumberofDependentPop = valueToScore("numberofDependentPop", NumberOfDependentPop);
		const IncomeSource = valueToScore("incomeSource", incomeSource);
		const VicinityToRivers = valueToScore("vicinityToRivers", vicinityToRivers);
		const AnnualIncome = valueToScore("annualIncome", annualIncome);
		const HouseType = valueToScore("houseType", houseTypeWall);
		const FloodImpactInThirtyYears = valueToScore("floodImpactInHouse", floodImpactInThirtyYears);
		const EducationLevel = valueToScore("educationLevel", educationLevel);
		const DistanceToSafeShelter = valueToScore("distanceToSafeShelter", distanceOfSafeShelter);
		const FemaleHeadedHousehold = valueToScore("femaleHeadedHousehold", isFemaleHeadedHousehold);
		const HasAccessToDrinkingWater = valueToScore(
			"hasAccessToDrinkingWater",
			hasAccessToDrinkingWater
		);
		const HasAccessToEarlyWarningInformation = valueToScore(
			"hasAccessToEarlyWarningInformation",
			hasAccessToEarlyWarningInformation
		);
		const HasInvolvmentToCommunityGroup = valueToScore(
			"hasInvolvmentToCommunityGroup",
			hasInvolvmentToCommunityGroup
		);
		const HasAccessToFinancialServices = valueToScore(
			"hasAccessToFinancialServices",
			hasAccessToFinancialServices
		);
		const HasAvailabilityOfSocialSecurity = valueToScore(
			"hasAvailabilityOfSocialSecurity",
			hasAvailabilityOfSocialSecurity
		);

		const {
			normalized_risk_score: risk,
			normalized_hazard_and_exposure: hazard,
			normalized_vulnerability: vulnerability,
			normalized_lack_of_coping_capacity: lackOfCopingCapacity,
		} = household;

		return {
			risk,
			hazard,
			vulnerability,
			lackOfCopingCapacity,
			historicalImpactsAndDamage: HistoricalImpactsAndDamage,
			vicinityToRivers: VicinityToRivers,
			numberOfDependentPop: NumberofDependentPop,
			femaleHeadedHousehold: FemaleHeadedHousehold,
			incomeSource: IncomeSource,
			annualIncome: AnnualIncome,
			houseType: HouseType,
			floodImpactInHouse: FloodImpactInThirtyYears,
			accessToDrinkingWater: HasAccessToDrinkingWater,
			earlyWarningInformationAccess: HasAccessToEarlyWarningInformation,
			involvementOfFamily: HasInvolvmentToCommunityGroup,
			accessToFinancial: HasAccessToFinancialServices,
			educationLevel: EducationLevel,
			availabilityOfSocialSecurity: HasAvailabilityOfSocialSecurity,
			distanceToSafeShelter: DistanceToSafeShelter,
			impactScore,
		};
	});
	const clickHandler = (data) => {
		setSelectedLegend(data.legend);
		if (isActive === "impacted") {
			const countTotal = getTotalCounts(householdRisk, selectedIndicator, data.range);
			getImpactedValue(data.indicator, countTotal);
		}
	};

	return (
		<div className={style.riskSuperCon}>
			<div className={style.riskContainer}>
				<h4 className={style.title}>{`${
					riskScore[0] && Object.keys(riskScore[0]).length > 0 ? riskScore[0].title : ""
				}`}</h4>
				<div className={style.rangeContainer}>
					{existingRiskRange[selectedIndicator] &&
						existingRiskRange[selectedIndicator].map((data) => (
							<>
								<div
									key={data.indicator}
									className={style.range}
									style={{
										backgroundColor: `${data.color}`,
									}}
									onClick={() => {
										clickHandler(data);
									}}>
									<span className={style.rangeValue}>
										{getTotalCounts(householdRisk, selectedIndicator, data.range)}
									</span>
									<span className={style.indicator}>{data.indicator}</span>
								</div>
							</>
						))}
				</div>
			</div>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(CountLegend);
