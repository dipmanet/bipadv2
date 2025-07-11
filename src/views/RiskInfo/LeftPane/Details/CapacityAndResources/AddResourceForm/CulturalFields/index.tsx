import React, { FunctionComponent } from "react";

import { connect } from "react-redux";
import { Translation } from "react-i18next";
import TextInput from "#rsci/TextInput";
import SelectInput from "#rsci/SelectInput";
import Checkbox from "#rsci/Checkbox";

import { EnumItem, KeyLabel } from "#types";
import { getAttributeOptions } from "#utils/domain";
import NumberInput from "#rsci/NumberInput";
import TimeInput from "#rsci/TimeInput";
import LocationInput from "#components/LocationInput";
import RawFileInput from "#rsci/RawFileInput";
import { languageSelector } from "#selectors";
import styles from "../styles.module.scss";

const mapStateToProps = (state) => ({
	language: languageSelector(state),
});
interface Props {
	resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const CulturalFields: FunctionComponent<Props> = ({
	resourceEnums,
	faramValues,
	optionsClassName,
	iconName,
	language: { language },
}: Props) => {
	// const religionOptions = getAttributeOptions(resourceEnums, 'religion');
	const booleanCondition = [
		{ key: true, label: language === "en" ? "Yes" : "हो" },
		{ key: false, label: language === "en" ? "No" : "होइन" },
	];
	const booleanConditionNe = [
		{ key: true, label: language === "en" ? "Yes" : "छ" },
		{ key: false, label: language === "en" ? "No" : "छैन" },
	];
	return (
		<Translation>
			{(t) => (
				<>
					<h1>{t("DISASTER MANAGEMENT")}</h1>
					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="isDesignedFollowingBuildingCode"
						label={t("Is the facility designed following building codes?")}
						options={booleanCondition}
						keySelector={keySelector}
						labelSelector={labelSelector}
						optionsClassName={optionsClassName}
						iconName={iconName}
					/>
					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="hasOpenSpace"
						label={t("Does the facility have open space?")}
						options={booleanConditionNe}
						keySelector={keySelector}
						labelSelector={labelSelector}
						optionsClassName={optionsClassName}
						iconName={iconName}
					/>
					{faramValues.hasOpenSpace && (
						<>
							<TextInput
								faramElementName="areaOfOpenSpace"
								label={t("Area of Open Space (Sq.Km)")}
							/>
							<NumberInput
								faramElementName="capacityOfOpenSpace"
								label={t("Total capacity of the open space.")}
							/>
						</>
					)}
					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="hasDisableFriendlyInfrastructure"
						label={t("Does the facility have disabled friendly infrastructure?")}
						options={booleanConditionNe}
						keySelector={keySelector}
						labelSelector={labelSelector}
						optionsClassName={optionsClassName}
						iconName={iconName}
					/>
					{faramValues.hasDisableFriendlyInfrastructure && (
						<TextInput
							faramElementName="specifyInfrastructure"
							label={t("Please specify,disable friendly infrastructures")}
						/>
					)}
					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="drinkingWater"
						label={t("Is drinking water available? ")}
						options={booleanConditionNe}
						keySelector={keySelector}
						labelSelector={labelSelector}
						optionsClassName={optionsClassName}
						iconName={iconName}
					/>
					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="toilet"
						label={t("Is toilet available? ")}
						options={booleanConditionNe}
						keySelector={keySelector}
						labelSelector={labelSelector}
						optionsClassName={optionsClassName}
						iconName={iconName}
					/>
					{faramValues.toilet && (
						<NumberInput faramElementName="noOfToilets" label={t("Number Of Toilets")} />
					)}

					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="hasWashFacility"
						label={t("Does the facility have WASH facility?")}
						options={booleanConditionNe}
						keySelector={keySelector}
						labelSelector={labelSelector}
						optionsClassName={optionsClassName}
						iconName={iconName}
					/>
					{faramValues.hasWashFacility && (
						<TextInput
							faramElementName="specifyWashFacility"
							label={t("Specify WASH facility available ")}
						/>
					)}
					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="hasSleepingFacility"
						label={t("Has sleeping facility available?")}
						options={booleanConditionNe}
						keySelector={keySelector}
						labelSelector={labelSelector}
						optionsClassName={optionsClassName}
						iconName={iconName}
					/>
					{faramValues.hasSleepingFacility && (
						<NumberInput faramElementName="noOfBeds" label={t("Number of beds available")} />
					)}
					<NumberInput faramElementName="noOfMats" label={t("Number of mats available")} />
					<NumberInput faramElementName="noOfCots" label={t("Number of cots available")} />
					<TextInput
						faramElementName="otherFacilities"
						label={t("If other facilities are available, please specify.")}
					/>
					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="hasElectricity"
						label={t("Does the facility have electricity facility?")}
						options={booleanConditionNe}
						keySelector={keySelector}
						labelSelector={labelSelector}
						optionsClassName={optionsClassName}
						iconName={iconName}
					/>

					<h2>{t("OPENING HOUR")}</h2>

					<TimeInput faramElementName="startTime" label={t("Start Time")} />
					<TimeInput faramElementName="endTime" label={t("End Time")} />
					<TextInput
						faramElementName="remarksOnOpeningHours"
						label={t("Remarks on opening hours")}
					/>
					<h1>{t("CONTACT")}</h1>
					<TextInput faramElementName="phoneNumber" label={t("Phone Number")} />
					<TextInput faramElementName="emailAddress" label={t("Email Address")} />
					<TextInput faramElementName="website" label={t("Website")} />
					<TextInput faramElementName="localAddress" label={t("Local Address")} />
					{faramValues.resourceType !== "openspace" ||
					faramValues.resourceType !== "communityspace" ? (
						<RawFileInput
							faramElementName="picture"
							showStatus
							accept="image/*"
							language={language}>
							{t("Upload Image")}
						</RawFileInput>
					) : (
						""
					)}
				</>
			)}
		</Translation>
	);
};

export default connect(mapStateToProps)(CulturalFields);
