import React, { useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import Page from '#components/Page';
import styles from './styles.scss';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import Icon from '#rscg/Icon';
import ReportModal from './ReportModal';

interface Props {
}

const PalikaReport: React.FC<Props> = (props: Props) => {
    const [showReportModal, setShowReportModal] = useState(true);
    const [showId, setShwoID] = useState(false);
    const handleCloseModal = () => setShowReportModal(false);
    return (
        <>
            <Page hideMap hideFilter />
            <div className={styles.maincontainer}>
                <div className={styles.leftContainer}>
                   left
                    <button
                        type="button"
                        onClick={console.log('clickec')}
                    >
                        <Icon
                            name="info"
                        />
                    </button>
                </div>
                <div className={styles.rightContainer}>
                   right
                </div>

            </div>
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
                    <ModalBody className={styles.modalBody}>
                        <ReportModal />
                    </ModalBody>
                </Modal>
            )}

        </>
    );
};
export default PalikaReport;
