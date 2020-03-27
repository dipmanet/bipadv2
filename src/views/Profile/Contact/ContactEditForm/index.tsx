import React from 'react';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';
import Faram, {
    FaramInputElement,
    requiredCondition,
    emailCondition,
} from '@togglecorp/faram';

import Modal from '#rscv/Modal';
import LoadingAnimation from '#rscv/LoadingAnimation';
import ModalHeader from '#rscv/Modal/Header';
import Message from '#rscv/Message';
import ModalBody from '#rscv/Modal/Body';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import SimpleCheckbox from '#rsu/../v2/Input/Checkbox';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import RawFileInput from '#rsci/RawFileInput';
import LocationInput from '#components/LocationInput';
import NonFieldErrors from '#rsci/NonFieldErrors';

import FullStepwiseRegionSelectInput, {
    RegionValuesAlt,
} from '#components/FullStepwiseRegionSelectInput';


import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { MultiResponse } from '#store/atom/response/types';
import {
    Contact,
    Organization,
    Training as ContactTraining,
} from '#store/atom/page/types';

import {
    committeeValueList,
    committeeKeySelector,
    committeeLabelSelector,
} from '../utils';

import ContactTrainingList from './ContactTrainingList';
import styles from './styles.scss';

const StepwiseRegionSelectInput = FaramInputElement(FullStepwiseRegionSelectInput);

const Checkbox = FaramInputElement(SimpleCheckbox);

const getLocationDetails = (point: unknown) => {
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
    });
};

interface OwnProps {
    contactId?: Contact['id'];
    details?: Contact;
    onEditSuccess?: (contactId: Contact['id'], contact: Contact) => void;
    onAddSuccess?: (contact: Contact) => void;
    closeModal?: () => void;
}

// TODO: Write appropriate types
interface FaramValues {
    name?: string | null;
    position?: string | null;
    email?: string | null;
    image?: File | null;
    workNumber?: string | null;
    mobileNumber?: string | null;
    isDrrFocalPerson?: boolean | null;
    organization?: number | null;
    committee?: Contact['committee'] | null;
    stepwiseRegion?: RegionValuesAlt | null;
    communityAddress?: string | null;
    location?: ReturnType<typeof getLocationDetails> | null;
}

interface FaramErrors {
}

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
    organizationList?: Organization[];
}

