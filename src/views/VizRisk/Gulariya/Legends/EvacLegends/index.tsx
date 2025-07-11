import React, { useState, useEffect } from "react";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import Safe from "#resources/icons/Safeshelter_Updated.svg";

import Icon from "#rscg/Icon";
import Culture from "../../Icons/icon_set_religion.svg";
import styles from "./styles.module.scss";

const EvacLegends = (props) => {
	const { handleEvac, evacElement } = props;
	const [showCulture, setshowCulture] = useState(false);
	const [showSafe, setshowSafe] = useState(false);
	const [showAll, setshowAll] = useState(true);
	const resetCriticalLayers = () => {
		setshowCulture(false);
		setshowAll(false);
		setshowSafe(false);
	};

	useEffect(() => {
		if (evacElement === "all") {
			resetCriticalLayers();
			setshowAll(true);
		} else if (evacElement === "safeshelter") {
			resetCriticalLayers();
			setshowSafe(true);
		} else if (evacElement === "Cultural") {
			resetCriticalLayers();
			setshowCulture(true);
		}
	}, [evacElement]);

	const handleEvacclick = (layer) => {
		handleEvac(layer);
		if (layer === "all") {
			resetCriticalLayers();
			setshowAll(true);
		}

		if (layer === "Cultural") {
			resetCriticalLayers();
			setshowCulture(true);
		}

		if (layer === "safeshelter") {
			resetCriticalLayers();
			setshowSafe(true);
		}
	};
	return (
		<>
			<h2 className={styles.heading}>Evacuation Centers</h2>
			<div className={styles.criticalIcons}>
				<div className={styles.toggleContainer}>
					<div className={styles.infraIconContainer}>
						<button
							type="button"
							className={showAll ? styles.criticalButtonSelected : styles.criticalButton}
							onClick={() => handleEvacclick("all")}
							style={{ zIndex: 5 }}>
							<Icon name="circle" className={showAll ? styles.allIconSelected : styles.allIcon} />
							Show All
						</button>
					</div>
					<div className={styles.infraIconContainer}>
						<button
							type="button"
							className={showCulture ? styles.criticalButtonSelected : styles.criticalButton}
							onClick={() => handleEvacclick("Cultural")}
							style={{ zIndex: 4 }}>
							<ScalableVectorGraphics className={styles.svgIcon} src={Culture} />
							Culture
						</button>
					</div>
					<div className={styles.infraIconContainer}>
						<button
							type="button"
							className={showSafe ? styles.criticalButtonSelected : styles.criticalButton}
							onClick={() => handleEvacclick("safeshelter")}
							style={{ zIndex: 3 }}>
							<ScalableVectorGraphics className={styles.svgIcon} src={Safe} width={"25px"} />
							Safe Shelter
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default EvacLegends;
