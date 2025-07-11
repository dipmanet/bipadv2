import React, { useEffect, useState } from "react";
import Redux from "redux";
import { connect } from "react-redux";
import { ibfPageSelector, userSelector } from "#selectors";
import IbfLeftArrow from "#resources/icons/IbfLeftArrow.svg";
import PenIbf from "#resources/icons/pen-ibf.svg";
import { _cs } from "@togglecorp/fujs";
import { setIbfPageAction } from "#actionCreators";
import { AppState } from "#types";
import { PropsFromDispatch } from "#views/IBF";
import { User } from "#store/atom/auth/types";
import { IbfPage } from "#store/atom/page/types";
import ExistingRiskItem from "../ExistingRiskItem";
import styles from "./styles.module.scss";

import { getExistingRiskData } from "../RiskAndImpact/expression";
import WeightCard from "../WeightCard";

interface OwnProps {
	contentShowingParam?: string;
	setCountActive: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PropsFromState {
	ibfPage: IbfPage;
	user: User;
}

type Props = OwnProps & PropsFromDispatch & PropsFromState;

interface ContentType {
	key: string;
	value: string;
}

interface ExistingRiskDataType {
	title: string;
	score: string;
	key: string;
	content: ContentType[];
}

const mapStateToProps = (state: AppState): PropsFromState => ({
	ibfPage: ibfPageSelector(state),
	user: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setIbfPage: (params) => dispatch(setIbfPageAction(params)),
});

const ExistingRisk = ({ ibfPage, setCountActive, setIbfPage, user }: Props) => {
	const { householdDistrictAverage, weights } = ibfPage;
	const [maintainTitle, setMaintainTitle] = useState("");
	const [isActive, setActive] = useState(false);
	const [existingRiskData, setExistingRiskData] = useState<ExistingRiskDataType[]>([]);
	const [wt, setWeight] = useState({});
	const [isWtActive, setWtActive] = useState(false);

	const isActiveHandler = (selectedData) => {
		if (selectedData.length === 1) {
			setExistingRiskData(selectedData);
			setIbfPage({ showHouseHold: 1 });
		} else {
			setExistingRiskData(selectedData);
			setCountActive(false);
			setIbfPage({ showHouseHold: 0 });
		}
		setActive((prevIsActive) => !prevIsActive);
	};

	const getTitle = () => {
		if (isActive && existingRiskData.length === 1) {
			return existingRiskData[0].title;
		}
		return "Existing Risk";
	};

	// if (contentShowingParam === 'risk' && Object.keys(householdDistrictAverage).length > 0) {
	//     setExistingRiskData(getExistingRiskData(householdDistrictAverage));
	// }
	const weightHandler = (title) => {
		const tit = title.replaceAll(" ", "").toLowerCase();
		const wtObj = weights[tit];
		setWeight(wtObj);
		setWtActive(true);
		setIbfPage({ wtChange: 0 });
	};

	useEffect(() => {
		if (maintainTitle) {
			const existingRiskDataList = getExistingRiskData(householdDistrictAverage);
			const filteredDataList = existingRiskDataList.filter(
				(dataItem) => dataItem.title === maintainTitle
			);
			setExistingRiskData(filteredDataList);
			return;
		}
		const existingRiskDataList = getExistingRiskData(householdDistrictAverage);
		setExistingRiskData(existingRiskDataList);
		// setActive(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [householdDistrictAverage]);

	return (
		<div className={styles.existingRiskContainer}>
			<div className={styles.titleContainer}>
				<div className={styles.title}>
					{isActive && (
						<button
							className={styles.backBtn}
							type="button"
							onClick={() => {
								isActiveHandler(getExistingRiskData(householdDistrictAverage));
								setWeight({});
								setWtActive(false);
							}}>
							<img src={IbfLeftArrow} alt="leftArrow" />
						</button>
					)}
					<h1 className={_cs(isActive ? styles.activeTitle : styles.baseTitle)}>
						{isWtActive ? "Edit Weights" : getTitle()}
					</h1>
				</div>
				{user && isActive && (
					<button
						className={_cs(styles.weight, getTitle() === "Risk" && styles.wtHidden)}
						type="button"
						onClick={() => weightHandler(getTitle())}>
						<img className={styles.editBtn} src={PenIbf} alt="pen icon" />
						Edit Weights
					</button>
				)}
			</div>
			<div className={styles.content}>
				{!isWtActive &&
					existingRiskData &&
					existingRiskData.length > 0 &&
					existingRiskData.map((dataItem) => (
						<ExistingRiskItem
							setMaintainTitle={setMaintainTitle}
							key={dataItem.score}
							data={dataItem}
							isActiveHandler={isActiveHandler}
							isActive={isActive}
							countActiveHandler={setCountActive}
						/>
					))}
				{isWtActive && (
					<WeightCard
						weight={wt}
						setWtActive={setWtActive}
						isActiveHandler={() => isActiveHandler(getExistingRiskData(householdDistrictAverage))}
					/>
				)}
			</div>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(ExistingRisk);
