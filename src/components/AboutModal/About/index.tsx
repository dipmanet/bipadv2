import React from "react";
import { Translation } from "react-i18next";
import { _cs } from "@togglecorp/fujs";

import styles from "./styles.module.scss";

export default class About extends React.PureComponent {
	render() {
		const { className } = this.props;

		return (
			<Translation>
				{(t) => (
					<div className={_cs(styles.about, className)}>
						<h3>{t("BIPAD: Building Information Platform Against Disaster")}</h3>
						<p>
							{t(
								"Disaster related data/information is one of the most crucial components for policy making, planning, and implementing DRRM activities.BIPAD is built at a time when disaster governance in Nepal is changing on account of federal restructuring of the country.However, disaster data/information is still scattered, insufficient and not fully harmonized.On this backdrop, BIPAD is developed by pooling all credible digital and spatial data that are available within different government bodies, non-governmental organizations, academic institutions and research organizations on a single platform.The platform has six modules in the portal that has the potential to:"
							)}
						</p>
						<ul>
							<li>{t("Enhance preparedness and early warning")}</li>
							<li>{t("Strengthen disaster communication")}</li>
							<li>{t("Strengthen emergency response")}</li>
							<li>{t("Enhance coordination post-incident")}</li>
							<li>{t("Evidence-based planning, decision making and policy making")}</li>
						</ul>
						<p>
							{t(
								"The focus of the system is on bottom up approach of data collection,targeting the Provincial and Municipal governments to engage in verifying and collecting data.BIPAD is targeted for Emergency Operation Centers at National, Provincial and Municipal tiers of the government, and Nepal Police, who is the first responder to disaster. Other users of this system are the line ministries at National and Provincial tiers working in disaster management division and departments, Nepal Army, Armed Police Force, non-governmental organizations, research institutions and the general public."
							)}
						</p>
						<p>
							{t(
								"The features in BIPAD inform the users about the details of an incident for both natural and non-natural hazards for response and for historical analysis of loss and damage. The system integrates electronic version of the incident reporting form used in collecting incident information by Nepal Police."
							)}
						</p>
						<p>
							{t(
								"The alert feature has the potential to pre-inform to take early actions to mitigate   disasters. BIPAD targets to provide crucial information on the capacity and resources, such as on health institutions, financial institutions, schools, banks, stockpiles, road network, inventories, NGOs, government agencies, etc. in relation to the incidents. The system incorporates hazard maps and vulnerability indicators that can be used for risk sensitive land use planning and DRR inclusive development activities. The system is built to accommodate repository of DRRM documents, status of DRRM projects, and relief budget tracking. It has provisions to monitor the government’s as well as non-government organizations’ projects on the basis of seven targets of Sendai Framework (2015-2030) and Priorities and Sub-Priorities of Disaster Risk Reduction Strategic Action plan 2018."
							)}
						</p>
						<p>
							{t(
								"The above features of the system would be fully functional when credible data/information is integrated into the system coming from local level. The system is committed for the same."
							)}
						</p>
					</div>
				)}
			</Translation>
		);
	}
}
