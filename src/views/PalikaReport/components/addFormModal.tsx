import React, { useState } from 'react';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import DangerButton from '#rsca/Button/DangerButton';
import Page from '#components/Page';

const AddFormModal = (props) => {
    const [modalClose, setModalClose] = useState(props.data);

    const handleCloseModal = () => {
        setModalClose(true);
    };
    return (
        <div>
            <Page hideMap hideFilter />
            {modalClose ? ''
                : (
                    <Modal>

                        <ModalHeader
                            title="Login"
                            rightComponent={(
                                <DangerButton
                                    transparent
                                    iconName="close"
                                    title="Close Modal"
                                    onClick={handleCloseModal}
                                />
                            )}
                        />
                        <ModalBody />
                        <ModalFooter>
                            <DangerButton>
                          Close
                            </DangerButton>

                        </ModalFooter>


                    </Modal>
                )
            }
        </div>

    );
};


export default AddFormModal;
