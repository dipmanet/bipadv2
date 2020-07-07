import React from 'react';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';

import styles from './styles.scss';

interface Props {
    handleModalClose: () => void;
    title: string;
}

class PollutionModal extends React.PureComponent<Props> {
    public render() {
        const { title = 'Pollution Modal',
            handleModalClose } = this.props;
        return (
            <Modal className={styles.pollutionModal}>
                <ModalHeader
                    title={title}
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={handleModalClose}
                        />
                    )}
                />
                <ModalBody className={styles.body}>
                    Pollution Body
                </ModalBody>
            </Modal>
        );
    }
}

export default PollutionModal;
