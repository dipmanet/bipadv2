import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import produce from 'immer';
import { _cs } from '@togglecorp/fujs';

import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import NonFieldErrors from '#rsci/NonFieldErrors';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import ModalFooter from '#rscv/Modal/Footer';
import DateInput from '#rsci/DateInput';
import TimeInput from '#rsci/TimeInput';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import Checkbox from '#rsci/Checkbox';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';

import LocationInput from '#components/LocationInput';

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
    eventListSelector,
    hazardTypeListSelector,
} from '#selectors';
import { getAttributeOptions } from '#utils/domain';
import { ModelEnum, ResourceEnum, KeyLabel } from '#types';

interface Params {
    body: object;
    onSuccess: (response: PageType.Alert) => void;
    setFaramErrors?: (error: object) => void;
}

interface FaramValues {
    source?: string;
    description?: string;
    hazard?: number;
    event?: number;
    point?: string;
    polygon?: string;
    district?: string;
    municipality?: string;
    wards?: number[];
    startedOnDate?: string;
    startedOnTime?: string;
    expireOnDate?: string;
    expireOnTime?: string;
    geoJson?: string;
    verified?: boolean;
    public?: boolean;

}

interface OwnProps {
    // closeModal?: () => void;
    onUpdate?: () => void;
    className?: string;
    data?: {};
}

interface PropsFromState {
    eventList: PageType.Event[];
    hazardList: PageType.HazardType[];
}

interface PropsFromDispatch {
}

interface Tabs {
    general: string;
    location: string;
}

interface Views {
    general: {};
    location: {};
}

interface FaramErrors {
}

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    eventList: eventListSelector(state),
    hazardList: hazardTypeListSelector(state),
});

