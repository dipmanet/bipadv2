import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import Button from '#rsca/Button';
import modalize from '#rscg/Modalize';
import ScrollTabs from '#rscv/ScrollTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';

import { Layer } from '#types';

import styles from './styles.scss';

interface Props {
    className?: string;
    layer: Layer;
}

const ModalButton = modalize(Button);

interface ModalProps {
    className?: string;
    layer: Layer;
    closeModal?: () => void;
}
class LayerDetailModal extends React.PureComponent<ModalProps> {
    public state = {
        activeView: 'details',
    }

    private tabs = {
        details: 'Details',
        metadata: 'Metadata',
    }

    private views = {
        details: {
            component: () => (
                <div className={styles.details}>
                    <div className={styles.description}>
                        { this.props.layer.description }
                    </div>
                    <div className={styles.disclaimer}>
                        <h3 className={styles.heading}>
                            Disclaimer
                        </h3>
                        <div className={styles.content}>
                            { this.props.layer.disclaimer }
                        </div>
                    </div>
                </div>
            ),
        },
        metadata: {
            component: () => (
                <div className={styles.metadata}>
                    { this.props.layer.metadata.map(g => (
                        <div
                            key={g.groupTitle}
                            className={styles.group}
                        >
                            <div className={styles.groupTitle}>
                                { g.groupTitle }
                            </div>
                            <div className={styles.rows}>
                                { g.rows.map(m => (
                                    <div
                                        className={styles.metadataItem}
                                        key={m.label}
                                    >
                                        <div className={styles.label}>
                                            { m.label }
                                        </div>
                                        <div className={styles.value}>
                                            { m.value || '-' }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
    }

    private handleTabClick = (activeView) => {
        this.setState({ activeView });
    }

    public render() {
        const {
            className,
            closeModal,
            layer,
        } = this.props;

        const { activeView } = this.state;

        return (
            <Modal className={_cs(styles.layerDetailModal, className)}>
                <ModalHeader
                    title="Layer details"
                    rightComponent={(
                        <Button
                            transparent
                            iconName="close"
                            onClick={closeModal}
                        />
                    )}
                />
                <ModalBody className={styles.body}>
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

class LayerDetailModalButton extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            layer,
            disabled,
        } = this.props;

        return (
            <ModalButton
                disabled={disabled}
                title="Click to see more details about this layer"
                className={_cs(styles.layerDetailModalButton, className)}
                transparent
                iconName="info"
                modal={(
                    <LayerDetailModal
                        layer={layer}
                    />
                )}
            />
        );
    }
}

export default LayerDetailModalButton;
