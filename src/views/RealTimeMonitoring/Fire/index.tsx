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
import { RealTimeFire } from '#store/atom/page/types';

import {
    convertNormalTableToCsv,
} from '#utils/table';

import styles from './styles.scss';

interface RealTimeFireExtended extends RealTimeFire {
    title?: string;
}
interface Props {
    realTimeFire: RealTimeFireExtended[];
    closeModal?: () => void;
}

const fireSelector = (fire: RealTimeFireExtended) => fire.id;

const defaultSort = {
    key: 'eventOn',
    order: 'dsc',
};

class Fire extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        // TODO: add OandM by to riverWatch
        this.fireHeader = [
            {
                key: 'title',
                label: 'Location',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.title, b.title),
                modifier: (row: RealTimeFireExtended) => {
                    const { title } = row;
                    return (title) || undefined;
                },
            },
            {
                key: 'eventOn',
                label: 'Date',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.eventOn, b.eventOn),
                modifier: (row: RealTimeFireExtended) => {
                    const { eventOn } = row;

                    return (eventOn) ? eventOn.substring(0, eventOn.indexOf('T')) : undefined;
                },
            },
            {
                key: 'time',
                label: 'Time',
                order: 3,
                sortable: false,
                modifier: (row: RealTimeFire) => {
                    const { eventOn } = row;
                    if (eventOn) {
                        return eventOn.split('T')[1].split('.')[0].split('+')[0];
                    } return undefined;
                },
            },
            {
                key: 'landCover',
                label: 'Land Cover',
                order: 4,
                sortable: false,
            },
            {
                key: 'brightness',
                label: 'Brightness',
                order: 5,
                sortable: true,
                comparator: (a, b) => compareNumber(a.brightness, b.brightness),
            },
        ];
    }

    private fireHeader: Header<RealTimeFireExtended>[];

    private getClassName = () => 'fire';

    public render() {
        const {
            realTimeFire,
            closeModal,
        } = this.props;

        const formattedTableData = convertNormalTableToCsv(realTimeFire,
            this.fireHeader);
        return (
            <Modal
                // closeOnEscape
                // onClose={closeModal}
                className={styles.fireModal}
            >
                <ModalHeader
                    title="Fire"
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
                        className={styles.fireTable}
                        data={realTimeFire}
                        headers={this.fireHeader}
                        keySelector={fireSelector}
                        defaultSort={defaultSort}
                    />
                </ModalBody>
                <ModalFooter>
                    <DangerButton onClick={closeModal}>
                        Close
                    </DangerButton>
                    <DownloadButton
                        value={formattedTableData}
                        name="Fire.csv"
                    >
                        Download
                    </DownloadButton>
                </ModalFooter>
            </Modal>
        );
    }
}

export default Fire;
