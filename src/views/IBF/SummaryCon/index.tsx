import React, { useState } from "react";
import OverallSummary from "#resources/icons/IbfOverallSummary.svg";
import Button from "../Components/CollapsableButton";
import Summary from "../Components/Summary";
import style from "./styles.module.scss";

interface Props {
	handleWidthToggle: (bool: boolean) => void;
}

const SummaryCon = ({ handleWidthToggle }: Props) => {
	const [toggle, setToggle] = useState(false);
	return (
		<>
			<Button
				btnClassName={style.summaryBtn}
				btnName={"Overall Summary"}
				btnIcon={OverallSummary}
				setToggleBtn={setToggle}
				toggleBtn={toggle}
				handleWidth={handleWidthToggle}
			/>
			<Summary
				summaryClassName={style.summaryModal}
				setToggleSummary={setToggle}
				toggleSummary={toggle}
				handleWidth={handleWidthToggle}
			/>
		</>
	);
};

export default SummaryCon;