const hazardKeySelector = (d: PageType.HazardType) => d.id;
const hazardLabelSelector = (d: PageType.HazardType) => d.title;
const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    addAlertRequest: {
        url: '/alert/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ params, response }) => {
            if (params && params.onSuccess) {
                params.onSuccess(response as PageType.Alert);
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
    enumGetRequest: {
        url: '/enum-choice/',
        method: methods.GET,
        onMount: true,
    },
    editAlertRequest: {
        url: ({ props }) => `/alert/${props.data.id}/`,
        method: methods.PUT,
        body: ({ params: { body } }) => body,
        onSuccess: ({ params, response }) => {
            if (params && params.onSuccess) {
                params.onSuccess(response as PageType.Alert);
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

const defaultHazardColor = '#a0a0a0';

class AddAlertForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        let initialData = {};
        const { data } = props;

        if (data) {
            const startedOn = new Date(data.startedOn);
            const startedOnDate = encodeDate(startedOn);
            const startedOnTime = encodeTime(startedOn);

            const expireOn = new Date(data.expireOn);
            const expireOnDate = encodeDate(expireOn);
            const expireOnTime = encodeTime(expireOn);

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
                source: data.source,
                description: data.description,
                hazard: data.hazard,
                startedOnDate,
                startedOnTime,
                public: data.public,
                verified: data.verified,
                event: (data.event || {}).id,
                expireOnDate,
                expireOnTime,
                location: {
                    region,
                    geoJson,
                    wards: data.wards,
                },
            };
        }

        this.state = {
            faramValues: {
                public: true,
                verified: true,
                wards: [],
                ...initialData,
            },
            faramErrors: {},
            pristine: true,
        };
    }

    private static schema = {
        fields: {
            source: [requiredCondition],
            description: [requiredCondition],
            hazard: [requiredCondition],
            startedOnDate: [requiredCondition],
            startedOnTime: [requiredCondition],
            public: [requiredCondition],
            verified: [],
            event: [],
            point: [],
            polygon: [],
            district: [],
            municipality: [],
            wards: [],
            geoJson: [],
            location: [requiredCondition],
            expireOnDate: [],
            expireOnTime: [],
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
                addAlertRequest,
                editAlertRequest,
            },
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

        const startedOn = startedOnDate && startedOnTime ? new Date(`${startedOnDate}T${startedOnTime}`).toISOString() : undefined;
        const expireOn = expireOnDate && expireOnTime ? new Date(`${expireOnDate}T${expireOnTime}`).toISOString() : undefined;
        const point = location.geoJson.features[0].geometry;
        const wards = location.wards;
        const {
            regionType,
            regionId,
        } = getRegion(location.region);

        const body = {
            ...others,
            startedOn,
            expireOn,
            point,
            wards,
            regionId,
            region: regionType,
        };

        if (data && data.id) {
            editAlertRequest.do({
                body,
                onSuccess: this.handleRequestSuccess,
                setFaramErrors: this.handleFaramValidationFailure,
            });
        } else {
            addAlertRequest.do({
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

    private handleRequestFailure = (faramErrors) => {
        this.setState({ faramErrors });
    }

    private handleTabClick = (newTab: keyof Tabs) => {
        this.setState({ currentView: newTab });
    }

    public render() {
        const {
            className,
            // closeModal,
            hazardList,
            eventList,
            onCloseButtonClick,
            requests: {
                addAlertRequest: {
                    pending: addAlertRequestPending,
                },
                editAlertRequest: {
                    pending: editAlertRequestPending,
                },
                enumGetRequest: {
                    response: enumResponse,
                    pending: enumPending,
                },
            },
        } = this.props;

        const {
            pristine,
            faramValues,
            faramErrors,
        } = this.state;

        let sourceOptions: KeyLabel[] = [];
        if (!enumPending && enumResponse) {
            const enumList: ModelEnum[] = enumResponse as ModelEnum[];
            const alertEnum = enumList.find(v => v.model === 'Alert');

            if (alertEnum && alertEnum.enums) {
                sourceOptions = getAttributeOptions(alertEnum.enums, 'source');
            }
        }

        const pending = addAlertRequestPending || editAlertRequestPending || enumPending;

        return (
            <Modal
                className={_cs(styles.addAlertFormModal, className)}
                onClose={onCloseButtonClick}
                // closeOnEscape
            >
                <Faram
                    className={styles.addAlertForm}
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={AddAlertForm.schema}
                    value={faramValues}
                    error={faramErrors}
                    disbled={pending}
                >
                    <ModalHeader
                        title="Add / edit alert"
                        rightComponent={(
                            <DangerConfirmButton
                                transparent
                                iconName="close"
                                onClick={onCloseButtonClick}
                                title="Close Modal"

                                confirmationMessage="Are you sure you want to close the form?"
                                disabled={pending}
                            />
                        )}
                    />
                    <ModalBody className={styles.body}>
                        <div className={styles.generalInputs}>
                            <NonFieldErrors faramElement />
                            <TextArea
                                className={styles.descriptionInput}
                                faramElementName="description"
                                label="Description"
                                persistantHintAndError={false}
                                autoFocus
                            />
                            <div className={styles.inputRow}>
                                <SelectInput
                                    className={styles.hazardInput}
                                    faramElementName="hazard"
                                    options={hazardList}
                                    keySelector={hazardKeySelector}
                                    labelSelector={hazardLabelSelector}
                                    label="Hazard"
                                />
                                <SelectInput
                                    className={styles.sourceInput}
                                    faramElementName="source"
                                    options={sourceOptions}
                                    keySelector={keySelector}
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
                            </div>
                            <div className={styles.dateTimeInputs}>
                                <div className={styles.startedOnInputs}>
                                    <DateInput
                                        className={styles.startedOnDate}
                                        faramElementName="startedOnDate"
                                        label="Started on"
                                    />
                                    <TimeInput
                                        className={styles.startedOnTime}
                                        faramElementName="startedOnTime"
                                    />
                                </div>
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
                            </div>
                            <div className={styles.checkboxes}>
                                <Checkbox
                                    className={styles.isPublicSelectionCheckbox}
                                    label="Public"
                                    faramElementName="public"
                                />
                                <Checkbox
                                    className={styles.isVerifiedSelectionCheckbox}
                                    label="Verified"
                                    faramElementName="verified"
                                />
                            </div>
                        </div>
                        <LocationInput
                            className={styles.locationInput}
                            faramElementName="location"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <DangerConfirmButton
                            onClick={onCloseButtonClick}

                            confirmationMessage="Are you sure you want to close the form?"
                            disabled={pending}
                        >
                            Close
                        </DangerConfirmButton>
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
    connect(mapStateToProps),
    createRequestClient(requests),
)(AddAlertForm);
