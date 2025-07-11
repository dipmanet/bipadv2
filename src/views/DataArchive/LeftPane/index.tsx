import React, { useState, useEffect, useContext } from "react";

import { connect } from "react-redux";
import DataArchiveContext, { DataArchiveContextProps } from "#components/DataArchiveContext";
import { userSelector } from "#selectors";
import { AppState } from "#types";
import { User } from "#store/atom/auth/types";
import Rain from "./Rain";
import River from "./River";
import Pollution from "./Pollution";
import Earthquake from "./Earthquake";
import MiniOption from "./MiniOption";

import styles from "./styles.module.scss";

type Options = "Rain" | "River" | "Earthquake" | "Pollution" | undefined;

interface Props {
	user: User;
}

const mapStateToProps = (state: AppState) => ({
	user: userSelector(state),
});

const LeftPane = (props: Props) => {
	const { handleOptionClick, chosenOption: chosenOptionContext }: DataArchiveContextProps =
		useContext(DataArchiveContext);
	const [activeView, setActiveView] = useState("");
	const [chosenOption, setChosenOption] = useState<Options>(undefined);

	const { user } = props;

	useEffect(() => {
		if (chosenOptionContext) {
			setActiveView("data");
			setChosenOption(chosenOptionContext);
		}
	}, [chosenOptionContext]);

	const handleMiniOptionsClick = (miniOption: Options) => {
		setChosenOption(miniOption);
		setActiveView("data");
	};

	return (
		<div className={styles.leftPane}>
			<div className={styles.content}>
				{user && chosenOption === "Rain" && activeView === "data" && <Rain />}
				{user && chosenOption === "River" && activeView === "data" && <River />}
				{chosenOption === "Pollution" && activeView === "data" && <Pollution />}
				{chosenOption === "Earthquake" && activeView === "data" && <Earthquake />}
			</div>
			<MiniOption
				handleMiniOptionsClick={handleMiniOptionsClick}
				handleOptionClick={handleOptionClick || (() => {})}
				chosenOption={chosenOption}
			/>
		</div>
	);
};

export default connect(mapStateToProps)(LeftPane);
