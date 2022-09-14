/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
import React, { useState, useContext } from 'react';
import { Link, navigate } from '@reach/router';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createRequestClient, methods } from '@togglecorp/react-rest-request';
import LoadingAnimation from '#rscv/LoadingAnimation';
import gonImage from '#resources/icons/gon.png';
import {

    authStateSelector,
    closeWalkThroughSelector,
    languageSelector,
    runSelector,

} from '#selectors';
import {

    setAuthAction,
    setInitialCloseWalkThroughAction,
    setInitialRunAction,
} from '#actionCreators';

import LanguageToggle from '#components/LanguageToggle';
import about from '#resources/icons/about.png';
import technicalSupport from '#resources/icons/technicalsupport.png';
import manuals from '#resources/icons/manuals.png';
import faq from '#resources/icons/faqs.png';
import NewLoginModal from '#components/NewLoginModal';

import { createConnectedRequestCoordinator } from '#request';

import FeedbackSupport from '#views/FeedbackSupport';
import styles from './styles.scss';
import Navbar from './Navbar';

const mapStateToProps = (state: AppState): PropsFromState => ({
    closeWalkThrough: closeWalkThroughSelector(state),
    run: runSelector(state),
    language: languageSelector(state),
    authState: authStateSelector(state),

});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({

    setCloseWalkThrough: params => dispatch(setInitialCloseWalkThroughAction(params)),
    setRun: params => dispatch(setInitialRunAction(params)),
    setAuth: params => dispatch(setAuthAction(params)),

});

const Slide1 = (props) => {
    const [feedbackSupportBoolean, setFeebbackSupportBoolean] = useState(false);
    const { setCloseWalkThrough, setRun, language: { language } } = props;
    const handleClickStart = () => {
        setCloseWalkThrough({ value: true });
        setRun({ value: true });
    };


    return (
        <div className={styles.mainContainer}>


            <Navbar />

            <div className={styles.container}>
                {feedbackSupportBoolean && <FeedbackSupport className={undefined} closeModal={() => setFeebbackSupportBoolean(false)} />}

                <div className={styles.content}>
                    <div className={styles.imageLogo}>
                        <img src={gonImage} alt="logo" />
                    </div>

                    <div>
                        <p className={styles.welcome}>
                            Welcome to
                            {' '}
                            <br />
                        </p>
                        <p className={styles.bipadPortal}>
                            BIPAD PORTAL
                        </p>
                        <p className={styles.paragraph}>
                            Building Information Platform Against Disaster (BIPAD) portal is an integrated and
                            comprehensive Disaster Information Management System (DIMS). It is a platform for data partnership.
                            BIPAD portal is built upon the concept of creating a national portal embedded with independent
                            platforms for National, Provincial, and Municipal Governments with bottom-up approach of disaster data partnership.


                        </p>
                        <p className={styles.paragraph}>
                            BIPAD is developed by pooling all credible digital and spatial data that are available within different government bodies,
                            non-governmental organizations, academic institutions and research organizations on a single platform. The platform has
                            six modules in the portal that has the potential to enhance preparedness and early warning, strengthen disaster communication,
                            strengthen emergency response, enhance coordination post-incident, evidence-based planning, decision making and policy making.
                        </p>
                        <div className={styles.buttonGroup}>
                            <Link to="/dashboard/">
                                <div
                                    onClick={handleClickStart}
                                    className={styles.submitButton}
                                    role="presentation"
                                >
                                    {language === 'en' ? 'TAKE A TOUR' : 'भ्रमण गर्नुहोस्'}
                                </div>
                            </Link>
                            <Link
                                to="/dashboard/"
                                className={styles.viewDashboard}
                            // onClick={() => setCloseWalkThrough({ value: true })}
                            >
                                <h5>{language === 'en' ? 'VIEW DASHBOARD' : 'ड्यासबोर्ड हेर्नुहोस्'}</h5>

                            </Link>

                        </div>
                        <div className={styles.footer}>
                            <span style={{ marginRight: '20px' }} onClick={() => navigate('/about/')}>
                                <img style={{ marginRight: '5px' }} src={about} alt="about" />
                                {language === 'en' ? 'About' : 'बारेमा'}
                            </span>
                            <span className={styles.contains} onClick={() => setFeebbackSupportBoolean(true)}>
                                <img style={{ marginRight: '5px' }} src={technicalSupport} alt="technical support" />
                                {language === 'en' ? 'Technical Support' : 'प्राविधिक समर्थन'}
                            </span>
                            <span className={styles.contains} onClick={() => navigate('/manuals/')}>
                                <img style={{ marginRight: '5px' }} src={manuals} alt="technical support" />
                                {language === 'en' ? 'Manuals' : 'पुस्तिकाहरू'}
                            </span>
                            <span className={styles.contains} onClick={() => navigate('/faqs/')}>
                                <img style={{ marginRight: '5px' }} src={faq} alt="technical support" />
                                {language === 'en' ? 'FAQs' : 'सोधिने प्रश्नहरू'}
                            </span>
                        </div>
                    </div>
                </div>
                {/* <ScrollDownIndicatorButton scrollButton={scrollButton} id="2" /> */}

            </div>

        </div>
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient()(
            Slide1,
        ),
    ),
);
