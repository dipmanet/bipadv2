import React from 'react';

import DateRangeInfo from '#components/DateRangeInfo';
import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import RiverModal from '../Modal';

import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

const ModalButton = modalize(Button);

interface Props {
    startDate?: string;
    endDate?: string;
    riverList: PageType.DataArchiveRiver[];
}

const TopBar = (props: Props) => {
    const { riverList, startDate, endDate } = props;

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
                    <RiverModal
                        dataArchiveRiver={riverList}
                    />
                )}
            />
        </div>
    );
};

export default TopBar;
