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

const onSuccess = ({
    params,
    response,
}: {
    params: Params;
    response: PageType.Alert;
}) => {
    if (params && params.onSuccess) {
        params.onSuccess(response);
    }
};

const onFailure = ({
    error,
    params,
}: {
    params: Params;
    error: {
        faramErrors: {};
    };
}) => {
    if (params.onFailure) {
        onFailure(error.faramErrors);
    }
};

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    lossGetRequest: {
        url: '/loss/',
        method: methods.GET,
        onMount: true,
        query: {
            limit: 50,
        },
        onSuccess: ({ response, props: { setLossList } }) => {
            interface Response { results: PageType.Loss[] }
            const { results: lossList = [] } = response as Response;
            const filteredLossList = lossList.filter(d => d.description);
            setLossList({ lossList: filteredLossList });
        },
    },
    addIncidentRequest: {
        url: '/incident/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess,
        onFailure,
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
                    <div className={styles.generalInputs}>
                        <TextArea
                            className={styles.descriptionInput}
                            faramElementName="description"
                            label="Description"
                        />
                        <TextArea
                            className={styles.detailInput}
                            faramElementName="detail"
                            label="Detail"
                        />
                        <TextArea
                            className={styles.causeInput}
                            faramElementName="cause"
                            label="Cause"
                        />
                        <SelectInput
                            className={styles.hazardInput}
                            faramElementName="hazard"
                            options={this.props.hazardList}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            label="Hazard"
                        />
                        <SelectInput
                            className={styles.sourceInput}
                            faramElementName="source"
                            options={this.props.sourceList}
                            keySelector={labelSelector}
                            labelSelector={labelSelector}
                            label="Source"
                        />
                        <SelectInput
                            className={styles.eventInput}
                            faramElementName="event"
                            options={this.props.eventList}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            label="Event"
                        />
                        <SelectInput
                            className={styles.lossInput}
                            faramElementName="loss"
                            options={this.props.lossList}
                            keySelector={lossKeySelector}
                            labelSelector={lossLabelSelector}
                            label="Loss"
                        />
                        <TextInput
                            className={styles.streetAddressInput}
                            faramElementName="streetAddress"
                            label="Street Address"
                        />
                        <div className={styles.dateInputs}>
                            <div className={styles.incidentOnInputs}>
                                <DateInput
                                    label="Incident on"
                                    className={styles.incidentOnDate}
                                    faramElementName="incidentOnDate"
                                />
                                <TimeInput
                                    faramElementName="incidentOnTime"
                                />
                            </div>
                            <div className={styles.reportedOnInputs}>
                                <DateInput
                                    label="Reported on"
                                    faramElementName="reportedOnDate"
                                />
                                <TimeInput
                                    faramElementName="reportedOnTime"
                                />
                            </div>
                        </div>
                        <div className={styles.checkboxes}>
                            <Checkbox
                                className={styles.isApprovedSelectionCheckbox}
                                label="Approved"
                                faramElementName="approved"
                            />
                            <Checkbox
                                className={styles.isVerifiedSelectionCheckbox}
                                label="Verified"
                                faramElementName="verified"
                            />
                            <Checkbox
                                className={styles.needFollowupSelectionCheckbox}
                                label="Need Followup"
                                faramElementName="needFollowup"
                            />
                        </div>
                        <TextArea
                            className={styles.verificationMessageInput}
                            faramElementName="verificationMessage"
                            label="Verification Message"
                        />
                    </div>
                ),
            },
            location: {
                component: () => (
                    <LocationInput
                        className={styles.locationInput}
                        faramElementName="location"
                    />
                ),
            },
        };

        this.state = {
            faramValues: {
                approved: true,
                verified: true,
            },
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
            incidentOnDate: [],
            incidentOntime: [],
            wards: [],
            point: [],
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
            location: [],
        },
    };

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
        console.warn(faramValues);
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
            requests: {
                addIncidentRequest,
            },
        } = this.props;
        const {
            incidentOnDate,
            incidentOnTime,
            reportedOnDate,
            reportedOnTime,
            location,
            ...others
        } = faramValues;

        const getRegion = (region) => {
            const regionTypeMap = {
                1: 'province',
                2: 'district',
                3: 'municipality',
                4: 'ward',
            };

            return {
                regionType: regionTypeMap[region.adminLevel],
                regionId: region.geoarea,
            };
        };

        const incidentOn = new Date(`${incidentOnDate}T${incidentOnTime}`).toISOString();

        let reportedOn;
        if (reportedOnDate && reportedOnTime) {
            reportedOn = new Date(`${reportedOnDate}T${reportedOnTime}`).toISOString();
        }
        const point = location.geoJson.features[0].geometry;
        const wards = location.wards;

        const {
            regionType,
            regionId,
        } = getRegion(location.region);

        const body = {
            ...others,
            incidentOn,
            reportedOn,
            point,
            wards,
            regionId,
            region: regionType,
        };

        addIncidentRequest.do({
            body,
            onSuccess: this.handleRequestSuccess,
            onFailure: this.handleRequestFailure,
        });
    }

    private handleRequestSuccess = (response) => {
        const { onRequestSuccess } = this.props;

        if (onRequestSuccess) {
            onRequestSuccess(response);
        }
    }

    private handleRequestFailure = (faramErrors) => {
        this.setState({ faramErrors });
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
                className={_cs(styles.addIncidentFormModal, className)}
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
                    className={styles.addIncidentForm}
                >
                    <ModalHeader title="Add Incident" />
                    <ModalBody className={styles.body}>
                        <FixedTabs
                            className={styles.tabs}
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
