import PropTypes from "prop-types";
import React from "react";
import { listToMap, isFalsy, _cs } from "@togglecorp/fujs";
import { FaramInputElement } from "@togglecorp/faram";

import DangerButton from "../../Action/Button/DangerButton.tsx";
import MultiSelectInput from "../MultiSelectInput/index.tsx";
import Table from "../../View/Table";

import HintAndError from "../HintAndError/index.tsx";

import styles from "./styles.module.scss";

/**
 * comparator: comparator function for sorting, recieves data rows(not column data)
 *
 * defaultSortOrder: the sort order which should be applied when clicked,
 *
 * key: unique key for each column, the key is also used to determine
 *      the data for rows in the body
 *
 * label: text label for the column
 *
 * modifier: returns a renderable object for the column, recieves whole row of data (not column)
 *
 * order: the order in which they appear relative to that of other header columns
 *
 * sortable: is element sortable?
 */
const TableHeaderPropTypes = PropTypes.arrayOf(
	PropTypes.shape({
		comparator: PropTypes.func,
		defaultSortOrder: PropTypes.string,
		key: PropTypes.string,
		label: PropTypes.string,
		modifier: PropTypes.func,
		order: PropTypes.number,
		sortable: PropTypes.bool,
	})
);

const propTypes = {
	blackList: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.arrayOf(PropTypes.number),
	]),

	/**
	 * Key selector function
	 * should return key from provided row data
	 */
	keySelector: PropTypes.func,

	onChange: PropTypes.func,

	value: PropTypes.arrayOf(PropTypes.object),

	/**
	 * String to show in case of error
	 */
	error: PropTypes.string,

	/**
	 * Hint text
	 */
	hint: PropTypes.string,

	showHintAndError: PropTypes.bool,

	disabled: PropTypes.bool,
	readOnly: PropTypes.bool,

	/**
	 * Value selector function
	 * should return value from provided row data
	 */
	labelSelector: PropTypes.func,

	hideRemoveFromListButton: PropTypes.bool,

	className: PropTypes.string,
	/**
	 * Options to be shown
	 */
	options: PropTypes.arrayOf(PropTypes.object),

	/**
	 * headers is an array of the structure objects required for the header
	 *
	 * NOTE: see { TableHeaderPropTypes } in Table/Header for more detail
	 */
	tableHeaders: TableHeaderPropTypes,
};

const defaultProps = {
	className: "",
	keySelector: (d) => (d || {}).key,
	labelSelector: (d) => (d || {}).label,
	onChange: undefined,
	hideRemoveFromListButton: false,
	error: "",
	hint: "",
	options: [],
	blackList: [],
	value: [],
	disabled: false,
	readOnly: false,
	showHintAndError: true,
	tableHeaders: [],
};

class TabularSelectInput extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	constructor(props) {
		super(props);

		const { options, blackList, keySelector, tableHeaders, value } = this.props;

		const selectedOptions = this.getSelectedOptions(value, keySelector, blackList, options);
		const tableHeadersWithRemove = this.createTableHeaders(tableHeaders);
		const validOptions = this.getValidOptions(options, keySelector, blackList);
		const selectedOptionsKeys = selectedOptions.map((d) => keySelector(d));

		this.state = {
			validOptions,
			tableHeadersWithRemove,
			selectedOptions,
			selectedOptionsKeys,
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { tableHeaders, blackList, options, value } = this.props;

		if (nextProps.tableHeaders !== tableHeaders) {
			const tableHeadersWithRemove = this.createTableHeaders(nextProps.tableHeaders);
			this.setState({ tableHeadersWithRemove });
		}

		if (nextProps.blackList !== blackList || nextProps.options !== options) {
			const validOptions = this.getValidOptions(
				nextProps.options,
				nextProps.keySelector,
				nextProps.blackList
			);
			this.setState({
				validOptions,
			});
		}

		if (nextProps.value !== value) {
			const selectedOptions = this.getSelectedOptions(
				nextProps.value,
				nextProps.keySelector,
				blackList,
				nextProps.options
			);
			const selectedOptionsKeys = selectedOptions.map((d) => nextProps.keySelector(d));

			this.setState({
				selectedOptions,
				selectedOptionsKeys,
			});
		}
	}

