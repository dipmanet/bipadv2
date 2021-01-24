import React from 'react';
import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

interface Props {
    data: PageType.DataArchiveRiver;
}
const RiverItem = (props: Props) => {
    const { data } = props;
    const { basin, waterLevelOn, waterLevel } = data;
    console.log('RainItem');
    return (
        <div className={styles.riverItem}>
            {`${basin} Basin`}
        </div>
    );
};

export default RiverItem;
