import React from 'react';
import { compose } from 'redux';
import {
    populateFormat,
    breakFormat,
    encodeDate,
    _cs,
} from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import ScrollTabs from '#rscv/ScrollTabs';
import LoadingAnimation from '#rscv/LoadingAnimation';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import Cloak from '#components/Cloak';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import GeneralDetails from './General';
import Loss from './Loss';
import PeopleLossList from './PeopleLossList';
import FamiliesLossList from './FamiliesLossList';
import LivestockLossList from './LivestockLossList';
import styles from './styles.scss';

interface Tabs {
    general: string;
    loss: string;
    peopleLoss: string;
    familyLoss: string;
    livestockLoss: string;
}
interface Views {
    general: {};
    loss: {};
    peopleLoss: {};
    familyLoss: {};
    livestockLoss: {};
}
interface Params {
    body?: object;
    setFaramErrors?: (error: object) => void;
    incidentServerId?: number;
}

interface CloakParams {
    add_incident?: boolean;
    change_incident?: boolean;
    add_loss?: boolean;
    change_loss?: boolean;
    add_people?: boolean;
    change_people?: boolean;
    add_family?: boolean;
    change_family?: boolean;
    add_livestock?: boolean;
    change_livestock?: boolean;
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
        url: ({ props: { incidentServerId } }) => (incidentServerId
            ? `/incident/${incidentServerId}/` : '/incident/'),
        method: ({ props: { incidentServerId } }) => (
            incidentServerId ? methods.PATCH : methods.POST
        ),
        query: ({
            expand: ['loss', 'event', 'wards'],
        }),
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ props, response }) => {
            const { onIncidentChange } = props;
            if (onIncidentChange) {
                onIncidentChange(response);
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
    },
};

const getLocationDetails = (incidentDetails) => {
    const {
        wards = [],
        point,
        ward,
        municipality,
    } = incidentDetails || {};

    if (!point) {
        return undefined;
    }

    const geoJson = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: point,
                properties: {
                    hazardColor: '#f00000',
                },
            },
        ],
    };

    return ({
        geoJson,
        region: {
            geoarea: municipality,
            adminLevel: 3,
            ward,
        },
        wards: wards.map(w => w.id),
    });
};

const getIncidentDateTime = (incidentOn: string | number | undefined) => {
    if (!incidentOn) {
        return {};
    }

    const date = new Date(incidentOn);
    return {
        incidentOnDate: encodeDate(date),
        incidentOnTime: populateFormat(breakFormat('hh:mm'), date)[0].value,
    };
};

const getReportedDateTime = (reportedOn: string | number | undefined) => {
    if (!reportedOn) {
        return {};
    }

    const date = new Date(reportedOn);
    return {
        reportedOnDate: encodeDate(date),
        reportedOnTime: populateFormat(breakFormat('hh:mm'), date)[0].value,
    };
};

class AddIncidentForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.tabs = {
            general: 'General',
            loss: 'Loss',
            peopleLoss: 'People Loss',
            familyLoss: 'Family Loss',
            livestockLoss: 'Livestock Loss',
        };

        const {
            incidentDetails = {},
        } = this.props;

        const faramValuesForState = {
            approved: false,
            verified: false,
            ...incidentDetails,
            location: getLocationDetails(incidentDetails),
            event: incidentDetails.event && incidentDetails.event.id,
            ...getIncidentDateTime(incidentDetails.incidentOn),
            ...getReportedDateTime(incidentDetails.reportedOn),
        };

        const isIncidentHidden = (p: CloakParams) => {
            if (incidentDetails) {
                return !p.change_incident;
            }
            return !p.add_incident;
        };
        const isLossHidden = (p: CloakParams) => {
            if (incidentDetails) {
                return !p.change_loss;
            }

            return !p.add_loss;
        };
        const isPeopleLossHidden = (p: CloakParams) => {
            if (incidentDetails) {
                return !p.change_people;
            }

            return !p.add_people;
        };
        const isFamilyLossHidden = (p: CloakParams) => {
            if (incidentDetails) {
                return !p.change_family;
            }

            return !p.add_family;
        };
        const isLivestockLossHidden = (p: CloakParams) => {
            if (incidentDetails) {
                return !p.change_livestock;
            }
            return !p.add_livestock;
        };

        this.views = {
            general: {
                component: () => {
                    const {
                        pristine,
                        faramValues,
                        faramErrors,
                    } = this.state;

                    const {
                        requests: {
                            incidentRequest: {
                                pending: incidentPending,
                            },
                        },
                    } = this.props;

                    return (
                        <Cloak hiddenIf={isIncidentHidden}>
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
                                        pending={incidentPending}
                                        disabled={pristine}
                                    >
                                        Save
                                    </PrimaryButton>
                                </div>
                            </Faram>
                        </Cloak>
                    );
                },
            },
            loss: {
                component: () => {
                    const {
                        onLossChange,
                        lossServerId,
                        incidentServerId,
                    } = this.props;

                    return (
                        <Cloak hiddenIf={isLossHidden}>
                            <Loss
                                lossServerId={lossServerId}
                                incidentServerId={incidentServerId}
                                onLossChange={onLossChange}
                            />
                        </Cloak>
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
                        <Cloak hiddenIf={isPeopleLossHidden}>
                            <PeopleLossList
                                className={styles.peopleLossList}
                                lossServerId={lossServerId}
                            />
                        </Cloak>
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
                        <Cloak hiddenIf={isFamilyLossHidden}>
                            <FamiliesLossList
                                className={styles.peopleLossList}
                                lossServerId={lossServerId}
                            />
                        </Cloak>
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
                        <Cloak hiddenIf={isLivestockLossHidden}>
                            <LivestockLossList
                                className={styles.peopleLossList}
                                lossServerId={lossServerId}
                            />
                        </Cloak>
                    );
                },
            },
        };

        this.state = {
            faramValues: faramValuesForState,
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
            needFollowup: [],
            event: [],
            location: [requiredCondition],
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
            pristine: true,
        });
    }

    private handleFaramValidationSuccess = (faramValues: FaramValues) => {
        const {
            requests: {
                incidentRequest,
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

        incidentRequest.do({
            body,
            setFaramErrors: this.handleFaramValidationFailure,
        });

        this.setState({ pristine: true });
    }

    private handleTabClick = (newTab: keyof Tabs) => {
        this.setState({ currentView: newTab });
    }

    public render() {
        const {
            className,
            closeModal,
            lossServerId,
            incidentServerId,
            requests: {
                incidentRequest: {
                    pending: incidentPending,
                },
            },
        } = this.props;

        const { currentView } = this.state;

        const disabledTabs = [
            !lossServerId && !incidentServerId && 'loss',
            !lossServerId && 'peopleLoss',
            !lossServerId && 'familyLoss',
            !lossServerId && 'livestockLoss',
        ];

        return (
            <Modal
                className={_cs(styles.addIncidentFormModal, className)}
                // onClose={closeModal}
            >
                <ModalHeader
                    title="Add / edit incident"
                    rightComponent={(
                        <DangerConfirmButton
                            transparent
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"

                            confirmationMessage="Are you sure you want to close the form?"
                        />
                    )}
                />
                <div className={styles.addIncidentForm}>
                    <ModalBody className={styles.body}>
                        {incidentPending && <LoadingAnimation />}
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
