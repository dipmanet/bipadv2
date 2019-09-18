import React from 'react';
import {
    compareString,
    compareNumber,
} from '@togglecorp/fujs';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import Table from '#rscv/Table';
import DangerButton from '#rsca/Button/DangerButton';

import { Header } from '#store/atom/table/types';
import {
    WaterLevelAverage,
    RealTimeRain,
} from '#store/atom/page/types';

import styles from './styles.scss';

interface Props {
    realTimeRain: RealTimeRain[];
    handleModalClose: () => void;
}

const rainWatchKeySelector = (rain: RealTimeRain) => rain.id;

const compareIntervalValues = (
    a: WaterLevelAverage[] = [],
    b: WaterLevelAverage[] = [],
    interval: number,
) => {
    const aAverage = a.find(av => av.interval === interval);
    const aValue = aAverage ? aAverage.value : 0;

    const bAverage = b.find(av => av.interval === interval);
    const bValue = bAverage ? bAverage.value : 0;

    return compareNumber(aValue, bValue);
};

class RainWatch extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        this.rainWatchHeader = [
            {
                key: 'basin',
                label: 'Basin',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.basin, b.basin),
            },
            {
                key: 'title',
                label: 'Title',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.title, b.title),
            },
            {
                key: 'description',
                label: 'Description',
                order: 3,
            },
            {
                key: 'lastHour',
                label: 'Accumulated rainfall within last 1 hours',
                order: 4,
                modifier: (row) => {
                    const {
                        averages = [],
                    } = row;
                    const average = averages.find(av => av.interval === 1);
                    return average ? average.value : undefined;
                },
                sortable: true,
                comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 1),
            },
            {
                key: 'lastThreeHours',
                label: 'Accumulated rainfall within last 3 hours',
                order: 5,
                modifier: (row) => {
                    const {
                        averages = [],
                    } = row;
                    const average = averages.find(av => av.interval === 3);
                    return average ? average.value : undefined;
                },
                sortable: true,
                comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 3),
            },
            {
                key: 'lastSixHours',
                label: 'Accumulated rainfall within last 6 hours',
                order: 6,
                modifier: (row) => {
                    const {
                        averages = [],
                    } = row;
                    const average = averages.find(av => av.interval === 6);
                    return average ? average.value : undefined;
                },
                sortable: true,
                comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 6),
            },
            {
                key: 'lastTwelveHours',
                label: 'Accumulated rainfall within last 12 hours',
                order: 7,
                modifier: (row) => {
                    const {
                        averages = [],
                    } = row;
                    const average = averages.find(av => av.interval === 12);
                    return average ? average.value : undefined;
                },
                sortable: true,
                comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 12),
            },
            {
                key: 'lastTwentyFourHours',
                label: 'Accumulated rainfall within last 24 hours',
                order: 8,
                modifier: (row) => {
                    const {
                        averages = [],
                    } = row;
                    const average = averages.find(av => av.interval === 24);
                    return average ? average.value : undefined;
                },
                sortable: true,
                comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 24),
            },
            {
                key: 'status',
                label: 'Status',
                order: 9,
                sortable: true,
                comparator: (a, b) => compareString(a.status, b.status),
            },
        ];
    }

    private rainWatchHeader: Header<RealTimeRain>[];

    public render() {
        const {
            realTimeRain,
            handleModalClose,
        } = this.props;

        return (
            <Modal
                closeOnEscape
                onClose={handleModalClose}
                className={styles.rainWatchModal}
            >
                <ModalHeader
                    title="Rainfall Watch"
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={handleModalClose}
                        />
                    )}
                />
                <ModalBody className={styles.body}>
                    <Table
                        className={styles.rainWatchTable}
                        data={realTimeRain}
                        headers={this.rainWatchHeader}
                        keySelector={rainWatchKeySelector}
                    />
                </ModalBody>
            </Modal>
        );
    }
}

export default RainWatch;
