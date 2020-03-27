import React from 'react';
import {
    _cs,
    camelToNormal,
} from '@togglecorp/fujs';

import DangerButton from '#rsca/Button/DangerButton';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import Button from '#rsca/Button';
import modalize from '#rscg/Modalize';
import ScrollTabs from '#rscv/ScrollTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Message from '#rscv/Message';

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

const orderedKeys = {
    general: {
        dateOfReceipt: '',
        abstract: '',
        purpose: '',
        descriptiveKeyword: '',
    },
    metadataRecordInfo: {
        language: '',
        charset: '',
        hierarchyLevel: '',
        date: '',
        standardName: '',
    },
    contact: {
        name: '',
        organizationName: '',
        positionName: '',
        role: '',
        email: '',
    },
    identificationInfo: {
        title: '',
        date: '',
        dateType: '',
        abstract: '',
        purpose: '',
        status: '',
        charset: '',
        topicCategory: '',
        spaticalRepresentationType: '',
        spaticalResolutionEquivalentScale: '',
    },
    pointOfContact: {
        name: '',
        organizationName: '',
        positionName: '',
        role: '',
    },
    geographicExtend: {
        geographicExtend: '',
        geographicExtendEast: '',
        geographicExtendWest: '',
        geographicExtendNorth: '',
        geographicExtendSouth: '',
    },
    resourceMaintenanceInformation: {
        maintenanceAndUpdateFrequency: '',
        userDefinedUpdateFrequency: '',
        dateOfNextUpdate: '',
    },
    legalConstraints: {
        useLimitation: '',
        accessConstraints: '',
        useConstraints: '',
    },
    referenceSystemInformation: {
        code: '',
    },
    dataQualityInfo: {
        hierarchyLevel: '',
        statement: '',
    },
    distributorInfo: {
        individualName: '',
        organizationName: '',
        positionName: '',
        email: '',
        role: '',
    },
};

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
            component: () => {
                const { layer } = this.props;

                if (!layer.longDescription) {
                    return (
                        <div className={styles.details}>
                            <Message>
                                Not available
                            </Message>
                        </div>
                    );
                }

                return (
                    <div className={styles.details}>
                        <div
                            className={styles.content}
                            dangerouslySetInnerHTML={{
                                __html: layer.longDescription,
                            }}
                        />
                    </div>
                );
            },
        },
        metadata: {
            component: () => {
                const {
                    layer,
                } = this.props;

                if (!layer.metadata) {
                    return (
                        <div className={styles.metadata}>
                            <Message>
                                Not available
                            </Message>
                        </div>
                    );
                }

                const groups = layer.metadata.value;
                const orderedKeyList = Object.keys(orderedKeys);

                return (
                    <div className={styles.metadata}>
                        { orderedKeyList.map((groupKey) => {
                            const group = groups[groupKey];
                            if (!group) {
                                return null;
                            }

                            const orderGroup = orderedKeys[groupKey];


                            return (
                                <div
                                    key={groupKey}
                                    className={styles.group}
                                >
                                    <div className={styles.groupTitle}>
                                        { camelToNormal(groupKey) }
                                    </div>
                                    <div className={styles.rows}>
                                        { Object.keys(orderGroup).map((mk) => {
                                            const metadata = group[mk];

                                            if (!metadata) {
                                                return null;
                                            }

                                            return (
                                                <div
                                                    className={styles.metadataItem}
                                                    key={mk}
                                                >
                                                    <div className={styles.label}>
                                                        {camelToNormal(mk)}
                                                    </div>
                                                    <div className={styles.value}>
                                                        {metadata || '-'}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            },
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
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"
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
