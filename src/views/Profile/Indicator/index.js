import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import { Translation } from 'react-i18next';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import DangerButton from '#rsca/Button/DangerButton';

import template from './source.html';
import templateNep from './sourceNe.html';
import styles from './styles.scss';
import { languageSelector } from '#selectors';

const mapStateToProps = state => ({
    language: languageSelector(state),
});


const Indicator = ({
    language,
    closeModal,
    className,
}) => (
    <Translation>
        {
            t => (
                <Modal className={_cs(className, styles.indicatorsModal)}>
                    <ModalHeader
                        title={t('Indicators')}
                        rightComponent={(
                            <DangerButton
                                transparent
                                iconName="close"
                                onClick={closeModal}
                                title="Close Modal"
                            />
                        )}
                    />
                    <ModalBody className={styles.body}>
                        <div
                            className={styles.tableContainer}
                            dangerouslySetInnerHTML={{ __html: language.language === 'en' ? template : templateNep }}
                        />
                    </ModalBody>
                </Modal>
            )
        }
    </Translation>

);

export default connect(mapStateToProps)(Indicator);
