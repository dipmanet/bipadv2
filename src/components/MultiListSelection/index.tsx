import React from "react";
import { FaramInputElement } from "@togglecorp/faram";
import { _cs } from "@togglecorp/fujs";
import PropTypes from "prop-types";

import Button from "#rsca/Button";
import Label from "#rsci/Label";
import ListView from "#rscv/List/ListView";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import styles from "./styles.module.scss";

const propTypes = {
	options: PropTypes.array, // eslint-disable-line react/forbid-prop-types
	value: PropTypes.array, // eslint-disable-line react/forbid-prop-types
	onChange: PropTypes.func,
	className: PropTypes.string,
	showLabel: PropTypes.bool,
	label: PropTypes.string,
	labelSelector: PropTypes.func,
	keySelector: PropTypes.func,
	titleSelector: PropTypes.func,
	iconSelector: PropTypes.func,
};

const defaultProps = {
	labelSelector: (d) => d.label,
	keySelector: (d) => d.key,
	titleSelector: undefined,
	iconSelector: (d) => d.icon,
	label: "",
	showLabel: true,
	options: [],
	value: [],
	onChange: () => {},
	className: "",
};

const emptyArray = [];

@FaramInputElement
export default class MultiListSelection extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	getRendererParams = (index, option, options) => {
		const { labelSelector, iconSelector, keySelector, titleSelector, value } = this.props;

		const key = keySelector(option, index, options);

		return {
			label: labelSelector(option, index, options),
			icon: iconSelector(option, index, options),
			title: titleSelector ? titleSelector(option, index, options) : "",
			optionKey: key,
			className: styles.option,
			isActive: value.indexOf(key) !== -1,
		};
	};

	handleOptionClick = (optionKey) => {
		const { value, onChange } = this.props;

		const newValue = [...value];
		const optionIndex = value.findIndex((d) => d === optionKey);

		if (optionIndex === -1) {
			newValue.push(optionKey);
		} else {
			newValue.splice(optionIndex, 1);
		}

		onChange(newValue);
	};

	handleClearButtonClick = () => {
		const { onChange } = this.props;

		onChange(emptyArray);
	};

	renderOption = ({ label, icon, optionKey, className, isActive, title }) => (
		<div
			role="presentation"
			className={_cs(className, isActive && styles.active)}
			onClick={() => this.handleOptionClick(optionKey)}
			title={title}>
			{icon && <ScalableVectorGraphics className={styles.icon} src={icon} />}
			<div className={styles.title}>{label}</div>
		</div>
	);

	render() {
		const { className, options, label, showLabel, keySelector, value } = this.props;

		const showClearButton = value.length > 0;

		return (
			<div className={_cs(styles.multiListSelection, className)}>
				<div className={styles.headerContainer}>
					<Label className={styles.label} text={label} show={showLabel} />
					{showClearButton && (
						<Button
							className={styles.clearButton}
							onClick={this.handleClearButtonClick}
							transparent>
							Clear
						</Button>
					)}
				</div>
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
