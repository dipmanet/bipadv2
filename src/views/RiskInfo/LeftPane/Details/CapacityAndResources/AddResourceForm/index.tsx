import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
    _cs,
    isNotDefined,
    isDefined,
} from '@togglecorp/fujs';
import memoize from 'memoize-one';
import Faram from '@togglecorp/faram';

import LocationInput from '#components/LocationInput';
import NonFieldErrors from '#rsci/NonFieldErrors';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import SelectInput from '#rsci/SelectInput';
import TextInput from '#rsci/TextInput';
import TextArea from '#rsci/TextArea';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';
import { EnumItem, ModelEnum, ResourceTypeKeys } from '#types';
import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    enumOptionsSelector,
    resourceTypeListSelector,
} from '#selectors';

import EducationFields from './EducationFields';
import HealthFields from './HealthFields';
import FinanceFields from './FinanceFields';
import GovernanceFields from './GovernanceFields';
import CulturalFields from './CulturalFields';
import TourismFields from './TourismFields';
import CommunicationFields from './CommunicationFields';
import IndustryFields from './IndustryFields';
import OpenspaceFields from './OpenspaceFields';
import CommunitySpaceFields from './CommunitySpaceFields';
import schemaMap, { defaultSchema } from './schema';

import styles from './styles.scss';
import HelipadFields from './HelipadFields';

const getLocationDetails = (point: unknown, ward?: number) => {
    const geoJson = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: point,
            },
        ],
    };

    return ({
        geoJson,
        region: {
            ward,
        },
    });
};

interface Params {
    resourceId?: number;
    body?: object;
    onSuccess?: (resource: PageType.Resource) => void;
    setFaramErrors?: (error: object) => void;
}
interface OwnProps {
    closeModal?: () => void;
    className?: string;
    resourceId?: number;
    resourceDetails?: PageType.Resource;
    onAddSuccess?: (resource: PageType.Resource) => void;
    onEditSuccess?: (resourceId: PageType.Resource['id'], resource: PageType.Resource) => void;
}

interface PropsFromState {
    resourceTypeList: PageType.ResourceType[];
    enumOptions: ModelEnum[];
}

interface PropsFromDispatch {
}

interface FaramValues {
    title?: string;
    description?: string;
    point?: string;
    location?: ReturnType<typeof getLocationDetails> | null;
    ward?: number;
    resourceType?: string;
}
interface FaramErrors {
}
interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
    resourceId?: number;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    resourceTypeList: resourceTypeListSelector(state),
    enumOptions: enumOptionsSelector(state),
});

