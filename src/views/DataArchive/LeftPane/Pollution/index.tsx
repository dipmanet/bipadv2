import React from 'react';
import * as PageType from '#store/atom/page/types';

import PollutionItem from './PollutionItem';
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

interface PollutionData {
    aqi: number;
    createdOn: string;
    observation: {}[];
    title: string;
}
class Pollution extends React.PureComponent<Props> {
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
            <div className={styles.pollution}>
                { data.map((datum: PollutionData) => (
                    <PollutionItem
                        data={datum}
                        title="Bhaktapur"
                        date="2019-11-13"
                        time="11:25PM"
                        aqi={1}
                    />
                )) }
                {/* <PollutionItem title="Bhaktapur" date="2019-11-13" time="11:25PM" /> */}
            </div>
        );
    }
}

export default Pollution;
