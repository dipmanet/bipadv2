import React from 'react';
import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

interface Props {
    data: PageType.DataArchiveRain;
}
const RainItem = (props: Props) => {
    const { data } = props;
    const { basin, createdOn, averages } = data;
    console.log('RainItem');
    return (
        <div className={styles.rainItem}>
            {`${basin} Basin`}
        </div>
    );
};

export default RainItem;
