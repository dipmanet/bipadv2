import React, { useState } from "react";
import styles from "./styles.module.scss";

interface Props {
	handleNext: () => void;
	handlePrev: () => void;
	disableNavLeftBtn: boolean;
	disableNavRightBtn: boolean;
	pagenumber: number;
	totalPages: number;
	pending: boolean;
	leftElement: number;
	active: number;
	setActivePage: (item: number) => void;
}

const NavButtons = (props: Props) => {
	const {
		handleNext,
		handlePrev,
		disableNavLeftBtn,
		disableNavRightBtn,
		pagenumber,
		totalPages,
		pending,
		leftElement,
		active,
		setActivePage,
	} = props;

	return (
		<div
			className={disableNavRightBtn && disableNavLeftBtn ? styles.navRowDisabled : styles.navRow}>
			<div className={styles.pagination}>
				{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
					<button
						key={item}
						type="button"
						className={active === item ? styles.activePage : styles.paginationIndividual}
						onClick={() => setActivePage(item)}
						disabled={disableNavRightBtn && disableNavLeftBtn}>
						{item}
					</button>
				))}
			</div>
			<div className={styles.buttonContainer}>
				<div className={styles.navBtnCont}>
					<button
						type="button"
						onClick={handlePrev}
						className={
							pagenumber === 1 || disableNavLeftBtn === true ? styles.btnDisable : styles.navbutton
						}
						disabled={pagenumber === 1 || disableNavLeftBtn}>
						Previous
					</button>
				</div>
				<div className={styles.navBtnCont}>
					<button
						type="button"
						onClick={handleNext}
						className={
							pagenumber === totalPages || disableNavRightBtn === true
								? styles.btnDisable
								: styles.navbutton
						}
						disabled={pagenumber === totalPages || disableNavRightBtn}>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default NavButtons;
