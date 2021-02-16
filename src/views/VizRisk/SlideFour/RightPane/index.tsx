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

                <h1>Exposure to Flooding</h1>

                <p>
                    {' '}
                    Rajapur faced significant flooding in 2009, 2013, 2014 and 2017.
                    Flood exposure in Rajapur is due to its proximity to the
                    Karnali River, which is a major river system of Nepal.
                    Rajapur Municipality lies in the inland delta region
                    formed by the bifurcation and downstream confluence of
                    the Karnali river. The river carries significant discharge
                    during monsoon season.
                </p>

                <p>
                    {' '}
                    Increased risk of flooding is due to encroachment of
                    floodplain. The riparian landscape of Rajapur entails
                    the active and dynamic interaction of its inhabitants
                    with Karnali River for domestic purposes, cattle farming,
                    irrigation, construction materials and others.

                </p>

                <h1>Early Warning System and Safe Shelters</h1>
                <p>
                    Originating from the Himalayas, the Karnali River flows
                    to the Terai plains from a narrow gorge at Chisapani, where
                    it bifurcates into Geruwa and Karnali river.
                </p>


                <p>
                    The Karnali flood forecasting station is at Chisapani with
                    predefined thresholds for warning and danger levels at 10
                    and 10.8 meters respectively. The Chisapani gauge was incorporated
                    into Early Warning System (EWS) in 2010.
                </p>

                <p>
                    The water level data at the station is used to provide flood
                    warnings to the communities in Rajapur through mobile alerts
                    and sirens. This community based early warning systems and the
                    safe shelters have been instrumental in saving lives and
                    livelihood in Rajapur.
                </p>

                <p>
                    Currently, there are nine safe shelters located in Rajapur
                    in number of locations, mostly at 2 Km buffer from the river.
                    Once the communities at Rajapur receive warnings on approaching
                    flood, they move to the nearest safe shelter. Apart from safe
                    shelters constructed specifically for evacuation during flooding,
                    the communities also use schools as evacuation centers during
                    disasters.
                </p>


                {/*
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
                </p> */}

            </div>
        );
    }
}

export default SlideThreePane;
