/* eslint-disable css-modules/no-undef-class */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Loader from "react-loader";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import {
	createConnectedRequestCoordinator,
	createRequestClient,
	ClientAttributes,
	methods,
} from "#request";
import styles from "./styles.module.scss";
import { refData, getBuildingOptions, getSelectTypes, getInputTypes } from "./formData";

interface Props {}

interface Params {}

// Styled Components to replace makeStyles classes

const StyledFormControl = styled(FormControl)(({ theme }) => ({
	width: "100%",
	margin: "15px 0",
	borderBottomColor: "#dddddd",
}));

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
	fontSize: "13px",
	color: "white",
	"&.Mui-focused": {
		color: "#dddddd",
	},
}));

const StyledInput = styled(Input)(({ theme }) => ({
	color: "#ffffff",
	width: "100%",
	fontSize: "13px",
	padding: "10px 0",
	borderBottomColor: "#dddddd",
	"& input::placeholder": {
		fontSize: "12px",
		color: "#dddddd",
	},
	"&:after": {
		borderBottomColor: "#dddddd",
	},
}));

const StyledSelect = styled(Select)(({ theme }) => ({
	color: "#ffffff",
	padding: "10px 0",
	width: "100%",
	fontSize: "13px",
	borderBottomColor: "#dddddd",
	"&.MuiSelect-select": {
		borderBottomColor: "red",
	},
	"&:before": {
		borderBottomColor: "#dddddd",
	},
	"&:after": {
		borderBottomColor: "#dddddd",
	},
}));

// requestOptions stays the same
const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
	buildingPostRequest: {
		url: "/vizrisk-building/",
		method: methods.POST,
		body: ({ params }) => {
			if (!params) {
				return {};
			}
			return {
				osmId: params.osmId,
				...params.data,
			};
		},
		onSuccess: ({ response, props, params }) => {
			params.handlePostSuccess(response);
		},
	},
	buildingPutRequest: {
		url: ({ params }) => `/vizrisk-building/${params.id}/`,
		method: methods.PATCH,
		body: ({ params }) => {
			if (!params) {
				return {};
			}
			return {
				...params.data,
			};
		},
		onSuccess: ({ response, props, params }) => {
			params.handlePostSuccess(response);
		},
	},
	buildingGetRequest: {
		url: ({ params }) => `/vizrisk-building/${params.newId}/`,
		method: methods.GET,
		onSuccess: ({ response, props, params }) => {
			params.handleGetSuccess(response);
		},
		query: ({ params }) => ({
			id: params.id,
		}),
	},
};

