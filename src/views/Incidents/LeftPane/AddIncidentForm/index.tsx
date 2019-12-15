import React from 'react';
import { compose } from 'redux';
import {
    _cs,
    isFalsy,
} from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import ScrollTabs from '#rscv/ScrollTabs';
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
import PeopleLossList from './PeopleLossList';
import FamiliesLossList from './FamiliesLossList';
import LivestockLossList from './LivestockLossList';
import styles from './styles.scss';

interface Tabs {
    general: string;
    peopleLoss: string;
    familyLoss: string;
    livestockLoss: string;
}
interface Views {
    general: {};
    peopleLoss: {};
    familyLoss: {};
    livestockLoss: {};
}
interface Params {
    body?: object;
    onAddFailure?: (faramErrors: object) => void;
}

interface OwnProps {
    closeModal?: () => void;
    onUpdate?: () => void;
    className?: string;
    lossServerId?: number;
    incidentServerId?: number;
    onLossChange?: (loss: object) => void;
    onIncidentChange?: (incident: object) => void;
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
    title?: string;
    needFollowup?: boolean;
    event?: number;
    lossDescription?: string;
    estimatedLoss?: number;
}

interface FaramErrors {
}

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
    currentView: keyof Tabs;
    incidentServerId?: number;
}

type ReduxProps = OwnProps;
type Props = NewProps<ReduxProps, Params>;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    incidentRequest: {
        url: '/incident/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ props, response }) => {
            console.warn('incident creation', response);
            const { onIncidentChange } = props;
            if (onIncidentChange) {
                onIncidentChange(response);
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.onAddFailure) {
                const { faramErrors } = error as { faramErrors: object };
                params.onAddFailure(faramErrors);
            }
        },
    },
    lossRequest: {
        url: '/loss/',
        method: methods.POST,
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ props, response }) => {
            console.warn('loss creation', response);
            const { onLossChange } = props;
            if (onLossChange) {
                onLossChange(response);
            }
        },
    },
};

class AddIncidentForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.tabs = {
            general: 'General',
            peopleLoss: 'People Loss',
            familyLoss: 'Family Loss',
            livestockLoss: 'Livestock Loss',
        };

        this.views = {
            general: {
                component: () => {
                    const {
                        pristine,
                        faramValues,
                        faramErrors,
                    } = this.state;

                    return (
                        <Faram
                            onChange={this.handleFaramChange}
                            onValidationFailure={this.handleFaramValidationFailure}
                            onValidationSuccess={this.handleFaramValidationSuccess}
                            schema={AddIncidentForm.schema}
                            value={faramValues}
                            error={faramErrors}
                            className={styles.generalInputs}
                        >
                            <GeneralDetails />
                            <div className={styles.footer}>
                                <PrimaryButton
                                    type="submit"
                                    disabled={pristine}
                                >
                                    Submit
                                </PrimaryButton>
                            </div>
                        </Faram>
                    );
                },
            },
            peopleLoss: {
                component: () => {
                    const { lossServerId } = this.props;

                    if (!lossServerId) {
                        return null;
                    }

                    return (
                        <PeopleLossList
                            className={styles.peopleLossList}
                            lossServerId={lossServerId}
                        />
                    );
                },
            },
            familyLoss: {
                component: () => {
                    const { lossServerId } = this.props;

                    if (!lossServerId) {
                        return null;
                    }

                    return (
                        <FamiliesLossList
                            className={styles.peopleLossList}
                            lossServerId={lossServerId}
                        />
                    );
                },
            },
            livestockLoss: {
                component: () => {
                    const { lossServerId } = this.props;

                    if (!lossServerId) {
                        return null;
                    }

                    return (
                        <LivestockLossList
                            className={styles.peopleLossList}
                            lossServerId={lossServerId}
                        />
                    );
                },
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
            incidentOnDate: [requiredCondition],
            incidentOnTime: [requiredCondition],
            wards: [],
            point: [],
            polygon: [],
            description: [],
            cause: [],
            verified: [],
            verificationMessage: [],
            approved: [],
            reportedOnDate: [requiredCondition],
            reportedOnTime: [requiredCondition],
            streetAddress: [],
            title: [requiredCondition],
            needFollowup: [],
            event: [],
            lossDescription: [requiredCondition],
            estimatedLoss: [],
            location: [requiredCondition],
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
        this.setState({ faramErrors });
    }

    private handleFaramValidationSuccess = (faramValues: FaramValues) => {
        const {
            requests: {
                incidentRequest,
                lossRequest,
            },
        } = this.props;

        const {
            incidentOnDate,
            incidentOnTime,
            reportedOnDate,
            reportedOnTime,
            location,
            estimatedLoss,
            lossDescription,
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

        const bodyForLoss = {
            description: lossDescription,
            estimatedLoss,
        };

        incidentRequest.do({
            body,
            onAddFailure: this.handleRequestFailure,
        });

        lossRequest.do({
            body: bodyForLoss,
            onAddFailure: this.handleRequestFailure,
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
            lossServerId,
        } = this.props;

        const { currentView } = this.state;

        const disabledTabs = isFalsy(lossServerId)
            ? ['peopleLoss']
            : undefined;

        return (
            <Modal
                className={_cs(styles.addIncidentFormModal, className)}
                onClose={closeModal}
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
                <div className={styles.addIncidentForm}>
                    <ModalBody className={styles.body}>
                        <ScrollTabs
                            className={styles.tabs}
                            tabs={this.tabs}
                            onClick={this.handleTabClick}
                            active={currentView}
                            disabledTabs={disabledTabs}
                        />
                        <MultiViewContainer
                            views={this.views}
                            active={currentView}
                        />
                    </ModalBody>
                </div>
            </Modal>
        );
    }
}

export default compose(createRequestClient(requests))(AddIncidentForm);
