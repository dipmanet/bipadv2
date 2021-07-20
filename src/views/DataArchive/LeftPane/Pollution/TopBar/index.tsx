import React from 'react';

import DateRangeInfo from '#components/DateRangeInfo';
import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import PollutionModal from '../Modal';

import { pastDaysToDateRange } from '#utils/transformations';
import { DAPollutionFiltersElement } from '#types';
import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

const ModalButton = modalize(Button);

const getDates = (pollutionFilters: DAPollutionFiltersElement) => {
    const { dataDateRange } = pollutionFilters;
    const { rangeInDays } = dataDateRange;
    let startDate;
    let endDate;
    if (rangeInDays !== 'custom') {
        ({ startDate, endDate } = pastDaysToDateRange(rangeInDays));
    } else {
        ({ startDate, endDate } = dataDateRange);
    }
    return [startDate, endDate];
};

interface Props {
    pollutionFilters: DAPollutionFiltersElement;
    pollutionList: PageType.DataArchivePollution[];
}

const TopBar = (props: Props) => {
    const { pollutionFilters, pollutionList } = props;
    const [startDate, endDate] = getDates(pollutionFilters);

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
                    <PollutionModal
                        dataArchivePollution={pollutionList}
                    />
                )}
            />
        </div>
    );
};

export default TopBar;
