import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Faram from '@togglecorp/faram';
import { connect } from 'react-redux';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import Button from '#rsca/Button';
import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import TimeInput from '#rsci/TimeInput';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';
import Checkbox from '#rsci/Checkbox';

import {
    BasicElement,
    EventElement,
    SourceElement,
    HazardElement,
    AppState,
} from '#types';

import LocationInput from '#components/LocationInput';
import {
    eventListSelector,
    sourceListSelector,
    hazardTypeListSelector,
} from '#selectors';

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

type Props = ComponentProps & PropsFromAppState;

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    eventList: eventListSelector(state),
    sourceList: sourceListSelector(state),
    hazardList: hazardTypeListSelector(state),
});

const schema = {
    fields: {
        hazard: [],
        source: [],
        incidentOnDate: [],
        incidentOnTime: [],
        wards: [],
        point: [],
        polygon: [],
        description: [],
        cause: [],
        verified: [],
        verificationMessage: [],
        approved: [],
        reportedOnDate: [],
        reportedOnTime: [],
        streetAddress: [],
        needFollowup: [],
        event: [],
        location: [],
    },
};

const keySelector = (d: BasicElement) => d.id;
const labelSelector = (d: BasicElement) => d.title;

class CitizenReportFormModal extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            closeModal,
            hazardList,
            sourceList,
            eventList,
        } = this.props;

        return (
            <Modal
                className={_cs(styles.addCitizenReportFormModal, className)}
                onClose={closeModal}
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
                <div className={styles.addIncidentForm}>
                    <ModalBody className={styles.body}>
                        <Faram
                            schema={schema}
                        >
                            <TextArea
                                className={styles.input}
                                faramElementName="description"
                                label="Description"
                            />
                            <TextArea
                                className={styles.input}
                                faramElementName="cause"
                                label="Cause"
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
                                <SelectInput
                                    className={styles.input}
                                    faramElementName="source"
                                    options={sourceList}
                                    keySelector={keySelector}
                                    labelSelector={labelSelector}
                                    label="Source"
                                />
                                <SelectInput
                                    className={styles.input}
                                    faramElementName="event"
                                    options={eventList}
                                    keySelector={keySelector}
                                    labelSelector={labelSelector}
                                    label="Event"
                                />
                            </div>
                            <div className={styles.inputGroup}>
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
                            <TextInput
                                className={styles.input}
                                faramElementName="streetAddress"
                                label="Street Address"
                            />
                            <LocationInput
                                className={_cs(styles.locationInput, styles.input)}
                                faramElementName="location"
                            />
                        </Faram>
                    </ModalBody>
                </div>
            </Modal>
        );
    }
}

export default connect(mapStateToProps)(CitizenReportFormModal);
