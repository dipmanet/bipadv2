import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import styles from './styles.scss';
import MultiViewContainer from '#rscv/MultiViewContainer';
import MetaData from './MetaData';
import Details from './Details';
import ScrollTabs from '#rscv/ScrollTabs';
import HowToUse from './MetadataComponents/HowToUse';
import StandardMetadata from './MetadataComponents/StandardMetadata';

interface Params {
    body: object;
    onSuccess?: () => void;
    setFaramErrors?: (error: object) => void;
}

interface State {
    pristine: boolean;
    activeView: string | undefined;
}

class OpenspaceMetadataModal extends React.PureComponent<any, State> {
    public constructor(props: any) {
        super(props);

        this.state = {
            pristine: true,
            activeView: 'details',
        };
    }

    private tabs = {
        details: 'Details',
        atrributes: 'Atrributes',
        metadata: 'Metadata',
        howToUSe: 'How to Use',
    };

    private views = {
        details: {
            component: Details,
        },
        atrributes: {
            component: MetaData,
        },
        metadata: {
            component: StandardMetadata,
        },
        howToUSe: {
            component: HowToUse,
        },
    };

    private handleTabClick = (activeView) => {
        this.setState({ activeView });
    };

    public render() {
        const { className, closeModal, value } = this.props;

        const { activeView } = this.state;

        return (
            <Modal
                className={_cs(styles.metaDAtaModal)}
                // onClose={closeModal}
                closeOnEscape
            >
                <ModalHeader
                    title={'Layer Details'}
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
                    <ScrollTabs
                        className={styles.tabs}
                        tabs={this.tabs}
                        active={activeView}
                        onClick={this.handleTabClick}
                    />
                    <MultiViewContainer
                        views={this.views}
                        active={activeView}
                    />
                </ModalBody>
            </Modal>
        );
    }
}

export default OpenspaceMetadataModal;
