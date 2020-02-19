import React from 'react';
import { _cs } from '@togglecorp/fujs';

import MultiViewContainer from '#rscv/MultiViewContainer';
import ScrollTabs from '#rscv/ScrollTabs';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import Button from '#rsca/Button';

import About from './About';
import PrivacyPolicy from './PrivacyPolicy';
import Metadata from './Metadata';
import Disclaimer from './Disclaimer';
import Manual from './Manual';

import styles from './styles.scss';

export default class AboutUs extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            currentView: 'about',
        };

        this.tabs = {
            about: 'About',
            privacyPolicy: 'Privacy policy',
            metadata: 'Metadata',
            // disclaimer: 'Disclaimer',
            manual: 'Publications',
        };

        const rendererParams = () => ({ className: styles.view });

        this.views = {
            about: {
                component: About,
                rendererParams,
            },
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
                onClose={closeModal}
            >
                <ModalHeader
                    className={styles.header}
                    title="Bipad"
                    rightComponent={(
                        <Button
                            onClick={closeModal}
                            transparent
                            iconName="close"
                        />
                    )}
                />
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
