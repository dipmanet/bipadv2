import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { Translation } from 'react-i18next';
import Cloak from '#components/Cloak';
import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import TimeInput from '#rsci/TimeInput';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';
import Checkbox from '#rsci/Checkbox';
import LoadingAnimation from '#rscv/LoadingAnimation';
import NonFieldErrors from '#rsci/NonFieldErrors';

import LocationInput from '#components/LocationInput';

import * as PageType from '#store/atom/page/types';
import { AppState } from '#store/types';
import {
    eventListSelector,
    sourceListSelector,
    hazardTypeListSelector,
    languageSelector,
} from '#selectors';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
    pending?: boolean;
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
    language: languageSelector(state),
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
            pending,
            language: { language },
        } = this.props;

        return (
            <Translation>
                {
                    t => (
                        <div className={_cs(styles.general, className)}>
                            {pending && <LoadingAnimation />}
                            <NonFieldErrors faramElement />
                            <TextArea
                                className={styles.input}
                                faramElementName="description"
                                label={t('Description')}
                                autoFocus
                            />
                            <TextArea
                                className={styles.input}
                                faramElementName="cause"
                                label={t('Cause')}
                            />
                            <div className={styles.inputGroup}>
                                <SelectInput
                                    placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                                    className={styles.input}
                                    faramElementName="hazard"
                                    options={hazardList}
                                    keySelector={keySelector}
                                    labelSelector={labelSelector}
                                    label={t('Hazard')}
                                />
                                <SelectInput
                                    placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                                    className={styles.input}
                                    faramElementName="source"
                                    options={sourceList}
                                    keySelector={keySelector}
                                    labelSelector={labelSelector}
                                    label={t('Source')}
                                />
                                <SelectInput
                                    placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                                    className={styles.input}
                                    faramElementName="event"
                                    options={eventList}
                                    keySelector={keySelector}
                                    labelSelector={labelSelector}
                                    label={t('Event')}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <DateInput
                                    label={t('Incident on')}
                                    className={styles.input}
                                    faramElementName="incidentOnDate"
                                    language={language}
                                />
                                <TimeInput
                                    className={styles.input}
                                    faramElementName="incidentOnTime"
                                />
                                <DateInput
                                    className={styles.input}
                                    label={t('Reported on')}
                                    faramElementName="reportedOnDate"
                                    language={language}
                                />
                                <TimeInput
                                    className={styles.input}
                                    faramElementName="reportedOnTime"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <Cloak hiddenIf={p => !p.approve_incident}>
                                    <Checkbox
                                        className={styles.input}
                                        label={t('Approved')}
                                        faramElementName="approved"
                                    />
                                </Cloak>
                                <Cloak hiddenIf={p => !p.verify_incident}>
                                    <Checkbox
                                        className={styles.input}
                                        label={t('Verified')}
                                        faramElementName="verified"
                                    />
                                </Cloak>
                                <Checkbox
                                    className={styles.input}
                                    label={t('Need Followup')}
                                    faramElementName="needFollowup"
                                />
                            </div>
                            <TextInput
                                className={styles.input}
                                faramElementName="streetAddress"
                                label={t('Street Address')}
                            />
                            <LocationInput
                                className={_cs(styles.locationInput, styles.input)}
                                faramElementName="location"
                            />
                            <Cloak hiddenIf={p => !p.verify_incident}>
                                <TextArea
                                    className={styles.input}
                                    faramElementName="verificationMessage"
                                    label={t('Verification Message')}
                                />
                            </Cloak>
                        </div>
                    )
                }
            </Translation>

        );
    }
}

export default compose(
    connect(mapStateToProps),
)(GeneralIncidentDetails);
