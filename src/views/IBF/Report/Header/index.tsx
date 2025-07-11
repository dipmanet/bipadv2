import React from "react";
import style from "./styles.module.scss";

const Header = (props) => {
	const { page } = props;
	const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
	const today = new Date();
	return (
		<div className={style.header}>
			<div className={style.title}>Impact Based Forecast (IBF) for Chisapani Station</div>
			<div className={style.note}>
				<div className={style.headNote}>
					{`Report Generation Date: ${today.toLocaleDateString("en-NP", options)}`}
				</div>
				<div className={style.pageNo}>{page}</div>
			</div>
		</div>
	);
};
export default Header;
