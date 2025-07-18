import React from "react";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styles from "./styles.module.scss";

const chartData = [
	{
		name: "Schools",
		Total: 54,
	},
	{
		name: "Culture",
		Total: 16,
	},
	{
		name: "Safe Shelters",
		Total: 9,
	},
];

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

class SlideFivePane extends React.PureComponent<Props, State> {
	public constructor(props) {
		super();
		this.state = {
			showReferences: true,
		};
	}

	public handleRefClick = () => {
		this.setState((prevState) => ({
			showReferences: !prevState.showReferences,
		}));
	};

	public render() {
		return (
			<div className={styles.vrSideBar}>
				<h1>Evacuation centers </h1>
				<p>
					Evacuation centers provide temporary shelter for people displaced from their homes
					following a flooding event. The schools and cultural heritage sites can also be used for
					evacuation during floods. However, their functionality during floods is contingent upon
					several factors including building types and their exposure, whether they are located in
					flood-prone or flood safe areas.
				</p>

				<ResponsiveContainer className={styles.respContainer} width="100%" height={200}>
					<BarChart
						width={350}
						// height={600}
						data={chartData}
						layout="vertical"
						margin={{ top: 10, bottom: 10, right: 10, left: 10 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis type="number" tick={{ fill: "#94bdcf" }} />
						<YAxis type="category" dataKey="name" tick={{ fill: "#94bdcf" }} />
						<Tooltip />
						<Bar
							dataKey="Total"
							fill="#ffbf00"
							// barCategoryGap={20}
							barSize={20}
							radius={[0, 20, 20, 0]}
							label={{ position: "insideRight" }}
						/>
					</BarChart>
				</ResponsiveContainer>
				<h2 className={styles.referencesBtn}>References</h2>

				<ul className={styles.referencesText}>
					<li>
						Modeling Exposure Through Earth Observations Routines (METEOR) ,UK Space Agency,
						https://meteor-project.org/
					</li>
					<li>
						Risk Nexus, Urgent case for recovery. What we can learn from the August 2014 Karnali
						River floods in Nepal. Zurich Insurance Group Ltd and ISET-International, 2015
					</li>
					<li>Central Bureau of Statistics, 2011</li>
					<li>Rajapur Municipality Profile, 2075</li>
				</ul>
			</div>
		);
	}
}

export default SlideFivePane;
