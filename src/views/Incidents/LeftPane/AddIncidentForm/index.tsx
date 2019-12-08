import React from 'react';
import { compose } from 'redux';
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
import ConfirmButton from '#rsca/ConfirmButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import GeneralDetails from './General';
import styles from './styles.scss';

interface Tabs {
    general: string;
}
interface Views {
    general: {};
}
interface Params {
    body?: object;
    onIncidentAddFailure?: (faramErrors: object) => void;
}

interface OwnProps {
    closeModal?: () => void;
    onUpdate?: () => void;
    className?: string;
    onRequestSuccess?: () => void;
}
interface FaramValues {
    location?: {
        geoJson: object;
        region: object;
        wards: number[];
    };
    hazard?: number;
    source?: number;
    incidentOnDate?: string;
    incidentOnTime?: string;
    wards?: [number];
    point?: [number];
    polygon?: string;
    description?: string;
    cause?: string;
    verified?: boolean;
    verificationMessage?: string;
    approved?: boolean;
    reportedOnDate?: string;
    reportedOnTime?: string;
    streetAddress?: string;
    detail?: string;
    needFollowup?: boolean;
    event?: number;
    loss?: number;
}
interface FaramErrors {
}
interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
    currentView: keyof Tabs;
}

type ReduxProps = OwnProps;
type Props = NewProps<ReduxProps, Params>;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    addIncidentRequest: {
        url: '/incident/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ props, response }) => {
            if (props.onRequestSuccess) {
                props.onRequestSuccess(response);
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.onIncidentAddFailure) {
                const { faramErrors } = error as { faramErrors: object };
                params.onIncidentAddFailure(faramErrors);
            }
        },
    },
};

class AddIncidentForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.tabs = {
            general: 'General',
        };

        this.views = {
            general: {
                component: () => (
                    <GeneralDetails
                        className={styles.generalInputs}
                    />
                ),
            },
        };

        this.state = {
            faramValues: {
                approved: true,
                verified: true,
            },
            faramErrors: {},
            pristine: true,
            currentView: 'general',
        };
    }

    private tabs: Tabs;

    private views: Views;

    private static schema = {
        fields: {
            hazard: [requiredCondition],
            source: [requiredCondition],
            incidentOnDate: [],
            incidentOntime: [],
            wards: [],
            point: [],
            polygon: [],
            description: [],
            cause: [],
            verified: [],
            verificationMessage: [],
            approved: [],
            reportedOn: [],
            streetAddress: [],
            detail: [],
            needFollowup: [],
            event: [],
            loss: [],
            location: [],
        },
    };

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
        console.warn(faramValues);
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
        const {
            requests: {
                addIncidentRequest,
            },
        } = this.props;

        const {
            incidentOnDate,
            incidentOnTime,
            reportedOnDate,
            reportedOnTime,
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

        const incidentOn = new Date(`${incidentOnDate}T${incidentOnTime}`).toISOString();

        let reportedOn;
        if (reportedOnDate && reportedOnTime) {
            reportedOn = new Date(`${reportedOnDate}T${reportedOnTime}`).toISOString();
        }
        const point = location.geoJson.features[0].geometry;
        const wards = location.wards;

        const {
            regionType,
            regionId,
        } = getRegion(location.region);

        const body = {
            ...others,
            incidentOn,
            reportedOn,
            point,
            wards,
            regionId,
            region: regionType,
        };

        addIncidentRequest.do({
            body,
            onIncidentAddFailure: this.handleRequestFailure,
        });
    }

    private handleRequestFailure = (faramErrors: object) => {
        this.setState({ faramErrors });
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
            faramValues,
            faramErrors,
            currentView,
        } = this.state;

        return (
            <Modal
                className={_cs(styles.addIncidentFormModal, className)}
                onClose={closeModal}
            >
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={AddIncidentForm.schema}
                    value={faramValues}
                    error={faramErrors}
                    className={styles.addIncidentForm}
                >
                    <ModalHeader
                        className={styles.header}
                        title="Add Incident"
                        rightComponent={(
                            <ConfirmButton
                                onClick={closeModal}
                                transparent
                                iconName="close"
                                confirmationMessage="Are you sure you want to close?"
                            />
                        )}
                    />
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

export default compose(createRequestClient(requests))(AddIncidentForm);
