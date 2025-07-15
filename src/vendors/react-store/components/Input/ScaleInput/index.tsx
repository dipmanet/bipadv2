import React from "react";
import PropTypes from "prop-types";
import { isFalsy } from "@togglecorp/fujs";
import { FaramInputElement } from "@togglecorp/faram";

import List from "../../View/List";

import styles from "./styles.module.scss";

const propTypes = {
	className: PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	options: PropTypes.array,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	readOnly: PropTypes.bool,
	keySelector: PropTypes.func,
	labelSelector: PropTypes.func,
	colorSelector: PropTypes.func,
	isDefaultSelector: PropTypes.func,
};
const defaultProps = {
	className: "",
	options: [],
	value: undefined,
	onChange: () => {},
	disabled: false,
	readOnly: false,

	keySelector: (option) => option.key,
	labelSelector: (option) => option.label,
	colorSelector: (option) => option.color,
	isDefaultSelector: (option) => !!option.default,
};

class ScaleInput extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	constructor(props) {
		super(props);
		// FIXME: this kind of actions should be moved to Faram:computeSchema
		this.checkAndSetDefaultValue(props.options, props.value);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { options, disabled, readOnly } = this.props;

		if (
			nextProps.options !== options ||
			(!nextProps.disabled && nextProps.disabled !== disabled) ||
			(!nextProps.readOnly && nextProps.readOnly !== readOnly)
		) {
			this.checkAndSetDefaultValue(nextProps.options, nextProps.value);
		}
	}

	getClassName = () => {
		const { className, disabled, readOnly } = this.props;

		const classNames = [className, "scale-input", styles.scaleInput];

		if (disabled) {
			classNames.push("disabled");
			classNames.push(styles.disabled);
		}

		if (readOnly) {
			classNames.push("read-only");
			classNames.push(styles.readOnly);
		}

		return classNames.join(" ");
	};

	getOptionClassName = (key) => {
		const { value } = this.props;

		const classNames = [styles.value];

		// FIXME: there shouldn't be need for cast to string
		const isActive = String(key) === String(value);

		if (isActive) {
			classNames.push(styles.active);
		}

		return classNames.join(" ");
	};

	checkAndSetDefaultValue = (options, value) => {
		const { onChange, isDefaultSelector, keySelector, disabled, readOnly } = this.props;

		if (disabled || readOnly) {
			return;
		}

		const defaultOption = options.find((option) => isDefaultSelector(option));
		if (isFalsy(value, [""]) && !isFalsy(defaultOption, [""])) {
			onChange(keySelector(defaultOption));
		}
	};

	handleOptionClick = (key) => {
		const { value, onChange } = this.props;

		if (value !== key) {
			onChange(key);
		}
	};

	renderOption = (k, option) => {
		const { disabled, readOnly, colorSelector, keySelector, labelSelector } = this.props;

		const key = keySelector(option);
		const color = colorSelector(option);
		const label = labelSelector(option);

		const style = {
			backgroundColor: color,
		};

		const className = this.getOptionClassName(key);

		return (
			<button
				onClick={() => {
					this.handleOptionClick(key);
				}}
				type="button"
				key={key}
				className={className}
				title={label}
				disabled={disabled || readOnly}
				style={style}
			/>
		);
	};

	render() {
		const { options } = this.props;
		const className = this.getClassName();

		return (
			<div className={className}>
				<List data={options} modifier={this.renderOption} />
			</div>
		);
	}
}

export default FaramInputElement(ScaleInput);
