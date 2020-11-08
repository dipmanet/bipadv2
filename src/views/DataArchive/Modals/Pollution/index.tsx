import React from 'react';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';

import styles from './styles.scss';

interface Props {
    handleModalClose: () => void;
    stationName: string;
}

const PollutionModal = (props: Props) => {
    const { stationName = 'Pollution Modal',
        handleModalClose } = props;
    return (
        <Modal className={styles.pollutionModal}>
            <ModalHeader
                title={stationName}
                rightComponent={(
                    <DangerButton
                        transparent
                        iconName="close"
                        onClick={handleModalClose}
                    />
                )}
            />
            <ModalBody className={styles.body}>
                <div className={styles.modalRow}>
                    <div className={styles.modalMap}>Modal Map</div>
                    <div className={styles.modalDetails}>Modal Details</div>
                </div>
                <div className={styles.modalRow}>
                    <div className={styles.modalOneMonth}>Modal One Month Graph</div>
                    <div className={styles.modalTwelveMonth}>Modal Tweleve Month Graph</div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default PollutionModal;
