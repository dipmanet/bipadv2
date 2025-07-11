import React from "react";
import Redux from "redux";
import { connect } from "react-redux";
import Faram from "@togglecorp/faram";
import { _cs } from "@togglecorp/fujs";

import { Translation } from "react-i18next";
import { AppState } from "#store/types";
import ListSelection from "#rsci/ListSelection";

import { setRealTimeFiltersAction } from "#actionCreators";
import { languageSelector, realTimeFiltersSelector } from "#selectors";

import styles from "./styles.module.scss";

const sourceKeySelector = (d: Source) => d.id;
const sourceLabelSelector = (d: Source, language: string) => {
	if (language === "en") {
		return d.title;
	}
	return d.titleNe;
};

interface Source {
	id: number;
	title: string;
	titleNe: string;
}

interface Language {
	language: "en" | "np";
}

interface OwnProps {
	className?: string;
	realTimeSourceList: Source[];
	otherSourceList: Source[];
	language: { language: "en" | "np" };
}

interface PropsFromAppState {
	filters: {
		faramValues: object;
		faramErrors: object;
	};
}

interface PropsFromDispatch {
	setFilters: ({
		faramValues,
		faramErrors,
		pristine,
	}: {
		faramValues: object;
		faramErrors: object;
		pristine: boolean;
	}) => void;
}

type Props = OwnProps & PropsFromAppState & PropsFromDispatch;

interface State {}

const mapStateToProps = (state: AppState) => ({
	filters: realTimeFiltersSelector(state),
	language: languageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setFilters: (params) => dispatch(setRealTimeFiltersAction(params)),
});

class RealTimeMonitoringFilter extends React.PureComponent<Props, State> {
	private static schema = {
		fields: {
			region: [],
			realtimeSources: [],
			otherSources: [],
		},
	};

	private handleFaramChange = (faramValues: object, faramErrors: object) => {
		this.props.setFilters({
			faramValues,
			faramErrors,
			pristine: false,
		});
	};

	private handleFaramFailure = (faramErrors: object) => {
		this.props.setFilters({
			faramErrors,
			pristine: true,
		});
	};

	public render() {
		const {
			className,
			filters: { faramValues, faramErrors },
			realTimeSourceList,
			otherSourceList,
			language: { language },
		} = this.props;
		return (
			<Faram
				className={_cs(className, styles.filter)}
				onChange={this.handleFaramChange}
				schema={RealTimeMonitoringFilter.schema}
				value={faramValues}
				error={faramErrors}
				disabled={false}>
				<Translation>
					{(t) => (
						<ListSelection
							label={t("Realtime layers")}
							className={styles.realTimeSourcesInput}
							faramElementName="realtimeSources"
							options={realTimeSourceList}
							keySelector={sourceKeySelector}
							labelSelector={(e: Source) => sourceLabelSelector(e, language)}
							showHintAndError={false}
							// autoFocus
						/>
					)}
				</Translation>
				<Translation>
					{(t) => (
						<ListSelection
							label={t("Other layers")}
							className={styles.otherSourcesInput}
							listClassName={styles.list}
							faramElementName="otherSources"
							options={otherSourceList}
							keySelector={sourceKeySelector}
							labelSelector={(e: Source) => sourceLabelSelector(e, language)}
							showHintAndError={false}
						/>
					)}
				</Translation>
			</Faram>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RealTimeMonitoringFilter);
