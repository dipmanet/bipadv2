import React from "react";
import { connect } from "react-redux";

import {
	generalDataSelector,
	budgetDataSelector,
	budgetActivityDataSelector,
	programAndPolicySelector,
} from "#selectors";
import style from "#mapStyles/rasterStyle";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import styles from "./styles.module.scss";
import Relief from "../../Relief";
import Leadership from "./Leadership";
import Footer from "./Footer";

const mapStateToProps = (state) => ({
	generalData: generalDataSelector(state),
	programAndPolicyData: programAndPolicySelector(state),
	budgetData: budgetDataSelector(state),
	budgetActivityData: budgetActivityDataSelector(state),
});

interface Props {
	reportData: Element[];
}

export interface GeneralData {
	reportTitle?: string;
	fiscalYear: string;
	mayor: string;
	cao: string;
	focalPerson: string;
	formationDate: string;
	committeeMembers: number;
}

export interface BudgetData {
	totMunBudget: number;
	totDrrBudget: number;
	additionalDrrBudget: number;
}

export interface ProgramAndPolicyData {
	pointOne: string;
	pointTwo: string;
	pointThree: string;
}

export interface BudgetActivityData {
	name: string;
	fundSource: string;
	additionalDrrBudget: string;
	budgetCode: string;
	drrmCycle: string;
	projStatus: string;
	projCompletionDate: string;
	allocatedBudget: string;
	actualExp: string;
	remarks: string;
}

const Preview = (props: Props) => {
	const { generalData, programAndPolicyData, budgetData, budgetActivityData, url } = props;

	const { reportTitle, fiscalYear, mayor, cao, focalPerson, formationDate, committeeMembers } =
		generalData;

	const { municipalBudget, drrFund, additionalFund } = budgetData;

	const {
		name,
		fundSource,
		budgetCode,
		drrmCycle,
		projStatus,
		projCompletionDate,
		allocatedBudget,
		actualExp,
		remarks,
	} = budgetActivityData;

	return (
		<>
			<div className={styles.previewContainer}>
				{/* <Header /> */}
				<div className={styles.rowOne}>
					<Relief
						previewDetails
						reportData={""}
						tableHeader={() => {}}
						updateTab={() => {}}
						page={-1}
						handlePrevClick={() => {}}
						handleNextClick={() => {}}
					/>
				</div>
				<div className={styles.rowTwo}>
					<Relief
						hazardwiseImpact
						reportData={""}
						tableHeader={() => {}}
						updateTab={() => {}}
						page={-1}
						handlePrevClick={() => {}}
						handleNextClick={() => {}}
					/>
				</div>

				<div className={styles.rowfour}>
					<Leadership />
				</div>
			</div>
			<div className={styles.rowFive}>
				<Footer />
			</div>
		</>
	);
};

export default connect(mapStateToProps, undefined)(Preview);
