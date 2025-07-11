import React from "react";
import { connect } from "react-redux";
import memoize from "memoize-one";
import { ResponsiveContainer, PieChart, Label, Tooltip, Pie, Cell, Sector } from "recharts";
import CustomChartLegend from "#views/VizRisk/Rajapur/Components/CustomChartLegend";

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
	{ name: "Agricultural land", value: 94.07 },
	{ name: "Forest", value: 5.99 },
	{ name: "Water bodies", value: 5.18 },
	{ name: "Other", value: 21.5 },
	{ name: "Buildings", value: 0.959 },
].sort(({ value: a }, { value: b }) => b - a);
const COLORS_CHART = ["#d3e378", "#a8abb4", "#00a811", "#2b4253", "#d5d3d3"];

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
			return (
				<div className={styles.customTooltip}>
					<p>{`${((payload[0].value / 127.02) * 100).toFixed(2)} % `}</p>
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
				<h1>Landcover</h1>

				{/* <p>
                    {' '}
                    Located in the Terai region and lying close to water bodies,
                    Rajapur has fertile and arable land.

                </p> */}
				<p>
					Out of a total area of 127.08 sq. km, 74.06% of the land is used for agriculture.Building
					covers 0.75% of land while water bodies occupy 4.08% of total land in Rajapur.
				</p>
				<ResponsiveContainer className={styles.respContainer} height={200}>
					<PieChart width={200} height={150} margin={{ top: 15, bottom: 15, left: 5, right: 5 }}>
						<Pie
							activeIndex={activeIndex}
							activeShape={this.renderActiveShape}
							data={data}
							// cx={150}
							// cy={50}
							innerRadius={70}
							outerRadius={90}
							fill="#8884d8"
							paddingAngle={0}
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
										value2={` / ${((data[activeIndex].value / 127.02) * 100).toFixed(2)}%`}
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
						data={"94.07 sq km / 74.06"}
						selected={activeIndex === 0}
					/>

					<CustomChartLegend
						text={data[2].name}
						barColor={COLORS_CHART[2]}
						background={"#eee"}
						data={"5.99 sq km / 4.72"}
						selected={activeIndex === 2}
					/>
					<CustomChartLegend
						text={data[3].name}
						barColor={COLORS_CHART[3]}
						background={"#eee"}
						data={"5.18 sq km / 4.08"}
						selected={activeIndex === 3}
					/>
					<CustomChartLegend
						text={data[4].name}
						barColor={COLORS_CHART[4]}
						background={"#444"}
						data={"0.959 sq km / 0.75"}
						selected={activeIndex === 4}
						builtupArea
					/>
					<CustomChartLegend
						text={data[1].name}
						barColor={COLORS_CHART[1]}
						background={"#444"}
						data={"21.5 sq km / 16.93"}
						selected={activeIndex === 1}
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
