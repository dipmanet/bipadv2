/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import Redux, {
    compose,
} from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';
import { Translation } from 'react-i18next';
import Select from 'react-select';
import NonFieldErrors from '#rsci/NonFieldErrors';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';
import NumberInput from '#rsci/NumberInput';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import {
    setInventoryItemListActionRP,
    // setResourceListActionRP,
} from '#actionCreators';
import {
    // resourceListSelectorRP,
    inventoryItemListSelectorRP,
} from '#selectors';

import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import RawFileInput from '#rsci/RawFileInput';
import styles from './styles.scss';

interface Params {
    body: object;
    onSuccess?: () => void;
    setFaramErrors?: (error: object) => void;
}
interface OwnProps {
    closeModal?: () => void;
    value?: PageType.Inventory;
    onUpdate?: () => void;
    className?: string;
    resourceId: number;
}
interface PropsFromState {
    inventoryItemList: PageType.InventoryItem[];
    // resourceList: PageType.Resource[];
}
interface PropsFromDispatch {
    setInventoryItemList: typeof setInventoryItemListActionRP;
    // setResourceList: typeof setResourceListActionRP;
}

type FaramValues = Partial<PageType.Inventory>;
interface FaramErrors {
}
interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}
type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    // resourceList: resourceListSelectorRP(state),
    inventoryItemList: inventoryItemListSelectorRP(state),
});
const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setInventoryItemList: params => dispatch(setInventoryItemListActionRP(params)),
    // setResourceList: params => dispatch(setResourceListActionRP(params)),
});


const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    inventoryItemListGetRequest: {
        url: '/inventory-item/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props: { setInventoryItemList } }) => {
            interface Response { results: PageType.InventoryItem[] }
            const { results: inventoryItemList = [] } = response as Response;
            setInventoryItemList({ inventoryItemList });
        },
    },
    /*
    resourceListGetRequest: {
        url: '/resource/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props: { setResourceList } }) => {
            interface Response { results: PageType.Resource[] }
            const { results: resourceList = [] } = response as Response;
            setResourceList({ resourceList });
        },
    },
    */
    addClusterPostRequest: {
        url: ({ props }) => (
            props.value
                ? `/inventory-item/${props.value.id}/`
                : '/inventory-item/'
        ),
        method: ({ props }) => (
            props.value
                ? methods.PATCH
                : methods.POST
        ),
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ props }) => {
            if (props.onUpdate) {
                props.onUpdate();
            }
            if (props.closeModal) {
                props.closeModal();
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                // TODO: handle error
                console.warn('failure', error);
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
        onFatal: ({ params }) => {
            if (params && params.setFaramErrors) {
                params.setFaramErrors({
                    $internal: ['Some problem occurred'],
                });
            }
        },
        extras: { hasFile: true },
    },
};

class AddItemForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            ...otherValues
        } = props.value || {};

        this.state = {
            faramValues: {
                ...otherValues,
            },
            faramErrors: {},
            pristine: true,
            selectedClusters: null,
            selectedCategories: null,
            selectedHazard: null,
        };
    }

    private static schema = {
        fields: {
            title: [requiredCondition],
            titleNe: [],
            shortDescription: [],
            description: [],
            unitNp: [],
            unit: [],
            image: [],
            dimension: [],
            occupency: [],
            code: [],
            unitLink: [],
            categories: [],
            clusters: [],
            hazards: [],
        },
    };

    private handleClusters = (selectedOption) => {
        this.setState({ selectedClusters: selectedOption }, () => {
            const data = this.state.selectedClusters.map(item => item.value);
            this.setState({
                faramValues: { ...this.state.faramValues, clusters: data },
            });
        });
    };

    private handleCategories = (selectedOption) => {
        this.setState({ selectedCategories: selectedOption }, () => {
            const data = this.state.selectedCategories.map(item => item.value);
            this.setState({
                faramValues: { ...this.state.faramValues, categories: data },
            });
        });
    };

    private handleHazard = (selectedOption) => {
        this.setState({ selectedHazard: selectedOption }, () => {
            const data = this.state.selectedHazard.map(item => item.value);
            this.setState({
                faramValues: { ...this.state.faramValues, hazards: data },
            });
        });
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

    private handleFaramValidationSuccess = (faramValues: FaramValues) => {
        const {
            requests: { addClusterPostRequest },
            resourceId,
        } = this.props;


        addClusterPostRequest.do({
            body: {
                ...faramValues,
                resource: resourceId,
            },
            setFaramErrors: this.handleFaramValidationFailure,
        });
    }

    private multipleSelectFunctionType = (array, language) => {
        const data = array.length && array.map(item => ({ value: item.id, label: language === 'en' ? item.title : item.titleNe || item.title }));
        return data;
    }

    public render() {
        const {
            className,
            closeModal,
            inventoryItemList,
            // resourceList,
            requests: {
                addClusterPostRequest: {
                    pending,
                },
            },
            value,
            unitList,
            categoriesList,
            clustersList,
            language,
            hazard,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
            selectedCategories,
            selectedClusters,
            selectedHazard,
        } = this.state;
        const keySelector = (d: PageType.Field) => d.id;
        const labelSelector = (d: PageType.Field) => (
            language === 'en' ? d.title : d.titleNe
        );
        const categoriesRenderlist = this.multipleSelectFunctionType(categoriesList, language);
        const clusterRenderlist = this.multipleSelectFunctionType(clustersList, language);
        const hazardRenderlist = this.multipleSelectFunctionType(hazard, language);
        return (
            <Modal
                className={_cs(styles.addInventoryModal, className)}
            // onClose={closeModal}
            // closeOnEscape
            >
                {pending && <LoadingAnimation />}
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={AddItemForm.schema}
                    value={faramValues}
                    error={faramErrors}
                    disabled={pending}
                >
                    <Translation>
                        {
                            t => (
                                <>
                                    <ModalHeader
                                        title={
                                            value ? t('Edit Item') : t('Add Item')
                                        }
                                        rightComponent={(
                                            <DangerButton
                                                transparent
                                                iconName="close"
                                                onClick={closeModal}
                                                title={t('Close Modal')}
                                            />
                                        )}
                                    />
                                    <ModalBody>
                                        <NonFieldErrors faramElement />
                                        <TextArea
                                            faramElementName="title"
                                            label={t('Title')}
                                        />
                                        <TextArea
                                            faramElementName="titleNe"
                                            label={t('Title Nepali')}
                                        />
                                        <TextArea
                                            faramElementName="shortDescription"
                                            label={t('Short Description')}
                                        />
                                        <TextArea
                                            faramElementName="description"
                                            label={t('Description')}
                                        />

                                        <TextArea
                                            faramElementName="dimension"
                                            label={t('Dimension')}

                                        />
                                        <NumberInput
                                            faramElementName="occupency"
                                            label={t('Occupancy')}
                                        />
                                        <TextArea
                                            faramElementName="code"
                                            label={t('Code')}
                                        />
                                        <SelectInput
                                            faramElementName="unitLink"
                                            options={unitList}
                                            keySelector={keySelector}
                                            labelSelector={labelSelector}
                                            label={t('Unit')}
                                        />
                                        <div>
                                            <pre style={{
                                                fontWeight: '700',
                                                margin: '5px 0px',
                                                color: 'rgba(0, 0, 0, 0.6)',
                                                textTransform: 'uppercase',
                                                fontSize: '10px',
                                                marginTop: '18px',
                                            }}
                                            >
                                                {t('Clusters')}

                                            </pre>
                                            <Select
                                                value={selectedClusters}
                                                options={clusterRenderlist}
                                                onChange={this.handleClusters}
                                                isMulti
                                            />
                                        </div>
                                        <div>
                                            <pre
                                                className={styles.multiselect}
                                                style={{
                                                    fontWeight: '700',
                                                    margin: '5px 0px',
                                                    color: 'rgba(0, 0, 0, 0.6)',
                                                    textTransform: 'uppercase',
                                                    fontSize: '10px',
                                                }}
                                            >
                                                {t('Categories')}

                                            </pre>
                                            <Select
                                                value={selectedCategories}
                                                options={categoriesRenderlist}
                                                onChange={this.handleCategories}
                                                isMulti

                                            />
                                        </div>

                                        <div>
                                            <pre style={{
                                                fontWeight: '700',
                                                margin: '5px 0px',
                                                color: 'rgba(0, 0, 0, 0.6)',
                                                textTransform: 'uppercase',
                                                fontSize: '10px',
                                                marginTop: '18px',
                                            }}
                                            >
                                                {t('Hazard')}

                                            </pre>
                                            <Select
                                                value={selectedHazard}
                                                options={hazardRenderlist}
                                                onChange={this.handleHazard}
                                                isMulti

                                            />
                                        </div>
                                        <div style={{ margin: '10px 0px' }}>
                                            <RawFileInput
                                                faramElementName="image"
                                                showStatus
                                                accept="image/*"
                                                language={language}
                                            >
                                                {t('Upload Image')}

                                            </RawFileInput>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <DangerButton onClick={closeModal}>
                                            {t('Close')}
                                        </DangerButton>
                                        <PrimaryButton
                                            type="submit"
                                            disabled={pristine}
                                            pending={pending}
                                        >
                                            {t('Save')}
                                        </PrimaryButton>
                                    </ModalFooter>
                                </>
                            )}
                    </Translation>
                </Faram>
            </Modal>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requests),
)(AddItemForm);
