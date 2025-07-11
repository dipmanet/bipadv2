import React from "react";
import { _cs } from "@togglecorp/fujs";
import Faram, { requiredCondition } from "@togglecorp/faram";

import DangerButton from "#rsca/Button/DangerButton";
import Modal from "#rscv/Modal";
import ModalHeader from "#rscv/Modal/Header";
import ModalBody from "#rscv/Modal/Body";
import ModalFooter from "#rscv/Modal/Footer";
import PrimaryButton from "#rsca/Button/PrimaryButton";
import NonFieldErrors from "#rsci/NonFieldErrors";
import TextArea from "#rsci/TextArea";
import ReCaptcha from "#rsci/ReCaptcha";

import {
	createConnectedRequestCoordinator,
	createRequestClient,
	NewProps,
	ClientAttributes,
	methods,
} from "#request";

import styles from "./styles.module.scss";

// FIXME: get from common typings
interface IncidentFeedback {
	name: string;
	email: string;
	mobileNumber?: string | number;
	comment: string;
	acknowledged: boolean;
	acknowledgedMessage?: string;
	incident: number;

	id: number;
	createdOn: string;
}

interface ComponentProps {
	className?: string;
	closeModal?: () => void;
	feedbackId: number;
	onSuccess: (data: IncidentFeedback) => void;
}

interface FaramValues {
	acknowledgedMessage?: string;
}

interface State {
	faramValues: FaramValues;
	faramErrors: object;
}

interface Params {
	body?: object;
	setFaramErrors?: (error: object) => void;
}

type Props = NewProps<ComponentProps, Params>;

const schema = {
	fields: {
		acknowledgedMessage: [requiredCondition],
	},
};

const requestOptions: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
	incidentFeedbackPostRequest: {
		url: ({ props: { feedbackId } }) => `/incident-feedback/${feedbackId}/`,
		method: methods.PATCH,
		body: ({ params }) => params && params.body,
		onSuccess: ({ response, props }) => {
			const feedback = response as IncidentFeedback;
			props.onSuccess(feedback);
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

class IncidentFeedbackAckFormModal extends React.PureComponent<Props, State> {
	public state = {
		faramValues: {},
		faramErrors: {},
	};

	private handleFaramValidationFailure = (faramErrors: object) => {
		this.setState({ faramErrors });
	};

	private handleFaramChange = (faramValues: FaramValues, faramErrors: object) => {
		this.setState({ faramValues, faramErrors });
	};

	private handleFaramValidationSuccess = (faramValues: FaramValues) => {
		const {
			requests: { incidentFeedbackPostRequest },
			feedbackId,
		} = this.props;

		const body = {
			...faramValues,
			id: feedbackId,
			acknowledged: true,
		};

		incidentFeedbackPostRequest.do({
			body,
			setFaramErrors: this.handleFaramValidationFailure,
		});
	};

	public render() {
		const {
			className,
			closeModal,
			requests: {
				incidentFeedbackPostRequest: { pending },
			},
		} = this.props;

		const { faramValues, faramErrors } = this.state;

		return (
			<Modal
				className={_cs(styles.addIncidentFeedbackFormModal, className)}
				// onClose={closeModal}
			>
				<Faram
					className={styles.form}
					schema={schema}
					onChange={this.handleFaramChange}
					value={faramValues}
					error={faramErrors}
					onValidationSuccess={this.handleFaramValidationSuccess}
					onValidationFailure={this.handleFaramValidationFailure}
					disabled={pending}>
					<ModalHeader
						className={styles.header}
						title="Acknowledge Feedback"
						rightComponent={
							<DangerButton transparent iconName="close" onClick={closeModal} title="Close Modal" />
						}
					/>
					<ModalBody className={styles.body}>
						<NonFieldErrors faramElement />
						<TextArea
							className={styles.input}
							faramElementName="acknowledgedMessage"
							label="Acknowledge Message"
							autoFocus
						/>
					</ModalBody>
					<ModalFooter>
						<DangerButton onClick={closeModal}>Close</DangerButton>
						<PrimaryButton type="submit" pending={pending}>
							Save
						</PrimaryButton>
					</ModalFooter>
				</Faram>
			</Modal>
		);
	}
}

export default createConnectedRequestCoordinator<ComponentProps>()(
	createRequestClient(requestOptions)(IncidentFeedbackAckFormModal)
);
