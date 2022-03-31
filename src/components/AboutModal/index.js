import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import MultiViewContainer from '#rscv/MultiViewContainer';
import ScrollTabs from '#rscv/ScrollTabs';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import { languageSelector } from '#selectors';
import About from './About';
// import PrivacyPolicy from './PrivacyPolicy';
// import Metadata from './Metadata';
// import Disclaimer from './Disclaimer';
import Manual from './Manual';
import styles from './styles.scss';

const mapStateToProps = state => ({
    language: languageSelector(state),
});

class AboutUs extends React.PureComponent {
    constructor(props) {
        super(props);
        const { language: { language } } = this.props;


        this.state = {
            currentView: 'about',
        };

        this.tabs = {
            about: language === 'en' ? 'Description' : 'विवरण',
            // privacyPolicy: 'Privacy policy',
            // metadata: 'Metadata',
            // disclaimer: 'Disclaimer',
            manual: language === 'en' ? 'Publications' : 'प्रकाशनहरू',
        };

        const rendererParams = () => ({ className: styles.view });

        this.views = {
            about: {
                component: About,
                rendererParams,
            },
            /*
            privacyPolicy: {
                component: PrivacyPolicy,
                rendererParams,
            },
            metadata: {
                component: Metadata,
                rendererParams,
            },
            disclaimer: {
                component: Disclaimer,
                rendererParams,
            },
            */
            manual: {
                component: Manual,
                rendererParams,
            },
        };
    }

    handleTabClick = (newTab) => {
        this.setState({ currentView: newTab });
    }

    render() {
        const {
            className,
            closeModal,
        } = this.props;
        const {
            currentView,
        } = this.state;

        return (
            <Modal
                className={_cs(styles.loginModal, className)}
                // onClose={closeModal}
            >
                <Translation>
                    {
                        t => (
                            <ModalHeader
                                className={styles.header}
                                title={t('BIPAD')}
                                rightComponent={(
                                    <DangerButton
                                        transparent
                                        iconName="close"
                                        onClick={closeModal}
                                        title="Close Modal"
                                    />
                                )}
                            />
                        )
                    }
                </Translation>

                <ModalBody className={styles.content}>
                    <ScrollTabs
                        className={styles.tabs}
                        tabs={this.tabs}
                        // useHash
                        // onHashChange={this.handleHashChange}
                        active={currentView}
                        onClick={this.handleTabClick}
                    />
                    <MultiViewContainer
                        views={this.views}
                        active={currentView}
                        // useHash
                    />
                </ModalBody>
            </Modal>
        );
    }
}

export default connect(mapStateToProps)(AboutUs);
