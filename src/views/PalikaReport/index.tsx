import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Page from '#components/Page';
import styles from './styles.scss';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import DangerButton from '#rsca/Button/DangerButton';

interface Props {
    closeModal?: () => void;
}

const PalikaReport: React.FC<Props> = (props: Props) => {
    const { closeModal } = props;
    console.log(props);

    return (
        <>
            <Page hideMap hideFilter />
            <p>Hello</p>
            <Modal className={styles.modalContainer}>
                <ModalHeader
                    title="Citizen Reports"
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"
                        />
                    )}
                />
                <ModalBody className={styles.modalBody} />
            </Modal>
        </>
    );
};
export default PalikaReport;
