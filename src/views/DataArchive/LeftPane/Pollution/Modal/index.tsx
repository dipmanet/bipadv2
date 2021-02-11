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
import { DataArchivePollution } from '#store/atom/page/types';

import {
    convertNormalTableToCsv,
} from '#utils/table';

import styles from './styles.scss';

// original interface does not have all the properties so extended
interface DataArchivePollutionExtended extends DataArchivePollution {
    title?: string;
    createdOn?: string;
    aqiColor?: string;
    dateTime?: string;
}
interface Props {
    dataArchivePollution: DataArchivePollutionExtended[];
    closeModal?: () => void;
}

const pollutionSelector = (pollution: DataArchivePollutionExtended) => pollution.id;

const defaultSort = {
    key: 'aqi',
    order: 'dsc',
};

class PollutionModal extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        // TODO: add OandM by to riverWatch
        this.pollutionHeader = [
            {
                key: 'title',
                label: 'Location',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.title, b.title),
                modifier: (row: DataArchivePollutionExtended) => {
                    const { title } = row;
                    return (title) || undefined;
                },
            },
            {
                key: 'dateTime',
                label: 'Date',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.dateTime, b.dateTime),
                modifier: (row: DataArchivePollutionExtended) => {
                    const { dateTime } = row;
                    // parsing date to appropiate format
                    return (dateTime) ? dateTime.substring(0, dateTime.indexOf('T')) : undefined;
                },
            },
            {
                key: 'time',
                label: 'Time',
                order: 3,
                sortable: false,
                modifier: (row: DataArchivePollutionExtended) => {
                    const { dateTime } = row;
                    return (dateTime) ? dateTime.split('T')[1].split('.')[0] : undefined;
                },
            },
            {
                key: 'aqi',
                label: 'AQI',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareNumber(a.aqi, b.aqi),
                modifier: (row: DataArchivePollutionExtended) => {
                    const { aqi } = row;

                    // return (aqi) ? `${aqi.toFixed(2)} µg/m³` : undefined;
                    return (aqi) ? `${aqi.toFixed(2)}` : undefined;
                },
            },
        ];
    }

    private getClassName = (row: DataArchivePollutionExtended) => {
        const { aqi } = row;
        if (aqi <= 50) {
            return styles.good;
        }
        if (aqi <= 100) {
            return styles.moderate;
        }
        if (aqi <= 150) {
            return styles.unhealthyForSensitive;
        }
        if (aqi <= 200) {
            return styles.unhealthy;
        }
        if (aqi <= 300) {
            return styles.veryUnhealthy;
        }
        if (aqi > 300) {
            return styles.hazardous;
        }

        return styles.good;
    }

    private pollutionHeader: Header<DataArchivePollutionExtended>[];

    public render() {
        const {
            dataArchivePollution,
            closeModal,
        } = this.props;

        const formattedTableData = convertNormalTableToCsv(dataArchivePollution,
            this.pollutionHeader);
        return (
            <Modal
                // closeOnEscape
                // onClose={closeModal}
                className={styles.pollutionModal}
            >
                <ModalHeader
                    title="Pollution"
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
                        className={styles.pollutionTable}
                        data={dataArchivePollution}
                        headers={this.pollutionHeader}
                        keySelector={pollutionSelector}
                        defaultSort={defaultSort}
                    />
                </ModalBody>
                <ModalFooter>
                    <DangerButton onClick={closeModal}>
                        Close
                    </DangerButton>
                    <DownloadButton
                        value={formattedTableData}
                        name="DataArchivePollution.csv"
                    >
                        Download
                    </DownloadButton>
                </ModalFooter>
            </Modal>
        );
    }
}

export default PollutionModal;
