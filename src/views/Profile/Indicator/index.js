import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import Button from '#rsca/Button';

import template from './source.html';
import styles from './styles.scss';

const Indicator = ({
    closeModal,
    className,
}) => (
    <Modal className={_cs(className, styles.indicatorsModal)}>
        <ModalHeader
            title="Indicators"
            rightComponent={(
                <Button
                    iconName="close"
                    transparent
                    onClick={closeModal}
                />
            )}
        />
        <ModalBody className={styles.body}>
            <div
                className={styles.tableContainer}
                dangerouslySetInnerHTML={{ __html: template }}
            />
        </ModalBody>
    </Modal>
);

export default Indicator;
