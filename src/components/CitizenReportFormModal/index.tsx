import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Faram, { requiredCondition } from '@togglecorp/faram';
import { connect } from 'react-redux';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import NonFieldErrors from '#rsci/NonFieldErrors';
import RawFileInput from '#rsci/RawFileInput';
import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import TimeInput from '#rsci/TimeInput';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';
import ReCaptcha from '#rsci/ReCaptcha';


import {
    HazardType,
} from '#store/atom/page/types';

import {
    BasicElement,
    EventElement,
    SourceElement,
    AppState,
} from '#types';

import {
    encodeDate,
    encodeTime,
} from '#utils/common';

import LocationInput from '#components/LocationInput';
import {
    eventListSelector,
    sourceListSelector,
    hazardTypeListSelector,
} from '#selectors';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import styles from './styles.scss';

interface ComponentProps {
    className?: string;
    closeModal?: () => void;
}

interface PropsFromAppState {
    eventList: EventElement[];
    sourceList: SourceElement[];
    hazardList: HazardType[];
}

interface FaramValues {
    description?: string;
    hazard?: number;
    incidentOnDate?: string;
    incidentOnTime?: string;
    streetAddress?: string;
    location?: {
        wards: number[];
        geoJson: object;
    };
    recaptcha?: number;

    image?: File;
}

interface State {
    faramValues: FaramValues;
    faramErrors: object;
}

interface Params {
    body?: object;
    setFaramErrors?: (error: object) => void;
}

type PropsWithRedux = ComponentProps & PropsFromAppState;
type Props = NewProps<PropsWithRedux, Params>;

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    eventList: eventListSelector(state),
    sourceList: sourceListSelector(state),
    hazardList: hazardTypeListSelector(state),

});

const schema = {
    fields: {
        description: [],
        hazard: [requiredCondition],
        incidentOnDate: [],
        incidentOnTime: [],
        streetAddress: [],
        location: [requiredCondition],
        recaptcha: [requiredCondition],

        image: [],
        /*
        source: [],
        wards: [],
        point: [],
        polygon: [],
        approved: [],
        */
    },
};

const keySelector = (d: BasicElement) => d.id;
const labelSelector = (d: BasicElement) => d.title;

const requestOptions: { [key: string]: ClientAttributes<PropsWithRedux, Params> } = {
    citizenReportPostRequest: {
        url: '/citizen-report/',
        method: methods.POST,
        body: ({ params }) => params && params.body,
        onSuccess: ({ response, props }) => {
            if (props.closeModal) {
                props.closeModal();
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

};

class CitizenReportFormModal extends React.PureComponent<Props, State> {
    public state = {
        faramValues: {
            incidentOnDate: encodeDate(new Date()),
            incidentOnTime: encodeTime(new Date()),
        },
        faramErrors: {},
    };

    private handleFaramValidationFailure = (faramErrors: object) => {
        this.setState({ faramErrors });
    }

    private handleFaramChange = (faramValues: FaramValues, faramErrors: object) => {
        this.setState({ faramValues, faramErrors });
    }

    private handleFaramValidationSuccess = (faramValues: FaramValues) => {
        const {
            requests: {
                citizenReportPostRequest,
            },
        } = this.props;

        const {
            location,
            hazard,
            description,
            recaptcha,
            image,
        } = faramValues;

        const { wards, geoJson } = location;
        const point = geoJson.features[0].geometry;

        const body = {
            hazard,
            description,
            recaptcha,
            incident: null,
            point: JSON.stringify(point),
            ward: wards[0],
            image,
        };

        citizenReportPostRequest.do({
            body,
            setFaramErrors: this.handleFaramValidationFailure,
        });
    }

    public render() {
        const {
            className,
            closeModal,
            hazardList,
            sourceList,
            eventList,
            requests: {
                citizenReportPostRequest: {
                    pending,
                },

            },

        } = this.props;

        const {
            faramValues,
            faramErrors,
        } = this.state;

        return (
            <Modal
                className={_cs(styles.addCitizenReportFormModal, className)}
            // onClose={closeModal}
            >
                <Faram
                    className={styles.form}
                    schema={schema}
                    onChange={this.handleFaramChange}
                    value={faramValues}
                    error={faramErrors}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    onValidationFailure={this.handleFaramValidationFailure}
                    disabled={pending}
                >
                    <ModalHeader
                        className={styles.header}
                        title="Report an incident"
                        rightComponent={(
                            <DangerButton
                                transparent
                                iconName="close"
                                onClick={closeModal}
                                title="Close Modal"
                            />
                        )}
                    />
                    <ModalBody className={styles.body}>
                        <NonFieldErrors faramElement />
                        <TextArea
                            className={styles.input}
                            faramElementName="description"
                            label="Description"
                            autoFocus
                        />
                        <div className={styles.inputGroup}>
                            <SelectInput
                                className={styles.input}
                                faramElementName="hazard"
                                options={hazardList}
                                keySelector={keySelector}
                                labelSelector={labelSelector}
                                label="Hazard"
                            />
                            <div className={styles.dateTimeInput}>
                                <DateInput
                                    label="Incident on"
                                    className={styles.input}
                                    faramElementName="incidentOnDate"
                                />
                                <TimeInput
                                    className={styles.input}
                                    faramElementName="incidentOnTime"
                                />
                            </div>
                        </div>
                        <TextInput
                            className={styles.input}
                            faramElementName="streetAddress"
                            label="Street Address"
                        />
                        <RawFileInput
                            className={styles.fileInput}
                            faramElementName="image"
                            showStatus
                            accept="image/*"
                        >
                            Upload Image
                        </RawFileInput>
                        <LocationInput
                            className={_cs(styles.locationInput, styles.input)}
                            faramElementName="location"
                        />
                        <ReCaptcha
                            faramElementName="recaptcha"
                            siteKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <PrimaryButton
                            type="submit"
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

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requestOptions)(
            CitizenReportFormModal,
        ),
    ),
);
