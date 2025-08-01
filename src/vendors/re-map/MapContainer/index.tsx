import React, { useContext, useEffect } from "react";
import { _cs } from "@togglecorp/fujs";

import { MapChildContext } from "../context";
import useDimension from "../useDimension";
import styles from "./styles.module.scss";

interface Props {
	className?: string;
}

// TODO: make container responsive
const MapContainer: React.FC<Props> = ({ className }) => {
	const { mapContainerRef, map } = useContext(MapChildContext);
	const rect = useDimension(mapContainerRef);

	useEffect(() => {
		if (map) {
			map.resize();
		}
	}, [rect, map]);

	return <div ref={mapContainerRef} className={_cs(className, styles.map)} />;
};

export default MapContainer;
