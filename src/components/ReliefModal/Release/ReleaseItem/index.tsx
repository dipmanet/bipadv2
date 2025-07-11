import React from "react";
import { _cs } from "@togglecorp/fujs";

import Cloak from "#components/Cloak";
import TextOutput from "#components/TextOutput";
import modalize from "#rscg/Modalize";
import Button from "#rsca/Button";
import DangerConfirmButton from "#rsca/ConfirmButton/DangerConfirmButton";

import { Release } from "#types";

import { createRequestClient, NewProps, ClientAttributes, methods } from "#request";
import AddReleaseForm from "../AddReleaseForm";

import styles from "./styles.module.scss";

const ModalButton = modalize(Button);

interface OwnProps {
	className?: string;
	onUpdate: () => void;
	data: Release;
}
interface State {}

interface Params {}

type Props = NewProps<OwnProps, Params>;
const requestOptions: { [key: string]: ClientAttributes<OwnProps, Params> } = {
	reliefReleaseDeleteRequest: {
		url: ({
			props: {
				data: { id },
			},
		}) => `/relief-release/${id}/`,
		method: methods.DELETE,
		onSuccess: ({ props }) => {
			if (props.onUpdate) {
				props.onUpdate();
			}
		},
	},
};

class ReleaseItem extends React.PureComponent<Props, State> {
	private handleReleaseDelete = () => {
		const {
			requests: { reliefReleaseDeleteRequest },
		} = this.props;
		reliefReleaseDeleteRequest.do();
	};

	public render() {
		const {
			data,
			onUpdate,
			requests: {
				reliefReleaseDeleteRequest: { pending },
			},
			className,
		} = this.props;

		const {
			benificiaryOther,
			amount,
			description,
			providerOrganization,
			incident,
			ward,
			person,
			benificiary,
			status,
		} = data;

		return (
			<div className={_cs(className, styles.releaseItem)}>
				<div className={styles.basicDetails}>
					<TextOutput label="incident" value={incident} />
					<TextOutput label="Amount" value={amount} />
					<TextOutput label="Provided By" value={providerOrganization} />
				</div>

				<div className={styles.incidentDetails}>
					<TextOutput label="Incident" value={incident} />
					<TextOutput label="Person" value={person} />
					<TextOutput label="Status" value={status} />
					<TextOutput label="Benificiary" value={benificiary} />
					<TextOutput label="Other Benificiary" value={benificiaryOther} />
					<TextOutput label="Ward" value={ward} />
				</div>
				<div className={styles.description}>{description}</div>
				<div className={styles.actions}>
					<Cloak hiddenIf={(p) => !p.change_release}>
						<ModalButton
							transparent
							iconName="edit"
							modal={<AddReleaseForm value={data} onUpdate={onUpdate} />}>
							Edit
						</ModalButton>
					</Cloak>
					<Cloak hiddenIf={(p) => !p.delete_release}>
						<DangerConfirmButton
							iconName="delete"
							confirmationMessage="Are you sure you want to delete this relief release?"
							onClick={this.handleReleaseDelete}
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

export default createRequestClient(requestOptions)(ReleaseItem);
