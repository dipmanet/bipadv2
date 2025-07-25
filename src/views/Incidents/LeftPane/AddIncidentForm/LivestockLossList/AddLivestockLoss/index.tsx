import React from "react";

import Faram, { requiredCondition } from "@togglecorp/faram";

import { Translation } from "react-i18next";
import { connect } from "react-redux";
import { createRequestClient, NewProps, ClientAttributes, methods } from "#request";

import { Status, Field } from "#store/atom/page/types";

import NonFieldErrors from "#rsci/NonFieldErrors";
import LoadingAnimation from "#rscv/LoadingAnimation";
import Modal from "#rscv/Modal";
import ModalBody from "#rscv/Modal/Body";
import ModalHeader from "#rscv/Modal/Header";
import ModalFooter from "#rscv/Modal/Footer";
import TextInput from "#rsci/TextInput";
import SelectInput from "#rsci/SelectInput";
import NumberInput from "#rsci/NumberInput";
import Checkbox from "#rsci/Checkbox";
import PrimaryButton from "#rsca/Button/PrimaryButton";
import DangerButton from "#rsca/Button/DangerButton";

import Cloak from "#components/Cloak";

import { MultiResponse } from "#store/atom/response/types";
import { languageSelector } from "#selectors";
import styles from "./styles.module.scss";

const mapStateToProps = (state) => ({
	language: languageSelector(state),
});
interface FaramValues {}

interface FaramErrors {}

interface OwnProps {
	className?: string;
	closeModal: () => void;
	onAddSuccess: (familyLoss: object) => void;
	lossServerId: number;
}

interface PropsFromState {}

interface PropsFromDispatch {}

interface Params {
	body?: object;
	setFaramErrors?: (error: object) => void;
	setLivestockTypes?: (livestockTypes: LivestockType[]) => void;
}

interface State {
	faramValues: FaramValues;
	faramErrors: FaramErrors;
	pristine: boolean;
	livestockTypes: LivestockType[];
}

interface LivestockType extends Field {}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const labelSelector = (d: Field, language) => (language === "en" ? d.title : d.titleNe);
const keySelector = (d: Field) => d.id;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	addLivestockLossRequest: {
		url: "/loss-livestock/",
		method: methods.POST,
		body: ({ params: { body } = { body: {} } }) => body,
		onSuccess: ({ response, props }) => {
			const { onAddSuccess, closeModal } = props;

			if (onAddSuccess) {
				onAddSuccess(response);
			}
			closeModal();
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
	livestockTypeGetRequest: {
		url: "/livestock-type/",
		method: methods.GET,
		onMount: true,
		onSuccess: ({ response, params: { setLivestockTypes } = { setLivestockType: undefined } }) => {
			const { results } = response as MultiResponse<LivestockType>;
			if (setLivestockTypes) {
				setLivestockTypes(results);
			}
		},
	},
};
const livestockLossStatus: Status[] = [
	{
		id: 1,
		title: "destroyed",
		titleNe: "नष्‍ट भएको",
	},
	{
		id: 1,
		title: "affected",
		titleNe: "प्रभावित भएको",
	},
];

class AddLivestockLoss extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			livestockTypes: [],
			faramValues: {},
			faramErrors: {},
			pristine: true,
		};

		const {
			requests: { livestockTypeGetRequest },
		} = this.props;

		livestockTypeGetRequest.setDefaultParams({
			setLivestockTypes: (livestockTypes: LivestockType[]) => {
				this.setState({
					livestockTypes,
				});
			},
		});
	}

	private static schema = {
		fields: {
			title: [],
			type: [],
			status: [requiredCondition],
			count: [requiredCondition],
			economicLoss: [],
			verified: [],
			verificationMessage: [],
		},
	};

	private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
		this.setState({
			faramValues,
			faramErrors,
			pristine: false,
		});
	};

	private handleFaramValidationFailure = (faramErrors: FaramErrors) => {
		this.setState({
			faramErrors,
		});
	};

	private handleFaramValidationSuccess = (faramValues: FaramValues) => {
		const {
			requests: { addLivestockLossRequest },
			lossServerId,
		} = this.props;

		addLivestockLossRequest.do({
			body: {
				loss: lossServerId,
				...faramValues,
			},
			setFaramErrors: this.handleFaramValidationFailure,
		});
	};

	public render() {
		const {
			className,
			closeModal,
			requests: {
				addLivestockLossRequest: { pending },
			},
			language: { language },
		} = this.props;

		const { livestockTypes, faramValues, faramErrors, pristine } = this.state;

		return (
			<Translation>
				{(t) => (
					<Modal className={className}>
						<ModalHeader
							title={t("Add Family Loss")}
							rightComponent={
								<DangerButton
									transparent
									iconName="close"
									onClick={closeModal}
									title="Close Modal"
								/>
							}
						/>
						<Faram
							onChange={this.handleFaramChange}
							onValidationFailure={this.handleFaramValidationFailure}
							onValidationSuccess={this.handleFaramValidationSuccess}
							schema={AddLivestockLoss.schema}
							value={faramValues}
							error={faramErrors}>
							<ModalBody className={styles.modalBody}>
								<NonFieldErrors faramElement />
								{pending && <LoadingAnimation />}
								<TextInput faramElementName="title" label={t("Title")} autoFocus />
								<SelectInput
									placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
									faramElementName="type"
									label={t("Type")}
									options={livestockTypes}
									keySelector={keySelector}
									labelSelector={(d) => labelSelector(d, language)}
								/>
								<SelectInput
									placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
									faramElementName="status"
									label={t("Status")}
									options={livestockLossStatus}
									keySelector={labelSelector}
									labelSelector={labelSelector}
								/>
								<NumberInput faramElementName="count" label={t("Count")} />
								<NumberInput faramElementName="economicLoss" label={t("Economic Loss")} />
								<Cloak hiddenIf={(p) => !p.verify_livestock}>
									<>
										<Checkbox faramElementName="verified" label={t("Verified")} />
										<TextInput
											faramElementName="verificationMessage"
											label={t("Verification Message")}
										/>
									</>
								</Cloak>
							</ModalBody>
							<ModalFooter>
								<DangerButton onClick={closeModal}>{t("Close")}</DangerButton>
								<PrimaryButton type="submit" disabled={pristine} pending={pending}>
									{t("Save")}
								</PrimaryButton>
							</ModalFooter>
						</Faram>
					</Modal>
				)}
			</Translation>
		);
	}
}

export default connect(mapStateToProps)(createRequestClient(requests)(AddLivestockLoss));