interface Params {
    body?: FaramValues;
    setPristine?: (pristine: boolean) => void;
    setOrganizationList?: (organizationList: Organization[]) => void;
    setFaramErrors?: (error: object) => void;
}

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    municipalityContactEditRequest: {
        url: ({ props }) => `/municipality-contact/${props.contactId}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
        query: {
            expand: ['trainings', 'organization'],
        },
        onSuccess: ({ response, props, params }) => {
            const editedContact = response as Contact;
            const {
                contactId,
                onEditSuccess,
            } = props;
            if (onEditSuccess && contactId) {
                onEditSuccess(contactId, editedContact);
            }
            if (params && params.setPristine) {
                params.setPristine(true);
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
    municipalityContactAddRequest: {
        url: '/municipality-contact/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        query: {
            expand: ['trainings', 'organization'],
        },
        onSuccess: ({ response, props }) => {
            const editedContact = response as Contact;
            const { onAddSuccess, closeModal } = props;
            if (onAddSuccess) {
                onAddSuccess(editedContact);
            }
            if (closeModal) {
                closeModal();
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
    organizationGetRequest: {
        url: '/organization/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, params }) => {
            const organizationList = response as MultiResponse<Organization>;

            if (params && params.setOrganizationList) {
                params.setOrganizationList(organizationList.results);
            }
        },
    },
};

const organizationKeySelector = (o: Organization) => o.id;
const organizationLabelSelector = (o: Organization) => o.title;

class ContactForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            details,
            requests: {
                organizationGetRequest,
            },
        } = this.props;

        let faramValues: FaramValues = {
            isDrrFocalPerson: false,
            stepwiseRegion: {},
        };

        if (details) {
            const {
                province,
                district,
                municipality,
                ward,
                isDrrFocalPerson,
                organization,
                point,
                image, // just capturing this here
                ...otherValues
            } = details;

            faramValues = {
                ...otherValues,
                isDrrFocalPerson: !!isDrrFocalPerson,
                organization: organization ? organization.id : undefined,
                location: point && getLocationDetails(point),
                stepwiseRegion: {
                    province,
                    district,
                    ward,
                    municipality,
                },
            };
        }

        organizationGetRequest.setDefaultParams({ setOrganizationList: this.setOrganizationList });

        this.state = {
            faramValues,
            faramErrors: {},
            pristine: true,
        };
    }

    private static schema = {
        fields: {
            name: [requiredCondition],
            position: [requiredCondition],
            email: [emailCondition],
            workNumber: [],
            mobileNumber: [],
            isDrrFocalPerson: [],
            committee: [requiredCondition],
            image: [],
            communityAddress: [],
            location: [],
            organization: [],
            stepwiseRegion: [],
        },
    }

    private setPristine = (pristine: boolean) => {
        this.setState({ pristine });
    }

    private setOrganizationList = (organizationList: Organization[]) => {
        this.setState({ organizationList });
    }

    private handleFaramValidationFailure = (faramErrors: object) => {
        this.setState({
            faramErrors,
            pristine: true,
        });
    }

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
        this.setState({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    private handleFaramValidationSuccess = (faramValues: FaramValues) => {
        const {
            requests: {
                municipalityContactEditRequest,
                municipalityContactAddRequest,
            },
            contactId,
        } = this.props;

        const {
            name,
            position,
            email,
            workNumber,
            mobileNumber,
            isDrrFocalPerson,
            communityAddress,
            stepwiseRegion,
            location,
            image,
            organization,
            committee,
        } = faramValues;

        const point = location
            ? JSON.stringify(location.geoJson.features[0].geometry)
            : undefined;

        const body = {
            name,
            position,
            email,
            point,
            workNumber,
            mobileNumber,
            isDrrFocalPerson,
            communityAddress,
            committee,
            image,
            organization,

            province: stepwiseRegion && stepwiseRegion.province,
            ward: stepwiseRegion && stepwiseRegion.ward,
            municipality: stepwiseRegion && stepwiseRegion.municipality,
            district: stepwiseRegion && stepwiseRegion.district,
        };

        // NOTE; not un-setting image when user doesn't pick a new image
        if (body.image === null) {
            body.image = undefined;
        }

        if (isDefined(contactId)) {
            municipalityContactEditRequest.do({
                body,
                setPristine: this.setPristine,
                setFaramErrors: this.handleFaramValidationFailure,
            });
        } else {
            municipalityContactAddRequest.do({
                body,
                setFaramErrors: this.handleFaramValidationFailure,
            });
        }
    }

    private handleContactTrainingListChange = (newList: ContactTraining[]) => {
        const {
            onEditSuccess,
            contactId,
        } = this.props;

        // FIXME: this looks problematic
        if (contactId && onEditSuccess) {
            onEditSuccess(contactId, { trainings: newList });
        }
    }

    public render() {
        const {
            contactId,
            closeModal,
            requests: {
                organizationGetRequest: { pending: organizationPending },
                municipalityContactEditRequest: { pending: contactEditPending },
                municipalityContactAddRequest: { pending: contactAddPending },
            },
            details,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
            organizationList,
        } = this.state;

        return (
            <Modal
                className={_cs(
                    styles.contactFormModal,
                    isDefined(contactId) && styles.largeModal,
                )}
            >
                <ModalHeader
                    title={isDefined(contactId) ? 'Edit Contact' : 'Add Contact'}
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
                    {organizationPending && <LoadingAnimation />}
                    <Faram
                        className={styles.form}
                        onChange={this.handleFaramChange}
                        onValidationFailure={this.handleFaramValidationFailure}
                        onValidationSuccess={this.handleFaramValidationSuccess}
                        schema={ContactForm.schema}
                        value={faramValues}
                        error={faramErrors}
                        disabled={organizationPending || contactEditPending || contactAddPending}
                    >
                        <NonFieldErrors faramElementName />
                        <div className={styles.inputsContainer}>
                            <NonFieldErrors faramElement />
                            <TextInput
                                faramElementName="name"
                                label="Name"
                                placeholder="Hari"
                                autoFocus
                            />
                            <TextInput
                                faramElementName="position"
                                label="Position"
                                placeholder="Officer"
                            />
                            <TextInput
                                faramElementName="email"
                                label="Email"
                                placeholder="ram@neoc.gov.np"
                            />
                        </div>
                        <div className={styles.inputsContainer}>
                            <div className={styles.imageContainer}>
                                {details && details.image ? (
                                    <>
                                        <div>
                                            Previous Image
                                        </div>
                                        <img
                                            className={styles.image}
                                            src={details.image}
                                            alt="profile"
                                        />
                                    </>
                                ) : (
                                    <div className={styles.noImageMessage}>
                                        <Message>
                                            No Image Available
                                        </Message>
                                    </div>
                                )}
                                <RawFileInput
                                    faramElementName="image"
                                    showStatus
                                    accept="image/*"
                                >
                                    Upload Image
                                </RawFileInput>
                            </div>
                            <div className={styles.verticalInputsContainer}>
                                <TextInput
                                    faramElementName="workNumber"
                                    type="number"
                                    label="Work Number"
                                />
                                <TextInput
                                    faramElementName="mobileNumber"
                                    type="number"
                                    label="Mobile Number"
                                />
                                <Checkbox
                                    className={styles.checkbox}
                                    faramElementName="isDrrFocalPerson"
                                    label="Is DRR Focal Person"
                                />
                                <SelectInput
                                    faramElementName="organization"
                                    label="Organization"
                                    options={organizationList}
                                    keySelector={organizationKeySelector}
                                    labelSelector={organizationLabelSelector}
                                />
                                <SelectInput
                                    faramElementName="committee"
                                    label="Committee"
                                    options={committeeValueList}
                                    keySelector={committeeKeySelector}
                                    labelSelector={committeeLabelSelector}
                                />
                            </div>
                        </div>
                        <div className={styles.inputsContainer}>
                            <TextInput
                                faramElementName="communityAddress"
                                label="Community Address"
                            />
                            <StepwiseRegionSelectInput
                                className={styles.stepwiseInput}
                                faramElementName="stepwiseRegion"
                                showHintAndError
                            />
                        </div>
                        <div className={styles.inputsContainer}>
                            <LocationInput
                                className={styles.locationInput}
                                faramElementName="location"
                            />
                        </div>
                        <div className={styles.actionButtons}>
                            <PrimaryButton
                                disabled={pristine}
                                className={styles.button}
                                pending={contactEditPending || contactAddPending}
                                type="submit"
                            >
                                Save
                            </PrimaryButton>
                        </div>
                    </Faram>
                    {isDefined(contactId) && (
                        <ContactTrainingList
                            className={styles.trainingList}
                            contactId={contactId}
                            onListChange={this.handleContactTrainingListChange}
                        />
                    )}
                </ModalBody>
            </Modal>
        );
    }
}

export default createRequestClient(requests)(ContactForm);
