import React from "react";
import { compose } from "redux";
import { _cs } from "@togglecorp/fujs";

import { Translation } from "react-i18next";
import { createRequestClient, NewProps, ClientAttributes, methods } from "#request";

import AccentButton from "#rsca/Button/AccentButton";
import DangerConfirmButton from "#rsca/ConfirmButton/DangerConfirmButton";
import LoadingAnimation from "#rscv/LoadingAnimation";
import Table from "#rscv/Table";
import modalize from "#rscg/Modalize";
import Cloak from "#components/Cloak";

import * as PageType from "#store/atom/page/types";
import { Header } from "#store/atom/table/types";
import { MultiResponse } from "#store/atom/response/types";

import AddTraining from "./AddTrainingModal";
import { trainingValues, trainingValuesNe } from "../../utils";

import styles from "./styles.module.scss";

const ModalAccentButton = modalize(AccentButton);

interface ExtraHeader {
	// FIXME: Not sure what to put here
	actions?: string;
}

interface State {
	list: PageType.Training[];
}

interface OwnProps {
	className?: string;
	contactId: number;
	onListChange: (list: PageType.Training[]) => void;
}

interface Params {
	onAddFailure?: (faramErrors: object) => void;
	onListGet?: (list: PageType.Training[]) => void;
	onListItemRemove?: (listItem: number) => void;
	itemId?: number;
}

const keySelector = (d: PageType.Field) => d.id;

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
	listRequest: {
		url: "/contact-training/",
		query: ({ props: { contactId } }) => ({
			contact: contactId,
		}),
		onMount: true,
		method: methods.GET,
		onSuccess: ({ params, response }) => {
			const listResponse = response as MultiResponse<PageType.Training>;
			if (params && params.onListGet) {
				params.onListGet(listResponse.results);
			}
		},
	},
	listItemRemoveRequest: {
		url: ({ params: { itemId } }) => `/contact-training/${itemId}/`,
		method: methods.DELETE,
		onSuccess: ({ params }) => {
			if (params && params.onListItemRemove && params.itemId) {
				params.onListItemRemove(params.itemId);
			}
		},
	},
};

class ContactTrainingList extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		const {
			requests: { listRequest },
		} = this.props;

		listRequest.setDefaultParams({
			onListGet: this.handleListGet,
		});

		this.headers = (language) => [
			{
				key: "title",
				label: language === "en" ? "title" : "शीर्षक",
				order: 1,
				modifier: (row: PageType.Training) =>
					language === "en" ? trainingValues[row.title] : trainingValuesNe[row.title],
			},
			{
				key: "durationDays",
				label: language === "en" ? "Duration In Days" : "दिन अवधि ",
				order: 2,
			},
			{
				key: "actions",
				label: language === "en" ? "Actions" : "कार्यहरु",
				order: 3,
				modifier: (row) => {
					const { id: rowKey } = row;

					return (
						<Translation>
							{(t) => (
								<div className={styles.actionButton}>
									<DangerConfirmButton
										iconName="delete"
										transparent
										confirmationMessage={t("Are you sure you want to delete this item?")}
										onClick={() => this.handleItemRemove(rowKey)}
									/>
								</div>
							)}
						</Translation>
					);
				},
			},
		];

		this.state = {
			list: [],
		};
	}

	private headers: Header<PageType.Training & ExtraHeader>[];

	private handleListGet = (list: PageType.Training[]) => {
		this.setState({ list });
	};

	private handleListItemAdd = (listItem: PageType.Training) => {
		const { list } = this.state;
		const { onListChange } = this.props;
		const newList = [...list, listItem];
		this.setState({ list: newList }, () => {
			onListChange(newList);
		});
	};

	private handleListItemRemoveSuccess = (itemId: number) => {
		const { list } = this.state;
		const { onListChange } = this.props;
		const itemIndex = list.findIndex((l: PageType.Training) => l.id === itemId);

		if (itemIndex === -1) {
			return;
		}

		const newList = [...list];
		newList.splice(itemIndex, 1);

		this.setState({ list: newList }, () => {
			onListChange(newList);
		});
	};

	private handleItemRemove = (rowKey: number) => {
		const {
			requests: { listItemRemoveRequest },
		} = this.props;

		listItemRemoveRequest.do({
			itemId: rowKey,
			onListItemRemove: this.handleListItemRemoveSuccess,
		});
	};

	public render() {
		const {
			className,
			contactId,
			requests: {
				listRequest: { pending: listPending },
				listItemRemoveRequest: { pending: itemRemovePending },
			},
			language: { language },
		} = this.props;

		const { list } = this.state;
		const pending = listPending || itemRemovePending;

		return (
			<Translation>
				{(t) => (
					<div className={_cs(styles.listContainer, className)}>
						{pending && <LoadingAnimation />}
						<header className={styles.header}>
							<h4 className={styles.heading}>{t("Contact Training")}</h4>
							<Cloak hiddenIf={(p) => !p.add_training}>
								<ModalAccentButton
									className={styles.button}
									transparent
									iconName="add"
									modal={
										<AddTraining
											contactId={contactId}
											onAddSuccess={this.handleListItemAdd}
											language={language}
										/>
									}>
									{t("Add Training")}
								</ModalAccentButton>
							</Cloak>
						</header>
						<Table
							className={styles.table}
							headers={this.headers(language)}
							data={list}
							keySelector={keySelector}
						/>
					</div>
				)}
			</Translation>
		);
	}
}

export default compose(createRequestClient(requests))(ContactTrainingList);
