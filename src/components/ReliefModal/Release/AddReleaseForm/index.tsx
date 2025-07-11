import React from "react";
import Redux, { compose } from "redux";
import { isDefined, isNotDefined } from "@togglecorp/fujs";
import { connect } from "react-redux";
import Faram, { requiredCondition } from "@togglecorp/faram";

import { Translation } from "react-i18next";
import TextArea from "#rsci/TextArea";
import TextInput from "#rsci/TextInput";
import DangerButton from "#rsca/Button/DangerButton";
import PrimaryButton from "#rsca/Button/PrimaryButton";
import Modal from "#rscv/Modal";
import ModalHeader from "#rscv/Modal/Header";
import ModalBody from "#rscv/Modal/Body";
import ModalFooter from "#rscv/Modal/Footer";
import SelectInput from "#rsci/SelectInput";
import SearchSelectInput from "#rsci/SearchSelectInput";
import NumberInput from "#rsci/NumberInput";
import LoadingAnimation from "#rscv/LoadingAnimation";
import NonFieldErrors from "#rsci/NonFieldErrors";
import Button from "#rsca/Button";
import modalize from "#rscg/Modalize";
import { createRequestClient, NewProps, ClientAttributes, methods } from "#request";

import { AppState, EventElement, Release, Organization, Person } from "#types";

import { Incident } from "#store/atom/page/types";

import { eventListSelector, languageSelector } from "#selectors";

import { setEventListAction } from "#actionCreators";
import { MultiResponse } from "#store/atom/response/types";

import AddOrganizationModal from "#components/AddOrganizationModal";
import styles from "./styles.module.scss";

const ModalButton = modalize(Button);

interface FaramValues {
	incident?: number;
	people?: number;
	benificiary?: number;
}
interface FaramErrors {}

interface OwnProps {
	closeModal?: () => void;
	onUpdate?: () => void;
	value?: Release;
}

interface PropsFromAppState {
	eventList: EventElement[];
}

interface PropsFromDispatch {
	setEventList: typeof setEventListAction;
}

interface State {
	faramValues: FaramValues;
	faramErrors: object;
	pristine: boolean;

	people: Person[];
	organizationList?: Organization[];
}

interface Params {
	body?: object;
	incident?: number;
	setFaramErrors?: (error: object) => void;
	setPeople?: (people: Person[]) => void;
	setOrganizations?: (organizationList: Organization[]) => void;
}

interface StatusOption {
	id: number;
	title: string;
}

type PropsWithRedux = OwnProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<PropsWithRedux, Params>;

const mapStateToProps = (state: AppState): PropsFromAppState => ({
	eventList: eventListSelector(state),
	language: languageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setEventList: (params) => dispatch(setEventListAction(params)),
});

const incidentKeySelector = (i: Incident) => i.id;
const incidentLabelSelector = (i: Incident) => i.title;
const organizationKeySelector = (o: Organization) => o.id;
const organizationLabelSelector = (o: Organization) => o.title;
const personKeySelector = (i: Person) => i.id;
const personLabelSelector = (i: Person) => i.name;
const statusKeySelector = (s: StatusOption) => s.id;
const statusLabelSelector = (s: StatusOption) => s.title;

