import React from 'react';
import * as PageType from '#store/atom/page/types';

import EarthquakeItem from './EarthquakeItem';
import Message from '#rscv/Message';

import styles from './styles.scss';

type Data
        = PageType.RealTimeRain[]
        | PageType.RealTimeRiver[]
        | PageType.RealTimeEarthquake[]
        | PageType.RealTimeFire[]
        | PageType.RealTimePollution[];

interface Props {
    data: Data;
}

class Earthquake extends React.PureComponent<Props> {
    public render() {
        const { data } = this.props;

        if (data.length < 1) {
            return (
                <div
                    className={styles.message}
                >
                    <Message>
                        No data available in the database.
                    </Message>
                </div>
            );
        }
        return (
            <div className={styles.earthquake}>
                { data.map((datum: PageType.DataArchiveEarthquake) => (
                    <EarthquakeItem
                        data={datum}
                    />
                )) }
            </div>
        );
    }
}

export default Earthquake;
