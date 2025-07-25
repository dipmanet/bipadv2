import PropTypes from "prop-types";
import React from "react";
import { isTruthy } from "@togglecorp/fujs";

import List from "../../../List";

import Cell from "../Cell";
import styles from "./styles.module.scss";

const propTypeKey = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

const propTypes = {
	areCellsHoverable: PropTypes.bool,

	className: PropTypes.string,

	dataModifier: PropTypes.func,

	headersOrder: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
		.isRequired,

	highlightCellKey: propTypeKey,
	// eslint-disable-next-line react/forbid-prop-types
	highlightColumnKeys: PropTypes.object,
	highlighted: PropTypes.bool,

	hoverable: PropTypes.bool,

	onClick: PropTypes.func,
	onHover: PropTypes.func,
	onHoverOut: PropTypes.func,

	rowData: PropTypes.shape({
		dummy: PropTypes.string,
	}).isRequired,

	uniqueKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const defaultProps = {
	areCellsHoverable: false,
	className: "",
	dataModifier: undefined,
	highlightCellKey: undefined,
	highlightColumnKeys: undefined,
	highlighted: false,
	hoverable: false,
	onClick: undefined,
	onHover: undefined,
	onHoverOut: undefined,
};

export default class Row extends React.Component {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	getClassName = (hoverable, highlighted, className) => {
		const classNames = [];

		// default className for global override
		classNames.push("row");
		classNames.push(styles.row);

		// className provided by parent (through className)
		classNames.push(className);

		if (hoverable) {
			classNames.push("hoverable");
			classNames.push(styles.hoverable);
		}

		if (highlighted) {
			classNames.push("highlighted");
			classNames.push(styles.highlighted);
		}

		return classNames.join(" ");
	};

	handleCellClick = (key, e) => {
		const { onClick, uniqueKey } = this.props;

		if (onClick) {
			onClick(uniqueKey, key, e);
		}
	};

	handleCellHover = (key, e) => {
		const { onHover, uniqueKey } = this.props;

		if (onHover) {
			onHover(uniqueKey, key, e);
		}
	};

	keySelector = (header) => header;

	renderCell = (key) => {
		const {
			areCellsHoverable,
			dataModifier,
			highlightCellKey,
			highlightColumnKeys,
			onHoverOut,
			rowData,
		} = this.props;

		const data = dataModifier
			? dataModifier(rowData, key) // FIXME: can be optimized
			: rowData[key];

		return (
			<Cell
				key={key}
				uniqueKey={key}
				onClick={this.handleCellClick}
				onHover={this.handleCellHover}
				onHoverOut={onHoverOut}
				hoverable={areCellsHoverable}
				highlighted={isTruthy(key) && key === highlightCellKey}
				columnHighlighted={
					isTruthy(key) && isTruthy(highlightColumnKeys) && highlightColumnKeys[key]
				}>
				{data}
			</Cell>
		);
	};

	render() {
		const { headersOrder, hoverable, highlighted, className } = this.props;
		const trClassName = this.getClassName(hoverable, highlighted, className);

		return (
			<tr className={trClassName}>
				<List data={headersOrder} keySelector={this.keySelector} modifier={this.renderCell} />
			</tr>
		);
	}
}
