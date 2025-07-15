import PropTypes from "prop-types";
import React from "react";
import memoize from "memoize-one";
import { _cs, formatPdfText } from "@togglecorp/fujs";
import { FaramInputElement } from "@togglecorp/faram";

import AccentButton from "../../Action/Button/AccentButton";
import Delay from "../../General/Delay";
import { NormalTextArea as TextArea } from "../TextArea";

import styles from "./styles.module.scss";

const propTypes = {
	disabled: PropTypes.bool,
	className: PropTypes.string,
	onChange: PropTypes.func,
	required: PropTypes.bool,
	readOnly: PropTypes.bool,
	showFormatButton: PropTypes.bool,
	value: PropTypes.string,
};

const defaultProps = {
	disabled: false,
	className: "",
	readOnly: false,
	onChange: undefined,
	required: false,
	showFormatButton: true,
	value: undefined,
};

class FormattedTextArea extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	handleFormatText = () => {
		const { onChange, value } = this.props;

		const formattedText = formatPdfText(value);
		onChange(formattedText);
	};

	shouldDisableFormat = memoize((excerpt) => !excerpt || excerpt === formatPdfText(excerpt));

	render() {
		const { disabled, readOnly, className, showFormatButton, value, extraButtons, ...otherProps } =
			this.props;

		return (
			<div className={_cs(className, styles.formattedText)}>
				<TextArea
					{...otherProps}
					disabled={disabled}
					readOnly={readOnly}
					className={styles.area}
					value={value}
				/>
				<div className={styles.buttonContainer}>
					{extraButtons}
					{showFormatButton && (
						<AccentButton
							tabIndex="-1"
							className={styles.formatButton}
							iconName="textFormat"
							onClick={this.handleFormatText}
							title="Click here to format the text"
							smallVerticalPadding
							smallHorizontalPadding
							transparent
							disabled={disabled || readOnly || this.shouldDisableFormat(value)}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default FaramInputElement(Delay(FormattedTextArea));
