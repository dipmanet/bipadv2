import React, { ReactText, useState } from 'react';
import * as PageType from '#store/atom/page/types';
import Button from '#rsca/Button';
import EarthquakeItem from '../EarthquakeItem';

import styles from './styles.scss';

interface Props {
    address: ReactText;
    data: PageType.DataArchiveEarthquake[];
}

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
                    <div className={styles.count}>
                        {`${data.length} events`}
                    </div>
                    <Button
                        className={styles.chevron}
                        iconName={isExpanded ? 'chevronUp' : 'chevronDown'}
                        onClick={handleButtonClick}
                    />
                </div>
            </div>

            <div className={styles.child}>
                { isExpanded && data.map((datum: PageType.DataArchiveEarthquake) => (
                    <EarthquakeItem
                        key={datum.id}
                        data={datum}
                    />
                )) }
            </div>

        </div>
    );
};

export default EarthquakeGroup;
