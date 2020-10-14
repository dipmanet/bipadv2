import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import OpenSpaces from './OpenSpaces';
import MultiViewContainer from '#rscv/MultiViewContainer';
import styles from './styles.scss';

interface State {
    currentView: string;
    allOpenspaces: unknown;
}

interface Props {
    closeModal: any;
    handelListClick: any;
}

class AllOpenspacesModal extends React.PureComponent<Props, State> {
    public constructor(props: any) {
        super(props);
        this.state = {
            currentView: 'OpenSpaces',
            allOpenspaces: [],
        };
    }

    private views = {
        OpenSpaces: {
            component: OpenSpaces,
            rendererParams: () => ({
                handelListClick: this.props.handelListClick,
                closeModal: this.props.closeModal,
            }),
        },
    };

    public render() {
        const { closeModal } = this.props;
        const { currentView } = this.state;

        return (
            <Modal className={_cs(styles.spacesListModal)} closeOnEscape>
                <ModalHeader
                    title={
                        currentView === 'OpenSpaces'
                            ? 'Open Spaces'
                            : 'Community Spaces'
                    }
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"
                        />
                    )}
                />
                <ModalBody>
                    <MultiViewContainer
                        views={this.views}
                        active={currentView}
                    />
                </ModalBody>
            </Modal>
        );
    }
}

export default AllOpenspacesModal;
