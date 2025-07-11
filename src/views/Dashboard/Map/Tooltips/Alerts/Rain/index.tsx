import React from "react";
import { Translation } from "react-i18next";
import { convertDateAccToLanguage } from "#utils/common";

import styles from "./styles.module.scss";

interface Average {
	interval: number;
	status: {
		danger: boolean;
		warning: boolean;
	};
	value: number;
}
interface ReferenceData {
	fields: {
		averages: Average[];
		basin: string;
		created_on: string;
		title: string;
	};
}

const nullData = {
	fields: {
		averages: [],
		basin: "",
		// eslint-disable-next-line @typescript-eslint/camelcase
		created_on: "",
		title: "",
	},
};

const RainTooltip = (
	title: string,
	description: string,
	createdDate: string,
	referenceData: ReferenceData,
	language
) => {
	const {
		fields: { averages, basin, created_on: createdOn, title: referenceDataTitle },
	} = referenceData || nullData;

	const oneHourInterval = averages[0].value;
	const threeHourInterval = averages[1].value;
	const sixHourInterval = averages[2].value;
	const twelveHourInterval = averages[3].value;
	const twentyFourHourInterval = averages[4].value;

	let renderedTitle;
	if (title.toUpperCase() === "HEAVY RAINFALL") {
		renderedTitle = `Heavy Rainfall at ${referenceDataTitle}`;
	} else {
		renderedTitle = title;
	}
	const date = createdDate.split("T")[0];
	const time = createdDate.split("T")[1].split("+")[0];
	const timeOnly = time.split(":").slice(0, 2).join(":");
	return (
		<Translation>
			{(t) => (
				<div className={styles.rainfallTooltip}>
					<div className={styles.header}>
						<div className={styles.title}>{renderedTitle}</div>
						<div className={styles.date}>
							{createdDate ? (
								<>
									<span>
										{convertDateAccToLanguage(date, language)} | {timeOnly}
									</span>
									<span>
										{" "}
										<span>{t("(NPT)")}</span>
									</span>
								</>
							) : (
								<span>{t("N/A")}</span>
							)}
						</div>
					</div>
					<div className={styles.content}>
						<div className={styles.basin}>
							<div className={styles.title}>
								<span>{t("Basin")}</span>:
							</div>
							<div className={styles.value}>{basin || <span>{t("N/A")}</span>}</div>
						</div>
						<div className={styles.station}>
							<div className={styles.title}>
								<span>{t("Station Name")}</span>:
							</div>
							<div className={styles.value}>{referenceDataTitle || <span>{t("N/A")}</span>}</div>
						</div>
						<div className={styles.rainfall}>
							<div className={styles.title}>{t("Accumulated Rainfall")}:</div>
							<div className={styles.rainfallList}>
								<div className={styles.rainfallItem}>
									<div className={styles.hour}>
										1<span>{t("Hour")}</span>
									</div>
									<div className={styles.value}>{`${oneHourInterval} ${t("mm")}`}</div>
								</div>
								<div className={styles.rainfallItem}>
									<div className={styles.hour}>
										3<span>{t("Hour")}</span>
									</div>
									<div className={styles.value}>{`${threeHourInterval} ${t("mm")}`}</div>
								</div>
								<div className={styles.rainfallItem}>
									<div className={styles.hour}>
										6<span>{t("Hour")}</span>
									</div>
									<div className={styles.value}>{`${sixHourInterval} ${t("mm")}`}</div>
								</div>
								<div className={styles.rainfallItem}>
									<div className={styles.hour}>
										12
										<span>{t("Hour")}</span>
									</div>
									<div className={styles.value}>{`${twelveHourInterval} ${t("mm")}`}</div>
								</div>
								<div className={styles.rainfallItem}>
									<div className={styles.hour}>
										24
										<span>{t("Hour")}</span>
									</div>
									<div className={styles.value}>{`${twentyFourHourInterval} ${t("mm")}`}</div>
								</div>
							</div>
						</div>
						<div className={styles.source}>
							<div className={styles.title}>
								<span>{t("Source")}</span>:
							</div>
							<a
								href="http://hydrology.gov.np/"
								target="_blank"
								rel="noopener noreferrer"
								className={styles.value}>
								<span>{t("Department of Hydrology and Meteorology")}</span>
							</a>
						</div>
					</div>
				</div>
			)}
		</Translation>
	);
};

export default RainTooltip;
