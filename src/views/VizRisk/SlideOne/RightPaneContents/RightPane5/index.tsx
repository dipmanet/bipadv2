import React from 'react';
import styles from './styles.scss';
import demographicsData from '#views/VizRisk/demographicsData';
import SourceInfo from '../../SourceInfo';

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
                <h1>Flood Exposure </h1>
                <p>
                    This visualization allows the super imposition of the flood hazard
                    maps for different return period of flood with land use details.
                    Return period is the probability of experiencing a given water
                    depth within a single year; i.e. ‘1-in-100 year’ means 1 in 100 (1%)
                    chance of occurrence in any given year.
                </p>
                <p>
                    This visualization helps understand the population, elements
                    and assets that are at threat to modeled flood hazard in the
                    region. For instance, the dense settlement areas that are in
                    proximity to Karnali river, on either tributaries, and lying
                    in the high flood depth might face major human and economic
                    loss in future floods.
                </p>
                <p>
                    The impact of flooding can be greatly reduced through
                    flood-sensitive land use planning and this visualization
                    allows re-thinking long term spatial planning in the region.
                </p>
                {/* <SourceInfo /> */}

            </div>
        );
    }
}

export default SlideFourPane;
