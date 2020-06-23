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
import { RealTimeEarthquake } from '#store/atom/page/types';

import {
    convertNormalTableToCsv,
} from '#utils/table';

import styles from './styles.scss';

interface Props {
    realTimeEarthquake: RealTimeEarthquake[];
    closeModal?: () => void;
}

const earthquakeSelector = (earthquake: RealTimeEarthquake) => earthquake.id;

const defaultSort = {
    key: 'magnitude',
    order: 'dsc',
};

class Earthquake extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        // TODO: add OandM by to riverWatch
        this.earthquakeHeader = [
            {
                key: 'address',
                label: 'Epicenter',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.address, b.address),
            },
            {
                key: 'magnitude',
                label: 'Magnitude',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareNumber(a.magnitude, b.magnitude),
                modifier: (row: RealTimeEarthquake) => {
                    const { magnitude } = row;
                    return (magnitude)
                        ? `${magnitude} ML` : undefined;
                },
            },
            {
                key: 'eventOn',
                label: 'Measured On',
                order: 3,
                sortable: true,
                comparator: (a, b) => compareString(a.eventOn, b.eventOn),
                modifier: (row: RealTimeEarthquake) => {
                    const { eventOn } = row;

                    // parsing date to appropiate format
                    return (eventOn) ? eventOn.substring(0, eventOn.indexOf('T')) : undefined;
                },
            },
            {
                key: 'time',
                label: 'time',
                order: 4,
                sortable: false,
                modifier: (row: RealTimeEarthquake) => {
                    const { eventOn } = row;
                    if (eventOn) {
                        const date = new Date(eventOn);
                        // parsing date to time format
                        return date.toISOString().split('T')[1].split('.')[0];
                    } return undefined;
                },
            },
            {
                key: 'description',
                label: 'Description',
                order: 5,
                sortable: true,
                comparator: (a, b) => compareString(a.description, b.description),
            },
        ];
    }

    private getClassName = (row: RealTimeEarthquake) => {
        const { magnitude } = row;
        if (magnitude <= 3) {
            return styles.minor;
        }
        if (magnitude <= 4) {
            return styles.light;
        }
        if (magnitude <= 5) {
            return styles.moderate;
        }
        if (magnitude <= 6) {
            return styles.strong;
        }
        if (magnitude <= 7) {
            return styles.major;
        }
        if (magnitude >= 8) {
            return styles.great;
        }

        return styles.minor;
    }

    private earthquakeHeader: Header<RealTimeEarthquake>[];

    public render() {
        const {
            realTimeEarthquake,
            closeModal,
        } = this.props;

        const formattedTableData = convertNormalTableToCsv(realTimeEarthquake,
            this.earthquakeHeader);
        return (
            <Modal
                // closeOnEscape
                // onClose={closeModal}
                className={styles.earthquakeModal}
            >
                <ModalHeader
                    title="Earthquake"
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
                        className={styles.earthquakeTable}
                        data={realTimeEarthquake}
                        headers={this.earthquakeHeader}
                        keySelector={earthquakeSelector}
                        defaultSort={defaultSort}
                    />
                </ModalBody>
                <ModalFooter>
                    <DangerButton onClick={closeModal}>
                        Close
                    </DangerButton>
                    <DownloadButton
                        value={formattedTableData}
                        name="Earthquake.csv"
                    >
                        Download
                    </DownloadButton>
                </ModalFooter>
            </Modal>
        );
    }
}

export default Earthquake;
