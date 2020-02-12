import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Faram from '@togglecorp/faram';
import { connect } from 'react-redux';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import TimeInput from '#rsci/TimeInput';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';
import ReCaptcha from '#rsci/ReCaptcha';

import {
    BasicElement,
    EventElement,
    SourceElement,
    HazardElement,
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
    hazardList: HazardElement[];
}

interface Params {
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
        hazard: [],
        source: [],
        wards: [],
        point: [],
        polygon: [],
        description: [],
        approved: [],
        reportedOnDate: [],
        reportedOnTime: [],
        streetAddress: [],
        location: [],
        recaptacha: [],
    },
};

const keySelector = (d: BasicElement) => d.id;
const labelSelector = (d: BasicElement) => d.title;

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    citizenReportPostRequest: {
        url: '/citizen-report/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
    },
};

class CitizenReportFormModal extends React.PureComponent<Props> {
    public state = {
        faramValues: {
            incidentOnDate: encodeDate(new Date()),
            incidentOnTime: encodeTime(new Date()),
        },
    };

    private handleFaramChange = (faramValues) => {
        this.setState({ faramValues });
    }

    private handleFaramValidationSuccess = (faramValues) => {
        const {
            requests: {
                citizenReportPostRequest,
            },
        } = this.props;

        const { location } = faramValues;

        const point = location.geoJson.features[0].geometry;
        const wards = location.wards;

        const body = {
            hazard: faramValues.hazard,
            point,
            ward: wards[0],
            description: faramValues.description,
            recaptcha: faramValues.recaptacha,
        };

        citizenReportPostRequest.do({ body });
    }

    public render() {
        const {
            className,
            closeModal,
            hazardList,
            sourceList,
            eventList,
        } = this.props;

        const { faramValues } = this.state;

        return (
            <Modal
                className={_cs(styles.addCitizenReportFormModal, className)}
                onClose={closeModal}
            >
                <Faram
                    className={styles.form}
                    schema={schema}
                    onChange={this.handleFaramChange}
                    value={faramValues}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                >
                    <ModalHeader
                        className={styles.header}
                        title="Report an incident"
                        rightComponent={(
                            <Button
                                onClick={closeModal}
                                transparent
                                iconName="close"
                            />
                        )}
                    />
                    <ModalBody className={styles.body}>
                        <TextArea
                            className={styles.input}
                            faramElementName="description"
                            label="Description"
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
                        <LocationInput
                            className={_cs(styles.locationInput, styles.input)}
                            faramElementName="location"
                        />
                        <ReCaptcha
                            faramElementName="recaptacha"
                            siteKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <PrimaryButton
                            type="submit"
                        >
                            Submit
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
