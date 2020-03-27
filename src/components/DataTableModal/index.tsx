import React from 'react';
import { _cs } from '@togglecorp/fujs';

import DangerButton from '#rsca/Button/DangerButton';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalFooter from '#rscv/Modal/Footer';
import ModalBody from '#rscv/Modal/Body';
import Table from '#rscv/Table';
import DownloadButton from '#components/DownloadButton';

import styles from './styles.scss';

interface Props {
    title: string;
    className?: string;
    closeModal?: boolean;

    keySelector: (item: unknown) => unknown;
    data: unknown[];
    headers: unknown[];
}

class DataTableModal extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            keySelector,
            title,
            data,
            headers,
            closeModal,
        } = this.props;

        return (
            <Modal className={_cs(className, styles.dataTableModal)}>
                <ModalHeader
                    title={title}
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"
                        />
                    )}
                />
                <ModalBody className={styles.modalBody}>
                    <Table
                        className={styles.table}
                        headers={headers}
                        data={data}
                        keySelector={keySelector}
                    />
                </ModalBody>
                <ModalFooter className={styles.modalFooter}>
                    <DownloadButton
                        value={data}
                        name={`${title}.csv`}
                    >
                        Download
                    </DownloadButton>
                </ModalFooter>
            </Modal>
        );
    }
}

export default DataTableModal;