const labelSelector = (d: PageType.Field) => d.title;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    addResourcePostRequest: {
        url: '/resource/',
        method: methods.POST,
        query: { meta: true },
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({
            params: { onSuccess } = { onSuccess: undefined },
            response,
        }) => {
            if (onSuccess) {
                onSuccess(response as PageType.Resource);
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
    editResourcePutRequest: {
        url: ({ params: { resourceId } }) => `/resource/${resourceId}/`,
        method: methods.PUT,
        query: { meta: true },
        body: ({ params: { body } = { body: {} } }) => body,
        onMount: false,
        onSuccess: ({
            params: { onSuccess } = { onSuccess: undefined },
            response,
        }) => {
            if (onSuccess) {
                onSuccess(response as PageType.Resource);
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

interface ExtraFieldProps {
    title: string;
    resourceEnums: EnumItem[];
    faramValues: FaramValues;
    resourceId: number | undefined;
    closeModal: () => void;
}

const ExtraFields = ({
    title,
    resourceEnums,
    faramValues,
    resourceId,
    closeModal,
}: ExtraFieldProps) => {
    switch (title) {
        case 'education':
            return (
                <EducationFields
                    resourceEnums={resourceEnums}
                />
            );

        case 'health':
            return (
                <HealthFields
                    resourceEnums={resourceEnums}
                />
            );

        case 'finance':
            return (
                <FinanceFields
                    resourceEnums={resourceEnums}
                />
            );

        case 'governance':
            return (
                <GovernanceFields
                    resourceEnums={resourceEnums}
                />
            );

        case 'cultural':
            return (
                <CulturalFields
                    resourceEnums={resourceEnums}
                />
            );
        case 'tourism':
            return (
                <TourismFields />
            );
        case 'communication':
            return (
                <CommunicationFields
                    resourceEnums={resourceEnums}
                />
            );
        case 'industry':
            return (
                <IndustryFields />
            );
        case 'openspace':
            return (
                <OpenspaceFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    resourceId={resourceId}
                    closeModal={closeModal}
                />
            );
        case 'communityspace':
            return (
                <CommunitySpaceFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    resourceId={resourceId}
                    closeModal={closeModal}
                />
            );
        case 'helipad':
            return (
                // <HelipadFields />
                null
            );
        default:
            return null;
    }
};

class AddResourceForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            resourceId,
            resourceDetails,
        } = this.props;

        let faramValues = {};
        if (resourceDetails) {
            const {
                point,
                ward,
            } = resourceDetails;

            faramValues = {
                ...resourceDetails,
                location: point && getLocationDetails(point, ward),
            };
        }

        this.state = {
            faramValues,
            faramErrors: {},
            pristine: true,
            resourceId,
        };
    }

    private getSchema = memoize((resourceType?: ResourceTypeKeys) => {
        if (resourceType) {
            return schemaMap[resourceType];
        }
        return defaultSchema;
    });

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

    private handleFaramValidationSuccess = (_: FaramValues, faramValues: FaramValues) => {
        const {
            location,
            ...others
        } = faramValues;
        const {
            resourceId,
        } = this.state;

        console.warn('here', faramValues);

        let values = others;
        if (location) {
            const point = location.geoJson.features[0].geometry;
            const { ward } = location.region;

            values = {
                ...values,
                point,
                ward,
            };
        }
        const {
            requests: {
                addResourcePostRequest,
                editResourcePutRequest,
            },
        } = this.props;

        if (isNotDefined(resourceId)) {
            addResourcePostRequest.do({
                body: values,
                onSuccess: this.handleAddResourceSuccess,
                setFaramErrors: this.handleFaramValidationFailure,
            });
        } else {
            editResourcePutRequest.do({
                resourceId,
                body: values,
                onSuccess: this.handleEditResourceSuccess,
                setFaramErrors: this.handleFaramValidationFailure,
            });
        }
    }


    private handleAddResourceSuccess = (resource: PageType.Resource) => {
        const { onAddSuccess, closeModal } = this.props;

        if (onAddSuccess) {
            onAddSuccess(resource);
        }

        this.setState({ resourceId: resource.id });
        closeModal();
    }

    private handleEditResourceSuccess = (resource: PageType.Resource) => {
        const { onEditSuccess, closeModal } = this.props;

        if (onEditSuccess) {
            onEditSuccess(resource.id, resource);
        }
        closeModal();
    }

    private filterEnumItem = (
        resourceEnums: ModelEnum[],
        resourceType: string,
    ) => {
        const options = resourceEnums.find(({ model }) => model.toLowerCase() === resourceType);
        if (options) {
            return options.enums;
        }
        return [];
    }

    public render() {
        const {
            className,
            closeModal,
            resourceTypeList,
            enumOptions,
            requests: {
                editResourcePutRequest: {
                    pending: editResourcePending,
                },
                addResourcePostRequest: {
                    pending: addResourcePending,
                }, addResourcePostRequest,
            },
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
            resourceId,
        } = this.state;

        const { resourceType } = faramValues;
        const schema = this.getSchema(resourceType as ResourceTypeKeys);

        let resourceEnums: EnumItem[] = [];
        if (resourceType) {
            resourceEnums = this.filterEnumItem(enumOptions, resourceType);
        }

        const hideButtons = resourceType === 'openspace' || resourceType === 'communityspace';
        return (
            <Modal
                className={_cs(styles.addResourceModal, className)}
            >
                <Faram
                    className={styles.form}
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalHeader
                        className={styles.header}
                        title="Add Data"
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
                        <NonFieldErrors faramElement />
                        <SelectInput
                            faramElementName="resourceType"
                            options={resourceTypeList}
                            keySelector={labelSelector}
                            labelSelector={labelSelector}
                            label="Resource Type"
                            autoFocus
                            disabled={isDefined(resourceId)}
                        />
                        <TextInput
                            faramElementName="title"
                            label="Title"
                        />
                        <TextArea
                            faramElementName="description"
                            label="Description"
                        />
                        <LocationInput
                            className={styles.locationInput}
                            faramElementName="location"
                        />
                        {
                            resourceType && (
                                <ExtraFields
                                    title={resourceType}
                                    resourceEnums={resourceEnums}
                                    resourceId={resourceId}
                                    faramValues={faramValues}
                                    closeModal={closeModal}
                                    addResourcePostRequest={addResourcePostRequest}
                                />
                            )
                        }
                    </ModalBody>
                    {
                        !hideButtons && (
                            <ModalFooter className={styles.footer}>
                                <DangerButton onClick={closeModal}>
                            Close
                                </DangerButton>
                                <PrimaryButton
                                    type="submit"
                                    disabled={pristine}
                                    pending={addResourcePending || editResourcePending}


                                >
                            Save
                                </PrimaryButton>
                            </ModalFooter>
                        )}
                </Faram>
            </Modal>
        );
    }
}

export default compose(
    connect(mapStateToProps),
    createRequestClient(requests),
)(AddResourceForm);
