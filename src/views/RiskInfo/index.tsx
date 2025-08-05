import React from "react";
import Page from "#components/Page";
import LeftPane from "./LeftPane";
import RiskInfoMap from "./Map";
import ActiveLayers from "./ActiveLayers";
import CapacityAndResourcesLegend from "./LeftPane/Details/CapacityAndResources/Legend";
import styles from "./styles.module.scss";

type Props = unknown;

class RiskInfo extends React.PureComponent<Props> {
	public state = {
		carActive: false,
		resourceIdForLegend: null,
		droneImagePending: false,
		activeLayersIndication: {
			education: false,
			health: false,
			finance: false,
			governance: false,
			hotelandrestaurant: false,
			cultural: false,
			industry: false,
			communication: false,
			openspace: false,
			communityspace: false,
			fireengine: false,
			helipad: false,
			evacuationcentre: false,
		},
	};

	public handleCarActive = (value: boolean) => {
		this.setState({ carActive: value });
	};

	public handleActiveLayerIndication = (value: {}) => {
		this.setState({ activeLayersIndication: value });
	};

	public setResourceId = (id: number) => {
		this.setState({ resourceIdForLegend: id });
	};

	public handleDroneImage = (loading: boolean) => {
		this.setState({ droneImagePending: loading });
	};

	public render() {
		const { carActive, activeLayersIndication, resourceIdForLegend, droneImagePending } =
			this.state;

		return (
			<>
				<RiskInfoMap />
				<Page
					hideHazardFilter
					hideDataRangeFilter
					leftContentContainerClassName={styles.leftContainer}
					leftContent={
						<LeftPane
							className={styles.leftPane}
							handleCarActive={this.handleCarActive}
							handleActiveLayerIndication={this.handleActiveLayerIndication}
							handleDroneImage={this.handleDroneImage}
							setResourceId={this.setResourceId}
							droneImagePending={droneImagePending}
						/>
					}
					mainContentContainerClassName={styles.mainContent}
					// mainContent={(
					//     <ActiveLayers className={styles.activeLayerList} />
					// )}
					mainContent={
						carActive ? (
							<div>
								<ActiveLayers className={styles.activeLayerList} />
								<CapacityAndResourcesLegend
									handleDroneImage={this.handleDroneImage}
									activeLayersIndication={activeLayersIndication}
									resourceIdForLegend={resourceIdForLegend}
								/>
							</div>
						) : (
							<ActiveLayers className={styles.activeLayerList} />
						)
					}
				/>
			</>
		);
	}
}

export default RiskInfo;
