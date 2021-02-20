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
import { DataArchiveRiver } from '#store/atom/page/types';

import {
    convertNormalTableToCsv,
} from '#utils/table';

import styles from './styles.scss';

interface Props {
    dataArchiveRiver: DataArchiveRiver[];
    closeModal?: () => void;
}

// interface RealTimeRiver extends RealTimeRiverOld{
//     stationSeriesId?: number;
// }

const riverWatchKeySelector = (river: DataArchiveRiver) => river.id;

const defaultSort = {
    key: 'status',
    order: 'asc',
};

class RiverModal extends React.PureComponent<Props> {
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
                key: 'stationSeriesId',
                label: 'Station Id',
                order: 3,
                sortable: true,
                comparator: (a, b) => compareNumber(a.stationSeriesId, b.stationSeriesId),
            },
            {
                key: 'district',
                label: 'District',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareString(a.district, b.district),
            },
            {
                key: 'waterLevelOn',
                label: 'WATER LEVEL ON',
                order: 5,
                sortable: true,
                comparator: (a, b) => compareString(a.waterLevelOn, b.waterLevelOn),
                modifier: (row: DataArchiveRiver) => {
                    const { waterLevelOn } = row;

                    return waterLevelOn ? waterLevelOn.split('T')[0] : null;
                },
            },
            {
                key: 'waterLevel',
                label: 'Water Level (m)',
                order: 5,
                sortable: true,
                comparator: (a, b) => compareNumber(
                    a.waterLevel ? a.waterLevel : 0, b.waterLevel ? b.waterLevel : 0,
                ),
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

    private getClassName = (row: DataArchiveRiver) => {
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

    private riverWatchHeader: Header<DataArchiveRiver>[];

    public render() {
        const {
            dataArchiveRiver,
            closeModal,
        } = this.props;

        const formattedTableData = convertNormalTableToCsv(dataArchiveRiver, this.riverWatchHeader);
        return (
            <Modal
                // closeOnEscape
                // onClose={closeModal}
                className={styles.riverWatchModal}
            >
                <ModalHeader
                    title="Data Archive River"
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
                        data={dataArchiveRiver}
                        headers={this.riverWatchHeader}
                        keySelector={riverWatchKeySelector}
                        defaultSort={defaultSort}
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

export default RiverModal;
