import React from "react";
import { _cs } from "@togglecorp/fujs";

import SelectInput from "#rsci/SelectInput";
import incidentMetadataList from "./metadata/incident";
import lossAndDamageMetadataList from "./metadata/loss-and-damage";
import {
	realtimeEarthquakeMetadataList,
	realtimeRainfallMetadataList,
	realtimeWaterLevelMetadataList,
} from "./metadata/realtime";
import {
	riskInfoEarthquakeRiskModelingMetadataList,
	riskInfoFloodRiskModelingMetadataList,
	riskInfoHDIMetadataList,
	riskInfoHouseholdAndIndividualVulnerabalityMetadataList,
} from "./metadata/risk-info";

import styles from "./styles.module.scss";

export default class Metadata extends React.PureComponent {
	constructor(props) {
		super(props);

		this.metadataOptionsList = [
			{ key: "incident", label: "Incident" },
			{ key: "lnd", label: "Loss and Damage" },
			{ key: "riskInfoHDI", label: "Risk information / HDI, HPI and Life Expectancy data" },
			{
				key: "riskInfoHousehold",
				label: "Risk information / Household and Individual socio-econimic data",
			},
			{ key: "riskInfoEarthquake", label: "Risk information / Earthquake Risk Modelling" },
			{ key: "riskInfoFlood", label: "Risk information / Earthquake Risk Modelling" },
			{ key: "realtimeWaterLevel", label: "Realtime / Water level" },
			{ key: "realtimeRainfall", label: "Realtime / Rainfall" },
			{ key: "realtimeEarthquake", label: "Realtime / Earthquake" },
		];

		this.metadataList = {
			incident: incidentMetadataList,
			lnd: lossAndDamageMetadataList,
			riskInfoHDI: riskInfoHDIMetadataList,
			riskInfoHousehold: riskInfoHouseholdAndIndividualVulnerabalityMetadataList,
			riskInfoEarthquake: riskInfoEarthquakeRiskModelingMetadataList,
			riskInfoFlood: riskInfoFloodRiskModelingMetadataList,
			realtimeWaterLevel: realtimeWaterLevelMetadataList,
			realtimeRainfall: realtimeRainfallMetadataList,
			realtimeEarthquake: realtimeEarthquakeMetadataList,
		};

		this.state = {
			currentMetadata: "incident",
		};
	}

	handleMetadataInputChange = (value) => {
		this.setState({ currentMetadata: value });
	};

	render() {
		const { className } = this.props;
		const { currentMetadata = "incident" } = this.state;

		return (
			<div className={_cs(styles.metadataList, className)}>
				<header className={styles.header}>
					<h4 className={styles.heading}>Search for metadata:</h4>
					<SelectInput
						options={this.metadataOptionsList}
						value={currentMetadata}
						onChange={this.handleMetadataInputChange}
						showLabel={false}
						showHintAndError={false}
						className={styles.selectInput}
						hideClearButton
					/>
				</header>
				<div className={styles.content}>
					{this.metadataList[currentMetadata].map((metadata) => {
						const { data, title } = metadata;

						return (
							<div key={title} className={styles.metadataItem}>
								<h2 className={styles.heading}>{title}</h2>
								{data.map((d) => (
									<div key={d[0]} className={styles.row}>
										<div className={styles.key}>{d[0]}</div>
										<div className={styles.value}>{d[1]}</div>
									</div>
								))}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
