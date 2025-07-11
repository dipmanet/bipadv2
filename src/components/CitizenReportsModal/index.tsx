import React from "react";
import { _cs, Obj } from "@togglecorp/fujs";
import { connect } from "react-redux";

import { Translation } from "react-i18next";
import ListView from "#rscv/List/ListView";
import DangerButton from "#rsca/Button/DangerButton";
import Modal from "#rscv/Modal";
import ModalBody from "#rscv/Modal/Body";
import ModalHeader from "#rscv/Modal/Header";

import * as PageType from "#store/atom/page/types";
import { AppState } from "#store/types";
import { CitizenReport } from "#types";
import { createRequestClient, NewProps, ClientAttributes, methods } from "#request";
import { hazardTypesSelector } from "#selectors";

import { MultiResponse } from "#store/atom/response/types";
import CitizenReportItem from "./CitizenReportItem";
import styles from "./styles.module.scss";

const keySelector = (c: CitizenReport) => c.id;

interface OwnProps {
	className?: string;
	closeModal?: () => void;
}

interface StateProps {
	hazardTypes: Obj<PageType.HazardType>;
}

type ReduxProps = OwnProps & StateProps;

interface State {
	incidents: PageType.Incident[];
	citizenReports: CitizenReport[];
	expandedReport?: CitizenReport["id"];
}

interface Params {
	onSuccess?: (incidents: PageType.Incident[]) => void;
	setCitizenReports?: (citizenReports: CitizenReport[]) => void;
}

type Props = NewProps<ReduxProps, Params>;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	citizenReportsGetRequest: {
		url: "/citizen-report/",
		method: methods.GET,
		onMount: true,
		onSuccess: ({ response, params }) => {
			let citizenReportList: CitizenReport[] = [];
			const citizenReportsResponse = response as MultiResponse<CitizenReport>;
			citizenReportList = citizenReportsResponse.results;
			if (params && params.setCitizenReports) {
				params.setCitizenReports(citizenReportList);
			}
		},
	},
	incidentsGetRequest: {
		url: "/incident/",
		method: methods.GET,
		query: () => {
			const today = new Date();
			const oneWeekAgo = new Date(new Date().setDate(today.getDate() - 7));
			return {
				fields: ["id", "title"],
				// eslint-disable-next-line @typescript-eslint/camelcase
				incident_on__lt: today.toISOString(),
				// eslint-disable-next-line @typescript-eslint/camelcase
				incident_on__gt: oneWeekAgo.toISOString(),
			};
		},
		onSuccess: ({ params, response }) => {
			if (params && params.onSuccess) {
				const incidentsResponse = response as MultiResponse<PageType.Incident>;
				const { onSuccess } = params;
				onSuccess(incidentsResponse.results);
			}
		},
		onMount: true,
	},
};

class CitizenReportsModal extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			incidents: [],
			citizenReports: [],
			expandedReport: undefined,
		};

		const {
			requests: { incidentsGetRequest, citizenReportsGetRequest },
		} = this.props;

		incidentsGetRequest.setDefaultParams({
			onSuccess: this.setIncidents,
		});

		citizenReportsGetRequest.setDefaultParams({
			setCitizenReports: this.setCitizenReports,
		});
	}

	private setIncidents = (list: PageType.Incident[]) => {
		this.setState({
			incidents: list,
		});
	};

	private setCitizenReports = (list: CitizenReport[]) => {
		this.setState({ citizenReports: list });
	};

	private setExpandedReport = (expandedReport?: CitizenReport["id"]) => {
		this.setState({ expandedReport });
	};

	private rendererParams = (_: number, data: CitizenReport) => ({
		data,
		hazardTypes: this.props.hazardTypes,
		isExpandedReport: data.id === this.state.expandedReport,
		setExpandedReport: this.setExpandedReport,
		incidents: this.state.incidents,
		incidentsGetPending: this.props.requests.incidentsGetRequest.pending,
	});

	public render() {
		const {
			className,
			closeModal,
			handledisableOutsideDivClick,
			requests: {
				citizenReportsGetRequest: { pending },
			},
		} = this.props;

		const { citizenReports } = this.state;

		return (
			<Translation>
				{(t) => (
					<Modal className={_cs(styles.citizenReportsModal, className)}>
						<ModalHeader
							title={t("Citizen Reports")}
							rightComponent={
								<DangerButton
									transparent
									iconName="close"
									onClick={() => {
										handledisableOutsideDivClick(false);
										closeModal();
									}}
									title="Close Modal"
								/>
							}
						/>
						<ModalBody className={styles.modalBody}>
							<ListView
								className={styles.citizenReportList}
								data={citizenReports}
								keySelector={keySelector}
								renderer={CitizenReportItem}
								rendererParams={this.rendererParams}
								pending={pending}
							/>
						</ModalBody>
					</Modal>
				)}
			</Translation>
		);
	}
}

const mapStateToProps = (state: AppState): StateProps => ({
	hazardTypes: hazardTypesSelector(state),
});

export default connect(mapStateToProps)(createRequestClient(requests)(CitizenReportsModal));
