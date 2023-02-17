/* eslint-disable no-unused-expressions */
/* eslint-disable no-lone-blocks */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/indent */
import React, { useState, useRef, useEffect } from 'react';
import { navigate } from '@reach/router';
import Button from 'src/vendor/react-store/v2/Action/Button';
import { _cs } from '@togglecorp/fujs';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import styles from './styles.scss';
import Feedback from './Feedback';
import Support from './Support';

const FeedbackSupport = ({ className, closeModal, handledisableOutsideDivClick }) => {
    const [formElementsPosition, setformElementsPosition] = useState(null);

    const HomePage = () => (
        <Modal
            className={_cs(styles.loginModal, className)}
            closeOnOutsideClick
        >
            <ModalBody className={styles.content}>
                <DangerButton
                    transparent
                    iconName="close"
                    onClick={() => {
                        handledisableOutsideDivClick(false);
                        closeModal();
                    }}
                    title="Close Modal"
                    className={styles.closeButton}
                />
                <div className={styles.container_welcome_feedback}>

                    <div className={styles.welcome_container}>
                        <div className={styles.welcome_wrapper}>
                            <h1 className={styles.welcome_head}>Welcome to BIPAD Portal</h1>
                            <p className={styles.welcome_intro}>
                                An integrated and comprehensive DIMS platform to support
                                disaster risk managment through informed decision making
                            </p>
                            <p className={styles.welcome_desc}>
                                BIPAD portal is a government owned integrated and comprehensive
                                Disaster Information Management System. It aims to bring
                                together all credible digital and spatial data into a single
                                platform to strengthen the preparedness, mitigation, and
                                response activities of all related stakeholders working in this
                                sector. This one stop platform has been developed with the
                                concept of creating a national portal embedded with independent
                                platforms for national, provincial, and municipal government
                                with a bottom-up approach of disaster data partnership
                            </p>
                        </div>
                    </div>


                    <div className={styles.feedback_container}>
                        <div className={styles.feedback_wrapper}>
                            <div className={styles.tech_feedback}>
                                <h3 className={styles.tech_head}>Technical Support</h3>
                                <p className={styles.tech_desc}>
                                    BIPAD portal's technical team will provide technical
                                    assistance to individuals/institutions interested in learning
                                    and understanding BIPAD system including its technical
                                    handling from its frontend to backend and using data and
                                    modules for data-driven decision making.
                                </p>
                                <div className={styles.tech_button}>
                                    <Button
                                        className={styles.tech_btn}
                                        onClick={() => {
                                            setformElementsPosition(0);
                                        }}
                                    >
                                        TECHNICAL SUPPORT REQUEST FORM
                                    </Button>
                                </div>

                            </div>
                            <div className={styles.leave_feedback}>
                                <h3 className={styles.feedback_head}>Leave Feedback</h3>
                                <p className={styles.feedback_desc}>
                                    We look for constant feedback/comments to improve the BIPAD
                                    portal and make it relevant. We appreciate you taking the time
                                    to provide us your valuable inputs.
                                </p>
                                <div className={styles.feed_button}>
                                    <Button
                                        className={styles.feed_btn}
                                        onClick={() => {
                                            setformElementsPosition(1);
                                        }
                                        }
                                    >
                                        FEEDBACK FORM
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

            </ModalBody>
        </Modal>

    );


    return (
        <>
            {formElementsPosition === 0
                && (
                    <Support
                        setPosition={setformElementsPosition}
                        closeModal={closeModal}
                    />
                )}
            {
                formElementsPosition === 1
                && (
                    <Feedback
                        setPosition={setformElementsPosition}
                        closeModal={closeModal}
                    />
                )
            }

            {
                formElementsPosition === null && <HomePage />
            }

        </>
    );
};
export default FeedbackSupport;
