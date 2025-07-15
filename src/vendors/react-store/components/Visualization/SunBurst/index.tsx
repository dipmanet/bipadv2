import React, { PureComponent, Fragment } from "react";
import { select, event } from "d3-selection";
import { hierarchy, partition } from "d3-hierarchy";
import { arc } from "d3-shape";
import { interpolateArray } from "d3-interpolate";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { PropTypes } from "prop-types";
import { schemePaired } from "d3-scale-chromatic";
import { path } from "d3-path";
import SvgSaver from "svgsaver";
import { getColorOnBgColor, randomString, doesObjectHaveNoData } from "@togglecorp/fujs";

import Responsive from "../../General/Responsive";
import { getStandardFilename } from "../../../utils/common";
import Float from "../../View/Float";

import styles from "./styles.module.scss";

const propTypes = {
	/**
	 * Size of the parent element/component (passed by the Responsive hoc)
	 */
	boundingClientRect: PropTypes.shape({
		width: PropTypes.number,
		height: PropTypes.number,
	}).isRequired,
	/**
	 * Hierarchical data structure that can be computed to form a hierarchical layout
	 * <a href="https://github.com/d3/d3-hierarchy">d3-hierarchy</a>
	 */
	data: PropTypes.shape({
		name: PropTypes.string,
	}).isRequired,
	/**
	 * Handle save functionality
	 */
	setSaveFunction: PropTypes.func,
	/**
	 * Accessor function to return children of node
	 */
	childrenSelector: PropTypes.func,
	/**
	 * Select label for each node
	 */
	labelSelector: PropTypes.func.isRequired,
	/**
	 * Modify the tooltip content
	 */
	tooltipContent: PropTypes.func,
	/**
	 * Select a color for each node
	 */
	colorSelector: PropTypes.func,
	/**
	 * Select the value of each node
	 */
	valueSelector: PropTypes.func.isRequired,
	/**
	 * if true, a tooltip is shown
	 */
	showTooltip: PropTypes.bool,
	/**
	 * Array of colors as hex color codes
	 */
	colorScheme: PropTypes.arrayOf(PropTypes.string),
	/**
	 * Additional css classes passed from parent
	 */
	className: PropTypes.string,
	/**
	 * Margins for the chart
	 */
	margins: PropTypes.shape({
		top: PropTypes.number,
		right: PropTypes.number,
		bottom: PropTypes.number,
		left: PropTypes.number,
	}),
};

const defaultProps = {
	setSaveFunction: () => {},
	childrenSelector: (d) => d.children,
	colorScheme: schemePaired,
	colorSelector: undefined,
	tooltipContent: undefined,
	showTooltip: true,
	className: "",
	margins: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
};

const twoPi = 2 * Math.PI;
const tooltipOffset = { x: 10, y: 10 };
/**
 * SunBurst shows hierarchical data as a series of rings and slices. Each slice represents a
 * node of the tree structure. SunBurst can be thought as a multi level pie chart.
 */
