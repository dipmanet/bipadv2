import React from 'react';
import styles from './styles.scss';
import demographicsData from '#views/VizRisk/Rajapur/Data/demographicsData';
import Disclaimer from '../../Components/Disclaimer';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

class SlideFourPane extends React.PureComponent<Props, State> {
    public constructor(props) {
        super();
        this.state = {
            showLandcover: false,
        };
    }

    public handleShowLandCover= () => {
        this.setState(
            prevState => ({
                showLandcover: !prevState.showLandcover,
            }),
        );
    }

    public render() {
        const chartData = demographicsData.demographicsData;
        const { showLandcover } = this.state;
        return (
            <div className={styles.vrSideBar}>
                <h1>Visualising flood exposure for Tikapur municipality </h1>
                <p>
                This visualization allows the superimposition of flood
                hazard maps for the different return periods of flood
                with land use details. Return period is the probability
                of experiencing a given water depth within a single year;
                i.e. ‘1-in-100 year’ means 1 in 100 (1%) chance of occurrence
                in any given year.

                </p>
                <p>
                This visualization helps understand the population,
                elements, and assets that are at threat to modeled
                flood hazards in the region. During the extreme flood,
                water cut across the ox-bows, damaging structures and
                fields, scouring the land, and depositing sediments.
                </p>
                <p>
                The impact of flooding can be greatly reduced through
                flood-sensitive land use planning and this visualization
                allows re-thinking long-term spatial planning in the region.
                </p>
                {/* <SourceInfo /> */}
                <Disclaimer
                    disclamer={'This flood hazard layer is the result of a computer-based simulation of flooding or flood inundation.\nThe datasets are produced using the available and best possible datasets. Considering this limitation, the flood hazard might notoccur in a similar pattern as observed on the map.'}
                />
            </div>
        );
    }
}

export default SlideFourPane;
