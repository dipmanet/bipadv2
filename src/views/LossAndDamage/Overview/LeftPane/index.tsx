import React from "react";
import { _cs } from "@togglecorp/fujs";
import PropTypes from "prop-types";

import styles from "./styles.module.scss";

import LossDetails from "#components/LossDetails";
import { iconNames } from "#constants";
import Button from "#rsca/Button";
import Icon from "#rscg/Icon";
import FormattedDate from "#rscv/FormattedDate";
import Visualizations from "./Visualizations";

const propTypes = {
	className: PropTypes.string,
};

const defaultProps = {
	className: undefined,
};

const emptyList = [];

export default class LeftPane extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	constructor(props) {
		super(props);

		this.state = {
			isExpanded: true,
			showTabularView: false,
		};
	}

	handleExpandChange = (isExpanded) => {
		this.setState({ isExpanded });

		const { onExpandChange } = this.props;
		if (onExpandChange) {
			onExpandChange(isExpanded);
		}
	};

	handleCollapseButtonClick = () => {
		this.handleExpandChange(false);
	};

	handleExpandButtonClick = () => {
		this.handleExpandChange(true);
	};

	handleShowTabularButtonClick = () => {
		this.setState((state) => ({ showTabularView: !state.showTabularView }));
	};

	renderHeader = () => (
		<header className={styles.header}>
			<h3 className={styles.heading}>Summary</h3>
			<Button
				className={styles.showTabularButton}
				onClick={this.handleShowTabularButtonClick}
				iconName={this.state.showTabularView ? iconNames.chevronUp : iconNames.expand}
				title="Show detailed view"
				transparent
			/>
			{!this.state.showTabularView && (
				<Button
					className={styles.collapseButton}
					onClick={this.handleCollapseButtonClick}
					iconName={iconNames.chevronUp}
					title="Collapse overview"
					transparent
				/>
			)}
		</header>
	);

	render() {
		const {
			className,
			lossAndDamageList = emptyList,
			pending,
			rightPaneExpanded,
			minDate,
		} = this.props;

		return (
			<div className={_cs(className, styles.leftPane)}>
				<LossDetails className={styles.lossDetails} data={lossAndDamageList} />
				<div className={styles.info}>
					<Icon className={styles.icon} name="info" />
					<div className={styles.content}>
						Data available from &nbsp;
						<FormattedDate value={minDate} mode="yyyy-MM-dd" />
					</div>
				</div>
				<Visualizations className={styles.visualizations} lossAndDamageList={lossAndDamageList} />
			</div>
		);
	}
}