class SunBurst extends PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	constructor(props) {
		super(props);
		if (props.setSaveFunction) {
			props.setSaveFunction(this.save);
		}
	}

	componentDidMount() {
		this.drawChart();
	}

	componentDidUpdate() {
		this.redrawChart();
	}

	getColor = (d) => {
		const { labelSelector, colorSelector } = this.props;

		if (colorSelector) {
			return colorSelector(d);
		}
		return this.colors(labelSelector(d.children ? d.data : d.parent.data));
	};

	save = () => {
		const svg = select(this.svg);
		const svgsaver = new SvgSaver();
		svgsaver.asSvg(svg.node(), `${getStandardFilename("sunburst", "graph")}.svg`);
	};

	calculateBounds = () => {
		const { margins, boundingClientRect } = this.props;

		const { width, height } = boundingClientRect;

		const { top, right, bottom, left } = margins;

		this.width = width - left - right;
		this.height = height - top - bottom;

		this.svgGroupTransformation = `translate(
            ${this.width / 2},
            ${this.height / 2}
        )`;
	};

	init = () => {
		const { colorScheme } = this.props;

		this.calculateBounds();

		this.radius = Math.min(this.width, this.height) / 2;

		this.x = scaleLinear().range([0, twoPi]).clamp(true);

		this.y = scaleLinear().range([0, this.radius]);

		this.colors = scaleOrdinal().range(colorScheme);

		this.arch = arc()
			.startAngle((d) => this.x(d.x0))
			.endAngle((d) => this.x(d.x1))
			.innerRadius((d) => Math.max(0, this.y(d.y0)))
			.outerRadius((d) => Math.max(0, this.y(d.y1)));
	};

	middleArcLine = (d) => {
		const halfPi = Math.PI / 2;
		const angles = [this.x(d.x0) - halfPi, this.x(d.x1) - halfPi];
		const r = Math.max(0, (this.y(d.y0) + this.y(d.y1)) / 2);

		const middleAngle = (angles[1] + angles[0]) / 2;
		const invertDirection = middleAngle > 0 && middleAngle < Math.PI;
		if (invertDirection) {
			angles.reverse();
		}

		const paths = path();
		paths.arc(0, 0, r, angles[0], angles[1], invertDirection);
		return paths.toString();
	};

	filterText = (d) => {
		if (d.depth === 0) {
			return false;
		}
		const CHAR_SPACE = 6;
		const deltaAngle = this.x(d.x1) - this.x(d.x0);
		const r = Math.max(0, (this.y(d.y0) + this.y(d.y1)) / 2);
		const perimeter = r * deltaAngle;

		return d.data.name.length * CHAR_SPACE < perimeter;
	};

	handleClick = (d = { x0: 0, x1: 1, y0: 0, y1: 1 }) => {
		const transitions = select(this.svg)
			.transition()
			.duration(750)
			.tween("scale", () => {
				const xd = interpolateArray(this.x.domain(), [d.x0, d.x1]);
				const yd = interpolateArray(this.y.domain(), [d.y0, 1]);
				const yr = interpolateArray(this.y.range(), [d.y0 ? 20 : 0, this.radius]);
				return (t) => {
					this.x.domain(xd(t));
					this.y.domain(yd(t)).range(yr(t));
				};
			});

		transitions.selectAll("path.main-arc").attrTween("d", (t) => () => this.arch(t));

		transitions.selectAll("path.hidden-arc").attrTween("d", (t) => () => this.middleArcLine(t));

		transitions
			.selectAll("text")
			.attrTween("display", (t) => () => this.filterText(t) ? null : "none");

		this.moveStackToFront(d);
	};

	handleArcMouseOver = (d) => {
		const { tooltipContent, labelSelector, showTooltip } = this.props;

		if (showTooltip) {
			const defaultTooltipContent = `
            <span class="${styles.label}">
                 ${labelSelector(d.data) || ""}
            </span>
            <span class="${styles.value}">
                 ${d.value || ""}
            </span>`;

			const content = tooltipContent ? tooltipContent(d) : defaultTooltipContent;

			this.tooltip.innerHTML = content;

			const { style } = this.tooltip;
			style.display = "block";
		}
	};

	handleArcMouseMove = () => {
		const { style } = this.tooltip;

		const { height, width } = this.tooltip.getBoundingClientRect();

		style.top = `${event.pageY - height - tooltipOffset.y}px`;
		style.left = `${event.pageX - width / 2}px`;
	};

	handleArcMouseOut = () => {
		const { style } = this.tooltip;
		style.display = "none";
	};

	moveStackToFront = (t) => {
		select(this.svg)
			.selectAll(".slice")
			.filter((d) => d === t)
			.each((d, i, nodes) => {
				nodes[i].parentNode.appendChild(nodes[i]);
				if (d.parent) {
					this.moveStackToFront(d.parent);
				}
			});
	};

	drawChart = () => {
		const { boundingClientRect, data, childrenSelector, labelSelector, valueSelector } = this.props;

		if (!boundingClientRect.width || doesObjectHaveNoData(data)) {
			return;
		}

		this.init();
		const uniqueId = randomString(16);

		const { width, height } = boundingClientRect;

		const svg = select(this.svg);

		const group = svg
			.attr("width", width)
			.attr("height", height)
			.on("click", this.handleClick)
			.append("g")
			.attr("transform", this.svgGroupTransformation);

		const root = hierarchy(data, childrenSelector).sum((d) => valueSelector(d));
		const partitions = partition()(root);
		const slicesData = partitions.descendants();

		const slices = group.selectAll("g.slice").data(slicesData);

		slices.exit().remove();

		const newSlice = slices
			.enter()
			.append("g")
			.attr("class", "slice")
			.on("click", (d) => {
				event.stopPropagation();
				this.handleClick(d);
			});

		newSlice
			.append("path")
			.attr("class", "main-arc")
			.style("fill", (d) => this.getColor(d))
			.attr("d", this.arch)
			.style("cursor", "pointer")
			.style("stroke-width", (d) => d.height + 2)
			.style("stroke", "white")
			.on("mouseover", this.handleArcMouseOver)
			.on("mousemove", this.handleArcMouseMove)
			.on("mouseout", this.handleArcMouseOut)
			.style("fill", (d) => this.colors(labelSelector(d.children ? d.data : d.parent.data)))
			.style("cursor", "pointer")
			.on("click", (d) => this.handleClick(d));

		newSlice
			.append("path")
			.attr("class", "hidden-arc")
			.style("fill", "none")
			.attr("id", (_, i) => `${uniqueId}-hiddenArc${i}`)
			.attr("d", this.middleArcLine);

		const text = newSlice
			.append("text")
			.attr("display", (d) => (this.filterText(d) ? null : "none"))
			.style("pointer-events", "none");

		text
			.append("textPath")
			.attr("startOffset", "50%")
			.attr("text-anchor", "middle")
			.attr("xlink:href", (_, i) => `#${uniqueId}-hiddenArc${i}`)
			.text((d) => labelSelector(d.data))
			.style("fill", (d) => {
				const colorBg = this.getColor(d);
				return getColorOnBgColor(colorBg);
			});
	};

	redrawChart = () => {
		const context = select(this.svg);
		context.selectAll("*").remove();
		this.drawChart();
	};

	render() {
		const { className } = this.props;
		const svgClassName = ["sunburst", styles.sunburst, className].join(" ");

		const tooltipClassName = ["sunburst-tooltip", styles.sunburstTooltip].join(" ");

		return (
			<Fragment>
				<svg
					ref={(elem) => {
						this.svg = elem;
					}}
					className={svgClassName}
				/>
				<Float>
					<div
						ref={(el) => {
							this.tooltip = el;
						}}
						className={tooltipClassName}
					/>
				</Float>
			</Fragment>
		);
	}
}

export default Responsive(SunBurst);
