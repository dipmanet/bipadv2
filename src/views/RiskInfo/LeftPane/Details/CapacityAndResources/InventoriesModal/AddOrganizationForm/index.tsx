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
import LocationInput from '#components/LocationInput';

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
        url: '/organization/',
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
    addOrganizationPostRequest: {
        url: ({ props }) => (
            props.value
                ? `/organization/${props.value.id}/`
                : '/organization/'
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

class AddOrganizationForm extends React.PureComponent<Props, State> {
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
            shortName: [requiredCondition],
            longName: [],
            description: [],
            incidentVerificationDuration: [],
            location: [requiredCondition],
            wards: [],
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
            requests: { addOrganizationPostRequest },
            resourceId,
        } = this.props;
        console.log('This is final faram values', faramValues);

        addOrganizationPostRequest.do({
            body: {
                ...faramValues,
                resource: resourceId,
                wards: faramValues.location.wards,
            },
            setFaramErrors: this.handleFaramValidationFailure,
        });
    }

    private multipleSelectFunctionType = (array, language) => {
        const data = array.length && array.map(item => ({ value: item.id, label: language === 'en' ? item.title : item.titleNe }));
        return data;
    }

    public render() {
        const {
            className,
            closeModal,
            inventoryItemList,
            // resourceList,
            requests: {
                addOrganizationPostRequest: {
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

        console.log('This is faram values', faramValues);
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
                    schema={AddOrganizationForm.schema}
                    value={faramValues}
                    error={faramErrors}
                    disabled={pending}
                >
                    <ModalHeader
                        title={
                            value ? 'Edit Item' : 'Add Item'
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
                        <NonFieldErrors faramElement />

                        <TextArea
                            faramElementName="title"
                            label="Title"
                        />
                        <TextArea
                            faramElementName="shortName"
                            label="Short Name"
                        />
                        <TextArea
                            faramElementName="longName"
                            label="Long Name"
                        />
                        <TextArea
                            faramElementName="description"
                            label="Description"
                        />
                        <NumberInput
                            faramElementName="incidentVerificationDuration"
                            label="Incident Verification Duration"
                        />
                        <LocationInput
                            className={styles.locationInput}
                            faramElementName="location"
                        // classCategory={styles.locationInput}

                        />
                    </ModalBody>
                    <ModalFooter>
                        <DangerButton onClick={closeModal}>
                            Close
                        </DangerButton>
                        <PrimaryButton
                            type="submit"
                            disabled={pristine}
                            pending={pending}
                        >
                            Save
                        </PrimaryButton>
                    </ModalFooter>
                </Faram>
            </Modal>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requests),
)(AddOrganizationForm);
