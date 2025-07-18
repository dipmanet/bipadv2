import React from "react";
import { connect } from "react-redux";
import { ResponsiveContainer, PieChart, Label, Tooltip, Pie, Cell, Sector } from "recharts";
import CustomChartLegend from "#views/VizRisk/Common/ChartComps/CustomChartLegend";

import {
	mapStyleSelector,
	regionsSelector,
	provincesSelector,
	districtsSelector,
	municipalitiesSelector,
	wardsSelector,
	hazardTypesSelector,
} from "#selectors";
import CustomLabel from "#views/VizRisk/Common/ChartComps/CustomLabel";
import NavButtons from "../../Components/NavButtons";
import LandCover from "../../Data/landCoverChartData";
import styles from "../styles.module.scss";

const demoChartdata = LandCover.chartData;

interface State {
	activeIndex: number;
	selected: number;
	showInfo: boolean;
}

interface ComponentProps {}

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

	public onPieEnter = (piedata, index) => {
		this.setState({
			activeIndex: index,
		});
	};

	public CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className={styles.customTooltip}>
					<p>{`${((payload[0].value / 436.09) * 100).toFixed(2)} % `}</p>
				</div>
			);
		}
		return null;
	};

	public renderActiveShape = (props) => {
		const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

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
		const { activeIndex } = this.state;
		const {
			handleNext,
			handlePrev,
			disableNavLeftBtn,
			disableNavRightBtn,
			pagenumber,
			totalPages,
		} = this.props;
		return (
			<div className={styles.vrSideBar}>
				<h1>Land Cover</h1>
				<p>
					Out of a total area of 436.09 sq km, 44.3% of land is covered by forests, 23.6% by shrubs,
					9.6% by snow, 8% by farmland and rocks/stones each. Other areas in the municipality is
					covered by buildings, water bodies, and grassland.
				</p>
				<div className={styles.customChartLegend}>
					<ResponsiveContainer className={styles.respContainer} height={200}>
						<PieChart width={200} height={150} margin={{ top: 15, bottom: 15, left: 5, right: 5 }}>
							<Pie
								activeIndex={activeIndex}
								activeShape={this.renderActiveShape}
								data={demoChartdata}
								// cx={150}
								// cy={50}
								innerRadius={70}
								outerRadius={90}
								fill="#8884d8"
								paddingAngle={0}
								dataKey="value"
								onClick={this.onPieEnter}
								stroke="none">
								{demoChartdata.map((entry) => (
									<Cell key={`cell-${entry.name}`} fill={entry.color} />
								))}
								<Label
									width={30}
									position="center"
									content={
										<CustomLabel
											value1={`${demoChartdata[activeIndex].value} sq km`}
											value2={` / ${(
												(demoChartdata[activeIndex].value / demoChartdata[0].total) *
												100
											).toFixed(2)}%`}
										/>
									}
								/>
							</Pie>
							<Tooltip content={this.CustomTooltip} />
						</PieChart>
					</ResponsiveContainer>
				</div>
				<div className={styles.customChartLegend}>
					{demoChartdata.map((item, i) => (
						<CustomChartLegend
							text={item.name}
							barColor={item.color}
							background={"#777"}
							data={`${item.value} sq km / ${((item.value / item.total) * 100).toFixed(2)}`}
							selected={activeIndex === i}
						/>
					))}
				</div>

				<NavButtons
					handleNext={handleNext}
					handlePrev={handlePrev}
					disableNavLeftBtn={disableNavLeftBtn}
					disableNavRightBtn={disableNavRightBtn}
					pagenumber={pagenumber}
					totalPages={totalPages}
				/>
			</div>
		);
	}
}

export default connect(mapStateToProps)(RightPane);
