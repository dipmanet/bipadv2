import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Page from '#components/Page';
import styles from './styles.scss';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import DangerButton from '#rsca/Button/DangerButton';

const PalikaReport = (props) => {
    const { closeModal } = props;
    console.log(props);

    return (
        <>
            <Page hideMap hideFilter />
            <p>Hello</p>
            <Modal>
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
