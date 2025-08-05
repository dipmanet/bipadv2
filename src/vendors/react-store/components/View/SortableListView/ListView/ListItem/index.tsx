import React from "react";
import { SortableElement } from "react-sortable-hoc";
import { _cs } from "@togglecorp/fujs";

import ItemDrag from "./ItemDrag";
import styles from "./styles.module.scss";

interface Props {
	data: Record<string, unknown>;
	dataIndex: number;
	dataKey: string | number;

	showDragHandle?: boolean;
	dragIconPosition?: "left" | "right";
	className?: string;

	renderer: React.ComponentType<any>;
	rendererParams?: (key: string | number, data: any, index: number) => Record<string, unknown>;
	rendererClassName?: string;

	dragHandleClassName?: string;
}

const ListItem = ({
	data,
	dataKey,
	dataIndex,

	showDragHandle = true,
	dragIconPosition = "left",
	className: classNameFromProps = "",

	renderer: Renderer,
	rendererParams,
	rendererClassName = "",

	dragHandleClassName = "",
	...otherProps
}: Props) => {
	const dragHandle = (
		<ItemDrag
			dataKey={dataKey}
			data={data}
			dataIndex={dataIndex}
			className={dragHandleClassName}
			{...otherProps}
		/>
	);

	const className = _cs(styles.sortableItem, classNameFromProps, "sortable-item");
	const extraProps = rendererParams ? rendererParams(dataKey, data, dataIndex) : undefined;

	return (
		<div className={className}>
			{showDragHandle && dragIconPosition === "left" && dragHandle}
			<Renderer className={rendererClassName} key={dataKey} {...extraProps} />
			{showDragHandle && dragIconPosition === "right" && dragHandle}
		</div>
	);
};

// Must wrap the function before export to use SortableElement HOC
export default SortableElement(ListItem);
