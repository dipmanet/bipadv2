import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ScrollTabs from '#rscv/ScrollTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';

import Flow from './Flow';
import Release from './Release';

import styles from './styles.scss';

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

        this.tabs = {
            flows: 'Flows',
            releases: 'Releases',
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
        } = this.props;

        const { currentView } = this.state;

        return (
            <Modal
                className={_cs(styles.reliefModal, className)}
                onClose={closeModal}
            >
                <ModalHeader
                    title="Relief"
                    rightComponent={(
                        <DangerButton
                            onClick={closeModal}
                            transparent
                            iconName="close"
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
        );
    }
}

export default ReliefModal;
