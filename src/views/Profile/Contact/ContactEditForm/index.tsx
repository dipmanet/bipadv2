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

import Icon from '#rscg/Icon';
import Modal from '#rscv/Modal';
import LoadingAnimation from '#rscv/LoadingAnimation';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import TextInput from '#rsci/TextInput';
import NumberInput from '#rsci/NumberInput';
import SelectInput from '#rsci/SelectInput';
import SimpleCheckbox from '#rsu/../v2/Input/Checkbox';
import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import LocationInput from '#components/LocationInput';
import FullStepwiseRegionSelectInput from '#components/FullStepwiseRegionSelectInput';

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

interface OwnProps {
    contactId?: Contact['id'];
    details?: Contact;
    onEditSuccess?: (contactId: Contact['id'], contact: Contact) => void;
    onAddSuccess?: (contact: Contact) => void;
    closeModal?: () => void;
}

// TODO: Write appropriate types
interface FaramValues {
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
}

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    municipalityContactEditRequest: {
        url: ({ props }) => `/municipality-contact/${props.contactId}/`,
        method: methods.PATCH,
        body: ({ params }) => params && params.body,
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
        query: {
            expand: ['trainings', 'organization'],
        },
    },
    municipalityContactAddRequest: {
        url: '/municipality-contact/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
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
        query: {
            expand: ['trainings', 'organization'],
        },
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

const getLocationDetails = (point) => {
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

class ContactForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            details,
            requests: {
                organizationGetRequest,
            },
        } = this.props;

        let faramValues = {
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
            stepwiseRegion,
            location,
            ...others
        } = faramValues;

        const newBody = {
            province: stepwiseRegion.province,
            ward: stepwiseRegion.ward,
            municipality: stepwiseRegion.municipality,
            district: stepwiseRegion.district,
            point: location && location.geoJson.features[0].geometry,
            ...others,
        };

        if (isDefined(contactId)) {
            municipalityContactEditRequest.do({
                body: newBody,
                setPristine: this.setPristine,
            });
        } else {
            municipalityContactAddRequest.do({
                body: newBody,
            });
        }
    }

    private handleContactTrainingListChange = (newList: ContactTraining[]) => {
        const {
            onEditSuccess,
            contactId,
        } = this.props;

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

        console.warn('here', details, faramValues);

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
                        <Button
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"
                            transparent
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
                        disabled={organizationPending}
                    >
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
                        <NumberInput
                            faramElementName="workNumber"
                            label="Work Number"
                        />
                        <NumberInput
                            faramElementName="mobileNumber"
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
                        <StepwiseRegionSelectInput
                            faramElementName="stepwiseRegion"
                        />
                        <TextInput
                            faramElementName="communityAddress"
                            label="Community Address"
                        />
                        <LocationInput
                            className={styles.locationInput}
                            faramElementName="location"
                        />
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
