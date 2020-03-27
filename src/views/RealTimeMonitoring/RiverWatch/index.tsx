import React from 'react';
import {
    compareString,
    compareNumber,
} from '@togglecorp/fujs';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import Table from '#rscv/Table';
import ModalFooter from '#rscv/Modal/Footer';
import DownloadButton from '#components/DownloadButton';
import DangerButton from '#rsca/Button/DangerButton';

import { Header } from '#store/atom/table/types';
import { RealTimeRiver } from '#store/atom/page/types';

import {
    convertNormalTableToCsv,
} from '#utils/table';

import styles from './styles.scss';

interface Props {
    realTimeRiver: RealTimeRiver[];
    closeModal?: () => void;
}

const riverWatchKeySelector = (river: RealTimeRiver) => river.id;

class RiverWatch extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        // TODO: add OandM by to riverWatch
        this.riverWatchHeader = [
            {
                key: 'basin',
                label: 'Basin',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.basin, b.basin),
            },
            {
                key: 'title',
                label: 'Station Name',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.title, b.title),
            },
            {
                key: 'stationId',
                label: 'Station Id',
                order: 3,
                sortable: true,
                comparator: (a, b) => compareNumber(a.stationId, b.stationId),
            },
            {
                key: 'district',
                label: 'District',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareString(a.district, b.district),
            },
            {
                key: 'waterLevel',
                label: 'Water Level (m)',
                order: 5,
                sortable: true,
                comparator: (a, b) => compareNumber(a.waterLevel, b.waterLevel),
            },
            {
                key: 'warningLevel',
                label: 'Warning Level',
                order: 6,
                sortable: true,
                comparator: (a, b) => compareNumber(a.warningLevel, b.warningLevel),
            },
            {
                key: 'dangerLevel',
                label: 'Danger Level',
                order: 7,
                sortable: true,
                comparator: (a, b) => compareNumber(a.dangerLevel, b.dangerLevel),
            },
            {
                key: 'steady',
                label: 'Steady',
                order: 8,
                sortable: true,
                comparator: (a, b) => compareString(a.steady, b.steady),
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

    private getClassName = (row: RealTimeRain) => {
        const { status } = row;
        if (status === 'BELOW WARNING LEVEL') {
            return styles.below;
        }
        if (status === 'ABOVE WARNING LEVEL') {
            return styles.above;
        }
        if (status === 'ABOVE DANGER LEVEL') {
            return styles.danger;
        }
        return styles.below;
    }

    private riverWatchHeader: Header<RealTimeRiver>[];

    public render() {
        const {
            realTimeRiver,
            closeModal,
        } = this.props;

        const formattedTableData = convertNormalTableToCsv(realTimeRiver, this.riverWatchHeader);
        return (
            <Modal
                // closeOnEscape
                // onClose={closeModal}
                className={styles.riverWatchModal}
            >
                <ModalHeader
                    title="River Watch"
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"
                        />
                    )}
                />
                <ModalBody className={styles.body}>
                    <Table
                        rowClassNameSelector={this.getClassName}
                        className={styles.riverWatchTable}
                        data={realTimeRiver}
                        headers={this.riverWatchHeader}
                        keySelector={riverWatchKeySelector}
                    />
                </ModalBody>
                <ModalFooter>
                    <DangerButton onClick={closeModal}>
                        Close
                    </DangerButton>
                    <DownloadButton
                        value={formattedTableData}
                        name="River Watch.csv"
                    >
                        Download
                    </DownloadButton>
                </ModalFooter>
            </Modal>
        );
    }
}

export default RiverWatch;
