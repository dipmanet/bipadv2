/* eslint-disable @typescript-eslint/indent */

import React, { FunctionComponent } from "react";

import { Translation } from "react-i18next";
import { connect } from "react-redux";
import NumberInput from "#rsci/NumberInput";
import TextInput from "#rsci/TextInput";
import SelectInput from "#rsci/SelectInput";

import { EnumItem, KeyLabel } from "#types";
import { getAttributeOptions } from "#utils/domain";
import LocationInput from "#components/LocationInput";
import RawFileInput from "#rsci/RawFileInput";
import DateInput from "#rsci/DateInput";

import { languageSelector } from "#selectors";
import styles from "../styles.module.scss";

interface Props {
	resourceEnums: EnumItem[];
}

const mapStateToProps = (state) => ({
	language: languageSelector(state),
});

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const BridgeFields: FunctionComponent<Props> = ({
	resourceEnums,
	faramValues,
	optionsClassName,
	iconName,
	language: { language },
}: Props) => {
	// const typeOptions = getAttributeOptions(resourceEnums, 'type');
	// const towerNameOptions = getAttributeOptions(resourceEnums, 'towers_name');
	// const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');
	// const offGridSiteOptions = getAttributeOptions(resourceEnums, 'off_grid_cell_sites');
	// const internetTypeOptions = getAttributeOptions(resourceEnums, 'internet_type');
	const booleanCondition = [
		{ key: true, label: language === "en" ? "Yes" : "हो" },
		{ key: false, label: language === "en" ? "No" : "होइन" },
	];
	const booleanConditionNe = [
		{ key: true, label: language === "en" ? "Yes" : "छ" },
		{ key: false, label: language === "en" ? "No" : "छैन" },
	];
	const bridgeCondition = [
		{ key: "Good", label: language === "en" ? "Good" : "राम्रो" },
		{ key: "Bad", label: language === "en" ? "Bad" : "नराम्रो" },
	];

	return (
		<Translation>
			{(t) => (
				<>
					<DateInput
						className={"startDateInput"}
						faramElementName="dateOfOperation"
						label={t("From When was the bridge operational?")}
						inputFieldClassName={styles.dateInput}
						language={language}
						optimizePosition
					/>
					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="isMotorable"
						label={t("Is the bridge motorable?")}
						options={booleanConditionNe}
						keySelector={keySelector}
						labelSelector={labelSelector}
						optionsClassName={optionsClassName}
						iconName={iconName}
					/>
					{faramValues.isMotorable && (
						<NumberInput
							faramElementName="noOfLanes"
							label={t("How many lane does the bridge have?")}
						/>
					)}

					<TextInput faramElementName="length" label={t("Length (in meter)")} />
					<TextInput faramElementName="width" label={t("Width (in meter)")} />

					<SelectInput
						placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
						faramElementName="condition"
						label={t("Condition of Bridge?")}
						options={bridgeCondition}
						keySelector={keySelector}
						labelSelector={labelSelector}
						optionsClassName={optionsClassName}
						iconName={iconName}
					/>
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

export default connect(mapStateToProps)(BridgeFields);
