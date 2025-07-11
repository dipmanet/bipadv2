import React from "react";
import { connect } from "react-redux";
import memoize from "memoize-one";
import { ResponsiveContainer, PieChart, Label, Tooltip, Pie, Cell, Sector } from "recharts";
import CustomChartLegend from "#views/VizRisk/Dhangadi/Components/CustomChartLegend";

import {
	mapStyleSelector,
	regionsSelector,
	provincesSelector,
	districtsSelector,
	municipalitiesSelector,
	wardsSelector,
	hazardTypesSelector,
} from "#selectors";
import CustomLabel from "./CustomLabel";

import styles from "./styles.module.scss";
import Disclaimer from "../../Components/Disclaimer";

const data = [
	{ name: "Agricultural land", value: 119.44 },
	{ name: "Forest", value: 89.12 },
	{ name: "Grassland", value: 2.06 },
	{ name: "Meadow", value: 0.52 },
	{ name: "Sand", value: 3.37 },
	{ name: "Water bodies", value: 4.96 },
	{ name: "Buildings", value: 4.01 },
	{ name: "Other ", value: 36.71 },
].sort(({ value: a }, { value: b }) => b - a);

const COLORS_CHART = [
	"#d3e378", // agriculture
	"#00a811", // forest
	"#f3f2f2", // other
	"#0765AA", // water bodies
	"#F2F2F2", // building
	"#effdc9", // sand
	"#4ad391", // grassland
	"#afeb0a", // meadow
];

interface State {
	activeIndex: number;
	selected: number;
	showInfo: boolean;
}

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state) => ({
	mapStyle: mapStyleSelector(state),
	regions: regionsSelector(state),
	provinces: provincesSelector(state),
	districts: districtsSelector(state),
	municipalities: municipalitiesSelector(state),
	wards: wardsSelector(state),
	hazardTypes: hazardTypesSelector(state),
});

class RightPane extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			activeIndex: 0,
			selected: 0,
			showInfo: false,
		};
	}

	public generateColor = memoize((maxValue, minValue, colorMapping) => {
		const newColor = [];
		const { length } = colorMapping;
		const range = maxValue - minValue;
		colorMapping.forEach((color, i) => {
			const val = minValue + (i * range) / (length - 1);
			newColor.push(val);
			newColor.push(color);
		});
		return newColor;
	});

	public generatePaint = memoize((color) => ({
		"fill-color": ["interpolate", ["linear"], ["feature-state", "value"], ...color],
		"fill-opacity": 0,
	}));

	public onPieEnter = (piedata, index) => {
		this.setState({
			activeIndex: index,
		});
	};

	public CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			// console.log('payload', payload);
			return (
				<div className={styles.customTooltip}>
					<p>{`${((payload[0].value / 260.919) * 100).toFixed(2)} % `}</p>
				</div>
			);
		}
		return null;
	};

	public renderActiveShape = (props) => {
		const {
			cx,
			cy,
			midAngle,
			innerRadius,
			outerRadius,
			startAngle,
			endAngle,
			fill,
			payload,
			percent,
			value,
		} = props;

		return (
			<g>
				<Sector
					cx={cx}
					cy={cy}
					innerRadius={innerRadius - 4}
					outerRadius={outerRadius + 4}
					startAngle={startAngle}
					endAngle={endAngle}
					paddingAngle={3}
					fill={fill}
				/>
			</g>
		);
	};

	public handleInfoClick = () => {
		const { showInfo } = this.state;
		if (showInfo) {
			this.setState({ showInfo: false });
		} else {
			this.setState({ showInfo: true });
		}
	};

	public render() {
		const { activeIndex, showInfo } = this.state;

		return (
			<div className={styles.vrSideBar}>
				<h1>Land Cover</h1>

				<p>
					Out of a total area of 260.92 sq. km, 45.8% of the land is covered by Farmland and 34.2%
					by forests. Other areas are covered by water bodies, grassland, sand, and built-up area.
				</p>
				<ResponsiveContainer className={styles.respContainer} height={200}>
					<PieChart width={200} height={150} margin={{ top: 15, bottom: 15, left: 5, right: 5 }}>
						<Pie
							activeIndex={activeIndex}
							activeShape={this.renderActiveShape}
							data={data}
							innerRadius={70}
							outerRadius={90}
							fill="#8884d8"
							paddingAngle={0}
							startAngle={90}
							endAngle={450}
							dataKey="value"
							onClick={this.onPieEnter}
							stroke="none">
							{data.map((entry, index) => (
								<Cell key={`cell-${entry.name}`} fill={COLORS_CHART[index % COLORS_CHART.length]} />
							))}
							<Label
								width={30}
								position="center"
								content={
									<CustomLabel
										value1={`${data[activeIndex].value} sq km`}
										value2={` / ${((data[activeIndex].value / 260.919) * 100).toFixed(2)}%`}
									/>
								}
							/>
						</Pie>
						<Tooltip content={this.CustomTooltip} />
					</PieChart>
				</ResponsiveContainer>

				<div className={styles.customChartLegend}>
					<CustomChartLegend
						text={data[0].name}
						barColor={COLORS_CHART[0]}
						background={"#eee"}
						data={"119.44 sq km / 45.78"}
						selected={activeIndex === 0}
					/>
					<CustomChartLegend
						text={data[1].name}
						barColor={COLORS_CHART[1]}
						background={"#eee"}
						data={"89.12 sq km / 34.16"}
						selected={activeIndex === 1}
					/>

					<CustomChartLegend
						text={data[2].name}
						barColor={COLORS_CHART[2]}
						background={"#eee"}
						data={"36.71 sq km / 14.07"}
						selected={activeIndex === 2}
					/>
					<CustomChartLegend
						text={data[3].name}
						barColor={COLORS_CHART[3]}
						background={"#eee"}
						data={"4.96 sq km / 1.90"}
						selected={activeIndex === 3}
					/>
					<CustomChartLegend
						text={data[4].name}
						barColor={COLORS_CHART[4]}
						background={"#eee"}
						data={"4.01 sq km / 1.54"}
						selected={activeIndex === 4}
					/>
					<CustomChartLegend
						text={data[5].name}
						barColor={COLORS_CHART[5]}
						background={"#eee"}
						data={"3.37 sq km / 1.29"}
						selected={activeIndex === 5}
					/>
					<CustomChartLegend
						text={data[6].name}
						barColor={COLORS_CHART[6]}
						background={"#eee"}
						data={"2.06 sq km / 0.79"}
						selected={activeIndex === 6}
					/>
					<CustomChartLegend
						text={data[7].name}
						barColor={COLORS_CHART[7]}
						background={"#eee"}
						data={"0.52 sq km / 0.19"}
						selected={activeIndex === 7}
					/>
				</div>
				{/* <SourceInfo /> */}
				<Disclaimer
					disclamer={
						"Disclaimer: Temporarily there is an inconsistency in the map layers due to different data sources"
					}
				/>
			</div>
		);
	}
}

export default connect(mapStateToProps)(RightPane);
