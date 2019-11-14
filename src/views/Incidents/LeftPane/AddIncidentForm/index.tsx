import React from 'react';
import Redux, {
    compose,
} from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import FixedTabs from '#rscv/FixedTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import TimeInput from '#rsci/TimeInput';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';
import Checkbox from '#rsci/Checkbox';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import LocationInput from '#components/LocationInput';

import {
    setLossListAction,
} from '#actionCreators';

import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    eventListSelector,
    sourceListSelector,
    hazardTypeListSelector,
    lossListSelector,
} from '#selectors';

import styles from './styles.scss';

interface Tabs {
    general: string;
    location: string;
}
interface Views {
    general: {};
    location: {};
}
interface Params {
    body: object;
    onSuccess: () => void;
    onFailure: (faramErrors: object) => void;
}
interface OwnProps {
    closeModal?: () => void;
    onUpdate?: () => void;
    className?: string;
}
interface PropsFromState {
    eventList: PageType.Event[];
    sourceList: PageType.Source[];
    hazardList: PageType.HazardType[];
    lossList: PageType.Loss[];
}
interface PropsFromDispatch {
    setLossList: typeof setLossListAction;
}
interface FaramValues {
    hazard?: number;
    source?: number;
    incidentOnDate?: string;
    incidentOnTime?: string;
    wards?: [number];
    point?: [number];
    polygon?: string;
    description?: string;
    cause?: string;
    verified?: boolean;
    verificationMessage?: string;
    approved?: boolean;
    reportedOnDate?: string;
    reportedOnTime?: string;
    streetAddress?: string;
    detail?: string;
    needFollowup?: boolean;
    event?: number;
    loss?: number;
}
interface FaramErrors {
}
interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
    currentView: keyof Tabs;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    eventList: eventListSelector(state),
    sourceList: sourceListSelector(state),
    hazardList: hazardTypeListSelector(state),
    lossList: lossListSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setLossList: params => dispatch(setLossListAction(params)),
});

const keySelector = (d: PageType.Field) => d.id;
const labelSelector = (d: PageType.Field) => d.title;
const lossKeySelector = (d: PageType.Loss) => d.id;
const lossLabelSelector = (d: PageType.Loss) => d.description;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    lossGetRequest: {
        url: '/loss/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props: { setLossList } }) => {
            interface Response { results: PageType.Loss[] }
            const { results: lossList = [] } = response as Response;
            setLossList({ lossList });
        },
    },
    addIncidentPostRequest: {
        url: '/incident/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ params: { onSuccess } = { onSuccess: undefined } }) => {
            if (onSuccess) {
                onSuccess();
            }
        },
        onFailure: ({ error, params: { onFailure } = { onFailure: undefined } }) => {
            if (onFailure) {
                onFailure((error as { faramErrors: object }).faramErrors);
            }
        },
    },
};

class AddIncidentForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.tabs = {
            general: 'General',
            location: 'Location',
        };

        const {
            eventList,
            sourceList,
            hazardList,
            lossList,
        } = this.props;

        this.views = {
            general: {
                component: () => (
                    <>
                        <TextArea
                            faramElementName="description"
                            label="Description"
                        />
                        <TextArea
                            faramElementName="detail"
                            label="Detail1"
                        />
                        <TextArea
                            faramElementName="cause"
                            label="Cause"
                        />
                        <SelectInput
                            className={styles.hazardInput}
                            faramElementName="hazard"
                            options={hazardList}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            label="Hazard"
                        />
                        <SelectInput
                            className={styles.sourceInput}
                            faramElementName="source"
                            options={sourceList}
                            keySelector={labelSelector}
                            labelSelector={labelSelector}
                            label="Source"
                        />
                        <SelectInput
                            className={styles.eventInput}
                            faramElementName="event"
                            options={eventList}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            label="Event"
                        />
                        <SelectInput
                            className={styles.lossInput}
                            faramElementName="loss"
                            options={lossList}
                            keySelector={lossKeySelector}
                            labelSelector={lossLabelSelector}
                            label="Loss"
                        />
                        <TextInput
                            className={styles.streetAddress}
                            faramElementName="streetAddress"
                            label="Street Address"
                        />
                        <div className={styles.dateTimeInputs}>
                            <h3>Incident On</h3>
                            <div className={styles.inputs}>
                                <DateInput
                                    className={styles.incidentOnDate}
                                    faramElementName="incidentOnDate"
                                />
                                <TimeInput
                                    faramElementName="incidentOnTime"
                                />
                            </div>
                        </div>
                        <div className={styles.dateTimeInputs}>
                            <h3>Reported On</h3>
                            <div className={styles.inputs}>
                                <DateInput
                                    faramElementName="reportedOnDate"
                                />
                                <TimeInput
                                    faramElementName="reportedOnTime"
                                />
                            </div>
                        </div>
                        <Checkbox
                            className={styles.approved}
                            label="Approved"
                            faramElementName="approved"
                        />
                        <Checkbox
                            className={styles.verified}
                            label="Verified"
                            faramElementName="verified"
                        />
                        <Checkbox
                            className={styles.needFollowup}
                            label="Need Followup"
                            faramElementName="needFollowup"
                        />
                        <TextArea
                            faramElementName="verificationMessage"
                            label="Verification Message"
                        />
                    </>
                ),
            },
            location: {
                component: () => (
                    <LocationInput
                        className={styles.location}
                        faramElementName="location"
                    />
                ),
            },
        };

        this.state = {
            faramValues: {},
            faramErrors: {},
            pristine: true,
            currentView: 'general',
        };
    }

    private tabs: Tabs;

    private views: Views;

    private static schema = {
        fields: {
            hazard: [requiredCondition],
            source: [requiredCondition],
            incidentOnDate: [requiredCondition],
            incidentOntime: [requiredCondition],
            wards: [requiredCondition],
            point: [requiredCondition],
            polygon: [],
            description: [],
            cause: [],
            verified: [],
            verificationMessage: [],
            approved: [],
            reportedOn: [],
            streetAddress: [],
            detail: [],
            needFollowup: [],
            event: [],
            loss: [],
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
        const { requests: { addIncidentPostRequest }, onUpdate, closeModal } = this.props;
        const {
            incidentOnDate,
            incidentOnTime,
            reportedOnDate,
            reportedOnTime,
            ...others
        } = faramValues;

        const startedOn = new Date(`${incidentOnDate}T${incidentOnTime}`).toISOString();
        let reportedOn;
        if (reportedOnDate && reportedOnTime) {
            reportedOn = new Date(`${reportedOnDate}T${reportedOnTime}`).toISOString();
        }

        addIncidentPostRequest.do({
            body: { startedOn, reportedOn, ...others },
            onSuccess: () => {
                if (onUpdate) {
                    onUpdate();
                } else if (closeModal) {
                    closeModal();
                }
            },
            onFailure: (faramErrors: object) => {
                this.setState({ faramErrors });
            },
        });
    }

    private handleTabClick = (newTab: keyof Tabs) => {
        this.setState({ currentView: newTab });
    }

    public render() {
        const {
            className,
            closeModal,
        } = this.props;

        const {
            pristine,
            faramValues,
            faramErrors,
            currentView,
        } = this.state;

        return (
            <Modal
                className={_cs(styles.addIncidentModal, className)}
                onClose={closeModal}
                closeOnEscape
            >
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={AddIncidentForm.schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalHeader title="Add Incident" />
                    <ModalBody>
                        <FixedTabs
                            tabs={this.tabs}
                            onClick={this.handleTabClick}
                            active={currentView}
                        />
                        <MultiViewContainer
                            views={this.views}
                            active={currentView}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <DangerButton onClick={closeModal}>
                            Close
                        </DangerButton>
                        <PrimaryButton
                            type="submit"
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
    createRequestClient(requests),
)(AddIncidentForm);
