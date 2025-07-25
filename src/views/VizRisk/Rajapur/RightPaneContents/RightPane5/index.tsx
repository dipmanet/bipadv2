import React from "react";
import styles from "./styles.module.scss";
import Disclaimer from "../../Components/Disclaimer";

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

class SlideFourPane extends React.PureComponent<Props, State> {
	public render() {
		return (
			<div className={styles.vrSideBar}>
				<h1> Visualising flood exposure for Rajapur municipality</h1>
				<p>
					This visualization allows the superimposition of the flood hazard maps for different
					return periods of flood with land use details. Return period is the probability of
					experiencing a given water depth within a single year; i.e. ‘1-in-100 year’ means 1 in 100
					(1%) chance of occurrence in any given year.
				</p>
				<p>
					This visualization helps understand the population, elements, and assets that are at
					threat to modeled flood hazards in the region. For instance, the dense settlement areas
					that are in proximity to the Karnali river, on either tributary and lying in the high
					flood depth might face major human and economic loss in future floods.
				</p>
				<p>
					The impact of flooding can be greatly reduced through flood-sensitive land use planning
					and this visualization allows re-thinking long-term spatial planning in the region.
				</p>
				{/* <SourceInfo /> */}
				<Disclaimer
					disclamer={
						"This flood hazard layer is the result of a computer-based simulation of flooding or flood inundation.\nThe datasets are produced using the available and best possible datasets. Considering this limitation, the flood hazard might not occur in a similar pattern as observed on the map."
					}
				/>
			</div>
		);
	}
}

export default SlideFourPane;
