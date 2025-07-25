import React from "react";
import { _cs } from "@togglecorp/fujs";

import DateOutput from "#components/DateOutput";
import TextOutput from "#components/TextOutput";
import modalize from "#rscg/Modalize";
import Button from "#rsca/Button";
import DangerConfirmButton from "#rsca/ConfirmButton/DangerConfirmButton";
import Cloak from "#components/Cloak";

import { Flow } from "#types";

import { createRequestClient, NewProps, ClientAttributes, methods } from "#request";
import AddFlowForm from "../AddFlowForm";

import styles from "./styles.module.scss";

const ModalButton = modalize(Button);

interface OwnProps {
	className?: string;
	onUpdate: () => void;
	data: Flow;
}
interface State {}

interface Params {}

type Props = NewProps<OwnProps, Params>;
const requestOptions: { [key: string]: ClientAttributes<OwnProps, Params> } = {
	reliefFlowDeleteRequest: {
		url: ({
			props: {
				data: { id },
			},
		}) => `/relief-flow/${id}/`,
		method: methods.DELETE,
		onSuccess: ({ props }) => {
			if (props.onUpdate) {
				props.onUpdate();
			}
		},
	},
};

class FlowItem extends React.PureComponent<Props, State> {
	private handleFlowDelete = () => {
		const {
			requests: { reliefFlowDeleteRequest },
		} = this.props;
		reliefFlowDeleteRequest.do();
	};

	public render() {
		const {
			data,
			onUpdate,
			requests: {
				reliefFlowDeleteRequest: { pending },
			},
			className,
		} = this.props;

		const {
			type,
			amount,
			date,
			description,
			receiverOrganization,
			providerOrganization,
			event,
			fiscalYear,
		} = data;

		return (
			<div className={_cs(className, styles.flowItem)}>
				<div className={styles.basicDetails}>
					<TextOutput label="type" value={type} />
					<TextOutput label="Amount" value={amount} />
					<TextOutput label="Received By" value={receiverOrganization} />
					<TextOutput label="Provided By" value={providerOrganization} />
				</div>
				<div className={styles.eventDetails}>
					<TextOutput label="Event" value={event} />
					<DateOutput value={date} />
					<TextOutput label="Fiscal Year" value={fiscalYear} />
				</div>
				<div className={styles.description}>{description}</div>
				<div className={styles.actions}>
					<Cloak hiddenIf={(p) => !p.change_flow}>
						<ModalButton
							transparent
							iconName="edit"
							modal={<AddFlowForm value={data} onUpdate={onUpdate} />}>
							Edit
						</ModalButton>
					</Cloak>
					<Cloak hiddenIf={(p) => !p.delete_flow}>
						<DangerConfirmButton
							iconName="delete"
							confirmationMessage="Are you sure you want to delete this relief flow?"
							onClick={this.handleFlowDelete}
							pending={pending}
							transparent>
							Delete
						</DangerConfirmButton>
					</Cloak>
				</div>
			</div>
		);
	}
}

export default createRequestClient(requestOptions)(FlowItem);
