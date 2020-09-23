import React from 'react';
import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

interface Props {
    pollutionList: PageType.DataArchivePollution[];
}
const PollutionViz = (props: Props) => {
    const { pollutionList } = props;
    console.log(pollutionList.length);
    return (
        <div className={styles.pollutionViz}>
            <div>
                {pollutionList.length}
            </div>
        </div>
    );
};

export default PollutionViz;
