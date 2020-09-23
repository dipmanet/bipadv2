import React from 'react';
import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

interface Props {
    earthquakeList: PageType.DataArchiveEarthquake[];
}
const EarthquakeViz = (props: Props) => {
    const { earthquakeList } = props;
    console.log(earthquakeList.length);
    return (
        <div className={styles.earthquakeViz}>
            <div>
                {earthquakeList.length}
            </div>
        </div>
    );
};

export default EarthquakeViz;
