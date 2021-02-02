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

                <h1>Early Warning System and Safe Shelters</h1>

                <p>
                    {' '}
                    Rajapur has faced significant flooding in 2009, 2013,
                    2014 and 2017. The most comparable earlier flooding was
                    the flood of 1983.

                </p>

                <p>
                    {' '}
                    Originating from the Himalayas, the Karnali River flows to
                    the Terai plains from a narrow gorge at Chisapani, where it
                    bifurcates into Geruwa and Karnali river.
                </p>

                <p>
                    {' '}
                    The Karnali flood
                    forecasting station is at Chisapani with predefined thresholds
                    for warning and danger levels at 10 and 10.8 meters respectively.
                    The Chisapani gauge was incorporated into Early Warning System
                    (EWS) in 2010.
                </p>
                <p>
                    {' '}
                    The water level data at the station is used to provide
                    flood warnings to the communities in Rajapur through mobile alerts
                    and sirens. The community based early warning system in Rajapur
                    and safe shelters have been instrumental in saving lives and livelihood.
                </p>
                <p>
                    {' '}
                    Currently, there are nine safe shelters located in Rajapur in
                    number of locations. Once the communities at Rajapur receive warnings
                    on approaching flood, they move to the nearest safe shelter. Apart from
                    safe shelters constructed specifically for evacuation during flooding,
                    schools are also used as evacuation centers.

                </p>
                <p>
                    {' '}
                    There are still many communities
                    in Rajapur, who do not have safe places to evacuate to during flooding.
                </p>

            </div>
        );
    }
}

export default SlideThreePane;
