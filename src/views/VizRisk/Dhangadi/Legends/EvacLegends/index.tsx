import React, { useState, useEffect } from "react";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import Education from "#resources/icons/SchoolVR.svg";
import Culture from "#resources/icons/CultureVR.svg";
import SafeShelter from "#resources/icons/Safeshelter_Updated.svg";
import Icon from "#rscg/Icon";
import styles from "./styles.module.scss";

const EvacLegends = (props) => {
	const { handleEvac, evacElement } = props;
	const [showEducation, setshowEducation] = useState(false);
	const [showCulture, setshowCulture] = useState(false);
	const [showSafe, setshowSafe] = useState(false);
	const [showAll, setshowAll] = useState(true);
	const resetCriticalLayers = () => {
		setshowEducation(false);
		setshowCulture(false);
		setshowAll(false);
		setshowSafe(false);
	};

	useEffect(() => {
		if (evacElement === "all") {
			resetCriticalLayers();
			setshowAll(true);
		} else if (evacElement === "education") {
			resetCriticalLayers();
			setshowEducation(true);
		} else if (evacElement === "safe") {
			resetCriticalLayers();
			setshowSafe(true);
		} else if (evacElement === "cultural") {
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

		if (layer === "education") {
			resetCriticalLayers();
			setshowEducation(true);
		}

		if (layer === "cultural") {
			resetCriticalLayers();
			setshowCulture(true);
		}

		if (layer === "safe") {
			resetCriticalLayers();
			setshowSafe(true);
		}
	};
	return (
		<>
			<h2>Evacuation Centers</h2>

			<div className={styles.criticalIcons}>
				<div className={styles.toggleContainer}>
					<div className={styles.infraIconContainer}>
						<button
							type="button"
							className={showAll ? styles.criticalButtonSelected : styles.criticalButton}
							onClick={() => handleEvacclick("all")}>
							<Icon name="circle" className={showAll ? styles.allIconSelected : styles.allIcon} />
							Show All
						</button>
					</div>
					<div className={styles.infraIconContainer}>
						<button
							type="button"
							className={showEducation ? styles.criticalButtonSelected : styles.criticalButton}
							onClick={() => handleEvacclick("education")}>
							<ScalableVectorGraphics className={styles.svgIcon} src={Education} />
							Education
						</button>
					</div>

					<div className={styles.infraIconContainer}>
						<button
							type="button"
							className={showCulture ? styles.criticalButtonSelected : styles.criticalButton}
							onClick={() => handleEvacclick("cultural")}>
							<ScalableVectorGraphics className={styles.svgIcon} src={Culture} />
							Culture
						</button>
					</div>
					<div className={styles.infraIconContainer}>
						<button
							type="button"
							className={showSafe ? styles.criticalButtonSelected : styles.criticalButton}
							onClick={() => handleEvacclick("safe")}>
							<ScalableVectorGraphics className={styles.svgIcon} src={SafeShelter} />
							Safe Shelter
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default EvacLegends;
