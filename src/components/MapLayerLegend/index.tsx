import React from "react";
import { _cs } from "@togglecorp/fujs";

import styles from "./styles.module.scss";

interface Props {
	className?: string;
	legendSrc?: string;
	description?: string;
	layerTitle?: string;
}

class MapLayerLegend extends React.PureComponent<Props> {
	public render() {
		const { className, legendSrc, description, layerTitle } = this.props;

		return (
			<div className={_cs(className, "map-legend-container", styles.mapLayerLegend)}>
				<h4 className={styles.heading}>Legends</h4>
				<div className={styles.legendDescription}>{description}</div>
				<img src={legendSrc} alt={`legend-for-${layerTitle}`} />
			</div>
		);
	}
}

export default MapLayerLegend;
