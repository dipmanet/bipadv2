import React, { useEffect, useState } from "react";
import Icon from "#rscg/Icon";

import styles from "./styles.module.scss";

const NavButtons = (props) => {
	const [page, setPage] = useState(1);
	const { getPage, maxPage, setDestination } = props;

	const handleNext = () => {
		if (page < maxPage) {
			setPage(page + 1);
			getPage(page + 1);
		}
	};

	const handlePrev = () => {
		if (page > 1) {
			setPage(page - 1);
			getPage(page - 1);
		}
	};

	return (
		<div className={styles.navBtnCont}>
			<button type="button" onClick={handlePrev} className={styles.navbutton} disabled={page === 1}>
				<Icon name="chevronLeft" className={page === 1 ? styles.btnDisable : styles.nextPrevBtn} />
				Prev
			</button>
			<div className={styles.navText}>
				{page === 2 ? `page ${1} of ${maxPage}` : `page ${page} of ${maxPage}`}
			</div>
			<button
				type="button"
				onClick={handleNext}
				className={styles.navbutton}
				disabled={page === maxPage}>
				<Icon
					name="chevronRight"
					className={page === maxPage ? styles.btnDisable : styles.nextPrevBtn}
				/>
				Next
			</button>
		</div>
	);
};

export default NavButtons;
