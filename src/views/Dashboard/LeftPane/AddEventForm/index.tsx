import React from 'react';
import { compose } from 'redux';
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
    endedOnDate?: string;
    endedOnTime?: string;
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
    addEventPostRequest: {
        url: '/event/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ params: { onSuccess } = { onSuccess: undefined } }) => {
            if (onSuccess) {
                onSuccess();
            }
        },
        onFailure: ({ error, params: { onFailure } = { onFailure: undefined } }) => {
            if (onFailure) {
                onFailure((error as { faramErrors: object}).faramErrors);
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
                    <>
                        <TextInput
                            faramElementName="title"
                            label="Title"
                        />
                        <TextArea
                            faramElementName="description"
                            label="Description"
                        />
                        <div className={styles.dateTimeInputs}>
                            <h3>Started On</h3>
                            <div className={styles.inputs}>
                                <DateInput
                                    faramElementName="startedOnDate"
                                />
                                <TimeInput
                                    faramElementName="startedOnTime"
                                />
                            </div>
                        </div>
                        <div className={styles.dateTimeInputs}>
                            <h3>Ended On</h3>
                            <div className={styles.inputs}>
                                <DateInput
                                    faramElementName="endedOnDate"
                                />
                                <TimeInput
                                    faramElementName="endedOnTime"
                                />
                            </div>
                        </div>
                        <SelectInput
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
                    </>
                ),
            },
            location: {
                component: () => (<div>Location</div>),
            },
        };

        this.state = {
            faramValues: {},
            faramErrors: {},
            pristine: true,
            currentView: 'general',
        };
    }

    private tabs: Tabs;

    private views: Views;

    private static schema = {
        fields: {
            title: [requiredCondition],
            startedOnDate: [requiredCondition],
            startedOnTime: [requiredCondition],
            hazard: [requiredCondition],
            description: [],
            point: [],
            polygon: [],
            endedOnDate: [],
            endedOnTime: [],
            severity: [],
        },
    };

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
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
        const { requests: { addEventPostRequest }, onUpdate, closeModal } = this.props;
        const {
            startedOnDate,
            startedOnTime,
            endedOnDate,
            endedOnTime,
            ...others
        } = faramValues;

        const startedOn = new Date(`${startedOnDate}T${startedOnTime}`).toISOString();

        let endedOn;
        if (endedOnDate && endedOnTime) {
            endedOn = new Date(`${endedOnDate}T${endedOnTime}`).toISOString();
        }
        addEventPostRequest.do({
            body: { startedOn, endedOn, ...others },
            onSuccess: () => {
                if (onUpdate) {
                    onUpdate();
                } else if (closeModal) {
                    closeModal();
                }
            },
            onFailure: (faramErrors: object) => {
                this.setState({ faramErrors });
            },
        });
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
            faramValues,
            faramErrors,
            pristine,
            currentView,
        } = this.state;

        return (
            <Modal
                className={_cs(styles.addEventModal, className)}
                onClose={closeModal}
                closeOnEscape
            >
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={AddEventForm.schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalHeader title="Add Event" />
                    <ModalBody>
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
    connect(mapStateToProps),
    createRequestClient(requests),
)(AddEventForm);
