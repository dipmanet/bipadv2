import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { compose } from 'redux';
import { connect } from 'react-redux';

import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import TimeInput from '#rsci/TimeInput';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';
import TextArea from '#rsci/TextArea';
import Checkbox from '#rsci/Checkbox';

import LocationInput from '#components/LocationInput';

import * as PageType from '#store/atom/page/types';
import { AppState } from '#store/types';
import {
    eventListSelector,
    sourceListSelector,
    hazardTypeListSelector,
} from '#selectors';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
}

interface PropsFromState {
    eventList: PageType.Event[];
    sourceList: PageType.Source[];
    hazardList: PageType.HazardType[];
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    eventList: eventListSelector(state),
    sourceList: sourceListSelector(state),
    hazardList: hazardTypeListSelector(state),
});

const keySelector = (d: PageType.Field) => d.id;
const labelSelector = (d: PageType.Field) => d.title;

type Props = OwnProps & PropsFromState;

class GeneralIncidentDetails extends React.PureComponent<Props> {
    public render() {
        const {
            eventList,
            hazardList,
            sourceList,
            className,
        } = this.props;

        return (
            <div className={_cs(styles.general, className)}>
                <TextArea
                    className={styles.input}
                    faramElementName="description"
                    label="Description"
                />
                <TextArea
                    className={styles.input}
                    faramElementName="detail"
                    label="Detail"
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
                        keySelector={labelSelector}
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
                    <DateInput
                        className={styles.input}
                        label="Reported on"
                        faramElementName="reportedOnDate"
                    />
                    <TimeInput
                        className={styles.input}
                        faramElementName="reportedOnTime"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <Checkbox
                        className={styles.input}
                        label="Approved"
                        faramElementName="approved"
                    />
                    <Checkbox
                        className={styles.input}
                        label="Verified"
                        faramElementName="verified"
                    />
                    <Checkbox
                        className={styles.input}
                        label="Need Followup"
                        faramElementName="needFollowup"
                    />
                </div>
                <TextArea
                    className={styles.input}
                    faramElementName="lossDescription"
                    label="Loss Description"
                />
                <NumberInput
                    className={styles.input}
                    faramElementName="estimatedLoss"
                    label="Estimated loss"
                />
                <TextInput
                    className={styles.input}
                    faramElementName="streetAddress"
                    label="Street Address"
                />
                <LocationInput
                    className={_cs(styles.locationInput, styles.input)}
                    faramElementName="location"
                />
                <TextArea
                    className={styles.input}
                    faramElementName="verificationMessage"
                    label="Verification Message"
                />
            </div>
        );
    }
}

export default compose(
    connect(mapStateToProps),
)(GeneralIncidentDetails);