const requestOptions: { [key: string]: ClientAttributes<PropsWithRedux, Params> } = {
	organizationGetRequest: {
		url: "/organization/",
		method: methods.GET,
		onMount: true,
		onSuccess: ({ response, params }) => {
			const organizations = response as MultiResponse<Organization>;
			const organizationList = organizations.results;
			if (params && params.setOrganizations) {
				params.setOrganizations(organizationList);
			}
		},
	},
	incidentListGetRequest: {
		url: "/incident/",
		method: methods.GET,
		onMount: true,
		query: {
			fields: ["id", "title"],
			limit: -1,
		},
	},
	peopleGetRequest: {
		url: "/loss-people/",
		query: ({ params, props }) => {
			if (isDefined(params) && isDefined(params.incident)) {
				return {
					incident: params.incident,
				};
			}
			if (isDefined(props.value) && isDefined(props.value.incident)) {
				return {
					incident: props.value.incident,
				};
			}
			return undefined;
		},
		method: methods.GET,
		onSuccess: ({ params, response }) => {
			if (params && params.setPeople) {
				const people = response as MultiResponse<Person>;
				params.setPeople(people.results);
			}
		},
		onMount: ({ props }) => isDefined(props.value) && isDefined(props.value.incident),
	},
	releaseStatusGetRequest: {
		url: "/relief-release-status/",
		method: methods.GET,
		onMount: true,
	},
	reliefReleaseAddRequest: {
		url: ({ props }) => (props.value ? `/relief-release/${props.value.id}/` : "/relief-release/"),
		method: ({ props }) => (props.value ? methods.PATCH : methods.POST),
		body: ({ params }) => params && params.body,
		onSuccess: ({ props }) => {
			if (props.onUpdate) {
				props.onUpdate();
			}
			if (props.closeModal) {
				props.closeModal();
			}
		},
		onFailure: ({ error, params }) => {
			if (params && params.setFaramErrors) {
				// TODO: handle error
				console.warn("failure", error);
				params.setFaramErrors({
					$internal: ["Some problem occurred"],
				});
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

class AddReleaseForm extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		const { value, requests } = this.props;

		requests.organizationGetRequest.setDefaultParams({
			setOrganizations: this.setOrganizations,
		});

		this.state = {
			faramValues: isDefined(value) ? (value as FaramValues) : {},
			faramErrors: {},
			pristine: true,
			people: [],
			organizationList: undefined,
		};

		this.schema = {
			fields: {
				providerOrganization: [requiredCondition],
				incident: [requiredCondition],
				district: [],
				municipality: [],
				ward: [],
				person: [requiredCondition],
				benificiary: [],
				benificiaryOther: [],
				status: [],
				amount: [requiredCondition],
				description: [],
			},
		};

		requests.peopleGetRequest.setDefaultParams({
			setPeople: (people: Person[]) => {
				this.setState({ people });
			},
		});
	}

	private schema: object;

	private setOrganizations = (organizationList: Organization[]) => {
		this.setState({ organizationList });
	};

	private handleOrganizationAdd = (organization: Organization) => {
		const { organizationList = [], faramValues } = this.state;

		const newOrganizationList = [organization, ...organizationList];

		const newFaramValues = {
			...faramValues,
			organization: organization.id,
		};

		this.setState({
			organizationList: newOrganizationList,
			faramValues: newFaramValues,
			pristine: false,
		});
	};

	private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
		const {
			faramValues: { incident: oldIncident },
		} = this.state;
		const { incident: newIncident } = faramValues;

		let newFaramValues = faramValues;

		if (oldIncident !== newIncident) {
			if (isNotDefined(newIncident)) {
				this.setState({ people: [] });
			} else {
				const {
					requests: { peopleGetRequest },
				} = this.props;
				peopleGetRequest.do({
					incident: newIncident,
					setPeople: (people: Person[]) => {
						this.setState({ people });
					},
				});
			}

			newFaramValues = {
				...faramValues,
				people: undefined,
				benificiary: undefined,
			};
		}

		this.setState({
			faramValues: newFaramValues,
			faramErrors,
			pristine: false,
		});
	};

	private handleFaramValidationFailure = (faramErrors: FaramErrors) => {
		this.setState({
			faramErrors,
		});
	};

	private handleFaramValidationSuccess = (_: unknown, faramValues: FaramValues) => {
		const {
			requests: { reliefReleaseAddRequest },
		} = this.props;
		reliefReleaseAddRequest.do({
			body: faramValues,
			setFaramErrors: this.handleFaramValidationFailure,
		});
	};

	public render() {
		const {
			closeModal,
			requests: {
				reliefReleaseAddRequest: { pending: addReliefPending },
				organizationGetRequest: { pending: organizationsGetPending },
				incidentListGetRequest: { response: incidentsResponse, pending: incidentsGetPending },
				peopleGetRequest: { pending: peopleGetPending },
				releaseStatusGetRequest: {
					response: releaseStatusResponse,
					pending: releaseStatusGetPending,
				},
			},
			language: { language },
		} = this.props;

		const { faramValues, faramErrors, pristine, people: personList, organizationList } = this.state;

		let incidentList: Incident[] = [];
		if (!incidentsGetPending && incidentsResponse) {
			const incidents = incidentsResponse as MultiResponse<Incident>;
			incidentList = incidents.results;
		}

		let statusList: StatusOption[] = [];
		if (!releaseStatusGetPending && releaseStatusResponse) {
			const releaseStatus = releaseStatusResponse as MultiResponse<StatusOption>;
			statusList = releaseStatus.results;
		}

		const pending = addReliefPending || organizationsGetPending || incidentsGetPending;

		return (
			<Modal>
				<Translation>
					{(t) => (
						<Faram
							onChange={this.handleFaramChange}
							onValidationFailure={this.handleFaramValidationFailure}
							onValidationSuccess={this.handleFaramValidationSuccess}
							schema={this.schema}
							value={faramValues}
							error={faramErrors}
							disabled={pending}>
							<ModalHeader
								title={t("Add Release")}
								rightComponent={
									<DangerButton
										transparent
										iconName="close"
										onClick={closeModal}
										title={t("Close Modal")}
									/>
								}
							/>
							<ModalBody className={styles.modalBody}>
								{pending && <LoadingAnimation />}
								<NonFieldErrors faramElement />
								<TextArea faramElementName="description" label={t("Description")} autoFocus />
								<div className={styles.organizationContainer}>
									<SelectInput
										placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
										faramElementName="providerOrganization"
										label={t("Provider Organization")}
										options={organizationList}
										keySelector={organizationKeySelector}
										labelSelector={organizationLabelSelector}
									/>
									<ModalButton
										className={styles.button}
										modal={<AddOrganizationModal onOrganizationAdd={this.handleOrganizationAdd} />}
										iconName="add"
										transparent
									/>
								</div>
								<NumberInput faramElementName="amount" label={t("Amount")} />
								<SearchSelectInput
									placeholder={language === "en" ? "Select an option" : "विकल्प खोज्नुहोस्"}
									faramElementName="incident"
									label={t("Incident")}
									options={incidentList}
									keySelector={incidentKeySelector}
									labelSelector={incidentLabelSelector}
								/>
								<SelectInput
									placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
									faramElementName="person"
									label={t("Person")}
									options={personList}
									keySelector={personKeySelector}
									labelSelector={personLabelSelector}
									disabled={peopleGetPending || isNotDefined(faramValues.incident)}
								/>
								<SelectInput
									placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
									faramElementName="benificiary"
									label={t("Beneficiary")}
									options={personList}
									keySelector={personKeySelector}
									labelSelector={personLabelSelector}
									disabled={peopleGetPending || isNotDefined(faramValues.incident)}
								/>
								<TextInput faramElementName="benificiaryOther" label={t("Beneficiary Other")} />
								<SelectInput
									placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
									faramElementName="status"
									label={t("Status")}
									options={statusList}
									keySelector={statusKeySelector}
									labelSelector={statusLabelSelector}
								/>
							</ModalBody>
							<ModalFooter>
								<DangerButton onClick={closeModal}>{t("Close")}</DangerButton>
								<PrimaryButton
									type="submit"
									pending={addReliefPending}
									disabled={pristine || pending}>
									{t("Save")}
								</PrimaryButton>
							</ModalFooter>
						</Faram>
					)}
				</Translation>
			</Modal>
		);
	}
}

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	createRequestClient(requestOptions)
)(AddReleaseForm);
