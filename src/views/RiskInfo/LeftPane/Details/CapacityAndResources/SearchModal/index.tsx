/* eslint-disable max-len */
import React from 'react';
import { _cs, Obj } from '@togglecorp/fujs';
import Faram from '@togglecorp/faram';
import { connect } from 'react-redux';
import { Translation } from 'react-i18next';
import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import DangerButton from '#rsca/Button/DangerButton';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import ModalFooter from '#rscv/Modal/Footer';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import * as PageType from '#store/atom/page/types';
import {
    createRequestClient,
    NewProps,
    createConnectedRequestCoordinator,
} from '#request';

import {
    setPalikaRedirectAction,
} from '#actionCreators';
import { hazardTypesSelector, languageSelector, palikaRedirectSelector } from '#selectors';
import styles from './styles.scss';
import SelectInput from '#rsci/SelectInput';

const mapStateToProps = (state, props) => ({
    palikaRedirect: palikaRedirectSelector(state),
    language: languageSelector(state),
    hazard: hazardTypesSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
});

const ModalButton = modalize(Button);

interface InventoryItemProps {
    className?: string;
    data: PageType.Inventory;
    onUpdate?: () => void;
    onDelete?: (itemId: number) => void;
    disabled?: boolean;
    resourceId: number;
}

interface OwnProps {
    className?: string;
    resourceId: number;
    closeModal?: () => void;
}

interface StateProps {
    hazardTypes: Obj<PageType.HazardType>;
}

interface State {
}

interface Params {
    inventoryId?: number;
}

type Props = NewProps<OwnProps, Params>;


class SearchModal extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            faramValues: {},
            faramErrors: {},
            pristine: true,
            selectedCategory: 1,
            selectedCategoryName: 'Inventories',
        };
    }

    private static schema = {
        fields: {
            data: [],
        },
    };

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
        this.setState({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    private handleFaramValidationFailure = (faramErrors: FaramErrors) => {
        this.setState({
            faramErrors,
        });
    }

    private handleSearch = () => {
        const { resourceList, searchedResourceCoordinateData, closeModal } = this.props;
        const { faramValues } = this.state;
        const data = resourceList.find(i => i.id === faramValues.data);
        const { point: { coordinates } } = data;
        searchedResourceCoordinateData(coordinates);
        closeModal();
    }

    public render() {
        const {
            className,
            closeModal,
            language: { language },
            resourceList,
        } = this.props;
        const { faramValues, faramErrors, pristine } = this.state;

        const keySelector = (d: PageType.Field) => d.id;
        const labelSelector = (d: PageType.Field) => (
            language === 'en' ? d.title : d.titleNe || d.title
        );
        return (
            <Modal className={_cs(styles.inventoriesModal, className)}>
                {/* {pending && <LoadingAnimation />} */}
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    schema={SearchModal.schema}
                    value={faramValues}
                    error={faramErrors}
                // disabled={pending}
                >
                    <Translation>
                        {
                            t => (
                                <>
                                    <ModalHeader
                                        title={t('Search Resources')}
                                        rightComponent={(
                                            <DangerButton
                                                transparent
                                                iconName="close"
                                                onClick={closeModal}
                                                title="Close Modal"
                                            />
                                        )}
                                    />
                                    <ModalBody className={styles.modalBody}>
                                        <SelectInput
                                            faramElementName="data"
                                            options={resourceList}
                                            keySelector={keySelector}
                                            labelSelector={labelSelector}
                                            label={t('Resources')}
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <DangerButton onClick={closeModal}>
                                            {t('Close')}
                                        </DangerButton>
                                        <PrimaryButton
                                            type="submit"
                                            disabled={pristine}
                                            onClick={this.handleSearch}
                                        >
                                            {t('Search')}
                                        </PrimaryButton>
                                    </ModalFooter>
                                </>
                            )
                        }
                    </Translation>
                </Faram>
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient()(
            SearchModal,
        ),
    ),
);
