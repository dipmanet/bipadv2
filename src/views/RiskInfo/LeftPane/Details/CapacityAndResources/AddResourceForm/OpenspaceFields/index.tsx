/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { isNotDefined, isDefined } from "@togglecorp/fujs";
import { createRequestClient, ClientAttributes, methods } from "#request";
import * as PageType from "#store/atom/page/types";
import MultiViewContainer from "#rscv/MultiViewContainer";
import ScrollTabs from "#rscv/ScrollTabs";
import styles from "./styles.module.scss";
import BasicInfo from "./AddOpenspaceTabs/BasicInfo";
import SuggestedUses from "./AddOpenspaceTabs/SuggestedUses";
import OnSiteAmenities from "./AddOpenspaceTabs/OnSiteAmenities";
import EnvironmentChecklist from "./AddOpenspaceTabs/EnvironmentChecklist";
import Media from "./AddOpenspaceTabs/Media";
import Details from "./AddOpenspaceTabs/Details";

const keySelector = (d: any) => d.id;

interface Tabs {
	basicInfo: string;
	details: string;
	suggestedUses: string;
	onSiteAmenties: string;
	environmentChecklist: string;
	media: string;
}
interface State {
	currentView: string;
	openspaceId: number | undefined;
	openspacePostError: boolean;
}

interface Props {
	resourceId: number | undefined;

	closeModal: () => void;
}
interface FaramErrors {}

interface ReduxProps {}

interface Params {}

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	addResourcePostRequest: {
		url: "/resource/",
		method: methods.POST,
		query: { meta: true },
		body: ({ params: { body } = { body: {} } }) => body,
		onSuccess: ({ params: { onSuccess } = { onSuccess: undefined }, response }) => {
			if (onSuccess) {
				onSuccess(response as PageType.Resource);
			}
		},
		onFailure: ({ error, params }) => {
			if (params && params.setFaramErrors) {
				const errorKey = Object.keys(error.response).find((i) => i === "ward");

				if (errorKey) {
					const errorList = error.response;
					errorList.location = errorList.ward;
					delete errorList.ward;

					params.setFaramErrors(errorList);
				} else {
					params.setFaramErrors({
						$internal: ["Some problem occurred"],

						// location: [(error.response.ward)[0]],
					});
				}
			}
		},
		onFatal: ({ params }) => {
			if (params && params.setFaramErrors) {
				params.setFaramErrors({
					$internal: ["Some problem occurred"],
				});
			}
		},
	},
	editResourcePostRequest: {
		url: ({ params: { resourceId } }) => `/resource/${resourceId}/`,
		method: methods.PUT,
		query: { meta: true },
		body: ({ params: { body } = { body: {} } }) => body,
		onSuccess: ({ params: { onSuccess } = { onSuccess: undefined }, response }) => {
			if (onSuccess) {
				onSuccess(response as PageType.Resource);
			}
		},
		onFailure: ({ error, params }) => {
			if (params && params.setFaramErrors) {
				const errorKey = Object.keys(error.response).find((i) => i === "ward");

				if (errorKey) {
					const errorList = error.response;
					errorList.location = errorList.ward;
					delete errorList.ward;

					params.setFaramErrors(errorList);
				} else {
					params.setFaramErrors({
						$internal: ["Some problem occurred"],

						// location: [(error.response.ward)[0]],
					});
				}
			}
		},
		onFatal: ({ params }) => {
			if (params && params.setFaramErrors) {
				params.setFaramErrors({
					$internal: ["Some problem occurred"],
				});
			}
		},
	},
};

