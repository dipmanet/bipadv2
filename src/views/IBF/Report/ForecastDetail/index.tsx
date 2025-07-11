import React from "react";

import source from "#resources/icons/Source.svg";
import link from "#resources/icons/Link.svg";
import date from "#resources/icons/Date.svg";
import event from "#resources/icons/Event.svg";
import lead from "#resources/icons/Lead.svg";
import forecast from "#resources/icons/Forecast.svg";
import style from "./styles.module.scss";

const ForecastDetail = (props) => {
	const { effectiveDate, forecastDate } = props;
	return (
		<div className={style.section}>
			<div className={style.sectionNo}>01</div>
			<div className={style.content}>
				<div className={style.title}>Forecast Details</div>
				<div className={style.blurpContainer}>
					<div className={style.blurp}>
						<div>
							<img className={style.icon} src={source} alt="source" />
						</div>
						<div className={style.text}>Source: GloFAS Reporting Points</div>
					</div>
					<div className={style.blurp}>
						<div>
							<img className={style.icon} src={link} alt="link" />
						</div>
						<div className={style.text}>Link: https://globalfloods.au</div>
					</div>
					<div className={style.blurp}>
						<div>
							<img className={style.icon} src={date} alt="source" />
						</div>
						<div className={style.text}>
							{"Effective Date: "}
							{effectiveDate}
						</div>
					</div>
					<div className={style.blurp}>
						<div>
							<img className={style.icon} src={event} alt="event" />
						</div>
						<div className={style.text}>Event Status: Real time</div>
					</div>
					<div className={style.blurp}>
						<div>
							<img className={style.icon} src={lead} alt="lead" />
						</div>
						<div className={style.text}>Lead time: 10 days from effective Date</div>
					</div>
					<div className={style.blurp}>
						<div>
							<img className={style.icon} src={forecast} alt="forecast" />
						</div>
						<div className={style.text}>
							{"Forecast Date: "}
							{forecastDate}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ForecastDetail;
