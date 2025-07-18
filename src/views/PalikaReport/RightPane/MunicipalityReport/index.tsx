/* eslint-disable import/order */

import React, { useEffect, useState } from "react";
import JsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { connect } from "react-redux";
import { isDefined, _cs } from "@togglecorp/fujs";
import { CircularProgressbar } from "react-circular-progressbar";
import ADToBS from "#utils/AdBSConverter/AdToBs";
import BSToAD from "#utils/AdBSConverter/BsToAd";
// import { ADToBS, BSToAD } from 'bikram-sambat-js';
import Gt from "#views/PalikaReport/utils";
import Translations from "#views/PalikaReport/Constants/Translations";
import styles from "./styles.module.scss";
import Budget from "./Sections/Budget";
import BudgetActivity from "./Sections/BudgetActivity";
import PreviewPageOne from "./Sections/Preview/PageOne";
import PreviewPageTwo from "./Sections/Preview/PageTwo";
import General from "./Sections/General";
import ProgrammeAndPolicies from "./Sections/ProgrammeAndPolicies";
import Contacts from "./Sections/Contacts";
import Inventory from "./Sections/Inventory";
import CriticalInfra from "./Sections/CriticalInfra";
import Organisation from "./Sections/Organisation";
import Relief from "./Sections/Relief";
import "react-circular-progressbar/dist/styles.css";

import {
	createConnectedRequestCoordinator,
	createRequestClient,
	ClientAttributes,
	methods,
} from "#request";
import {
	userSelector,
	palikaRedirectSelector,
	generalDataSelector,
	provincesSelector,
	districtsSelector,
	municipalitiesSelector,
	palikaLanguageSelector,
	drrmOrgSelecter,
	drrmInventorySelecter,
	drrmCriticalSelecter,
	drrmContactsSelecter,
	drrmRegionSelector,
} from "#selectors";
import Simulation from "./Sections/Simulation";

interface Props {
	keyTab: number;
	showTabs: boolean;
	hideWelcomePage: () => void;
}

