/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import { navigate } from '@reach/router';
import Button from 'src/vendor/react-store/v2/Action/Button';
import styles from './styles.scss';


const Feedback = () => (
    <>
        <div className={styles.container_welcome_feedback}>
            <div className={styles.wrapper_welcome_feedback}>
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
                <div className={styles.support_container}>
                    {/* <div className={styles.cross_button}>
                        <Button className={styles.cross_btn}>
                            <i
                                className="fas fa-times fa-3x"
                                style={{ color: '#027df3' }}
                            />
                        </Button>
                    </div> */}
                    <div className={styles.feedback_wrapper}>
                        <div className={styles.tech_feedback}>
                            <h1 className={styles.tech_head}>Technical Support</h1>
                            <p className={styles.tech_desc}>
                                BIPAD portal's technical team will provide technical
                                assistance to individuals/institutions interested in learning
                                and understanding BIPAD system including its technical
                                handling from its frontend to backend and using data and
                                modules for data-driven decision making.
                            </p>
                            <Button className={styles.tech_btn} onClick={() => navigate('/support-1/')}>
                                TECHNICAL SUPPORT REQUEST FORM
                            </Button>

                        </div>
                        <div className={styles.leave_feedback}>
                            <h1 className={styles.feedback_head}>Leave Feedback</h1>
                            <p className={styles.feedback_desc}>
                                We look for constant feedback/comments to improve the BIPAD
                                portal and make it relevant. We appreciate you taking the time
                                to provide us your valuable inputs.
                            </p>
                            <div className={styles.feedback_button}>
                                <Button className={styles.feed_btn} onClick={() => navigate('/feedback-1/')}>
                                    FEEDBACK FORM
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);
export default Feedback;
