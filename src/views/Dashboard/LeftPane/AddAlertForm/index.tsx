import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
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
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import ModalFooter from '#rscv/Modal/Footer';
import DateInput from '#rsci/DateInput';
import TimeInput from '#rsci/TimeInput';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import Checkbox from '#rsci/Checkbox';

import LocationInput from '#components/LocationInput';

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
    eventListSelector,
    sourceListSelector,
    hazardTypeListSelector,
} from '#selectors';

interface Params {
    body: object;
    onSuccess: (response: PageType.Alert) => void;
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

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
    currentView: keyof Tabs;
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    eventList: eventListSelector(state),
    sourceList: sourceListSelector(state),
    hazardList: hazardTypeListSelector(state),
});

const keySelector = (d: PageType.Field) => d.id;
const labelSelector = (d: PageType.Field) => d.title;

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

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
    addAlertRequest: {
        url: '/alert/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess,
        onFailure,
    },
    editAlertRequest: {
        url: ({ props }) => `/alert/${props.data.id}/`,
        method: methods.PUT,
        body: ({ params: { body } }) => body,
        onSuccess,
        onFailure,
    },
};

const defaultHazardColor = '#a0a0a0';

class AddAlertForm extends React.PureComponent<Props, State> {
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
        } = this.props;

        this.views = {
            general: {
                component: () => (
                    <div className={styles.generalInputs}>
                        <TextArea
                            className={styles.descriptionInput}
                            faramElementName="description"
                            label="Description"
                            persistantHintAndError={false}
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
                            className={styles.sourceInput}
                            faramElementName="source"
                            options={sourceList}
                            keySelector={labelSelector}
                            labelSelector={labelSelector}
                            label="Source"
                        />
                        <SelectInput
                            className={styles.hazardInput}
                            faramElementName="hazard"
                            options={hazardList}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            label="Hazard"
                        />
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
                            className={styles.locationInput}
                            faramElementName="location"
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

            const geoJson = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: props.data.point || {
                        type: 'Point',
                        coordinates: [],
                    },
                    properties: {
                        hazardColor: this.getActiveHazardColor(props.data.hazard, props.hazardList),
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
                adminLevel: adminLevelMap[props.data.region],
                geoarea: props.data.regionId,
            };

            initialData = {
                source: props.data.source,
                description: props.data.description,
                hazard: props.data.hazard,
                startedOnDate,
                startedOnTime,
                public: props.data.public,
                verified: props.data.verified,
                event: (props.data.event || {}).id,
                expireOnDate,
                expireOnTime,
                location: {
                    region,
                    geoJson,
                    wards: props.data.wards,
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
            currentView: 'general',
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
            location: [],
            expireOnDate: [],
            expireOnTime: [],
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


        const startedOn = new Date(`${startedOnDate}T${startedOnTime}`).toISOString();
        const expireOn = new Date(`${expireOnDate}T${expireOnTime}`).toISOString();
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
                onFailure: this.handleRequestFailure,
            });
        } else {
            addAlertRequest.do({
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
            hazardList,
            onCloseButtonClick,
            requests: {
                addAlertRequest: {
                    pending: addAlertRequestPending,
                },
                editAlertRequest: {
                    pending: editAlertRequestPending,
                },
            },
        } = this.props;

        const {
            pristine,
            currentView,
            faramValues,
            faramErrors,
        } = this.state;

        const pending = addAlertRequestPending || editAlertRequestPending;

        return (
            <Modal
                className={_cs(styles.addAlertFormModal, className)}
                onClose={closeModal}
                closeOnEscape
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
                    <ModalHeader title="Add / edit alert" />
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
                        <DangerButton
                            disabled={pending}
                            onClick={onCloseButtonClick}
                        >
                            Close
                        </DangerButton>
                        <PrimaryButton
                            type="submit"
                            disabled={pristine}
                            pending={pending}
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
)(AddAlertForm);
