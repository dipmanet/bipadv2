import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import produce from 'immer';
import {
    _cs,
    padStart as p,
} from '@togglecorp/fujs';
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
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import LocationInput from '#components/LocationInput';

import {} from '#actionCreators';
import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    hazardTypeListSelector,
    severityListSelector,
} from '#selectors';

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
    hazardList: PageType.HazardType[];
    severityList: PageType.SeverityType[];
}

interface PropsFromDispatch {
}

interface FaramValues {
    title?: string;
    description?: string;
    point?: string;
    polygon?: string;
    startedOnDate?: string;
    startedOnTime?: string;
    expireOnDate?: string;
    expireOnTime?: string;
    severity?: string;
    hazard?: number;
}

interface FaramErrors {
}

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
    currentView: keyof Tabs;
}
const keySelector = (d: PageType.Field) => d.id;
const labelSelector = (d: PageType.Field) => d.title;

const onSuccess = ({
    params,
    response,
}: {
    params: Params;
    response: PageType.Event;
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
    addEventRequest: {
        url: '/event/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess,
        onFailure,
    },
    editEventRequest: {
        url: ({ props }) => `/event/${props.data.id}/`,
        method: methods.PUT,
        body: ({ params: { body } }) => body,
        onSuccess,
        onFailure,
    },
};

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    hazardList: hazardTypeListSelector(state),
    severityList: severityListSelector(state),
});

const defaultHazardColor = '#a0a0a0';

class AddEventForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.tabs = {
            general: 'General',
            location: 'Location',
        };

        const {
            severityList,
            hazardList,
        } = this.props;

        this.views = {
            general: {
                component: () => (
                    <div className={styles.generalInputs}>
                        <TextInput
                            className={styles.titleInput}
                            faramElementName="title"
                            label="Title"
                            persistantHintAndError={false}
                        />
                        <TextArea
                            className={styles.descriptionInput}
                            faramElementName="description"
                            label="Description"
                            persistantHintAndError={false}
                        />
                        <div className={styles.startedOnInputs}>
                            <DateInput
                                className={styles.startedOnDate}
                                faramElementName="startedOnDate"
                                label="Started on"
                            />
                            <TimeInput
                                faramElementName="startedOnTime"
                            />
                        </div>
                        {/*
                        <div className={styles.expiresOnInputs}>
                            <DateInput
                                label="Expires on"
                                faramElementName="expireOnDate"
                            />
                            <TimeInput
                                className={styles.startedOnTime}
                                faramElementName="expireOnTime"
                            />
                        </div>
                        */}
                        <SelectInput
                            className={styles.severityInput}
                            faramElementName="severity"
                            options={severityList}
                            keySelector={labelSelector}
                            labelSelector={labelSelector}
                            label="Severity"
                        />
                        <SelectInput
                            className={styles.hazardInput}
                            faramElementName="hazard"
                            options={hazardList}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            label="Hazard"
                        />
                    </div>
                ),
            },
            location: {
                component: () => {
                    const {
                        faramValues: {
                            hazard,
                        },
                    } = this.state;

                    return (
                        <LocationInput
                            pointColor={this.getActiveHazardColor(hazard, hazardList)}
                            className={styles.locationInput}
                            faramElementName="location"
                            pointShape="rect"
                        />
                    );
                },
            },
        };

        let initialData = {};

        if (props.data) {
            const startedOn = new Date(props.data.startedOn);
            const startedOnDate = `${p(startedOn.getFullYear(), 2)}-${p(startedOn.getMonth() + 1, 2)}-${p(startedOn.getDate(), 2)}`;
            const startedOnTime = `${p(startedOn.getHours(), 2)}:${p(startedOn.getMinutes(), 2)}:${p(startedOn.getSeconds(), 2)}`;

            const expireOn = new Date(props.data.expireOn);
            const expireOnDate = `${p(expireOn.getFullYear(), 2)}-${p(expireOn.getMonth() + 1, 2)}-${p(expireOn.getDate(), 2)}`;
            const expireOnTime = `${p(expireOn.getHours(), 2)}:${p(expireOn.getMinutes(), 2)}:${p(expireOn.getSeconds(), 2)}`;

            initialData = {
                title: props.data.title,
                description: props.data.description,
                hazard: props.data.hazard,
                severity: props.data.severity,
                startedOnDate,
                startedOnTime,
                // expireOnDate,
                // expireOnTime,
            };
        }

        this.state = {
            faramValues: {
                wards: [],
                ...initialData,
            },
            faramErrors: {},
            pristine: true,
            currentView: 'general',
        };
    }

    private static schema = {
        fields: {
            title: [requiredCondition],
            startedOnDate: [requiredCondition],
            startedOnTime: [requiredCondition],
            hazard: [requiredCondition],
            description: [],
            point: [],
            polygon: [],
            // expireOnDate: [],
            // expireOnTime: [],
            location: [],
            severity: [],
        },
    };

    private tabs: Tabs;

    private views: Views;

    private getActiveHazardColor = (
        activeHazardKey: PageType.HazardType['id'] | undefined,
        hazardOptions: PageType.HazardType[],
    ) => {
        if (!activeHazardKey) {
            return defaultHazardColor;
        }

        const activeHazard = hazardOptions.find(d => d.id === activeHazardKey);
        if (!activeHazard) {
            return defaultHazardColor;
        }

        return activeHazard.color;
    }

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
        const hazardColor = this.getActiveHazardColor(faramValues.hazard, this.props.hazardList);
        const location = produce(faramValues.location, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState.geoJson.features[0].properties.hazardColor = hazardColor;
        });

        this.setState({
            faramValues: {
                ...faramValues,
                location,
            },
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
                addEventRequest,
                editEventRequest,
            },
            onUpdate,
            closeModal,
            data,
        } = this.props;

        const {
            startedOnDate,
            startedOnTime,
            expireOnDate,
            expireOnTime,
            location,
            ...others
        } = faramValues;

        const startedOn = new Date(`${startedOnDate}T${startedOnTime}`).toISOString();
        // const expireOn = new Date(`${expireOnDate}T${expireOnTime}`).toISOString();
        const point = location.geoJson.features[0].geometry;
        const wards = location.wards;
        const body = {
            ...others,
            startedOn,
            // expireOn,
            point,
            wards,
        };

        if (data && data.id) {
            editEventRequest.do({
                body,
                onSuccess: this.handleRequestSuccess,
                onFailure: this.handleRequestFailure,
            });
        } else {
            addEventRequest.do({
                body,
                onSuccess: this.handleRequestSuccess,
                onFailure: this.handleRequestFailure,
            });
        }
    }

    private handleRequestSuccess = (response: PageType.Alert) => {
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
            onCloseButtonClick,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
            currentView,
        } = this.state;

        return (
            <Modal
                className={_cs(styles.addEventFormModal, className)}
                onClose={closeModal}
                closeOnEscape
            >
                <Faram
                    className={styles.addEventForm}
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={AddEventForm.schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalHeader title="Add / edit event" />
                    <ModalBody className={styles.body}>
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
                        <DangerButton onClick={onCloseButtonClick}>
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
    connect(mapStateToProps),
    createRequestClient(requests),
)(AddEventForm);
