import React from "react";
import { compareString, compareNumber, _cs } from "@togglecorp/fujs";

import { Translation } from "react-i18next";
import Modal from "#rscv/Modal";
import ModalHeader from "#rscv/Modal/Header";
import ModalBody from "#rscv/Modal/Body";
import Table from "#rscv/Table";
import ModalFooter from "#rscv/Modal/Footer";
import DownloadButton from "#components/DownloadButton";
import DangerButton from "#rsca/Button/DangerButton";

import { Header } from "#store/atom/table/types";
import { RealTimeFire } from "#store/atom/page/types";

import { convertNormalTableToCsv } from "#utils/table";

import { convertDateAccToLanguage } from "#utils/common";
import styles from "./styles.module.scss";

interface RealTimeFireExtended extends RealTimeFire {
	title?: string;
}
interface Props {
	realTimeFire: RealTimeFireExtended[];
	closeModal?: () => void;
}

const fireSelector = (fire: RealTimeFireExtended) => fire.id;

const defaultSort = {
	key: "eventOn",
	order: "dsc",
};

class Fire extends React.PureComponent<Props> {
	public constructor(props: Props) {
		super(props);

		// TODO: add OandM by to riverWatch
		this.fireHeader = (language) => [
			{
				key: "title",
				label: language === "en" ? "Location" : "स्‍थान",
				order: 1,
				sortable: true,
				comparator: (a, b) => compareString(a.title, b.title),
				modifier: (row: RealTimeFireExtended) => {
					const { title } = row;
					return title || undefined;
				},
			},
			{
				key: "eventOn",
				label: language === "en" ? "Date" : "मिति",
				order: 2,
				sortable: true,
				comparator: (a, b) => compareString(a.eventOn, b.eventOn),
				modifier: (row: RealTimeFireExtended) => {
					const { eventOn } = row;

					return eventOn
						? convertDateAccToLanguage(eventOn.substring(0, eventOn.indexOf("T")), language)
						: undefined;
				},
			},
			{
				key: "time",
				label: language === "en" ? "Time" : "समय",
				order: 3,
				sortable: false,
				modifier: (row: RealTimeFire) => {
					const { eventOn } = row;
					if (eventOn) {
						return eventOn.split("T")[1].split(".")[0].split("+")[0];
					}
					return undefined;
				},
			},
			{
				key: "landCover",
				label: language === "en" ? "Land Cover" : "भूउपयोग",
				order: 4,
				sortable: false,
			},
			{
				key: "brightness",
				label: language === "en" ? "Brightness" : "चमक",
				order: 5,
				sortable: true,
				comparator: (a, b) => compareNumber(a.brightness, b.brightness),
			},
		];
	}

	private fireHeader: Header<RealTimeFireExtended>[];

	private getClassName = () => "fire";

	public render() {
		const { realTimeFire, closeModal, language } = this.props;
		const fireHeader = this.fireHeader(language);

		const formattedTableData = convertNormalTableToCsv(realTimeFire, fireHeader);
		return (
			<Translation>
				{(t) => (
					<Modal
						// closeOnEscape
						// onClose={closeModal}
						className={_cs(styles.fireModal, styles.languageFont)}>
						<ModalHeader
							title={t("Fire")}
							rightComponent={
								<DangerButton
									transparent
									iconName="close"
									onClick={closeModal}
									title={t("Close Modal")}
								/>
							}
						/>
						<ModalBody className={styles.body}>
							<Table
								rowClassNameSelector={this.getClassName}
								className={styles.fireTable}
								data={realTimeFire}
								headers={fireHeader}
								keySelector={fireSelector}
								defaultSort={defaultSort}
							/>
						</ModalBody>
						<ModalFooter>
							<DangerButton onClick={closeModal}>{t("Close")}</DangerButton>
							<DownloadButton value={formattedTableData} name="Fire.csv">
								{t("Download")}
							</DownloadButton>
						</ModalFooter>
					</Modal>
				)}
			</Translation>
		);
	}
}

export default Fire;
