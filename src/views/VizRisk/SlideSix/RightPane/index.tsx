import React from 'react';

import styles from './styles.scss';
import demographicsData from '../../demographicsData';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

class SlideThreePane extends React.PureComponent<Props, State> {
    public render() {
        const chartData = demographicsData.demographicsData;
        return (
            <div className={styles.vrSideBar}>

                <h1>
                    Population Exposure to Flooding
                </h1>
                <p>
                    Exposure is one of the critical drivers of long term
                    flood damages and loss in Rajapur area. To understand
                    the exposure of assets and people, this visualization
                    allows the super imposition of the flood hazard maps for
                    different return period of flood with population density.
                    This viz-risk helps understand the population, elements and
                    assets that are exposed to modeled flood hazard in the region.
                    Important implication from this viz-risk is that the impact from
                    the flood can be greatly reduced through flood-sensitive
                    land use planning. Here, the dense settlement areas that
                    are at proximity to Karnali river lying in flood hazard zone
                    might face major human loss and economic damage in future floods.
                </p>
            </div>
        );
    }
}

export default SlideThreePane;
