import React from 'react';
import Redux, {
    compose,
} from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

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

const keySelector = (d: PageType.Field) => d.id;
const labelSelector = (d: PageType.Field) => (
    d.unit ? `${d.title} (${d.unit})` : d.title
);

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
                ? `/inventory-category/${props.value.id}/`
                : '/inventory-category/'
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
    },
};

class AddCategoryForm extends React.PureComponent<Props, State> {
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
        };
    }

    private static schema = {
        fields: {
            title: [requiredCondition],
            titleNe: [],
            description: [],
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
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

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
                    schema={AddCategoryForm.schema}
                    value={faramValues}
                    error={faramErrors}
                    disabled={pending}
                >
                    <ModalHeader
                        title={
                            value ? 'Edit Cluster' : 'Add Cluster'
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
                            faramElementName="titleNe"
                            label="Title Nepali"
                        />
                        <TextArea
                            faramElementName="description"
                            label="Description"
                        />


                        {/*
                        <SelectInput
                            faramElementName="resource"
                            options={resourceList}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            label="Resource"
                        />
                        */}
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
)(AddCategoryForm);
