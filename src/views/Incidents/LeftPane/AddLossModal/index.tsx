import React from 'react';

import { _cs } from '@togglecorp/fujs';

import FixedTabs from '#rscv/FixedTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import DangerButton from '#rsca/Button/DangerButton';

import AddAgricultureLoss from './AddAgricultureLoss';
import AddInfrastructureLoss from './AddInfrastructureLoss';

import styles from './styles.scss';

interface Tabs {
    infrastructure: string;
    agriculture: string;
}

interface Views {
    infrastructure: {};
    agriculture: {};
}

interface OwnProps {
    closeModal?: () => void;
    onUpdate?: () => void;
    className?: string;
}

interface PropsFromState {
}

interface PropsFromDispatch {
}

interface State {
    currentView: string;
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

class AddLossModal extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.tabs = {
            infrastructure: 'Infrastructure',
            agriculture: 'Agriculture',
        };

        this.views = {
            infrastructure: {
                component: () => <AddInfrastructureLoss />,
            },
            agriculture: {
                component: () => <AddAgricultureLoss />,
            },
        };

        this.state = {
            currentView: '',
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

        const {
            currentView,
        } = this.state;

        return (
            <Modal
                className={_cs(styles.addLossModal, className)}
                onClose={closeModal}
                closeOnEscape
            >
                <ModalHeader title="Add Loss" />
                <ModalBody>
                    <FixedTabs
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
                <ModalFooter>
                    <DangerButton onClick={closeModal}>
                        Close
                    </DangerButton>
                </ModalFooter>
            </Modal>
        );
    }
}

export default AddLossModal;
