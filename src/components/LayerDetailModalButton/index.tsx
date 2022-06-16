/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
import React from 'react';
import {
    _cs,
    camelToNormal,
} from '@togglecorp/fujs';

import { connect } from 'react-redux';
import { Translation } from 'react-i18next';
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
import { languageSelector } from '#selectors';

interface Props {
    className?: string;
    layer: Layer;
    language: { language: string };
}

const ModalButton = modalize(Button);

interface ModalProps {
    className?: string;
    layer: Layer;
    language: string;
    closeModal?: () => void;
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});

// const orderedKeys = {
//     general: {
//         dateOfReceipt: '',
//         abstract: '',
//         purpose: '',
//         descriptiveKeyword: '',
//     },
//     metadataRecordInfo: {
//         language: '',
//         charset: '',
//         hierarchyLevel: '',
//         date: '',
//         standardName: '',
//     },
//     contact: {
//         name: '',
//         organizationName: '',
//         positionName: '',
//         role: '',
//         email: '',
//     },
//     identificationInfo: {
//         title: '',
//         date: '',
//         dateType: '',
//         abstract: '',
//         purpose: '',
//         status: '',
//         charset: '',
//         topicCategory: '',
//         spaticalRepresentationType: '',
//         spaticalResolutionEquivalentScale: '',
//     },
//     pointOfContact: {
//         name: '',
//         organizationName: '',
//         positionName: '',
//         role: '',
//     },
//     geographicExtend: {
//         geographicExtend: '',
//         geographicExtendEast: '',
//         geographicExtendWest: '',
//         geographicExtendNorth: '',
//         geographicExtendSouth: '',
//     },
//     resourceMaintenanceInformation: {
//         maintenanceAndUpdateFrequency: '',
//         userDefinedUpdateFrequency: '',
//         dateOfNextUpdate: '',
//     },
//     legalConstraints: {
//         useLimitation: '',
//         accessConstraints: '',
//         useConstraints: '',
//     },
//     referenceSystemInformation: {
//         code: '',
//     },
//     dataQualityInfo: {
//         hierarchyLevel: '',
//         statement: '',
//     },
//     distributorInfo: {
//         individualName: '',
//         organizationName: '',
//         positionName: '',
//         email: '',
//         role: '',
//     },
// };

const orderedKeys = {
    general: {
        datasetTitle: '',
        datasetCreationDate: '',
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
        dataType: '',
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
        email: '',
    },
    geographicExtent: {
        geographicExtentEast: '',
        geographicExtentWest: '',
        geographicExtentNorth: '',
        geographicExtentSouth: '',
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
        details: this.props.language === 'en' ? 'Details' : 'विवरण',
        metadata: this.props.language === 'en' ? 'Metadata' : 'मेटाडेटा',
    }

    private views = {
        details: {
            component: () => {
                const { layer, language } = this.props;

                if (!layer.longDescription) {
                    return (
                        <div className={styles.details}>
                            <Message>
                                {language === 'en' ? 'Not available' : 'उपलब्ध छैन'}
                            </Message>
                        </div>
                    );
                }

                return (
                    <div className={styles.details}>
                        <div
                            className={styles.content}
                            dangerouslySetInnerHTML={{
                                __html: language === 'en'
                                    ? layer.longDescription
                                    : layer.longDescriptionNe === undefined
                                        ? layer.longDescription
                                        : layer.longDescriptionNe,
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
                    language,
                } = this.props;
                if (!layer.metadata) {
                    return (
                        <div className={styles.metadata}>
                            <Message>
                                {language === 'en' ? 'Not available' : 'उपलब्ध छैन'}
                            </Message>
                        </div>
                    );
                }

                const groups = layer.metadata.value;
                const orderedKeyList = Object.keys(orderedKeys);

                return (
                    <div className={styles.metadata}>
                        {orderedKeyList.map((groupKey) => {
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
                                        {camelToNormal(groupKey)}
                                    </div>
                                    <div className={styles.rows}>
                                        {Object.keys(orderGroup).map((mk) => {
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
            <Translation>
                {
                    t => (
                        <Modal className={_cs(styles.layerDetailModal, className)}>
                            <ModalHeader
                                title={t('Layer details')}
                                rightComponent={(
                                    <DangerButton
                                        transparent
                                        iconName="close"
                                        onClick={closeModal}
                                        title={t('Close Modal')}
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
                    )
                }
            </Translation>

        );
    }
}

class LayerDetailModalButton extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            layer,
            disabled,
            language: { language },
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
                        language={language}
                    />
                )}
            />
        );
    }
}

export default connect(mapStateToProps)(LayerDetailModalButton);
