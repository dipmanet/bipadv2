import React from "react";
import { _cs } from "@togglecorp/fujs";
import { connect } from "react-redux";
import { Translation } from "react-i18next";

import { languageSelector } from "#selectors";
import styles from "./styles.module.scss";

import DrawIcon from "./icons/bbox.svg";
import GlobeIcon from "./icons/latlng.svg";
import NavigationIcon from "./icons/navigation.svg";
import SearchIcon from "./icons/search.svg";
import ReloadIcon from "./icons/reset.svg";
import FullScreenIcon from "./icons/fullscreen.svg";

// Props from parent
interface OwnProps {
	className?: string;
	goToLocation: () => void;
	lattitude: number | string | undefined;
	longitude: number | string | undefined;
	setLongitude: React.Dispatch<React.SetStateAction<number | undefined | string>>;
	setLattitude: React.Dispatch<React.SetStateAction<number | undefined | string>>;
	resetLocation: () => void;
	hideMap: boolean;
	toggleLeftPaneButtonStretched: boolean;
	drawToZoom: () => void;
	fullScreenMap: () => void;
	currentLocation: () => void;
	handleToggle: () => void;
	checkLatLngState: boolean;
	lattitudeRef: any;
}

// Props from Redux
interface StateProps {
	language: string;
}

type Props = OwnProps & StateProps;

const ZoomToolBar: React.FC<Props> = (props) => {
	const {
		className,
		goToLocation,
		lattitude,
		longitude,
		setLongitude,
		setLattitude,
		resetLocation,
		hideMap,
		drawToZoom,
		fullScreenMap,
		currentLocation,
		handleToggle,
		checkLatLngState,
		lattitudeRef,
		language: { language },
	} = props;

	const handleEnterFunction = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			goToLocation();
		}
	};

	if (hideMap) return null;

	return (
		<div className={_cs(styles.zoomToolBar, "zoomToolbar-tour")}>
			<div className={styles.zoomSection}>
				<button type="button" className={_cs(styles.bboxDrawBtn, className)} onClick={drawToZoom}>
					<span className={styles.tooltip}>
						{language === "en"
							? "Draw box to zoom into an area"
							: "कुनै क्षेत्रमा जुम गर्न बक्स कोर्नुहोस्"}
					</span>
					<img className={styles.svgIcon} src={DrawIcon} alt="" />
				</button>

				<button
					type="button"
					className={_cs(styles.navigationBtn, className)}
					onClick={currentLocation}>
					<span className={styles.tooltip}>
						{language === "en"
							? "Click to locate your current area"
							: "आफ्नो हालको क्षेत्र पत्ता लगाउन यहाँ  क्लिक गर्नुहोस्"}
					</span>
					<img src={NavigationIcon} alt="" />
				</button>

				<button type="button" className={_cs(styles.globeBtn, className)} onClick={handleToggle}>
					<span className={styles.tooltip}>
						{language === "en"
							? "Click to search by latitude and longitude"
							: "अक्षांश र देशान्तर द्वारा खोजी गर्न यहाँ क्लिक गर्नुहोस्"}
					</span>
					<img className={styles.svgIcon} src={GlobeIcon} alt="" />
				</button>

				<button
					type="button"
					className={_cs(styles.fullScreenIcon, className)}
					onClick={fullScreenMap}>
					<span className={styles.tooltip}>
						{language === "en"
							? "Click to view map in fullscreen"
							: "पूर्ण स्क्रिनमा नक्सा हेर्न यहाँ क्लिक गर्नुहोस्"}
					</span>
					<img className={styles.svgIcon} src={FullScreenIcon} alt="" />
				</button>

				<button type="button" className={_cs(styles.reloadIcon, className)} onClick={resetLocation}>
					<span className={styles.tooltip}>
						{language === "en"
							? "Reset the zoom of map to original view"
							: "जुम भएको नक्सालाई  मूल दृश्यमा रिसेट गर्नुहोस्"}
					</span>
					<img style={{ height: "17px" }} className={styles.svgIcon} src={ReloadIcon} alt="" />
				</button>
			</div>

			<Translation static="true">
				{(t) => (
					<div
						className={_cs(
							checkLatLngState ? styles.latLngSection : styles.latLngSectionHide,
							className
						)}>
						<input
							className={styles.latLngInputField}
							type="number"
							placeholder={t("Latitude")}
							value={lattitude}
							onChange={(e) => setLattitude(e.target.value)}
							ref={lattitudeRef}
						/>
						<input
							className={styles.latLngInputField}
							type="number"
							placeholder={t("Longitude")}
							value={longitude}
							onChange={(e) => setLongitude(e.target.value)}
							onKeyUp={handleEnterFunction}
						/>
						<button
							type="button"
							className={_cs(
								longitude && lattitude ? styles.searchIcon : styles.searchIconDisabled
							)}
							onClick={goToLocation}
							disabled={!(longitude && lattitude)}>
							<span className={styles.tooltip}>
								{longitude && lattitude
									? language === "en"
										? "Search"
										: "खोजनुहोस्"
									: language === "en"
									? "Please add a value in Latitude and Longitude fields"
									: "कृपया अक्षांश र देशान्तर क्षेत्रहरूमा मान थप्नुहोस्"}
							</span>
							<img className={styles.svgIcon} src={SearchIcon} alt="" />
						</button>
					</div>
				)}
			</Translation>
		</div>
	);
};

const mapStateToProps = (state: any): StateProps => ({
	language: languageSelector(state),
});

export default connect(mapStateToProps)(ZoomToolBar);
