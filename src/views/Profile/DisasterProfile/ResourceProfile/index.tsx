import React from "react";
import { _cs } from "@togglecorp/fujs";

import { Translation } from "react-i18next";
import ScalableVectorGraphcis from "#rscv/ScalableVectorGraphics";

import modalize from "#rscg/Modalize";
import AccentButton from "#rsca/Button/AccentButton";
import CommonMap from "#components/CommonMap";
import EducationIcon from "#resources/icons/Education.svg";
import HealthIcon from "#resources/icons/Health-facility.svg";
import FinanceIcon from "#resources/icons/Financing.svg";
import CommunicationIcon from "#resources/icons/Cell-tower.svg";
import GovernanceIcon from "#resources/icons/Food-Security.svg";
import TourismIcon from "#resources/icons/Tourist.svg";
import IndustryIcon from "#resources/icons/Factory.svg";
import CulturalIcon from "#resources/icons/Dreamcatcher.svg";
import EnergyIcon from "#resources/icons/Energy.svg";

import styles from "./styles.module.scss";

interface Props {
	data: unknown;
	onResourceAdd: () => void;
	className?: string;
}

interface Params {}

const attributes = {
	education: {
		dataKey: "educationCount",
		title: "Education",
		icon: EducationIcon,
	},
	health: {
		dataKey: "healthCount",
		title: "Health",
		icon: HealthIcon,
	},
	finance: {
		dataKey: "financeCount",
		title: "Finance",
		icon: FinanceIcon,
	},
	communication: {
		dataKey: "communicationCount",
		title: "Communication",
		icon: CommunicationIcon,
	},
	governance: {
		dataKey: "governanceCount",
		title: "Governance",
		icon: GovernanceIcon,
	},
	tourism: {
		dataKey: "tourismCount",
		title: "Tourism",
		icon: TourismIcon,
	},
	industry: {
		dataKey: "industryCount",
		title: "Industries",
		icon: IndustryIcon,
	},
	cultural: {
		dataKey: "culturalCount",
		title: "Religious sites",
		icon: CulturalIcon,
	},
	energy: {
		dataKey: "energyCount",
		title: "Energy station",
		icon: EnergyIcon,
	},
};

class ResourceProfile extends React.PureComponent<Props> {
	public render() {
		const { className, onResourceAdd, data = {} } = this.props;

		return (
			<div className={_cs(styles.resourceProfile, className)}>
				<header className={styles.header}>
					<Translation>
						{(t) => <h2 className={styles.heading}>{t("Available resources")}</h2>}
					</Translation>
				</header>
				<div className={styles.content}>
					<CommonMap sourceKey="profile-resource" />
					{Object.keys(attributes).map((key) => (
						<div key={key} className={styles.attribute}>
							<div className={styles.iconContainer}>
								<ScalableVectorGraphcis className={styles.icon} src={attributes[key].icon} />
							</div>
							<div className={styles.details}>
								<div className={styles.value}>{data[attributes[key].dataKey] || "-"}</div>
								<Translation>
									{(t) => <div className={styles.label}>{t(attributes[key].title)}</div>}
								</Translation>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default ResourceProfile;
