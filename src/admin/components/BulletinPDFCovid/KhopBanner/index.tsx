import React from "react";
import { Translation } from "react-i18next";
import styles from "./styles.module.scss";

const KhopBanner = (props) => {
	const { value, title, percentage } = props;
	return (
		<div className={styles.khopContainer}>
			<div>
				<h2>{value}</h2>
				{percentage ? (
					<Translation>
						{(t) => (
							<p className={styles.small}>
								{t("Percentage of 1st Dosage")} {`${percentage} %`}
							</p>
						)}
					</Translation>
				) : (
					<p> </p>
				)}
			</div>
			<p>
				<Translation>{(t) => <span>{t(`${title}`)}</span>}</Translation>
			</p>
		</div>
	);
};

export default KhopBanner;