interface SyntheticEvent<T> {
	currentTarget: EventTarget & T;
}
const mapStateToProps = (state, props) => ({
	user: userSelector(state),
	palikaRedirect: palikaRedirectSelector(state),
	generalData: generalDataSelector(state),
	provinces: provincesSelector(state),
	districts: districtsSelector(state),
	municipalities: municipalitiesSelector(state),
	palikaLanguage: palikaLanguageSelector(state),
	drrmOrg: drrmOrgSelecter(state),
	drrmInventory: drrmInventorySelecter(state),
	drrmCritical: drrmCriticalSelecter(state),
	drrmContacts: drrmContactsSelecter(state),
	drrmRegion: drrmRegionSelector(state),
	drrmLanguage: palikaLanguageSelector(state),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	// PalikaReportGetRequest: {
	//     url: ({ params }) => `${params.url}`,
	//     query: ({ params, props }) => {
	//         if (params) {
	//             return {
	//                 province: params.province,
	//                 district: params.district,
	//                 municipality: params.municipality,
	//             };
	//         }
	//         return { limit: params.page, offset: params.offset };
	//     },
	//     method: methods.GET,
	//     onMount: false,

	//     onSuccess: ({ response, params }) => {
	//         let citizenReportList: CitizenReport[] = [];
	//         const citizenReportsResponse = response as MultiResponse<CitizenReport>;
	//         citizenReportList = citizenReportsResponse.results;

	//         if (params && params.reportData) {
	//             params.reportData(citizenReportList);
	//         }
	//     },
	// },
	FiscalYearFetch: {
		url: "/nepali-fiscal-year/",
		method: methods.GET,
		onMount: true,

		onSuccess: ({ response, params }) => {
			let citizenReportList: CitizenReport[] = [];
			const citizenReportsResponse = response as MultiResponse<CitizenReport>;
			citizenReportList = citizenReportsResponse.results;
			params.fiscalYearList(citizenReportList);
		},
	},
	DisasterProfileGetRequest: {
		url: "/disaster-profile/",
		query: ({ params, props }) => ({
			province: params.province,
			district: params.district,
			municipality: params.municipality,
			// eslint-disable-next-line @typescript-eslint/camelcase
			fiscal_year: params.fiscalYear,
		}),
		method: methods.GET,
		onMount: true,

		onSuccess: ({ response, params }) => {
			let citizenReportList: CitizenReport[] = [];
			const citizenReportsResponse = response as MultiResponse<CitizenReport>;
			citizenReportList = citizenReportsResponse.results;

			if (params && params.disasterProfile) {
				params.disasterProfile(citizenReportList);
			}
		},
	},
};

let province = 0;
let district = 0;
let municipality = 0;
let municipalityName = "";
let provinceName = "";
let districtName = "";

// const formdata = new FormData();
const ReportModal: React.FC<Props> = (props: Props) => {
	const {
		keyTab,
		showTabs,
		hideWelcomePage,
		tableHeader,
		mayor,
		cao,
		focalPerson,
		updateTab,
		keyTabUrl,
		tabsLength,
		handlePrevClick,
		handleNextClick,
		localMembers,
		palikaRedirect,
		requests: { DisasterProfileGetRequest, FiscalYearFetch },
		generalData,
		user,
		provinces,
		districts,
		municipalities,
		palikaLanguage,
		drrmOrg,
		drrmInventory,
		drrmCritical,
		drrmContacts,
		drrmRegion,
		drrmLanguage,
	} = props;
	const { fiscalYear } = generalData;
	const { language } = palikaLanguage;
	const { data } = drrmInventory;
	const { showForm } = palikaRedirect;
	const [reportTitle, setreportTitle] = useState("");
	const [datefrom, setdatefrom] = useState("");
	const [dateTo, setdateTo] = useState("");
	const [formationDate, setformationDate] = useState("");
	const [memberCount, setmemberCount] = useState("");
	const [reportData, setReportData] = useState([]);
	const [disasterProfile, setDisasterProfile] = useState([]);
	const [pending, setPending] = useState(false);
	const [fiscalYearList, setFiscalYearList] = useState([]);
	const [fiscalYearTitle, setFYTitle] = useState("");
	const [progress, setProgress] = useState(0);

	if (drrmRegion.municipality) {
		municipality = drrmRegion.municipality;
		district = drrmRegion.district;
		province = drrmRegion.province;
	} else {
		municipality = user.profile.municipality;
		district = user.profile.district;
		province = user.profile.province;
	}
	const m = municipalities.filter((mun) => mun.id === municipality);
	const d = districts.filter((dis) => dis.id === district);
	const p = provinces.filter((pro) => pro.id === province);

	if (drrmLanguage.language === "en" && m && m[0] && d && d[0] && p && p[0]) {
		municipalityName = m[0].title;
		provinceName = p[0].title;
		districtName = d[0].title;
	} else if (drrmLanguage.language === "np" && m && m[0] && d && d[0] && p && p[0]) {
		municipalityName = m[0].title_ne;
		provinceName = p[0].title_ne;
		districtName = d[0].title_ne;
	}
	const getGeneralData = () => ({
		reportTitle,
		datefrom,
		dateTo,
		mayor,
		cao,
		focalPerson,
		formationDate,
		memberCount,
	});

	const handleDisasterProfile = (response) => {
		setDisasterProfile(response);
	};
	const handleFiscalYearList = (response) => {
		setFiscalYearList(response);
	};
	DisasterProfileGetRequest.setDefaultParams({
		province,
		district,
		municipality,
		fiscalYear: generalData.item ? generalData.item.fiscalYear : generalData.fiscalYear,
		disasterProfile: handleDisasterProfile,
	});
	FiscalYearFetch.setDefaultParams({
		fiscalYearList: handleFiscalYearList,
	});

	useEffect(() => {
		if (fiscalYearList.length > 0 && fiscalYear) {
			const FY = fiscalYearList.filter((item) => item.id === Number(fiscalYear));

			setFYTitle(FY);
		}
	}, [fiscalYear, fiscalYearList]);

	const handlePreviewBtn = async (reportType: string) => {
		setPending(true);
		let pageNumber = 1;
		const doc = new JsPDF("p", "mm", "a4");
		const docSummary = new JsPDF("p", "mm", "a4");
		let matchedFiscalYear = [];
		matchedFiscalYear = disasterProfile.filter(
			(item) => item.fiscalYear === Number(generalData.fiscalYear)
		);

		const ids = document.querySelectorAll(".page");
		const { length } = ids;
		for (let i = 0; i < length; i += 1) {
			const reportPage = document.getElementById(ids[i].id);
			setPending(true);
			setProgress(((i + 1) * 100) / (length + 1));
			await html2canvas(reportPage).then((canvas) => {
				const imgData = canvas.toDataURL("image/png");
				let imgWidth = 210;
				let pageHeight = 295;
				const imgHeight = (canvas.height * imgWidth) / canvas.width;
				if (i < length - 1 && i > 2) {
					imgWidth = 295;
					pageHeight = 210;
				}
				let heightLeft = imgHeight;
				let position = 0;
				doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, "", "FAST");
				if (i < 2) {
					docSummary.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, "", "FAST");
					if (i < 1) {
						docSummary.addPage("a4", "portrait");
					}
				}
				if (i >= 2) {
					heightLeft -= pageHeight;
					while (heightLeft >= 0) {
						position = heightLeft - imgHeight; // top padding for other pages
						pageNumber += 1;
						doc.addPage("a4", "landscape");
						doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, "", "FAST");
						// doc.text(200, 285, `page ${pageNumber}`);
						heightLeft -= pageHeight;
					}
				}

				if (i < length - 1 && i < 1) {
					// doc.text(270, 10, `page ${pageNumber}`);
					doc.addPage("a4", "portrait");
					pageNumber += 1;
				}
				if (i < length - 1 && i >= 1) {
					// doc.text(270, 10, `page ${pageNumber}`);
					doc.addPage("a4", "landscape");
					pageNumber += 1;
				}
			});
		}

		const blob = new Blob([doc.output("blob")], { type: "application/pdf" });
		const blobSummary = new Blob([docSummary.output("blob")], { type: "application/pdf" });

		let profileUser = {};
		if (user) {
			profileUser = user.profile;
		}
		const formdata = new FormData();
		if (language === "en") {
			formdata.append(
				"fullFileEn",
				blob,
				`${municipalityName.title_en}_DRRM Report FY_${generalData.fiscalYearTitle}.pdf`
			);
			formdata.append(
				"summaryFileEn",
				blobSummary,
				`${municipalityName.title_en}_Summary_DRRM Report FY_${generalData.fiscalYearTitle}.pdf`
			);
		}
		if (language === "np") {
			formdata.append(
				"fullFileNp",
				blob,
				`${municipalityName.title_en}_DRRM Report FY_${generalData.fiscalYearTitle}.pdf`
			);
			formdata.append(
				"summaryFileEn",
				blobSummary,
				`${municipalityName.title_en}_Summary_DRRM Report FY_${generalData.fiscalYearTitle}.pdf`
			);
		}

		formdata.append("title", `${municipalityName} DRRM Report FY ${generalData.fiscalYearTitle}`);
		formdata.append("fiscalYear", generalData.fiscalYear);
		formdata.append("drrmCommitteeFormationDate", generalData.formationDate);
		formdata.append("drrmCommitteeMembersCount", generalData.committeeMembers);
		formdata.append("province", province || "");
		formdata.append("district", district || "");
		formdata.append("municipality", municipality || "");

		if (generalData.mayor) {
			formdata.append("mayorChairperson", generalData.mayor.id);
		}
		if (generalData.cao) {
			formdata.append("chiefAdministrativeOfficer", generalData.cao.id);
		}
		if (generalData.focalPerson) {
			formdata.append("drrFocalPerson", generalData.focalPerson.id);
		}

		if (matchedFiscalYear.length) {
			axios
				.put(
					`${import.meta.env.VITE_APP_API_SERVER_URL}/disaster-profile/${matchedFiscalYear[0].id}/`,
					formdata,
					{
						headers: {
							"content-type": "multipart/form-data",
						},
					}
				)
				.then((response) => {
					setPending(false);
					setProgress(100);
					if (language === "np") {
						if (reportType === "full") {
							doc.save(
								`${municipalityName}DRRM प्रतिवेदन आर्थिक वर्ष_${generalData.fiscalYearTitle}.pdf`
							);
						}
						if (reportType === "summary") {
							docSummary.save(
								`${municipalityName}सारांश DRRM प्रतिवेदन आर्थिक वर्ष_${generalData.fiscalYearTitle}.pdf`
							);
						}
					}
					if (language === "en") {
						if (reportType === "full") {
							doc.save(`${municipalityName}DRRM Report FY_${generalData.fiscalYearTitle}.pdf`);
						}
						if (reportType === "summary") {
							docSummary.save(
								`${municipalityName}Summary DRRM Report FY_${generalData.fiscalYearTitle}.pdf`
							);
						}
					}
					alert("Your DRRM report has been uploaded sucessfully");
				})
				.catch((error) => {
					setPending(false);
					setProgress(100);
					if (language === "np") {
						if (reportType === "full") {
							doc.save(
								`${municipalityName}DRRM प्रतिवेदन आर्थिक वर्ष_${generalData.fiscalYearTitle}.pdf`
							);
						}
						if (reportType === "summary") {
							docSummary.save(
								`${municipalityName}सारांश DRRM प्रतिवेदन आर्थिक वर्ष_${generalData.fiscalYearTitle}.pdf`
							);
						}
					}
					if (language === "en") {
						if (reportType === "full") {
							doc.save(`${municipalityName}DRRM Report FY_${generalData.fiscalYearTitle}.pdf`);
						}
						if (reportType === "summary") {
							docSummary.save(
								`${municipalityName}Summary DRRM Report FY_${generalData.fiscalYearTitle}.pdf`
							);
						}
					}

					// docSummary.save(`${municipalityName.title_en}_Summary_DRRM Report FY_${'fiscalyear'}.pdf`);
					// doc.save(`${municipalityName.title_en}_DRRM Report FY_${'fiscalyear'}.pdf`);
					alert("Error occured. Please try again.");
				});
		} else {
			axios
				.post(`${import.meta.env.VITE_APP_API_SERVER_URL}/disaster-profile/`, formdata, {
					headers: {
						"content-type": "multipart/form-data",
					},
				})
				.then((response) => {
					setPending(false);
					setProgress(100);
					if (language === "np") {
						if (reportType === "full") {
							doc.save(
								`${municipalityName}DRRM प्रतिवेदन आर्थिक वर्ष_${generalData.fiscalYearTitle}.pdf`
							);
						}
						if (reportType === "summary") {
							docSummary.save(
								`${municipalityName}सारांश DRRM प्रतिवेदन आर्थिक वर्ष_${generalData.fiscalYearTitle}.pdf`
							);
						}
					}
					if (language === "en") {
						if (reportType === "full") {
							doc.save(`${municipalityName}DRRM Report FY_${generalData.fiscalYearTitle}.pdf`);
						}
						if (reportType === "summary") {
							docSummary.save(
								`${municipalityName}Summary DRRM Report FY_${generalData.fiscalYearTitle}.pdf`
							);
						}
					}
					alert("Your DRRM report has been uploaded sucessfully");
				})
				.catch((error) => {
					setPending(false);
					setProgress(100);

					alert("Error occured. Please try again.");
					if (language === "np") {
						if (reportType === "full") {
							doc.save(
								`${municipalityName}DRRM प्रतिवेदन आर्थिक वर्ष_${generalData.fiscalYearTitle}.pdf`
							);
						}
						if (reportType === "summary") {
							docSummary.save(
								`${municipalityName}सारांश DRRM प्रतिवेदन आर्थिक वर्ष_${generalData.fiscalYearTitle}.pdf`
							);
						}
					}
					if (language === "en") {
						if (reportType === "full") {
							doc.save(`${municipalityName}DRRM Report FY_${generalData.fiscalYearTitle}.pdf`);
						}
						if (reportType === "summary") {
							docSummary.save(
								`${municipalityName}Summary DRRM Report FY_${generalData.fiscalYearTitle}.pdf`
							);
						}
					}
					// docSummary.save(`${municipalityName.title_en}_Summary_DRRM Report FY_${'fiscalyear'}.pdf`);
					// doc.save(`${municipalityName.title_en}_DRRM Report FY_${'fiscalyear'}.pdf`);
				});
		}
	};

	return (
		<div className={drrmLanguage.language === "np" && styles.nep}>
			{keyTab === 0 ? (
				<General
					mayor={mayor}
					cao={cao}
					focalPerson={focalPerson}
					updateTab={updateTab}
					page={-1}
					handlePrevClick={handlePrevClick}
					handleNextClick={handleNextClick}
					localMembers={localMembers}
					handleShowErr={props.handleShowErr}
				/>
			) : (
				""
			)}
			{keyTab === 1 ? (
				<Budget
					reportData={reportData}
					tableHeader={tableHeader}
					updateTab={updateTab}
					page={-1}
					handlePrevClick={handlePrevClick}
					handleNextClick={handleNextClick}
				/>
			) : (
				""
			)}
			{keyTab === 2 ? (
				<BudgetActivity
					updateTab={updateTab}
					page={-1}
					handlePrevClick={handlePrevClick}
					handleNextClick={handleNextClick}
				/>
			) : (
				""
			)}
			{keyTab === 3 ? (
				<ProgrammeAndPolicies
					updateTab={updateTab}
					page={-1}
					handlePrevClick={handlePrevClick}
					handleNextClick={handleNextClick}
				/>
			) : (
				""
			)}
			{keyTab === 4 ? (
				<Organisation
					url={keyTabUrl}
					updateTab={updateTab}
					handlePrevClick={handlePrevClick}
					handleNextClick={handleNextClick}
				/>
			) : (
				""
			)}
			{keyTab === 5 ? (
				<Inventory
					handlePrevClick={handlePrevClick}
					handleNextClick={handleNextClick}
					// page={-1}
					updateTab={updateTab}
					width={"100%"}
					height={"40%"}
				/>
			) : (
				""
			)}
			{keyTab === 6 ? (
				<CriticalInfra
					handlePrevClick={handlePrevClick}
					handleNextClick={handleNextClick}
					page={-1}
					updateTab={updateTab}
					width={"100%"}
					height={"50%"}
				/>
			) : (
				""
			)}
			{keyTab === 7 ? (
				<>
					<Contacts
						handlePrevClick={handlePrevClick}
						handleNextClick={handleNextClick}
						page={-1}
						updateTab={updateTab}
					/>
					{/* <DRRMembers updateTab={updateTab} /> */}
				</>
			) : (
				""
			)}
			{keyTab === 8 ? (
				<Relief
					updateTab={updateTab}
					handlePrevClick={handlePrevClick}
					handleNextClick={handleNextClick}
					page={-1}
				/>
			) : (
				""
			)}
			{keyTab === 9 ? (
				<>
					<Simulation
						handlePrevClick={handlePrevClick}
						handleNextClick={handleNextClick}
						page={-1}
						updateTab={updateTab}
					/>
				</>
			) : (
				""
			)}
			{keyTab === tabsLength - 1 ? (
				<div className={styles.tabsPageContainer}>
					{pending && (
						<div className={styles.loaderDiv}>
							<div className={styles.loaderContainer}>
								<CircularProgressbar value={progress} />
							</div>
						</div>
					)}
					<div className={styles.buttonContainer}>
						<button
							type="button"
							onClick={() => handlePreviewBtn("full")}
							className={!pending ? styles.agreeBtn : styles.disabled}
							disabled={pending}>
							<Gt section={Translations.SubmitFull} />
						</button>
						<button
							type="button"
							onClick={() => handlePreviewBtn("summary")}
							className={!pending ? styles.agreeBtn : styles.disabled}
							disabled={pending}>
							<Gt section={Translations.SubmitPart} />
						</button>
					</div>

					<div id={"page1"} className={_cs(styles.page, "page")}>
						<PreviewPageOne generalData={getGeneralData()} url={keyTabUrl} />
					</div>

					<div id={"page2"} className={_cs(styles.page, "page")}>
						<PreviewPageTwo reportData={[<Budget />, <BudgetActivity />]} />
					</div>

					<div id={"page3"} className={_cs(styles.annexPage, "page")}>
						<h1>
							{" "}
							<Gt section={Translations.AnnexA} />
						</h1>
						<h2>
							<Gt section={Translations.LDMC} />
						</h2>
						<General
							annex
							mayor={mayor}
							cao={cao}
							focalPerson={focalPerson}
							updateTab={() => {}}
							handlePrevClick={() => {}}
							handleNextClick={() => {}}
							localMembers={localMembers}
						/>
					</div>

					<div id={"page5"} className={_cs(styles.annexPage, "page")}>
						<h1>
							<Gt section={Translations.AnnexB} />
						</h1>

						<Budget annex handlePrevClick={() => {}} handleNextClick={() => {}} />
					</div>

					<div id={"page6"} className={_cs(styles.annexPage, "page")}>
						<h1>
							<Gt section={Translations.AnnexC} />
						</h1>

						<BudgetActivity annex handlePrevClick={() => {}} handleNextClick={() => {}} />
					</div>

					<div id={"page7"} className={_cs(styles.annexPage, "page")}>
						<h1>
							<Gt section={Translations.AnnexD} />
						</h1>
						<ProgrammeAndPolicies annex handlePrevClick={() => {}} handleNextClick={() => {}} />
					</div>

					<div id={"page8"} className={_cs(styles.annexPage, "page")}>
						<h1>
							<Gt section={Translations.AnnexE} />
						</h1>
						<h2>
							<Gt section={Translations.OrganizationHeading} />
						</h2>

						<table id="table-to-xls">
							<tbody>
								<tr>
									<th>
										<Gt section={Translations.OrganizationSerialNumber} />
									</th>
									<th>
										<Gt section={Translations.OrganizationName} />
									</th>
									<th>
										<Gt section={Translations.OrganizationType} />
									</th>
									<th>
										<Gt section={Translations.OrganizationMaleEmployee} />
									</th>
									<th>
										<Gt section={Translations.OrganizationFemaleEmployee} />
									</th>
								</tr>
								{!drrmOrg.data ? (
									drrmOrg
										.filter((orgs) => orgs.selectedRow === true)
										.map((item, i) => (
											<tr key={item.id}>
												<td>{i + 1}</td>
												<td>{item.title || "-"}</td>
												<td>{item.type || "-"}</td>
												<td>{item.noOfMaleEmployee ? item.noOfMaleEmployee : 0}</td>
												<td>{item.noOfFemaleEmployee ? item.noOfFemaleEmployee : 0}</td>
											</tr>
										))
								) : (
									<tr key={Math.random()}>
										<td>-</td>
										<td>-</td>
										<td>-</td>
										<td>-</td>
										<td>-</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					<div id={"page9"} className={_cs(styles.annexPage, "page")}>
						<h1>
							{" "}
							<Gt section={Translations.AnnexF} />
						</h1>
						<h2>
							<Gt section={Translations.InventoryHeading} />
						</h2>
						<table>
							<tbody>
								<tr>
									<th>
										<Gt section={Translations.OrganizationSerialNumber} />
									</th>
									<th>
										<Gt section={Translations.InventoryResourceName} />
									</th>
									<th>
										<Gt section={Translations.InventoryResourceQuantity} />
									</th>
									<th>
										<Gt section={Translations.InventoryResourceUnit} />
									</th>
									<th>
										<Gt section={Translations.InventoryResourceCategory} />
									</th>

									<th>
										<Gt section={Translations.InventoryResourceOwnerOrganization} />
									</th>
									<th>
										<Gt section={Translations.InventoryResourceOwnerOrganizationType} />
									</th>
									<th>
										<Gt section={Translations.InventoryResourceAddedDate} />
									</th>
									<th>
										<Gt section={Translations.InventoryResourceUpdatedDate} />
									</th>
								</tr>

								{!drrmInventory.data &&
									drrmInventory
										.filter((inven) => inven.selectedRow === true)
										.map((item, i) => (
											<tr>
												<td>{item.SN}</td>

												<td>
													{drrmLanguage.language === "np" ? item.item.titleNp : item.item.title}
												</td>
												<td>{item.quantity || "-"}</td>
												<td>
													{drrmLanguage.language === "np" ? item.item.unitNp : item.item.unit}
												</td>
												<td>{item.item.category || "-"}</td>
												<td>{item.resourceName || "-"}</td>
												<td>{item.organizationType || "-"}</td>
												<td>{ADToBS(item.createdOn) || "-"}</td>
												<td>{ADToBS(item.modifiedOn) || "-"}</td>
											</tr>
										))}
							</tbody>
						</table>
					</div>

					<div id={"page10"} className={_cs(styles.annexPage, "page")}>
						<h1>
							{" "}
							<Gt section={Translations.AnnexG} />
						</h1>
						<h2>
							<Gt section={Translations.ResourcesHeading} />
						</h2>
						<table id="table-to-xls">
							<tbody>
								<tr>
									<th>
										<Gt section={Translations.OrganizationSerialNumber} />
									</th>
									<th>
										<Gt section={Translations.ResourcesName} />
									</th>
									<th>
										<Gt section={Translations.ResourcesType} />
									</th>
									<th>
										<Gt section={Translations.ResourcesOperatorType} />
									</th>
									<th>
										<Gt section={Translations.ResourcesNumberOfMaleEmployee} />
									</th>
									<th>
										<Gt section={Translations.ResourcesNumberOfFemaleEmployee} />
									</th>
									<th>
										<Gt section={Translations.ResourcesNumberOfTotalEmployee} />
									</th>
								</tr>
								{!drrmCritical.data &&
									drrmCritical
										.filter((ci) => ci.selectedRow === true)
										.map((item, i) => (
											<tr key={item.id}>
												<td>{i + 1}</td>
												<td>{item.title ? item.title : "-"}</td>
												<td>{item.resourceType ? item.resourceType : "-"}</td>
												<td>{item.operatorType ? item.operatorType : "-"}</td>
												<td>{item.noOfMaleEmployee ? item.noOfMaleEmployee : "-"}</td>
												<td>{item.noOfFemaleEmployee ? item.noOfFemaleEmployee : "-"}</td>
												<td>{item.noOfEmployee ? item.noOfEmployee : "-"}</td>
											</tr>
										))}
							</tbody>
						</table>
					</div>

					<div id={"page11"} className={_cs(styles.annexPage, "page")}>
						<h1>
							<Gt section={Translations.AnnexH} />
						</h1>
						<Relief
							// AnnexDetails
							reportData={""}
							tableHeader={() => {}}
							updateTab={() => {}}
							page={-1}
							handlePrevClick={() => {}}
							handleNextClick={() => {}}
							annex
						/>
					</div>

					<div id={"page12"} className={_cs(styles.annexPage, "page")}>
						<h1>
							<Gt section={Translations.AnnexI} />
						</h1>
						<h2>
							<Gt section={Translations.ContactGovernmentContact} />
						</h2>
						<table id="table-to-xls">
							<tbody>
								<tr>
									<th>
										<Gt section={Translations.ContactsSerialNumber} />
									</th>
									<th>
										<Gt section={Translations.ContactsName} />
									</th>
									<th>
										<Gt section={Translations.ContactTypeOfOrganization} />
									</th>
									<th>
										<Gt section={Translations.ContactPosition} />
									</th>
									<th>
										<Gt section={Translations.ContactNameOfOrganization} />
									</th>
									<th>
										<Gt section={Translations.ContactTrainingTitle} />
									</th>
									<th>
										<Gt section={Translations.ContactTrainingDuration} />
									</th>
									<th>
										<Gt section={Translations.ContactContactNumber} />
									</th>
									<th>
										<Gt section={Translations.ContactContactEmail} />
									</th>
									<th>
										<Gt section={Translations.ContactAction} />
									</th>
								</tr>
								{drrmContacts.gContacts.length > 0
									? drrmContacts.gContacts
											.filter((contact) => contact.selectedRow === true)
											.map((item, i) => (
												<tr key={item.id}>
													<td>{i + 1}</td>
													<td>{item.name || "No data"}</td>
													<td>{item.orgType || "No data"}</td>
													<td>{item.position || "No data"}</td>
													<td>{item.orgName || "No data"}</td>
													<td>
														{item.trainingTitle
															? item.trainingTitle.map((training) => training)
															: "No data"}
													</td>
													<td>
														{item.trainingDuration
															? item.trainingDuration.map((training) => training)
															: "No data"}
													</td>
													<td>{item.mobileNumber || "No Data"}</td>
													<td>{item.email || "No Data"}</td>
												</tr>
											))
									: "No Data"}
							</tbody>
						</table>
						<h2>
							<Gt section={Translations.ContactNonGovernmentalContact} />
						</h2>
						<table id="table-to-xls">
							<tbody>
								<tr>
									<th>
										<Gt section={Translations.ContactsSerialNumber} />
									</th>
									<th>
										<Gt section={Translations.ContactsName} />
									</th>
									<th>
										<Gt section={Translations.ContactTypeOfOrganization} />
									</th>
									<th>
										<Gt section={Translations.ContactNameOfOrganization} />
									</th>
									<th>
										<Gt section={Translations.ContactPosition} />
									</th>
									<th>
										<Gt section={Translations.ContactTrainingTitle} />
									</th>
									<th>
										<Gt section={Translations.ContactFocusHazard} />
									</th>
									<th>
										<Gt section={Translations.ContactTrainingActivities} />
									</th>
									<th>
										<Gt section={Translations.ContactTrainingDateFrom} />
									</th>
									<th>
										<Gt section={Translations.ContactTrainingDateTo} />
									</th>
									<th>
										<Gt section={Translations.ContactContactNumber} />
									</th>
									<th>
										<Gt section={Translations.ContactContactEmail} />
									</th>
								</tr>

								{drrmContacts.ngContacts.length > 0 ? (
									drrmContacts.ngContacts.map((cts, i) => (
										<tr key={cts.item && cts.item.id}>
											<td>{i + 1}</td>
											<td>{cts.item && cts.item.name}</td>
											<td>{cts.item && cts.item.typeOfOrganization}</td>
											<td>{cts.item && cts.item.nameOfOrganization}</td>
											<td>{cts.item && cts.item.position}</td>
											<td>{cts.item && cts.item.trainedTitle}</td>
											<td>{cts.item && cts.hazardName}</td>
											<td>{cts.item && cts.item.trainingActivities}</td>
											<td>{cts.item && cts.item.trainingDateFrom}</td>
											<td>{cts.item && cts.item.trainingDateTo}</td>
											<td>{cts.item && cts.item.contactNumber}</td>
											<td>{cts.item && cts.item.email}</td>
										</tr>
									))
								) : (
									<tr>
										<td>{"-"}</td>
										<td>{"-"}</td>
										<td>{"-"}</td>
										<td>{"-"}</td>
										<td>{"-"}</td>
										<td>{"-"}</td>
										<td>{"-"}</td>
										<td>{"-"}</td>
										<td>{"-"}</td>
										<td>{"-"}</td>
										<td>{"-"}</td>
										<td>{"-"}</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					<div id={"page13"} className={_cs(styles.annexPage, "page")}>
						<h1>
							<Gt section={Translations.AnnexJ} />
						</h1>
						<Simulation handlePrevClick={() => {}} handleNextClick={() => {}} annex />
					</div>
				</div>
			) : (
				""
			)}
		</div>
	);
};

export default connect(mapStateToProps)(
	createConnectedRequestCoordinator<PropsWithRedux>()(createRequestClient(requests)(ReportModal))
);
