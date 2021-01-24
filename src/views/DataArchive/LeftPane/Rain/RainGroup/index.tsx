import React, { ReactText, useState } from 'react';
import * as PageType from '#store/atom/page/types';
import Button from '#rsca/Button';
// import RainItem from '../RainItem';

import styles from './styles.scss';

interface Props {
    title: ReactText;
    data: PageType.DataArchiveRain[];
}
const SORT_KEY = 'createdOn';

const compare = (a: any, b: any) => {
    if (a[SORT_KEY] < b[SORT_KEY]) {
        return 1;
    }
    if (a[SORT_KEY] > b[SORT_KEY]) {
        return -1;
    }
    return 0;
};

const RainGroup = (props: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { title, data } = props;
    const handleButtonClick = () => {
        setIsExpanded(!isExpanded);
    };
    return (
        <div>
            <div className={styles.rainGroup}>
                <div className={styles.title}>
                    {title}
                </div>
                <div className={styles.right}>
                    <div className={styles.count}>
                        <span>
                            TOTAL
                            {' '}
                            {data.length}
                        </span>
                    </div>
                    <Button
                        className={styles.chevron}
                        iconName={isExpanded ? 'chevronUp' : 'chevronDown'}
                        onClick={handleButtonClick}
                    />
                </div>
            </div>

            {/* <div className={styles.child}>
                { isExpanded
                && data
                    .sort(compare)
                    .map((datum: PageType.DataArchiveRain) => (
                        <div
                            className={styles.wrapper}
                            key={datum.id}
                        >
                            <Raintem
                                data={datum}
                            />
                        </div>
                    )) }
            </div> */}

        </div>
    );
};

export default RainGroup;