class OpenspaceFields extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			openspaceId: undefined,
			currentView: "basicInfo",
			openspacePostError: false,
		};
	}

	public componentDidMount() {
		const { resourceId } = this.props;
		if (resourceId) {
			this.setState({
				openspaceId: resourceId,
				openspacePostError: false,
			});
		}
	}

	private tabs = {
		basicInfo: "Basic Info",
		details: "Details",
		suggestedUses: "Suggested Uses",
		onSiteAmenties: "Amenities",
		environmentChecklist: "Environment Checklist",
		media: "Media",
	};

	private views = {
		basicInfo: {
			component: BasicInfo,
			rendererParams: () => ({
				className: styles.views,
				resourceId: this.props.resourceId,
				setAdministrativeParameters: this.setAdministrativeParameters,
				openspacePostError: this.state.openspacePostError,
				handleTabClick: this.procceedTabClick,
				postBasicInfo: this.postBasicInfo,
				keySelector,
				LoadingSuccessHalt: this.props.LoadingSuccessHalt,
			}),
		},
		details: {
			component: Details,
			rendererParams: () => ({
				className: styles.views,
				handleTabClick: this.procceedTabClick,
				resourceId: this.props.resourceId,
				openspaceId: this.state.openspaceId,
				keySelector,

				LoadingSuccessHalt: this.props.LoadingSuccessHalt,
			}),
		},
		suggestedUses: {
			component: SuggestedUses,
			rendererParams: () => ({
				className: styles.views,
				handleTabClick: this.procceedTabClick,
				resourceId: this.props.resourceId,
				openspaceId: this.state.openspaceId,
				keySelector,
				LoadingSuccessHalt: this.props.LoadingSuccessHalt,
			}),
		},
		onSiteAmenties: {
			component: OnSiteAmenities,
			rendererParams: () => ({
				className: styles.views,
				// handleChange: this.handleChange,
				handleTabClick: this.procceedTabClick,
				resourceId: this.props.resourceId,
				openspaceId: this.state.openspaceId,
				keySelector,
				LoadingSuccessHalt: this.props.LoadingSuccessHalt,
			}),
		},
		environmentChecklist: {
			component: EnvironmentChecklist,
			rendererParams: () => ({
				className: styles.views,
				// handleChange: this.handleChange,
				handleTabClick: this.procceedTabClick,
				resourceId: this.props.resourceId,
				openspaceId: this.state.openspaceId,
				keySelector,
				LoadingSuccessHalt: this.props.LoadingSuccessHalt,
			}),
		},
		media: {
			component: Media,
			rendererParams: () => ({
				className: styles.views,
				// handleChange: this.handleChange,
				handleTabClick: this.procceedTabClick,
				resourceId: this.props.resourceId,
				openspaceId: this.state.openspaceId,
				keySelector,
				LoadingSuccessHalt: this.props.LoadingSuccessHalt,
				faramValueSetNull: this.props.faramValueSetNull,
			}),
		},
	};

	// private tabs = {
	//     basicInfo: 'Basic Info',
	//     details: 'Details',
	//     suggestedUses: 'Suggested Uses',
	//     onSiteAmenties: 'Amenities',
	//     environmentChecklist: 'Environment Checklist',
	//     media: 'Media',
	// };

	private handleTabClick = (tab: string) => {
		const { resourceId } = this.props;
		const { currentView } = this.state;

		if (isDefined(resourceId)) {
			this.setState({ currentView: tab });
		}
	};

	private procceedTabClick = (tabToProceed: string) => {
		if (tabToProceed === "closeModal") {
			this.props.closeModal();
		} else {
			this.setState({ currentView: tabToProceed });
		}
	};

	private handleFaramValidationFailure = (error) => {
		const { LoadingSuccessHalt, handleFaramValidationFailure } = this.props;
		this.setState({
			openspacePostError: true,
		});
		LoadingSuccessHalt(false);
		handleFaramValidationFailure(error);
	};

	private setAdministrativeParameters = (name, value) => {
		this.setState({
			[name]: value,
		});
	};

	private postBasicInfo = () => {
		this.setState({ openspacePostError: false });
		const { faramValues, resourceId } = this.props;
		const { province, district, municipality } = this.state;
		const { location, ...others } = faramValues;
		let values = others;
		if (location) {
			const point = location.geoJson.features[0].geometry;
			const { ward } = location.region;
			// const ward = 1;
			values = {
				...values,
				point,
				ward,
				province,
				district,
				municipality,
			};
		}

		const {
			requests: { addResourcePostRequest, editResourcePostRequest },
			LoadingSuccessHalt,
		} = this.props;
		LoadingSuccessHalt(true);
		if (isNotDefined(resourceId)) {
			addResourcePostRequest.do({
				body: values,
				onSuccess: this.handleOpenspacePostSuccess,
				setFaramErrors: this.handleFaramValidationFailure,
			});
		} else {
			editResourcePostRequest.do({
				resourceId,
				body: values,
				onSuccess: this.handleOpenspacePostSuccess,
				setFaramErrors: this.handleFaramValidationFailure,
			});
		}
	};

	private handleOpenspacePostSuccess = (resource: PageType.Resource) => {
		const { onAddSuccess, LoadingSuccessHalt, handleClearDataAfterAddition } = this.props;
		LoadingSuccessHalt(false);
		handleClearDataAfterAddition(resource.resourceType);
		if (onAddSuccess) {
			onAddSuccess(resource);
		}

		this.setState(
			{
				openspaceId: resource.id,
			},
			() => {
				this.setState({ currentView: "details" });
			}
		);
	};

	public render() {
		const { currentView } = this.state;
		const { addResourcePending, LoadingSuccessHalt, faramValueSetNull } = this.props;

		return (
			<>
				<ScrollTabs
					className={styles.tabs}
					tabs={this.tabs}
					active={currentView}
					onClick={this.handleTabClick}
					faramValueSetNull={faramValueSetNull}
					LoadingSuccessHalt={LoadingSuccessHalt}
				/>
				<MultiViewContainer
					views={this.views}
					active={currentView}
					faramValueSetNull={faramValueSetNull}
					LoadingSuccessHalt={LoadingSuccessHalt}
				/>
			</>
		);
	}
}

export default createRequestClient(requests)(OpenspaceFields);
