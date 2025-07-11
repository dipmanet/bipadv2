import React from "react";
import { _cs } from "@togglecorp/fujs";
import RangeInput from "react-input-range";
import rangeInputDefaultClassNames from "react-input-range/src/js/input-range/default-class-names";

import "react-input-range/lib/css/index.css";

import { Translation } from "react-i18next";
import styles from "./styles.module.scss";

interface Props {
	className?: string;
	inputKey: number;
	value: number;
	onChange: (key: number, value: number) => void;
}

interface State {
	value: number;
}

class OpacityInput extends React.PureComponent<Props, State> {
	private handleRangeInputChange = (value: number) => {
		const { inputKey, onChange } = this.props;

		onChange(inputKey, parseFloat(value.toFixed(1)));
	};

	public render() {
		const { className, value } = this.props;

		return (
			<Translation>
				{(t) => (
					<div className={_cs(styles.opacityInput, className)}>
						<div className={styles.label}>{t("Opacity")}:</div>
						<RangeInput
							classNames={{
								...rangeInputDefaultClassNames,
								inputRange: _cs(rangeInputDefaultClassNames.inputRange, styles.rangeInput),
								valueLabel: styles.valueLabel,
							}}
							minValue={0}
							maxValue={1}
							step={0.1}
							value={value}
							onChange={this.handleRangeInputChange}
						/>
						<div className={styles.value}>{value}</div>
					</div>
				)}
			</Translation>
		);
	}
}

export default OpacityInput;
