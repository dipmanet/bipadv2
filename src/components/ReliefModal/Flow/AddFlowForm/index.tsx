import React from 'react';
import Redux, {
    compose,
} from 'redux';
import { connect } from 'react-redux';
import Faram, { requiredCondition } from '@togglecorp/faram';

import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import DateInput from '#rsci/DateInput';
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
    Flow,
    Organization,
} from '#types';

import {
    Field,
    Event,
} from '#store/atom/page/types';

import {
    eventListSelector,
} from '#selectors';

import {
    setEventListAction,
} from '#actionCreators';
import { MultiResponse } from '#store/atom/response/types';

interface FaramValues {
}
interface FaramErrors {
}

interface OwnProps {
    closeModal?: () => void;
    onUpdate?: () => void;
    value?: Flow;
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
    body: object;
    onFailure: (faramErrors: object) => void;
}

interface FlowType {
    id: string;
    label: string;
}

interface FiscalYearType {
    id: number;
    title: string;
}

const typeList: FlowType[] = [
    {
        id: 'inflow',
        label: 'inflow',
    },
    {
        id: 'initial balance',
        label: 'initial balance',
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

const typeKeySelector = (f: FlowType) => f.id;
const typeLabelSelector = (f: FlowType) => f.label;
const eventKeySelector = (d: Field) => d.id;
const eventLabelSelector = (d: Field) => d.title;
const fiscalYearKeySelector = (f: FlowType) => f.id;
const fiscalYearLabelSelector = (f: FlowType) => f.title;
const organizationKeySelector = (o: Organization) => o.id;
const organizationLabelSelector = (o: Organization) => o.title;

const requestOptions: { [key: string]: ClientAttributes<PropsWithRedux, Params> } = {
    fiscalYearsGetRequest: {
        url: '/fiscal-year/',
        method: methods.GET,
        onMount: true,
    },
    organizationGetRequest: {
        url: '/organization/',
        method: methods.GET,
        onMount: true,
    },
    eventTypesGetRequest: {
        url: '/event/',
        method: methods.GET,
        onSuccess: ({ response, props: { setEventList } }) => {
            interface Response { results: Event[] }
            const { results: eventList = [] } = response as Response;
            setEventList({ eventList });
        },
        onMount: true,
    },
    reliefFlowAddRequest: {
        url: ({ props }) => (
            props.value
                ? `/relief-flow/${props.value.id}/`
                : '/relief-flow/'
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

class AddFlowForm extends React.PureComponent<Props, State> {
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
                receiverOrganization: [requiredCondition],
                providerOrganization: [],
                amount: [requiredCondition],
                type: [requiredCondition],
                fiscalYear: [requiredCondition],
                event: [],
                date: [],
            },
        };
    }

    private schema: object;

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

    private handleFaramValidationSuccess = (_: unknown, faramValues: FaramValues) => {
        const { requests: { reliefFlowAddRequest } } = this.props;
        reliefFlowAddRequest.do({
            body: faramValues,
            onFailure: (faramErrors: object) => {
                this.setState({ faramErrors });
            },
        });
    }

    public render() {
        const {
            closeModal,
            eventList,
            requests: {
                reliefFlowAddRequest: {
                    pending: addReliefPending,
                },
                eventTypesGetRequest: {
                    pending: eventTypesGetPending,
                },
                organizationGetRequest: {
                    response,
                    pending: organizationsGetPending,
                },
                fiscalYearsGetRequest: {
                    response: fiscalYearsResponse,
                    pending: fiscalYearsGetPending,
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

        let fiscalYearOptions: FiscalYearType[] = [];
        if (!fiscalYearsGetPending && fiscalYearsResponse) {
            const years = fiscalYearsResponse as MultiResponse<FiscalYearType>;
            fiscalYearOptions = years.results;
        }

        const pending = addReliefPending || eventTypesGetPending
            || organizationsGetPending || fiscalYearsGetPending;

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
                    <ModalHeader title="Add Flow" />
                    <ModalBody>
                        <NonFieldErrors faramElement />
                        <SelectInput
                            faramElementName="receiverOrganization"
                            label="Receiver Organization"
                            options={organizationList}
                            keySelector={organizationKeySelector}
                            labelSelector={organizationLabelSelector}
                        />
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
                            faramElementName="type"
                            label="Type"
                            options={typeList}
                            keySelector={typeKeySelector}
                            labelSelector={typeLabelSelector}
                        />
                        <SelectInput
                            faramElementName="event"
                            label="Event"
                            options={eventList}
                            keySelector={eventKeySelector}
                            labelSelector={eventLabelSelector}
                        />
                        <SelectInput
                            faramElementName="fiscalYear"
                            label="Fiscal Year"
                            options={fiscalYearOptions}
                            keySelector={fiscalYearKeySelector}
                            labelSelector={fiscalYearLabelSelector}
                        />
                        <DateInput
                            faramElementName="date"
                            label="Date"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <DangerButton onClick={closeModal}>
                            Close
                        </DangerButton>
                        <PrimaryButton
                            type="submit"
                            pending={addReliefPending}
                            disabled={pristine || pending}
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
    createRequestClient(requestOptions),
)(AddFlowForm);
