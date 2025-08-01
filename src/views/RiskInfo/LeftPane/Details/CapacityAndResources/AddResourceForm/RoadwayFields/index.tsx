import React, { FunctionComponent } from "react";

import { Translation } from "react-i18next";
import { connect } from "react-redux";
import TextInput from "#rsci/TextInput";
import DateInput from "#rsci/DateInput";
import SelectInput from "#rsci/SelectInput";
import NumberInput from "#rsci/NumberInput";
import TimeInput from "#rsci/TimeInput";
import RawFileInput from "#rsci/RawFileInput";
import LocationInput from "#components/LocationInput";
import { languageSelector } from "#selectors";
import styles from "../styles.module.scss";

const mapStateToProps = (state) => ({
	language: languageSelector(state),
});
const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;
const RoadwayFields: FunctionComponent = ({
	resourceEnums,
	faramValues,
	optionsClassName,
	iconName,
	language: { language },
}) => {
	const booleanCondition = [
		{ key: true, label: language === "en" ? "Yes" : "हो" },
		{ key: false, label: language === "en" ? "No" : "होइन" },
	];
	const booleanConditionNe = [
		{ key: true, label: language === "en" ? "Yes" : "छ" },
		{ key: false, label: language === "en" ? "No" : "छैन" },
	];

	const type = [
		{ key: "Vehicle Center", label: language === "en" ? "Vehicle Center" : "बसपार्क" },
		{ key: "Vehicle Committee", label: language === "en" ? "Vehicle Committee" : "यातायत समिति" },
	];

	return (
		<Translation>
			{(t) => (
				<>
					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="type"
						label={t(
							"Select either you are entering the details of vehicle center such as bus parks and stops or vehicle committee."
						)}
						options={type}
						keySelector={keySelector}
						labelSelector={labelSelector}
						optionsClassName={optionsClassName}
						iconName={iconName}
					/>
					<NumberInput
						faramElementName="numberOfTransporationFacilityAvailable"
						label={t("Number of transportation facilities")}
					/>
					<h2>{t("NUMBER OF EMPLOYEES")}</h2>
					<NumberInput faramElementName="noOfMaleEmployee" label={t("Number of Male Employees")} />
					<NumberInput
						faramElementName="noOfFemaleEmployee"
						label={t("Number of Female Employees")}
					/>
					<NumberInput
						faramElementName="noOfOtherEmployee"
						label={t("Number of Other Employees")}
					/>
					<NumberInput
						faramElementName="noOfEmployee"
						label={t("Total Number of Employees")}
						disabled
					/>
					<NumberInput
						faramElementName="noOfDifferentlyAbledMaleEmployees"
						label={t("Number of Differently-abled Male Employees")}
					/>
					<NumberInput
						faramElementName="noOfDifferentlyAbledFemaleEmployees"
						label={t("Number of Differently-abled Female Employees")}
					/>
					<NumberInput
						faramElementName="noOfDifferentlyAbledOtherEmployees"
						label={t("Number of Differently-abled Other Employees")}
					/>
					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="hasDisableFriendlyVehicle"
						label={t("Are disable friendly vehicle available?")}
						options={booleanConditionNe}
						keySelector={keySelector}
						labelSelector={labelSelector}
						optionsClassName={optionsClassName}
						iconName={iconName}
					/>
					{faramValues.hasDisableFriendlyVehicle && (
						<NumberInput
							faramElementName="nameAndNoOfDisableFriendlyVehicle"
							label={t("Disable Friendly Vehicle types and count available?")}
						/>
					)}
					{/* {faramValues.hasDisableFriendlyVehicle
                && (
                    <NumberInput
                        faramElementName="noOfDisableFriendlyVehicle"
                        label="Number of Disable Friendly Vehicle"
                    />
                )
            } */}
					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="designedWithBuildingCode"
						label={t("Is the building designed following building code?")}
						options={booleanCondition}
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
						label={t("Remarks on Opening Hours")}
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

export default connect(mapStateToProps)(RoadwayFields);
