import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import criticalInfraData from "#views/VizRisk/Gulariya/Data/criticalInfraData";
import styles from "./styles.module.scss";

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

class SlideFourPane extends React.PureComponent<Props, State> {
	public render() {
		const chartData = criticalInfraData.criticalInfraData;
		return (
			<div className={styles.vrSideBar}>
				<h1>Community Infrastructures</h1>
				<p>
					Flood exposure in Gulariya is due to its proximity to the Babai River, which is locally
					called Sarju Nadi. The Babai River originates from the low mountains in the Mahabharat
					Hills and flows in the northwest, enclosed by these hills on either side, and then exits
					onto the Terai plain and flows southwards into India. As the river enters the Terai, the
					river meanders as it flows downstream.
				</p>
				<p>
					All of the residential and governmental buildings, religious and cultural sites, banking
					institutions, critical infrastructures such as hospitals, schools, bridges in Gulariya are
					at constant threat of flooding every monsoon.
				</p>

				<ResponsiveContainer className={styles.respContainer} width="100%" height={300}>
					<BarChart
						width={300}
						// height={600}
						data={chartData}
						layout="vertical"
						margin={{ left: 20, right: 20 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis type="number" />
						<YAxis type="category" dataKey="name" tick={{ fill: "#94bdcf" }} />
						<Bar
							dataKey="Total"
							fill="#ffbf00"
							barSize={20}
							radius={[0, 20, 20, 0]}
							label={{ position: "right", fill: "#ffffff" }}
							tick={{ fill: "#94bdcf" }}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		);
	}
}

export default SlideFourPane;