const HouseholdForm = (props) => {
	const {
		requests: { buildingPutRequest, buildingPostRequest, buildingGetRequest },
		buildingData,
		osmId,
		enumData,
		handleShowForm,
	} = props;

	const [buildingFormData, setFormData] = useState({ ...buildingData });
	const [pending, setPending] = useState(false);
	const { physicalFactors, socialFactors, economicFactor } = getBuildingOptions(enumData);
	const pfSelectTypes = getSelectTypes(physicalFactors);
	const pfInputTypes = getInputTypes(physicalFactors);
	const scSelectTypes = getSelectTypes(socialFactors);
	const scInputTypes = getInputTypes(socialFactors);
	const ecInputTypes = getInputTypes(economicFactor);
	const ecSelectTypes = getSelectTypes(economicFactor);

	useEffect(() => {
		if (buildingData && Object.keys(buildingData).length > 0) {
			if (buildingData.agricultureZeroToThreeMonth) {
				setFormData({
					...buildingFormData,
					agricultureNineToTwelveMonth: false,
					agricultureSevenToNineMonth: false,
					agricultureZeroToThreeMonth: true,
					agricultureFourToSixMonth: false,
				});
			} else if (buildingData.agricultureSevenToNineMonth) {
				setFormData({
					...buildingFormData,
					agricultureNineToTwelveMonth: false,
					agricultureSevenToNineMonth: true,
					agricultureZeroToThreeMonth: false,
					agricultureFourToSixMonth: false,
				});
			} else if (buildingData.agricultureNineToTwelveMonth) {
				setFormData({
					...buildingFormData,
					agricultureNineToTwelveMonth: true,
					agricultureSevenToNineMonth: false,
					agricultureZeroToThreeMonth: false,
					agricultureFourToSixMonth: false,
				});
			} else if (buildingData.agricultureFourToSixMonth) {
				setFormData({
					...buildingFormData,
					agricultureNineToTwelveMonth: false,
					agricultureSevenToNineMonth: false,
					agricultureZeroToThreeMonth: false,
					agricultureFourToSixMonth: true,
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleFoundation = (e, type) => {
		if (type === "Sufficiency of Agriculture product (Months)") {
			if (e.target.value === "9-12") {
				setFormData({
					...buildingFormData,
					agricultureNineToTwelveMonth: true,
					agricultureSevenToNineMonth: false,
					agricultureZeroToThreeMonth: false,
					agricultureFourToSixMonth: false,
				});
			} else if (e.target.value === "7-9") {
				setFormData({
					...buildingFormData,
					agricultureNineToTwelveMonth: false,
					agricultureSevenToNineMonth: true,
					agricultureZeroToThreeMonth: false,
					agricultureFourToSixMonth: false,
				});
			} else if (e.target.value === "4-6") {
				setFormData({
					...buildingFormData,
					agricultureNineToTwelveMonth: false,
					agricultureSevenToNineMonth: false,
					agricultureZeroToThreeMonth: false,
					agricultureFourToSixMonth: true,
				});
			} else if (e.target.value === "4-6") {
				setFormData({
					...buildingFormData,
					agricultureNineToTwelveMonth: false,
					agricultureSevenToNineMonth: false,
					agricultureZeroToThreeMonth: true,
					agricultureFourToSixMonth: false,
				});
			}
		} else {
			setFormData({
				...buildingFormData,
				[refData[type]]: e.target.value || null,
			});
		}
	};
	const handleInput = (e, type) => {
		let val = null;
		if (Number(e.target.value) >= 0) {
			val = Number(e.target.value);
		}

		setFormData({
			...buildingFormData,
			[refData[type]]: val,
		});
	};

	const handleGetSuccess = (resp) => {
		setPending(false);
		handleShowForm(false, resp);
	};
	const handlePostSuccess = (response) => {
		buildingGetRequest.do({
			newId: response.id,
			handleGetSuccess,
		});
	};

	const handleSave = () => {
		setFormData({ ...buildingFormData, osmId: parseInt(osmId, 10) });
		if (buildingData && Object.keys(buildingData).length > 0 && buildingData.id) {
			setPending(true);
			buildingPutRequest.do({
				data: buildingFormData,
				id: buildingData.id,
				handlePostSuccess,
			});
		} else {
			setPending(true);
			buildingPostRequest.do({
				data: buildingFormData,
				osmId: parseInt(osmId, 10),
				handlePostSuccess,
			});
		}
	};

	const handleCancel = () => {
		handleShowForm(false, buildingData);
	};

	return (
		<>
			{pending ? (
				<div className={styles.loaderInfo}>
					<Loader color="#fff" className={styles.loader} />
					<p className={styles.loaderText}>Saving Household Data...</p>
				</div>
			) : (
				<div className={styles.formContainer}>
					<div className={styles.section}>
						<p>PHYSICAL FACTORS</p>
						{pfSelectTypes.map((type: any) => (
							<div key={type} className={styles.inputContainer}>
								<StyledFormControl>
									<StyledInputLabel>{type}</StyledInputLabel>
									<StyledSelect
										MenuProps={{
											anchorOrigin: {
												vertical: "center",
												horizontal: "left",
											},
											transformOrigin: {
												vertical: "top",
												horizontal: "left",
											},
											getContentAnchorEl: null,
										}}
										placeholder={`Please Enter ${type}`}
										value={buildingFormData[refData[type]]}
										onChange={(e) => handleFoundation(e, type)}
										className={styles.select}>
										<MenuItem value="" disabled>
											{physicalFactors.filter((pf) => pf.title === type)[0].placeholder}
										</MenuItem>
										{physicalFactors
											.filter((pf) => pf.title === type)[0]
											.options.map((item: string) => (
												<MenuItem key={item} value={item}>
													{item}
												</MenuItem>
											))}
									</StyledSelect>
								</StyledFormControl>
							</div>
						))}
						{pfInputTypes.map((type: any) => (
							<div key={type} className={styles.inputContainer}>
								<StyledFormControl>
									<StyledInputLabel>{type}</StyledInputLabel>
									<StyledInput
										placeholder={`Please Enter ${type}`}
										type="number"
										value={Number(buildingFormData[refData[type]])}
										onChange={(e) => handleInput(e, type)}
										className={styles.select}
									/>
								</StyledFormControl>
							</div>
						))}
					</div>

					<div className={styles.section}>
						<p>SOCIAL FACTORS</p>
						{scSelectTypes.map((type: any) => (
							<div key={type} className={styles.inputContainer}>
								<StyledFormControl>
									<StyledInputLabel>{type}</StyledInputLabel>
									<StyledSelect
										label={type}
										placeholder={`Please Enter ${type}`}
										value={buildingFormData[refData[type]]}
										onChange={(e) => handleFoundation(e, type)}
										className={styles.select}
										MenuProps={{
											anchorOrigin: {
												vertical: "bottom",
												horizontal: "left",
											},
											transformOrigin: {
												vertical: "top",
												horizontal: "left",
											},
											getContentAnchorEl: null,
										}}>
										<MenuItem value="" disabled>
											{socialFactors.filter((pf) => pf.title === type)[0].placeholder}
										</MenuItem>
										{socialFactors
											.filter((pf) => pf.title === type)[0]
											.options.map((item: string) => (
												<MenuItem key={item} value={item}>
													{item}
												</MenuItem>
											))}
									</StyledSelect>
								</StyledFormControl>
							</div>
						))}
						{scInputTypes.map((type: any) => (
							<div key={type} className={styles.inputContainer}>
								<StyledFormControl>
									<StyledInputLabel>{type}</StyledInputLabel>
									<StyledInput
										placeholder={`Please Enter ${type}`}
										type="number"
										value={buildingFormData[refData[type]]}
										onChange={(e) => handleInput(e, type)}
										className={styles.select}
									/>
								</StyledFormControl>
							</div>
						))}
					</div>

					<div className={styles.section}>
						<p>ECONOMIC FACTORS</p>
						{ecSelectTypes.map((type: any) => (
							<div key={type} className={styles.inputContainer}>
								<StyledFormControl>
									<StyledInputLabel>{type}</StyledInputLabel>
									<StyledSelect
										label={type}
										placeholder={`Please Enter ${type}`}
										value={buildingFormData[refData[type]]}
										onChange={(e) => handleFoundation(e, type)}
										className={styles.select}
										MenuProps={{
											anchorOrigin: {
												vertical: "bottom",
												horizontal: "left",
											},
											transformOrigin: {
												vertical: "top",
												horizontal: "left",
											},
											getContentAnchorEl: null,
										}}>
										<MenuItem value="" disabled>
											{economicFactor.filter((pf) => pf.title === type)[0].placeholder}
										</MenuItem>
										{economicFactor
											.filter((pf) => pf.title === type)[0]
											.options.map((item: string) => (
												<MenuItem key={item} value={item}>
													{item}
												</MenuItem>
											))}
									</StyledSelect>
								</StyledFormControl>
							</div>
						))}
						{ecInputTypes.map((type: any) => (
							<div key={type} className={styles.inputContainer}>
								<StyledFormControl>
									<StyledInputLabel>{type}</StyledInputLabel>
									<StyledInput
										placeholder={`Please Enter ${type}`}
										type="number"
										value={buildingFormData[refData[type]]}
										onChange={(e) => handleInput(e, type)}
										className={styles.select}
									/>
								</StyledFormControl>
							</div>
						))}
					</div>

					<button type="button" onClick={handleSave} className={styles.saveBtn}>
						Save/Update
					</button>
					<button type="button" onClick={handleCancel} className={styles.saveBtn}>
						Cancel
					</button>
				</div>
			)}
		</>
	);
};

export default connect(
	undefined,
	undefined
)(
	createConnectedRequestCoordinator<ReduxProps>()(
		createRequestClient(requestOptions)(HouseholdForm)
	)
);
