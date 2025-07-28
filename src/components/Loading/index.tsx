import React from "react";
import { useTranslation } from "react-i18next";

import Spinner from "#rscu/../v2/View/Spinner";
import styles from "./styles.module.scss";

interface LoadingProps {
	pending?: boolean;
	text?: string;
}

const Loading: React.FC<LoadingProps> = ({ pending = false, text = "Loading data" }) => {
	const { t } = useTranslation();

	if (!pending) {
		return null;
	}

	return (
		<div className={styles.loading}>
			<Spinner size="large" className={styles.spinner} />
			<div className={styles.text}>{t(text)}</div>
		</div>
	);
};

export default Loading;
