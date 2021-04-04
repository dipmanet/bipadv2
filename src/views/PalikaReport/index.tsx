import React, { useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import Page from '#components/Page';
import styles from './styles.scss';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';

interface Props {
}

const PalikaReport: React.FC<Props> = (props: Props) => {
    const [showReportModal, setShowReportModal] = useState(true);

    const handleCloseModal = () => setShowReportModal(false);
    return (
        <>
            <Page hideMap hideFilter />
            <p>Hello</p>
            {showReportModal
            && (
                <Modal closeOnOutsideClick className={styles.modalContainer}>
                    <ModalHeader
                        title="Citizen Reports"
                        rightComponent={(
                            <DangerButton
                                transparent
                                iconName="close"
                                onClick={handleCloseModal}
                                title="Close Modal"
                            />
                        )}
                    />
                    <ModalBody className={styles.modalBody} />
                </Modal>
            )}

        </>
    );
};
export default PalikaReport;
