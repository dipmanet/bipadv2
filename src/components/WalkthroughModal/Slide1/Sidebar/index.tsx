/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable css-modules/no-undef-class */
import { Link } from "@reach/router";
import React, { useRef } from "react";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import styles from "./styles.module.scss";
import Reset from "../../../../resources/icons/reset.svg";

const SidebarLogo = ({
	data,
	selectedCategory,
	onClick,
	manual,
	searchData,
	handleManualType,
	language,
	faqs,
	yearSelection,
	handleYearFilter,
	handleReset,
	filterManualTypeKey,
	filterYearKey,
}) => {
	const manualRef = useRef(null);
	const yearRef = useRef(null);
	return (
		<>
			<div className={styles.sidebar}>
				<div className={styles.sideNavHeading}>
					<div className={styles.navLeftSide}>
						<div className={styles.navLogo}>
							<div className={styles.colorBar} />
							<Link to="/">
								<div className={styles.bipdLogoName}>BIPAD Portal</div>
							</Link>
						</div>
					</div>
				</div>
				<div className={styles.mainSideBarBody}>
					{manual ? (
						<>
							<div
								style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								<h3>{language === "en" ? "Manuals" : "पुस्तिकाहरू"}</h3>
								{(filterManualTypeKey || filterYearKey) && (
									<div
										title={language === "en" ? "Reset" : "रिसेट"}
										onClick={() => handleReset(manualRef, yearRef)}
										style={{ cursor: "pointer" }}>
										<ScalableVectorGraphics
											// className={styles.hazardIcon}
											src={Reset}
											style={{ height: "20px", marginRight: "30px" }}
										/>
									</div>
								)}
							</div>

							<div className={styles.sidebarCategories}>
								<>
									<input
										className={styles.search}
										name="search"
										type="text"
										placeholder={language === "en" ? "Search" : "खोज्नुहोस्"}
										onChange={(e) => searchData(e)}
									/>
									<select name="type" id="manual" onChange={handleManualType} ref={manualRef}>
										<option value="">
											{language === "en" ? "Type of Document" : "डक्यूमेन्टको प्रकार"}
										</option>
										<option value="Technical Manual">
											{language === "en" ? "Technical Manual" : "प्राविधिक पुस्तिका"}
										</option>
										<option value="User Manual">
											{language === "en" ? "User Manual" : "प्रयोगकर्ता पुस्तिका"}
										</option>
									</select>
									<select name="type" id="manual" onChange={handleYearFilter} ref={yearRef}>
										<option value="">
											{language === "en" ? "Select Year" : "वर्ष चयन गर्नुहोस्"}
										</option>
										{yearSelection &&
											yearSelection.length &&
											yearSelection.map((item) => (
												<>
													<option value={item}>{item}</option>
												</>
											))}
									</select>
								</>
							</div>
						</>
					) : faqs ? (
						data.length &&
						data.map((item) => (
							<div key={item.id}>
								<h3>{language === "en" ? item.questionEn : item.questionNe}</h3>
								<div className={styles.sidebarCategories}>
									{item.childs.length &&
										item.childs.map((d) => (
											<span
												key={d.id}
												className={selectedCategory === d.id ? styles.active : ""}
												onClick={() => onClick(item.id, d.id)}>
												{language === "en" ? d.questionEn : d.questionNe}
											</span>
										))}
								</div>
							</div>
						))
					) : (
						data.length &&
						data.map((item) => (
							<div key={item.id}>
								<h3>{language === "en" ? item.nameEn : item.nameNe}</h3>
								<div className={styles.sidebarCategories}>
									{item.childs.length &&
										item.childs.map((d) => (
											<span
												key={d.id}
												className={selectedCategory === d.id ? styles.active : ""}
												onClick={() => onClick(item.id, d.id)}>
												{language === "en" ? d.nameEn : d.nameNe}
											</span>
										))}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</>
	);
};

export default SidebarLogo;
