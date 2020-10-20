import React, { ReactText, useState } from 'react';
import * as PageType from '#store/atom/page/types';
import Button from '#rsca/Button';
import EarthquakeItem from '../EarthquakeItem';

import styles from './styles.scss';

interface Props {
    address: ReactText;
    data: PageType.DataArchiveEarthquake[];
}
const SORT_KEY = 'eventOn';

const compare = (a: any, b: any) => {
    if (a[SORT_KEY] < b[SORT_KEY]) {
        return 1;
    }
    if (a[SORT_KEY] > b[SORT_KEY]) {
        return -1;
    }
    return 0;
};

const EarthquakeGroup = (props: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { address, data } = props;
    const handleButtonClick = () => {
        setIsExpanded(!isExpanded);
    };
    return (
        <div>
            <div className={styles.earthquakeGroup}>
                <div className={styles.address}>
                    {address}
                </div>
                <div className={styles.right}>
                    {/* <div className={styles.count}>
                        {`${data.length} `}
                    </div> */}
                    <Button
                        className={styles.chevron}
                        iconName={isExpanded ? 'chevronUp' : 'chevronDown'}
                        onClick={handleButtonClick}
                    />
                </div>
            </div>

            <div className={styles.child}>
                { isExpanded
                && data
                    .sort(compare)
                    .map((datum: PageType.DataArchiveEarthquake) => (
                        <div
                            className={styles.wrapper}
                            key={datum.id}
                        >
                            <EarthquakeItem
                                data={datum}
                            />
                        </div>
                    )) }
            </div>

        </div>
    );
};

export default EarthquakeGroup;
