/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-one-expression-per-line */

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/camelcase */

import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { navigate, useLocation } from "@reach/router";
import Navbar from "src/admin/components/Navbar";
import Footer from "src/admin/components/Footer";
import ReactToPrint from "react-to-print";
import Page from "#components/Page";
import { districtsSelector, municipalitiesSelector, wardsSelector, userSelector } from "#selectors";
import { SetEpidemicsPageAction } from "#actionCreators";
import {
	ClientAttributes,
	createConnectedRequestCoordinator,
	createRequestClient,
	methods,
} from "#request";
// import styles from './styles.module.scss';
import { englishToNepaliNumber } from "nepali-number";
import ListSvg from "../../resources/list.svg";
import Ideaicon from "../../resources/ideaicon.svg";
import styles from "./styles.module.scss";

const mapStateToProps = (state, props) => ({
	districts: districtsSelector(state),
	municipalities: municipalitiesSelector(state),
	wards: wardsSelector(state),
	user: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setEpidemicsPage: (params) => dispatch(SetEpidemicsPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	getEarthquakeRequest: {
		url: ({ params }) => `/temporary-shelter-enrollment-form/${params.id}/`,
		method: methods.GET,
		onMount: false,
		onSuccess: ({ response, props, params }) => {
			params.fetchedData(response);
		},
		onFailure: ({ error, params }) => {
			params.ErrorFetchData();
		},
		onFatal: ({ error, params }) => {
			console.warn("failure", error);
		},
	},
};

const TrancheCondition = (props) => {
	const [validationError, setvalidationError] = useState(null);
	const [benificeryList, setBenificeryList] = useState([]);
	const [tranche1StatusList, setTranche1StatusList] = useState([]);
	const [tranche2StatusList, setTranche2StatusList] = useState([]);
	const [paymentReceiveList, setPaymentReceiveList] = useState([]);
	const [fundingSourceList, setFundingSourceList] = useState([]);

	const [loadPrint, setLoadPrint] = useState(false);
	const [fetchIncident, setFetchIncident] = useState([]);
	// const [formError, setFormError] = useState(ErrorObj);

	const [fetchedData, setFetchedData] = useState(null);
	const [errorFetchData, setErrorFetchData] = useState(false);
	const { pathname } = useLocation();
	const componentRef = useRef();
	const { districts, municipalities, wards } = props;
	const [loading, setLoading] = useState(false);
	const [overallStatusList, setOverallStatusList] = useState({
		tempShelterEntrollmentForm: "",
		overallBeneficiaryStatus: "",
		trancheOneStatus: "",
		trancheTwoStatus: "",
		paymentReceivedStatus: "",
		fundingSource: "",
	});

	const handleTableButton = () => {
		navigate(
			"/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table"
		);
	};

	const handleFetchedData = (finalData) => {
		setFetchedData(finalData);
	};

	useEffect(() => {
		const splittedRoute = pathname.split("/");
		const id = splittedRoute[splittedRoute.length - 1];
		if (id) {
			props.requests.getEarthquakeRequest.do({
				id,
				fetchedData: handleFetchedData,
				ErrorFetchData: () => setErrorFetchData(true),
			});
		}
	}, [pathname]);

	const districtNameConverter = (id) => {
		const finalData = fetchedData && districts.find((i) => i.id === id).title_ne;

		return finalData;
	};

	const municipalityNameConverter = (id) => {
		// const finalData = fetchedData && municipalities.find(i => i.id === id).title_ne;
		const finalData = fetchedData && municipalities.find((i) => i.id === id);
		if (finalData.type === "Rural Municipality") {
			const municipality = `${finalData.title_ne} गाउँपालिका`;
			return municipality;
		}
		if (finalData.type === "Submetropolitan City") {
			const municipality = `${finalData.title_ne} उप-महानगरपालिका`;
			return municipality;
		}
		if (finalData.type === "Metropolitan City") {
			const municipality = `${finalData.title_ne} महानगरपालिका`;
			return municipality;
		}
		return `${finalData.title_ne} नगरपालिका`;
	};

	const wardNameConverter = (id) => {
		const finalData = fetchedData && wards.find((i) => i.id === id).title;
		return finalData;
	};
	const handlePrint = () => {
		setLoadPrint(true);
	};

	useEffect(() => {
		if (loadPrint) {
			const timer = setTimeout(() => {
				setLoadPrint(false);
			}, 10000);
			return () => clearTimeout(timer);
		}
	}, [loadPrint]);

	const dateFormatter = (date) => {
		const slicedDate = date.split("-");
		const year = englishToNepaliNumber(slicedDate[0]);
		const month = englishToNepaliNumber(slicedDate[1]);
		const day = englishToNepaliNumber(slicedDate[2]);
		const finalDate = `${year}/${month}/${day}`;
		return finalDate;
	};
	const splittedRouteId = pathname.split("/");
	const routeId = splittedRouteId[splittedRouteId.length - 1];

	useEffect(() => {
		if (errorFetchData) {
			navigate(
				"/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data"
			);
		}
	}, [errorFetchData]);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_APP_API_SERVER_URL}/overall-beneficiary-status/`, {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((final_resp) => setBenificeryList(final_resp.results));

		fetch(`${import.meta.env.VITE_APP_API_SERVER_URL}/tranche-two-status/`, { credentials: "include" })
			.then((res) => res.json())
			.then((final_resp) => setTranche2StatusList(final_resp.results));

		fetch(`${import.meta.env.VITE_APP_API_SERVER_URL}/tranche-one-status/`, { credentials: "include" })
			.then((res) => res.json())
			.then((final_resp) => setTranche1StatusList(final_resp.results));

		fetch(`${import.meta.env.VITE_APP_API_SERVER_URL}/funding-source/`, { credentials: "include" })
			.then((res) => res.json())
			.then((final_resp) => setFundingSourceList(final_resp.results));

		fetch(`${import.meta.env.VITE_APP_API_SERVER_URL}/payment-received-status/`, {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((final_resp) => setPaymentReceiveList(final_resp.results));
	}, []);

	const handleFormData = (e: { target: { name: string; value: number } }) => {
		setOverallStatusList({
			...overallStatusList,
			[e.target.name]: e.target.value,
		});
	};

	useEffect(() => {
		const splittedRoute = pathname.split("/");
		const id = splittedRoute[splittedRoute.length - 1];
		if (fetchedData && fetchedData.allStatus) {
			setOverallStatusList({
				tempShelterEntrollmentForm: fetchedData.allStatus.tempShelterEntrollmentForm,
				overallBeneficiaryStatus: fetchedData.allStatus.overallBeneficiaryStatus,
				trancheOneStatus: fetchedData.allStatus.trancheOneStatus,
				trancheTwoStatus: fetchedData.allStatus.trancheTwoStatus,
				paymentReceivedStatus: fetchedData.allStatus.paymentReceivedStatus,
				fundingSource: fetchedData.allStatus.fundingSource,
			});
		} else {
			setOverallStatusList({
				...overallStatusList,
				tempShelterEntrollmentForm: id,
			});
		}
	}, [fetchedData]);

	const handleSubmit = () => {
		setLoading(true);
		if (fetchedData.allStatus) {
			fetch(
				`${import.meta.env.VITE_APP_API_SERVER_URL}/${fetchedData.allStatus.id}/temporary-shelter-overall-status/`,
				{
					credentials: "include",
					mode: "cors",
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(overallStatusList),
				}
			)
				.then((res) => res.json())
				.then((final_resp) => {
					setLoading(false);
					navigate(
						`/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${routeId}`
					);
				})
				.catch((err) => {
					setLoading(false);
				});
		} else {
			fetch(`${import.meta.env.VITE_APP_API_SERVER_URL}/temporary-shelter-overall-status/`, {
				credentials: "include",
				mode: "cors",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(overallStatusList),
			})
				.then((res) => res.json())
				.then((final_resp) => {
					setLoading(false);
					navigate(
						`/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${routeId}`
					);
				})
				.catch((err) => {
					setLoading(false);
				});
		}
	};

	return (
		<>
			<Page hideFilter hideMap />
			<Navbar />
			<div className="container123">
				<h1 className="header123">अस्थायी आवास सम्झौता फारम</h1>
				<p className="dataReporting123">डाटा रिपोर्टिङ</p>
				<div className="twoSections123">
					<div
						className="reportingStatus123"
						style={{
							display: "flex",
							flexDirection: "column",
							padding: "10px 20px",
						}}>
						<div
							className="reporting123"
							style={{ cursor: "pointer" }}
							role="button"
							onClick={() => {
								navigate(
									`/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/${routeId}`
								);
							}}>
							<img className="listSvg123" src={ListSvg} alt="" />
							<p className="reportingText123">पहिलो किस्ता फारम</p>
							<p className="grayCircle123" />
						</div>
						<div
							className="reporting123"
							style={{ cursor: "pointer" }}
							role="button"
							onClick={() => {
								navigate(`/admin/temporary-shelter-enrollment-form/add-view-tranche1/${routeId}`);
							}}>
							<img className="listSvg123" src={ListSvg} alt="" />
							<p className="reportingText123">पहिलो किस्ता फारम अपलोड</p>
							<p className="grayCircle123" />
						</div>
						<div
							className="reporting123"
							style={{ cursor: "pointer" }}
							role="button"
							aria-disabled
							onClick={() => {
								if (fetchedData.firstTrancheEnrollmentUpload) {
									navigate(`/admin/temporary-shelter-enrollment-form/add-view-tranche2/${routeId}`);
								}
							}}>
							<img className="listSvg123" src={ListSvg} alt="" />
							<p className="reportingText123">दोस्रो किस्ता फारम</p>
							<p className="grayCircle123" />
						</div>
						<div
							className="reporting123"
							style={{ cursor: "pointer" }}
							role="button"
							onClick={() => {
								if (fetchedData.secondTrancheEnrollmentForm) {
									navigate(
										`/admin/temporary-shelter-enrollment-form/add-tranche2-file-upload/${routeId}`
									);
								}
							}}>
							<img className="listSvg123" src={ListSvg} alt="" />
							<p className="reportingText123">दोस्रो किस्ता फारम अपलोड</p>
							<p className="grayCircle123" />
						</div>
						<div
							className="reporting123"
							style={{ cursor: "pointer" }}
							role="button"
							onClick={() => {
								navigate(
									`/admin/temporary-shelter-enrollment-form/add-tranche-condition/${routeId}`
								);
							}}>
							<img className="listSvg123" src={ListSvg} alt="" />
							<p className="reportingText123">अवस्था</p>
							<p className="greenCircle123" />
						</div>
					</div>
					<div className="mainForm123">
						<div className="generalInfoAndTableButton123">
							<h1 className="generalInfo">अस्थायी आश्रय समग्र स्थिति</h1>
							<button className="DataTableClick123" type="button" onClick={handleTableButton}>
								डाटा तालिका हेर्नुहोस्
							</button>
						</div>

						{!fetchedData ? (
							<p>Loading...</p>
						) : (
							<div
								style={{
									width: "8.3in",
									boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
									padding: "15px 0px",
								}}>
								<div
									style={{
										display: "flex",
										padding: "20px",
										width: "52%",
										justifyContent: "space-between",
									}}>
									<h2>समग्र लाभार्थी अवस्था:</h2>
									<select
										id="overallBeneficiaryStatus"
										name="overallBeneficiaryStatus"
										value={overallStatusList.overallBeneficiaryStatus}
										onChange={handleFormData}
										//         style={
										//     errorFields.event
										//       ? {
										//           border: '1px solid red',
										//           height: '34px',
										//           width: 'auto',
										//         }
										//       : { height: '34px', width: 'auto' }
										//   }
									>
										<option />
										{benificeryList.map((i) => (
											<option value={i.id} key={i.id}>
												{i.title}
											</option>
										))}
									</select>
								</div>
								<div
									style={{
										display: "flex",
										width: "52%",
										justifyContent: "space-between",
										padding: "20px",
									}}>
									<h2>पहिलो किस्ताको अवस्था:</h2>
									<select
										id="trancheOneStatus"
										name="trancheOneStatus"
										value={overallStatusList.trancheOneStatus}
										onChange={handleFormData}
										//         style={
										//     errorFields.event
										//       ? {
										//           border: '1px solid red',
										//           height: '34px',
										//           width: 'auto',
										//         }
										//       : { height: '34px', width: 'auto' }
										//   }
									>
										<option />
										{tranche1StatusList.map((i) => (
											<option value={i.id} key={i.id}>
												{i.title}
											</option>
										))}
									</select>
								</div>
								<div
									style={{
										display: "flex",
										width: "52%",
										justifyContent: "space-between",
										padding: "20px",
									}}>
									<h2>दोस्रो किस्ताको अवस्था:</h2>
									<select
										id="trancheTwoStatus"
										name="trancheTwoStatus"
										value={overallStatusList.trancheTwoStatus}
										onChange={handleFormData}
										//         style={
										//     errorFields.event
										//       ? {
										//           border: '1px solid red',
										//           height: '34px',
										//           width: 'auto',
										//         }
										//       : { height: '34px', width: 'auto' }
										//   }
									>
										<option />
										{tranche2StatusList.map((i) => (
											<option value={i.id} key={i.id}>
												{i.title}
											</option>
										))}
									</select>
								</div>
								<div
									style={{
										display: "flex",
										width: "52%",
										justifyContent: "space-between",
										padding: "20px",
									}}>
									<h2>भुक्तानी प्राप्त अवस्था:</h2>
									<select
										id="paymentReceivedStatus"
										name="paymentReceivedStatus"
										value={overallStatusList.paymentReceivedStatus}
										onChange={handleFormData}
										//         style={
										//     errorFields.event
										//       ? {
										//           border: '1px solid red',
										//           height: '34px',
										//           width: 'auto',
										//         }
										//       : { height: '34px', width: 'auto' }
										//   }
									>
										<option />
										{paymentReceiveList.map((i) => (
											<option value={i.id} key={i.id}>
												{i.title}
											</option>
										))}
									</select>
								</div>
								<div
									style={{
										display: "flex",
										width: "52%",
										justifyContent: "space-between",
										padding: "20px",
									}}>
									<h2>कोषको स्रोत:</h2>
									<select
										id="fundingSource"
										name="fundingSource"
										value={overallStatusList.fundingSource}
										onChange={handleFormData}>
										<option />
										{fundingSourceList.map((i) => (
											<option value={i.id} key={i.id}>
												{i.title}
											</option>
										))}
									</select>
								</div>
								<div className={styles.saveOrAddButtons}>
									<button
										className={styles.submitButtons}
										onClick={handleSubmit}
										type="submit"
										disabled={!!loading}>
										{loading ? "पेश गरिँदै छ..." : "पेश गर्नुहोस्"}
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createConnectedRequestCoordinator<ReduxProps>()(createRequestClient(requests)(TrancheCondition)));
