import React from 'react';

import DateRangeInfo from '#components/DateRangeInfo';
import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
// import PollutionModal from '../Modal';

import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

const ModalButton = modalize(Button);

interface Props {
    startDate?: string;
    endDate?: string;
    rainList: PageType.DataArchiveRain[];
}

const TopBar = (props: Props) => {
    const { rainList, startDate, endDate } = props;

    return (
        <div className={styles.topBar}>
            <DateRangeInfo
                className={styles.dateRange}
                startDate={startDate || 'N/A'}
                endDate={endDate || 'N/A'}
            />
            <ModalButton
                className={styles.showDetailsButton}
                transparent
                iconName="table"
                title="Show all data"
                modal={(
                    // <PollutionModal
                    //     dataArchivePollution={pollutionList}
                    // />
                    <div>Rain Modal</div>
                )}
            />
        </div>
    );
};

export default TopBar;
