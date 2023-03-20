import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import ScrollTabs from '#rscv/ScrollTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';

import { languageSelector } from '#selectors';
import Flow from './Flow';
import Release from './Release';

import styles from './styles.scss';


const mapStateToProps = state => ({
    language: languageSelector(state),

});

interface Tabs {
    flows: string;
    releases: string;
}

interface Views {
    flows: {};
    releases: {};
}

interface Props {
    closeModal?: () => void;
    className?: string;
}

interface State {
    currentView: keyof Tabs;
}

class ReliefModal extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const { language: { language } } = this.props;
        this.tabs = {
            flows: language === 'en' ? 'Flows' : 'प्रवाहहरु',
            releases: language === 'en' ? 'Releases' : 'रिलीजहरू',

        };

        this.views = {
            flows: {
                component: () => <Flow className={styles.flow} />,
            },

            releases: {
                component: () => <Release className={styles.release} />,
            },
        };

        this.state = {
            currentView: 'flows',
        };
    }

    private tabs: Tabs;

    private views: Views;

    private handleTabClick = (newTab: keyof Tabs) => {
        this.setState({ currentView: newTab });
    }

    public render() {
        const {
            className,
            closeModal,
            handledisableOutsideDivClick,
        } = this.props;

        const { currentView } = this.state;

        return (
            <Translation>
                {
                    t => (
                        <Modal
                            className={_cs(styles.reliefModal, className)}
                        >
                            <ModalHeader
                                title={t('Relief')}
                                rightComponent={(
                                    <DangerButton
                                        transparent
                                        iconName="close"
                                        onClick={() => {
                                            handledisableOutsideDivClick(false);
                                            closeModal();
                                        }}
                                        title={t('Close Modal')}
                                    />
                                )}
                            />
                            <ModalBody className={styles.modalBody}>
                                <ScrollTabs
                                    className={styles.tabs}
                                    tabs={this.tabs}
                                    onClick={this.handleTabClick}
                                    active={currentView}
                                />
                                <MultiViewContainer
                                    views={this.views}
                                    active={currentView}
                                />
                            </ModalBody>
                        </Modal>
                    )
                }
            </Translation>

        );
    }
}

export default connect(mapStateToProps)(ReliefModal);
