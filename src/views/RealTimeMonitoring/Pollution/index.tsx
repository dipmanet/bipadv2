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
import { RealTimePollution } from '#store/atom/page/types';

import {
    convertNormalTableToCsv,
} from '#utils/table';

import styles from './styles.scss';

// original interface does not have all the properties so extended
interface RealTimePollutionExtended extends RealTimePollution {
    title?: string;
    name?: string;
    createdOn?: string;
    aqiColor?: string;
    modifiedOn?: string;
}
interface Props {
    realTimePollution: RealTimePollutionExtended[];
    closeModal?: () => void;
}

const pollutionSelector = (pollution: RealTimePollutionExtended) => pollution.id;

const defaultSort = {
    key: 'aqi',
    order: 'dsc',
};

class Pollution extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        // TODO: add OandM by to riverWatch
        this.pollutionHeader = [
            {
                key: 'name',
                label: 'Location',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.name, b.name),
                modifier: (row: RealTimePollutionExtended) => {
                    const { name } = row;
                    return (name) || undefined;
                },
            },
            {
                key: 'modifiedOn',
                label: 'Date',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.modifiedOn, b.modifiedOn),
                modifier: (row: RealTimePollutionExtended) => {
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
                modifier: (row: RealTimePollutionExtended) => {
                    const { dateTime } = row;
                    if (dateTime) {
                        // const date = new Date(modifiedOn);
                        // parsing date to time format
                        // return date.toISOString().split('T')[1].split('.')[0];
                        return dateTime.split('T')[1].split('.')[0].split('+')[0];
                    } return undefined;
                },
            },
            {
                key: 'aqi',
                label: 'AQI',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareNumber(a.aqi, b.aqi),
                modifier: (row: RealTimePollutionExtended) => {
                    const { aqi } = row;

                    // return (aqi) ? `${aqi.toFixed(2)} µg/m³` : undefined;
                    return (aqi) ? `${aqi.toFixed(2)}` : undefined;
                },
            },
        ];
    }

    private getClassName = (row: RealTimePollutionExtended) => {
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

    private pollutionHeader: Header<RealTimePollutionExtended>[];

    public render() {
        const {
            realTimePollution,
            closeModal,
        } = this.props;
        const formattedTableData = convertNormalTableToCsv(realTimePollution,
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
                        data={realTimePollution}
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
                        name="Pollution.csv"
                    >
                        Download
                    </DownloadButton>
                </ModalFooter>
            </Modal>
        );
    }
}

export default Pollution;
