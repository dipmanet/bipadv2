import React from 'react';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';

import styles from './styles.scss';

const RainModal = (props) => {
    console.log('RainModal');
    const { stationName = 'Rain Modal',
        handleModalClose } = props;
    return (
        <Modal className={styles.rainModal}>
            <ModalHeader
                title="{stationName}"
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
                    <div className={styles.modalMap}>
                        MiniMap
                    </div>
                    <div className={styles.modalDetails}>
                        Details and Filters
                    </div>
                </div>
                <div className={styles.modalRow}>
                    <div className={styles.modalOneMonth}>
                        Graph
                    </div>
                    <div className={styles.modalTwelveMonth}>
                        TableView
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};
export default RainModal;
