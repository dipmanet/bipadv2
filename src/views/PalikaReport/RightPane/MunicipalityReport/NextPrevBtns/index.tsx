import React from "react";
import Icon from "#rscg/Icon";
import styles from "./styles.module.scss";
import Gt from "../../../utils";
import Translations from "../../../Constants/Translations";

interface Props {
	handleNextClick: () => {};
	lastpage?: number;
	disabled?: boolean;
}

const NextPrevBtns = (props: Props) => {
	const { handleNextClick, lastpage, disabled } = props;

	const handleNClick = () => handleNextClick();

	return (
		<div className={styles.btnContainer}>
			{!lastpage && (
				<button type="button" onClick={handleNClick} className={styles.savebtn} disabled={disabled}>
					<Icon name="plus" className={styles.plusIcon} />
					<Gt section={Translations.SaveContinue} />
				</button>
			)}
		</div>
	);
};

export default NextPrevBtns;
