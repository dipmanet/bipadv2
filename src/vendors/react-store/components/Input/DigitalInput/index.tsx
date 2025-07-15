import PropTypes from "prop-types";
import React from "react";
import { padStart, isFalsy, _cs } from "@togglecorp/fujs";

import RawInput from "../RawInput";

import styles from "./styles.module.scss";

const propTypes = {
	onChange: PropTypes.func,
	value: PropTypes.string,
	padLength: PropTypes.number,
	className: PropTypes.string,
};
const defaultProps = {
	value: "",
	onChange: undefined,
	padLength: 2,
	className: "",
};

export default class DigitalInput extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	static padAndTrim = (value, padLength) => {
		if (isFalsy(value, [""])) {
			return "";
		}
		return padStart(+value % 10 ** padLength, padLength, "0");
	};

	static getNewValue = (newValue, oldValue, padLength) => {
		// NOTE: to identify a backspace, we look at the length of
		// old value and new value. (New value will be shorter than old value)
		// However, when value is changed from arrows in number input,
		// this algorithm cannot differentiate between the two.
		if (
			isFalsy(newValue, [""]) ||
			(oldValue !== undefined && oldValue.length > newValue.length && newValue.match(/^0+$/))
		) {
			return "";
		}
		const newerValue = DigitalInput.padAndTrim(newValue, padLength);
		return newerValue;
	};

	handleChange = (event) => {
		const { value } = event.target;
		const { value: valueFromProps, padLength, onChange } = this.props;

		if (onChange) {
			const newValue = DigitalInput.getNewValue(value, valueFromProps, padLength);
			onChange(newValue);
		}
	};

	render() {
		const {
			className: classNameFromProps,
			onChange, // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
			padLength, // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
			...otherProps
		} = this.props;

		const className = _cs(classNameFromProps, "digital-input", styles.digitalInput);

		return (
			<RawInput className={className} type="number" onChange={this.handleChange} {...otherProps} />
		);
	}
}
