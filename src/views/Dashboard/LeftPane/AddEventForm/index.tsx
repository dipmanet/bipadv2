import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import produce from 'immer';
import { _cs } from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import NonFieldErrors from '#rsci/NonFieldErrors';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import TimeInput from '#rsci/TimeInput';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';

import LocationInput from '#components/LocationInput';

import {} from '#actionCreators';
import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';
import {
    encodeDate,
    encodeTime,
} from '#utils/common';


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
    onSuccess: (response: PageType.Alert) => void;
    setFaramErrors?: (error: object) => void;
}

interface OwnProps {
    // closeModal?: () => void;
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

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    addEventRequest: {
        url: '/event/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ params, response }) => {
            if (params && params.onSuccess) {
                params.onSuccess(response as PageType.Event);
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
    editEventRequest: {
        url: ({ props }) => `/event/${props.data.id}/`,
        method: methods.PUT,
        body: ({ params: { body } }) => body,
        onSuccess: ({ params, response }) => {
            if (params && params.onSuccess) {
                params.onSuccess(response as PageType.Event);
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

        let initialData = {};

        const { data } = props;
        if (data) {
            const startedOn = new Date(data.startedOn);
            const startedOnDate = encodeDate(startedOn);
            const startedOnTime = encodeTime(startedOn);

            const geoJson = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: data.point || {
                        type: 'Point',
                        coordinates: [],
                    },
                    properties: {
                        hazardColor: this.getActiveHazardColor(
                            data.hazard,
                            props.hazardList,
                        ),
                    },
                }],
            };

            const adminLevelMap = {
                province: 1,
                district: 2,
                municipality: 3,
                ward: 4,
            };

            const region = {
                adminLevel: adminLevelMap[data.region],
                geoarea: data.regionId,
            };

            initialData = {
                title: data.title,
                description: data.description,
                hazard: data.hazard,
                severity: data.severity,
                startedOnDate,
                startedOnTime,
                location: {
                    region,
                    geoJson,
                    wards: data.wards,
                },
            };
        }

        this.state = {
            faramValues: {
                wards: [],
                ...initialData,
            },
            faramErrors: {},
            pristine: true,
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
            location: [requiredCondition],
            severity: [],
        },
    };

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
        let location;
        if (faramValues.location) {
            location = produce(faramValues.location, (deferedState) => {
                // eslint-disable-next-line no-param-reassign
                deferedState.geoJson.features[0].properties.hazardColor = hazardColor;
            });
        }

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
            // closeModal,
            data,
        } = this.props;

        const {
            startedOnDate,
            startedOnTime,
            location,
            ...others
        } = faramValues;

        const startedOn = new Date(`${startedOnDate}T${startedOnTime}`).toISOString();
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
                setFaramErrors: this.handleFaramValidationFailure,
            });
        } else {
            addEventRequest.do({
                body,
                onSuccess: this.handleRequestSuccess,
                setFaramErrors: this.handleFaramValidationFailure,
            });
        }
    }

    private handleRequestSuccess = (response: PageType.Alert) => {
        const { onRequestSuccess } = this.props;
        if (onRequestSuccess) {
            onRequestSuccess(response);
        }
    }

    private handleRequestFailure = (faramErrors: object) => {
        this.setState({ faramErrors });
    }

    public render() {
        const {
            className,
            // closeModal,
            onCloseButtonClick,
            severityList,
            hazardList,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        return (
            <Modal className={_cs(styles.addEventFormModal, className)}>
                <Faram
                    className={styles.addEventForm}
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={AddEventForm.schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalHeader
                        title="Add / edit event"
                        rightComponent={(
                            <DangerConfirmButton
                                transparent
                                iconName="close"
                                onClick={onCloseButtonClick}
                                title="Close Modal"

                                confirmationMessage="Are you sure you want to close the form?"
                            />
                        )}
                    />
                    <ModalBody className={styles.body}>
                        <div className={styles.generalInputs}>
                            <NonFieldErrors faramElement />
                            <TextInput
                                className={styles.titleInput}
                                faramElementName="title"
                                label="Title"
                                persistantHintAndError={false}
                                autoFocus
                            />
                            <TextArea
                                className={styles.descriptionInput}
                                faramElementName="description"
                                label="Description"
                                persistantHintAndError={false}
                            />
                            <div className={styles.inputRow}>
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
                        </div>
                        <LocationInput
                            pointColor={this.getActiveHazardColor(faramValues.hazard, hazardList)}
                            className={styles.locationInput}
                            faramElementName="location"
                            pointShape="rect"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <DangerConfirmButton
                            onClick={onCloseButtonClick}

                            confirmationMessage="Are you sure you want to close the form?"
                        >
                            Close
                        </DangerConfirmButton>
                        <PrimaryButton
                            type="submit"
                            disabled={pristine}
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
    connect(mapStateToProps),
    createRequestClient(requests),
)(AddEventForm);
