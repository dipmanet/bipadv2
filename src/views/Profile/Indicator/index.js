import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import templateNep from './sourceNe.html';

import styles from './styles.scss';

import DangerButton from '#rsca/Button/DangerButton';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import { languageSelector } from '#selectors';
import template from './source.html';

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
