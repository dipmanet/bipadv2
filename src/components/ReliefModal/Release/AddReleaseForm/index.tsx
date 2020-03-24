import React from 'react';
import Redux, {
    compose,
} from 'redux';
import { connect } from 'react-redux';
import Faram, { requiredCondition } from '@togglecorp/faram';

import TextInput from '#rsci/TextInput';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';
import LoadingAnimation from '#rscv/LoadingAnimation';
import NonFieldErrors from '#rsci/NonFieldErrors';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    AppState,
    EventElement,
    Release,
    Organization,
    Person,
    Status,
} from '#types';

import {
    Incident,
} from '#store/atom/page/types';

import {
    eventListSelector,
} from '#selectors';

import {
    setEventListAction,
} from '#actionCreators';
import { MultiResponse } from '#store/atom/response/types';

interface FaramValues {
    incident?: number;
}
interface FaramErrors {
}

interface OwnProps {
    closeModal?: () => void;
    onUpdate?: () => void;
    value?: Release;
}

interface PropsFromAppState {
    eventList: EventElement[];
}

interface PropsFromDispatch {
    setEventList: typeof setEventListAction;
}

interface State {
    faramValues: FaramValues;
    faramErrors: object;
    pristine: boolean;
}

interface Params {
    body?: object;
    incident?: number;
    onFailure?: (faramErrors: object) => void;
}

interface StatusOptions {
    id: Status;
    label: Status;
}

const statusList: StatusOptions[] = [
    {
        id: 'dead',
        label: 'dead',
    },
    {
        id: 'missing',
        label: 'missing',
    },
    {
        id: 'injured',
        label: 'injured',
    },
    {
        id: 'affected',
        label: 'affected',
    },
];
type PropsWithRedux = OwnProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<PropsWithRedux, Params>;

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    eventList: eventListSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEventList: params => dispatch(setEventListAction(params)),
});

const incidentKeySelector = (i: Incident) => i.id;
const incidentLabelSelector = (i: Incident) => i.title;
const organizationKeySelector = (o: Organization) => o.id;
const organizationLabelSelector = (o: Organization) => o.title;
const personKeySelector = (i: Person) => i.id;
const personLabelSelector = (i: Person) => i.name;
const statusKeySelector = (s: StatusOptions) => s.id;
const statusLabelSelector = (s: StatusOptions) => s.label;

const requestOptions: { [key: string]: ClientAttributes<PropsWithRedux, Params> } = {
    organizationGetRequest: {
        url: '/organization/',
        method: methods.GET,
        onMount: true,
    },
    incidentListGetRequest: {
        url: '/incident/',
        method: methods.GET,
        onMount: true,
    },
    peopleGetRequest: {
        url: '/loss-people/',
        query: ({ params: { incident } = { incident: undefined } }) => ({
            incident,
        }),
        method: methods.GET,
        onMount: false,
    },
    reliefReleaseAddRequest: {
        url: ({ props }) => (
            props.value
                ? `/relief-release/${props.value.id}/`
                : '/relief-release/'
        ),
        method: ({ props }) => (
            props.value
                ? methods.PATCH
                : methods.POST
        ),
        body: ({ params }) => params && params.body,
        onSuccess: ({ props }) => {
            if (props.onUpdate) {
                props.onUpdate();
            }
            if (props.closeModal) {
                props.closeModal();
            }
        },
        onFailure: ({ error, params: { onFailure } = { onFailure: undefined } }) => {
            if (onFailure) {
                onFailure((error as { faramErrors: object }).faramErrors);
            }
        },
    },
};

class AddReleaseForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const { value } = this.props;
        this.state = {
            faramValues: value as FaramValues,
            faramErrors: {},
            pristine: true,
        };

        this.schema = {
            fields: {
                providerOrganization: [requiredCondition],
                incident: [requiredCondition],
                district: [],
                municipality: [],
                ward: [],
                person: [requiredCondition],
                benificiary: [],
                benificiaryOther: [],
                status: [],
                amount: [requiredCondition],
                description: [],
            },
        };
    }

    private schema: object;

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
        const { incident } = faramValues;
        if (incident) {
            const { requests: { peopleGetRequest } } = this.props;
            peopleGetRequest.do({ incident });
        }
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

    private handleFaramValidationSuccess = (_: unknown, faramValues: FaramValues) => {
        const { requests: { reliefReleaseAddRequest } } = this.props;
        reliefReleaseAddRequest.do({
            body: faramValues,
            onFailure: (faramErrors: object) => {
                this.setState({ faramErrors });
            },
        });
    }

    public render() {
        const {
            closeModal,
            requests: {
                reliefReleaseAddRequest: {
                    pending: addReliefPending,
                },
                organizationGetRequest: {
                    response,
                    pending: organizationsGetPending,
                },
                incidentListGetRequest: {
                    response: incidentsResponse,
                    pending: incidentsGetPending,
                },
                peopleGetRequest: {
                    response: peopleResponse,
                    pending: peopleGetPending,
                },
            },
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        let organizationList: Organization[] = [];
        if (!organizationsGetPending && response) {
            const organizations = response as MultiResponse<Organization>;
            organizationList = organizations.results;
        }

        let incidentList: Incident[] = [];
        if (!incidentsGetPending && incidentsResponse) {
            const incidents = incidentsResponse as MultiResponse<Incident>;
            incidentList = incidents.results;
        }

        let personList: Person[] = [];
        if (!peopleGetPending && peopleResponse) {
            const people = peopleResponse as MultiResponse<Person>;
            personList = people.results;
        }

        const pending = addReliefPending
            || organizationsGetPending || incidentsGetPending;

        return (
            <Modal
                onClose={closeModal}
                closeOnEscape
            >
                { pending && <LoadingAnimation />}
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={this.schema}
                    value={faramValues}
                    error={faramErrors}
                    disabled={pending}
                >
                    <ModalHeader title="Add Release" />
                    <ModalBody>
                        <NonFieldErrors faramElement />
                        <SelectInput
                            faramElementName="providerOrganization"
                            label="Provider Organization"
                            options={organizationList}
                            keySelector={organizationKeySelector}
                            labelSelector={organizationLabelSelector}
                        />
                        <NumberInput
                            faramElementName="amount"
                            label="Amount"
                        />
                        <SelectInput
                            faramElementName="incident"
                            label="Incident"
                            options={incidentList}
                            keySelector={incidentKeySelector}
                            labelSelector={incidentLabelSelector}
                        />
                        <SelectInput
                            faramElementName="person"
                            label="Person"
                            options={personList}
                            keySelector={personKeySelector}
                            labelSelector={personLabelSelector}
                            disabled={peopleGetPending}
                        />
                        <SelectInput
                            faramElementName="benificiary"
                            label="Beneficiary"
                            options={personList}
                            keySelector={personKeySelector}
                            labelSelector={personLabelSelector}
                            disabled={peopleGetPending}
                        />
                        <TextInput
                            faramElementName="benificiaryOther"
                            label="Benificiary Other"
                        />
                        <SelectInput
                            faramElementName="status"
                            label="Status"
                            options={statusList}
                            keySelector={statusKeySelector}
                            labelSelector={statusLabelSelector}
                        />
                        <NumberInput
                            faramElementName="amount"
                            label="Amount"
                        />
                        <TextInput
                            faramElementName="description"
                            label="Description"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <DangerButton onClick={closeModal}>
                            Close
                        </DangerButton>
                        <PrimaryButton
                            type="submit"
                            pending={pending}
                            disabled={pristine}
                        >
                            Submit
                        </PrimaryButton>
                    </ModalFooter>
                </Faram>
            </Modal>
        );
    }
}


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requestOptions),
)(AddReleaseForm);
