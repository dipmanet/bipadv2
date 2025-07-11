import React from "react";
import { _cs, bound } from "@togglecorp/fujs";
import memoize from "memoize-one";
import PropTypes from "prop-types";

import SparkLine from "#rscz/SparkLine";
import { groupFilledList } from "#utils/common";
import styles from "./styles.module.scss";

const propTypes = {
	start: PropTypes.number,
	end: PropTypes.number,
};

const defaultProps = {
	start: 0,
	end: 0,
};

const emptyList = [];
const DAY = 1000 * 60 * 60 * 24;

export default class Seekbar extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	constructor(props) {
		super(props);

		this.containerRef = React.createRef();
	}

	groupByIncidentCount = memoize((incidentList, metric, metricName) => {
		if (incidentList.length === 0) {
			return emptyList;
		}

		const mappedList = incidentList.map((incident) => ({
			value: metric(incident),
			label: (
				<div>
					<div>
						{metricName}
						:&nbsp;
						<strong>{metric(incident)}</strong>
					</div>
					<div>
						Date:
						{new Date(incident.key * DAY).toLocaleDateString()}
					</div>
				</div>
			),
		}));
		return mappedList;
	});

	handleClick = (e) => {
		const { current: container } = this.containerRef;
		const { onClick } = this.props;

		if (container) {
			const bcr = container.getBoundingClientRect();
			const left = e.pageX - bcr.left;
			const { width } = bcr;

			const seekPercentage = 100 * (left / width);
			onClick(seekPercentage);
		}
	};

	render() {
		const {
			className,
			data,
			end: endFromProps,
			metric,
			metricName,
			start: startFromProps,
		} = this.props;

		const start = bound(0, 100, startFromProps);
		const end = bound(0, 100, endFromProps);
		const groupedIncidents = this.groupByIncidentCount(data, metric, metricName);

		return (
			<div
				ref={this.containerRef}
				className={_cs(className, styles.seekbar)}
				role="presentation"
				onClick={this.handleClick}>
				<div className={styles.graphContainer}>
					<SparkLine
						circleRadius={3}
						className={styles.sparkLine}
						data={groupedIncidents}
						tooltipRenderer={(d) => d.label}
					/>
				</div>
				<div
					style={{
						left: `${start}%`,
						width: `${end - start}%`,
					}}
					className={styles.progress}
				/>
			</div>
		);
	}
}
