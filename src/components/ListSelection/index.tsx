import React from "react";
import { FaramInputElement } from "@togglecorp/faram";
import { _cs } from "@togglecorp/fujs";
import PropTypes from "prop-types";

import Button from "#rsca/Button";
import Delay from "#rscg/Delay";
import Label from "#rsci/Label";
import ListView from "#rscv/List/ListView";
import styles from "./styles.module.scss";

const propTypes = {
	options: PropTypes.array,
	className: PropTypes.string,
	showLabel: PropTypes.bool,
	labelSelector: PropTypes.func,
	keySelector: PropTypes.func,
	iconSelector: PropTypes.func,
};

const defaultProps = {
	labelSelector: (d) => d.label,
	keySelector: (d) => d.key,
	iconSelector: (d) => d.icon,
	showLabel: true,
	options: [],
	className: "",
};

@FaramInputElement
@Delay
export default class ListSelection extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	getRendererParams = (index, option, options) => {
		const { labelSelector, iconSelector, keySelector, value } = this.props;

		const key = keySelector(option, index, options);

		return {
			label: labelSelector(option, index, options),
			icon: iconSelector(option, index, options),
			optionKey: key,
			className: styles.option,
			isActive: key === value,
		};
	};

	handleOptionClick = ({ params: { optionKey } }) => {
		const { onChange } = this.props;
		onChange(optionKey);
	};

	renderOption = ({ label, icon, optionKey, className, isActive }) => (
		<Button
			className={_cs(className, isActive && styles.active)}
			transparent
			onClickParams={{ optionKey }}
			onClick={this.handleOptionClick}>
			{icon && <img className={styles.icon} src={icon} alt={label} />}
			<div className={styles.title}>{label}</div>
		</Button>
	);

	render() {
		const { className, options, label, showLabel, keySelector } = this.props;

		return (
			<div className={_cs(styles.listSelection, className)}>
				<Label className={styles.label} text={label} show={showLabel} />
				<ListView
					className={styles.options}
					data={options}
					renderer={this.renderOption}
					rendererParams={this.getRendererParams}
					keySelector={keySelector}
				/>
			</div>
		);
	}
}
