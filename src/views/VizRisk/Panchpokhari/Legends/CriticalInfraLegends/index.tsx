import React, { useState, useEffect } from "react";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import Education from "#resources/icons/icon_set_school.svg";
import Governance from "#resources/icons/icon_set_government.svg";
import Cultural from "#resources/icons/icon_set_religion.svg";
import Health from "#resources/icons/icon_set_health-01.svg";
import Industry from "#resources/icons/icon_set_industry.svg";
import Tourism from "#resources/icons/icon_set_hotel.svg";
import Bank from "#resources/icons/icon_set_bank.svg";
import Trade from "#resources/icons/trade.svg";
import Water from "#resources/icons/WATERVR.svg";
import Icon from "#rscg/Icon";
import styles from "./styles.module.scss";

const LandCoverLegends = (props) => {
	const { handleCritical, criticalFlood } = props;
	const [showEducation, setshowEducation] = useState(false);
	const [showFinance, setshowFinance] = useState(false);
	const [showIndustry, setshowIndustry] = useState(false);
	const [showGovernemnt, setshowGovernemnt] = useState(false);
	const [showCultural, setshowCultural] = useState(false);
	const [showHospital, setshowHospital] = useState(false);
	const [showTourism, setshowTourism] = useState(false);
	const [showWater, setshowWater] = useState(false);
	const [showTrade, setshowTrade] = useState(false);
	const [showAll, setshowAll] = useState(true);
	const [showCriticalElements, setshowCriticalElements] = useState(true);

	const resetCriticalLayers = () => {
		setshowEducation(false);
		setshowFinance(false);
		setshowIndustry(false);
		setshowGovernemnt(false);
		setshowCultural(false);
		setshowHospital(false);
		setshowTourism(false);
		setshowTrade(false);
		setshowWater(false);
		setshowAll(false);
	};

	const handleCriticalToggle = () => {
		const newVal = !showCriticalElements;
		setshowCriticalElements(newVal);
	};

	useEffect(() => {
		if (criticalFlood === "all") {
			resetCriticalLayers();
			setshowAll(true);
		} else if (criticalFlood === "Education") {
			resetCriticalLayers();
			setshowEducation(true);
		} else if (criticalFlood === "Cultural") {
			resetCriticalLayers();
			setshowCultural(true);
		} else if (criticalFlood === "Governance") {
			resetCriticalLayers();
			setshowGovernemnt(true);
		} else if (criticalFlood === "Health") {
			resetCriticalLayers();
			setshowHospital(true);
		} else if (criticalFlood === "Industry") {
			resetCriticalLayers();
			setshowIndustry(true);
		} else if (criticalFlood === "Finance") {
			resetCriticalLayers();
			setshowFinance(true);
		} else if (criticalFlood === "Tourism") {
			resetCriticalLayers();
			setshowTourism(true);
		} else if (criticalFlood === "Trade and business") {
			resetCriticalLayers();
			setshowTrade(true);
		} else if (criticalFlood === "Water sources") {
			resetCriticalLayers();
			setshowWater(true);
		} else if (criticalFlood === "Tourism") {
			resetCriticalLayers();
			setshowTourism(true);
		}
	}, [criticalFlood]);

	const handleCriticalclick = (layer) => {
		handleCritical(layer);
		if (layer === "all") {
			resetCriticalLayers();
			setshowAll(true);
		}
		if (layer === "Education") {
			resetCriticalLayers();
			setshowEducation(true);
		}
		if (layer === "Governance") {
			resetCriticalLayers();
			setshowGovernemnt(true);
		}
		if (layer === "Cultural") {
			resetCriticalLayers();
			setshowCultural(true);
		}
		if (layer === "Health") {
			resetCriticalLayers();
			setshowHospital(true);
		}
		if (layer === "Industry") {
			resetCriticalLayers();
			setshowIndustry(true);
		}
		if (layer === "Bank") {
			resetCriticalLayers();
			setshowFinance(true);
		}
		if (layer === "Tourism") {
			resetCriticalLayers();
			setshowTourism(true);
		}
		if (layer === "Trade and business") {
			resetCriticalLayers();
			setshowTrade(true);
		}
		if (layer === "Water sources") {
			resetCriticalLayers();
			setshowWater(true);
		}
	};

	return (
		<>
			<button type="button" className={styles.toggleCritical} onClick={handleCriticalToggle}>
				<h2>Infrastructures</h2>
				{showCriticalElements === true ? (
					<Icon name="chevronRight" className={styles.chevrontoggle} />
				) : (
					<Icon name="chevronDown" className={styles.chevrontoggle} />
				)}
			</button>

			{showCriticalElements && (
				<div className={styles.criticalIcons}>
					<div className={styles.toggleContainer}>
						<div className={styles.infraIconContainer}>
							<button
								type="button"
								className={showAll ? styles.criticalButtonSelected : styles.criticalButton}
								onClick={() => handleCriticalclick("all")}>
								<Icon name="circle" className={showAll ? styles.allIconSelected : styles.allIcon} />
								Show All
							</button>
						</div>
						<div className={styles.infraIconContainer}>
							<button
								type="button"
								className={showEducation ? styles.criticalButtonSelected : styles.criticalButton}
								onClick={() => handleCriticalclick("Education")}>
								<ScalableVectorGraphics className={styles.svgIcon} src={Education} />
								Educational Institution
							</button>
						</div>
						<div className={styles.infraIconContainer}>
							<button
								type="button"
								className={showFinance ? styles.criticalButtonSelected : styles.criticalButton}
								onClick={() => handleCriticalclick("Finance")}>
								<ScalableVectorGraphics className={styles.svgIcon} src={Bank} />
								Finance
							</button>
						</div>
						<div className={styles.infraIconContainer}>
							<button
								type="button"
								className={showCultural ? styles.criticalButtonSelected : styles.criticalButton}
								onClick={() => handleCriticalclick("Cultural")}>
								<ScalableVectorGraphics className={styles.svgIcon} src={Cultural} />
								Cultural Site
							</button>
						</div>
						<div className={styles.infraIconContainer}>
							<button
								type="button"
								className={showGovernemnt ? styles.criticalButtonSelected : styles.criticalButton}
								onClick={() => handleCriticalclick("Governance")}>
								<ScalableVectorGraphics className={styles.svgIcon} src={Governance} />
								Government Buildings
							</button>
						</div>

						<div className={styles.infraIconContainer}>
							<button
								type="button"
								className={showHospital ? styles.criticalButtonSelected : styles.criticalButton}
								onClick={() => handleCriticalclick("Health")}>
								<ScalableVectorGraphics className={styles.svgIcon} src={Health} />
								Hospital
							</button>
						</div>
						<div className={styles.infraIconContainer}>
							<button
								type="button"
								className={showTourism ? styles.criticalButtonSelected : styles.criticalButton}
								onClick={() => handleCriticalclick("Tourism")}>
								<ScalableVectorGraphics className={styles.svgIcon} src={Tourism} />
								Hotels/Restaurants
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default LandCoverLegends;
