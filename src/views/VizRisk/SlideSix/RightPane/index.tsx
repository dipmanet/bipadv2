import React from 'react';

import styles from './styles.scss';
import demographicsData from '../../demographicsData';
import Icon from '#rscg/Icon';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

class SlideThreePane extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            showInfo: false,
        };
    }

    public handleInfoClick = () => {
        console.log(this.state.showInfo);
        const { showInfo } = this.state;
        if (showInfo) {
            this.setState({ showInfo: false });
        } else {
            this.setState({ showInfo: true });
        }
    };

    public render() {
        const {
            showInfo,
        } = this.state;

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
                <div
                    className={showInfo ? styles.bottomInfo : styles.bottomInfoHide}
                >
                    <ol className={styles.referencesTitle}>
                        <li>
                        Modeling Exposure Through Earth Observations Routines (METEOR)
                        ,UK Space Agency, https://meteor-project.org/
                        </li>
                        <li>
                        Risk Nexus, Urgent case for recovery. What we can
                        learn from the August 2014 Karnali River floods in Nepal.
                        Zurich Insurance Group Ltd and ISET-International, 2015
                        </li>
                        <li>
                         Central Bureau of Statistics, 2011
                        </li>
                        <li>
                         Add the references that Reena used for Climate and others
                        </li>

                    </ol>
                </div>
                <div className={styles.iconContainer}>

                    <button type="button" className={styles.infoContainerBtn} onClick={this.handleInfoClick}>
                        <Icon
                            name="info"
                            className={styles.closeIcon}
                        />
                        References
                    </button>
                </div>
            </div>

        );
    }
}

export default SlideThreePane;