	getClassName = () => {
		const { className } = this.props;
		const { error } = this.state;

		const classNames = [className, styles.tabularSelectInput, "tabular-select-input"];

		if (!isFalsy(error, [""])) {
			classNames.push(styles.error);
			classNames.push("error");
		}

		return classNames.join(" ");
	};

	getSelectedOptions = (values, keySelector, blackList, options) => {
		const blackListMap = listToMap(
			blackList,
			(d) => d,
			() => true
		);
		const optionsMap = listToMap(options, (d) => keySelector(d));

		const selectedOptions = values
			.map((v) => ({
				...optionsMap[keySelector(v)],
				...v,
			}))
			.filter((value) => !blackListMap[keySelector(value)]);

		return selectedOptions;
	};

	getValidOptions = (options, keySelector, blackList) => {
		const blackListMap = listToMap(
			blackList,
			(d) => d,
			() => true
		);

		const validOptions = options.filter((option) => !blackListMap[keySelector(option)]);
		return validOptions;
	};

	createTableHeaders = (tableHeaders) => {
		const { hideRemoveFromListButton } = this.props;

		if (hideRemoveFromListButton) {
			return tableHeaders;
		}

		return [
			...tableHeaders,
			{
				key: "delete-action-included",
				label: "Remove",
				modifier: (row) => (
					<DangerButton
						className="delete-button"
						onClick={() => this.handleRemoveButtonClick(row)}
						iconName="delete"
						smallVerticalPadding
						transparent
						disabled={this.props.disabled || this.props.readOnly}
					/>
				),
			},
		];
	};

	handleSelectInputChange = (values) => {
		const { keySelector, onChange } = this.props;
		const { validOptions } = this.state;

		const selectedOptions = [];
		values.forEach((v) => {
			const rowIndex = validOptions.findIndex((u) => keySelector(u) === v);
			if (rowIndex !== -1) {
				selectedOptions.push(validOptions[rowIndex]);
			}
		});
		const selectedOptionsKeys = selectedOptions.map((d) => keySelector(d));

		this.setState(
			{
				selectedOptions,
				selectedOptionsKeys,
			},
			() => {
				if (onChange) {
					onChange(selectedOptions);
				}
			}
		);
	};

	handleRemoveButtonClick = (row) => {
		const { keySelector, onChange } = this.props;
		const { selectedOptions } = this.state;

		// Remove from selectedOptions
		const removedElementKey = keySelector(row);
		const index = selectedOptions.findIndex((d) => keySelector(d) === removedElementKey);
		const selectedOptionsNew = [...selectedOptions];
		selectedOptionsNew.splice(index, 1);

		const selectedOptionsKeys = selectedOptionsNew.map((d) => keySelector(d));

		this.setState(
			{
				selectedOptions: selectedOptionsNew,
				selectedOptionsKeys,
			},
			() => {
				if (onChange) {
					onChange(selectedOptionsNew);
				}
			}
		);
	};

	render() {
		const {
			keySelector,
			labelSelector,
			error,
			hint,
			showHintAndError,
			disabled,
			onChange, // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
			value, // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
			options, // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
			className, // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
			...otherProps
		} = this.props;

		const { selectedOptions, selectedOptionsKeys, validOptions, tableHeadersWithRemove } =
			this.state;

		return (
			<div className={this.getClassName()}>
				<MultiSelectInput
					className={styles.select}
					value={selectedOptionsKeys}
					options={validOptions}
					keySelector={keySelector}
					labelSelector={labelSelector}
					onChange={this.handleSelectInputChange}
					disabled={disabled}
					error={error}
					showHintAndError={false}
					{...otherProps}
				/>
				<div className={_cs(styles.tableContainer, "table-container")}>
					<Table
						data={selectedOptions}
						headers={tableHeadersWithRemove}
						keySelector={keySelector}
					/>
				</div>
				<HintAndError show={showHintAndError} hint={hint} error={error} />
			</div>
		);
	}
}

export default FaramInputElement(TabularSelectInput);
