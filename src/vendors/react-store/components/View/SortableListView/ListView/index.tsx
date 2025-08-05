import React from "react";
import PropTypes from "prop-types";
import { SortableContainer } from "react-sortable-hoc";

import NormalListView from "../../List/ListView";
import ListItem from "./ListItem";

class ListViewSortable extends React.Component {
	static propTypes = {
		data: PropTypes.array, // eslint-disable-line react/forbid-prop-types
		className: PropTypes.string,
		emptyComponent: PropTypes.func,
		keySelector: PropTypes.func,
		faramElement: PropTypes.bool,
		itemClassName: PropTypes.string,
	};

	static defaultProps = {
		data: [],
		keySelector: undefined,
		className: "",
		emptyComponent: undefined,
		faramElement: false,
		itemClassName: "",
	};

	rendererParams = (key, datum, index) => {
		const {
			data, // eslint-disable-line no-unused-vars
			className, // eslint-disable-line no-unused-vars
			keySelector, // eslint-disable-line no-unused-vars
			emptyComponent, // eslint-disable-line no-unused-vars
			itemClassName,
			...otherProps
		} = this.props;

		return {
			index, // required by Sortable HOC
			dataKey: key,
			dataIndex: index,
			data: datum,
			className: itemClassName,
			...otherProps,
		};
	};

	render() {
		const { data, className, keySelector, emptyComponent, faramElement } = this.props;

		return (
			<NormalListView
				className={className}
				emptyComponent={emptyComponent}
				data={data}
				keySelector={keySelector}
				renderer={ListItem}
				rendererParams={this.rendererParams}
				faramElement={faramElement}
			/>
		);
	}
}

// Important: wrap *after* declaration, not using decorator
export default SortableContainer(ListViewSortable);
