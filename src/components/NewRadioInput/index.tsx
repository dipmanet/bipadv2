import React, { useMemo, useCallback } from "react";
import { _cs, randomString } from "@togglecorp/fujs";

import Label from "#rsci/Label";
import ListView from "#rsu/../v2/View/ListView";
import { OptionKey } from "#rsu/../v2/types";

import RadioOption from "./RadioOption";

import styles from "./styles.module.scss";

interface Props<T, K extends OptionKey> {
	className?: string;
	options: T[];
	label?: string;
	value?: K;
	onChange?: (key: K) => void;
	hideLabel: boolean;
	error?: string;
	disabled: boolean;
	readOnly: boolean;
	optionKeySelector: (data: T) => K;
	optionLabelSelector: (data: T) => string;
}

function RadioInput<T, K extends OptionKey>(props: Props<T, K>) {
	const {
		className,
		disabled,
		error,
		hideLabel,
		label,
		onChange,
		optionKeySelector,
		optionLabelSelector,
		options,
		readOnly,
		value,
	} = props;

	const inputName = useMemo(() => randomString(), []);

	const getRendererParams = useCallback(
		(_: K, data: T) => {
			const optionKey = optionKeySelector(data);

			return {
				inputName,
				optionKey,
				label: optionLabelSelector(data),
				onClick: onChange,
				disabled,
				readOnly,
				checked: optionKey === value,
			};
		},
		[optionKeySelector, optionLabelSelector, value, disabled, readOnly, onChange]
	);

	return (
		<div className={_cs(styles.newRadioInput, className)}>
			<Label show={!hideLabel} text={label} error={error} disabled={disabled} />
			<ListView
				className={styles.optionList}
				data={options}
				renderer={RadioOption}
				rendererParams={getRendererParams}
				keySelector={optionKeySelector}
			/>
		</div>
	);
}
RadioInput.defaultProps = {
	disabled: false,
	readOnly: false,
	hideLabel: false,
};

export default RadioInput;
