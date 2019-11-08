import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { _cs } from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import FixedTabs from '#rscv/FixedTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';

import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import ModalFooter from '#rscv/Modal/Footer';
import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import TimeInput from '#rsci/TimeInput';
import SelectInput from '#rsci/SelectInput';
import TextArea from '#rsci/TextArea';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';

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
    onSuccess: () => void;
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
    title?: string;
    source?: string;
    description?: string;
    hazard?: number;
    event?: number;
    point?: string;
    polygon?: string;
    district?: string;
    municipality?: string;
    wards?: string[];
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

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    addAlertPostRequest: {
        url: '/alert/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ params: { onSuccess } = { onSuccess: undefined } }) => {
            if (onSuccess) {
                onSuccess();
            }
        },
        onFailure: ({ error, params: { onFailure } = { onFailure: undefined } }) => {
            if (onFailure) {
                onFailure((error as { faramErrors: object }).faramErrors);
            }
        },
    },
};

class AddAlertForm extends React.PureComponent<Props, State> {
    private static schema = {
        fields: {
            title: [requiredCondition],
            source: [requiredCondition],
            description: [requiredCondition],
            hazard: [requiredCondition],
            event: [],
            point: [],
            polygon: [],
            district: [],
            municipality: [],
            wards: [],
            geoJson: [],
            startedOnDate: [requiredCondition],
            startedOnTime: [requiredCondition],
            expireOnDate: [requiredCondition],
            expireOnTime: [requiredCondition],
        },
    };

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
                    <>
                        <TextInput
                            faramElementName="title"
                            label="Title"
                        />
                        <TextArea
                            className={styles.descriptionInput}
                            faramElementName="description"
                            label="Description"
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
                                faramElementName="startedOnTime"
                            />
                        </div>
                        <div className={styles.expiresOnInputs}>
                            <DateInput
                                label="Expires on"
                                faramElementName="expireOnDate"
                            />
                            <TimeInput
                                faramElementName="expireOnTime"
                            />
                        </div>

                    </>
                ),
            },
            location: {
                component: () => <LocationInput />,
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
        const { requests: { addAlertPostRequest }, onUpdate, closeModal } = this.props;
        const {
            startedOnDate,
            startedOnTime,
            expireOnDate,
            expireOnTime,
            ...others
        } = faramValues;

        const startedOn = new Date(`${startedOnDate}T${startedOnTime}`).toISOString();
        const expireOn = new Date(`${expireOnDate}T${expireOnTime}`).toISOString();

        addAlertPostRequest.do({
            body: { startedOn, expireOn, ...others },
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
            pristine,
            currentView,
            faramValues,
            faramErrors,
        } = this.state;

        return (
            <Modal
                className={_cs(styles.addAlertForm, className)}
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
                >
                    <ModalHeader title="Add Alert" />
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
)(AddAlertForm);
