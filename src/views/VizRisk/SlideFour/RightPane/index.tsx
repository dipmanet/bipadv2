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

                <h1>History of Flooding</h1>

                <p>
                    {' '}
                    Rajapur has faced significant flooding in 2009, 2013, 2014
                    and 2017. The most comparable earlier flooding was the
                    flood of 1983.
                </p>

                <p>
                    {' '}
                    Here we visualize the modeled water depth for flood events
                    of different return periods. It shows the maximum water
                    depth that would be expected if the flood events of the
                    specified return period were occurring at that location.
                    100 year return period flood means each year the chance of
                    its occurring or exceeding is 1%. The most severe flooding
                    in Rajapur occurred in 2014 , which was similar to 1 in 1000
                    year return period flood (0.1% probability).
                </p>
            </div>
        );
    }
}

export default SlideThreePane;
