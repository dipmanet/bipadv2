/* eslint-disable max-len */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
    _cs,
    isNotDefined,
    isDefined,
} from '@togglecorp/fujs';
import memoize from 'memoize-one';
import Faram from '@togglecorp/faram';
import * as ReachRouter from '@reach/router';

import LocationInput from '#components/LocationInput';
import NonFieldErrors from '#rsci/NonFieldErrors';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import SelectInput from '#rsci/SelectInput';
import TextInput from '#rsci/TextInput';
import TextArea from '#rsci/TextArea';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';
import { EnumItem, ModelEnum, ResourceTypeKeys } from '#types';
import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    enumOptionsSelector,
    resourceTypeListSelector,
    palikaRedirectSelector,
    wardsSelector,
} from '#selectors';
import {
    setPalikaRedirectAction,
} from '#actionCreators';

import EducationFields from './EducationFields';
import HealthFields from './HealthFields';
import FinanceFields from './FinanceFields';
import GovernanceFields from './GovernanceFields';
import CulturalFields from './CulturalFields';
import TourismFields from './TourismFields';
import CommunicationFields from './CommunicationFields';
import IndustryFields from './IndustryFields';
import OpenspaceFields from './OpenspaceFields';
import CommunitySpaceFields from './CommunitySpaceFields';
import schemaMap, { defaultSchema } from './schema';
import styles from './styles.scss';
import HelipadFields from './HelipadFields';
import { capacityResource } from '#utils/domain';
import RawFileInput from '#rsci/RawFileInput';
import BridgeFields from './BridgeFields';
import ElectricityFields from './ElectricityFields';
import SanitationFields from './SanitationFields';
import WaterSupplyInfrastructureFields from './WaterSupplyInfrastructureFields';
import AirwayFields from './AirwayFields';
import WaterwayFields from './WaterwayFields';
import RoadwayFields from './RoadwayFields';
import Loading from '#components/Loading';
import FireEngineFields from './FireEngineFields';
import EvacuationCentreFields from './EvacuationCentreFields';
import NumberInput from '#rsci/NumberInput';


const getLocationDetails = (point: unknown, ward?: number) => {
    const geoJson = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: point,
            },
        ],
    };

    return ({
        geoJson,
        region: {
            ward,
        },
    });
};

interface Params {
    resourceId?: number;
    body?: object;
    onSuccess?: (resource: PageType.Resource) => void;
    setFaramErrors?: (error: object) => void;
    top?: number;
    left?: number;
}
interface OwnProps {
    closeModal?: () => void;
    className?: string;
    resourceId?: number;
    resourceDetails?: PageType.Resource;
    onAddSuccess?: (resource: PageType.Resource) => void;
    onEditSuccess?: (resourceId: PageType.Resource['id'], resource: PageType.Resource) => void;
    modalPos?: { top: number | string; left: number | string };
}

interface PropsFromState {
    resourceTypeList: PageType.ResourceType[];
    enumOptions: ModelEnum[];
    wards: PageType.Ward[];
}

interface PropsFromDispatch {
}

interface FaramValues {
    title?: string;
    description?: string;
    point?: string;
    location?: ReturnType<typeof getLocationDetails> | null;
    ward?: number;
    resourceType?: string;
}
interface FaramErrors {
}
interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
    resourceId?: number;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;


const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),

});

const mapStateToProps = (state: AppState): PropsFromState => ({
    resourceTypeList: resourceTypeListSelector(state),
    enumOptions: enumOptionsSelector(state),
    palikaRedirect: palikaRedirectSelector(state),
    wards: wardsSelector(state),
});

const labelSelector = (d: PageType.Field) => d.title;
const typeSelector = (d: PageType.Field) => d.type;
const selectLabel = (d: PageType.Field) => d.label;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    addResourcePostRequest: {
        url: '/resource/',
        method: methods.POST,
        query: { meta: true },
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({
            params: { onSuccess } = { onSuccess: undefined },
            response,
        }) => {
            if (onSuccess) {
                onSuccess(response as PageType.Resource);
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                const errorKey = Object.keys(error.response).find(i => i === 'ward');

                if (errorKey) {
                    const errorList = error.response;
                    errorList.location = errorList.ward;
                    delete errorList.ward;

                    params.setFaramErrors(errorList);
                } else {
                    const data = error.response;
                    const resultError = {};
                    const keying = Object.keys(data);
                    const valuing = Object.values(data).map(item => item[0]);
                    const outputError = () => {
                        const outputFinalError = keying.map((item, i) => (
                            resultError[`${item}`] = valuing[i]
                        ));
                        return outputFinalError;
                    };
                    outputError();


                    params.setFaramErrors(resultError);
                }
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
    editResourcePutRequest: {
        url: ({ params: { resourceId } }) => `/resource/${resourceId}/`,
        method: methods.PUT,
        query: { meta: true },
        body: ({ params: { body } = { body: {} } }) => body,
        onMount: false,
        onSuccess: ({
            params: { onSuccess } = { onSuccess: undefined },
            response,
        }) => {
            if (onSuccess) {
                onSuccess(response as PageType.Resource);
            }
        },
        onFailure: ({ error, params }) => {
            if (params && params.setFaramErrors) {
                const errorKey = Object.keys(error.response).find(i => i === 'ward');

                if (errorKey) {
                    const errorList = error.response;
                    errorList.location = errorList.ward;
                    delete errorList.ward;

                    params.setFaramErrors(errorList);
                } else {
                    const data = error.response;
                    const resultError = {};
                    const keying = Object.keys(data);
                    const valuing = Object.values(data).map(item => item[0]);
                    const outputError = () => {
                        const outputFinalError = keying.map((item, i) => (
                            resultError[`${item}`] = valuing[i]
                        ));
                        return outputFinalError;
                    };
                    outputError();


                    params.setFaramErrors(resultError);
                }
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


interface ExtraFieldProps {
    title: string;
    resourceEnums: EnumItem[];
    faramValues: FaramValues;
    resourceId: number | undefined;
    closeModal: () => void;
}

const ExtraFields = ({
    title,
    resourceEnums,
    faramValues,
    resourceId,
    closeModal,
    iconName,
    LoadingSuccessHalt,
    addResourcePending,
    faramValueSetNull,
    handleFaramValidationFailure,

}: ExtraFieldProps) => {
    switch (title) {
        case 'education':
            return (
                <EducationFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />
            );

        case 'health':
            return (
                <HealthFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />
            );

        case 'finance':
            return (
                <FinanceFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />
            );

        case 'governance':
            return (
                <GovernanceFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />
            );

        case 'cultural':
            return (
                <CulturalFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />
            );
        case 'hotelandrestaurant':
            return (
                <TourismFields
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />
            );
        case 'communication':
            return (
                <CommunicationFields
                    faramValues={faramValues}
                    resourceEnums={resourceEnums}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />
            );
        case 'industry':
            return (
                <IndustryFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />
            );
        case 'openspace':
            return (
                <OpenspaceFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    resourceId={resourceId}
                    closeModal={closeModal}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                    LoadingSuccessHalt={LoadingSuccessHalt}
                    addResourcePending={addResourcePending}
                    faramValueSetNull={faramValueSetNull}
                    handleFaramValidationFailure={handleFaramValidationFailure}
                />
            );

        case 'bridge':
            return (
                <BridgeFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />
            );

        case 'electricity':
            return (
                <ElectricityFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />
            );
        case 'sanitation':
            return (
                <SanitationFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />
            );
        case 'communityspace':
            return (
                <CommunitySpaceFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    resourceId={resourceId}
                    closeModal={closeModal}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                    LoadingSuccessHalt={LoadingSuccessHalt}
                    addResourcePending={addResourcePending}
                    faramValueSetNull={faramValueSetNull}
                    handleFaramValidationFailure={handleFaramValidationFailure}

                />
            );
        case 'watersupply':
            return (
                <WaterSupplyInfrastructureFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}

                />
            );


        case 'helipad':
            return (
                <HelipadFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />

            );
        case 'airway':
            return (
                <AirwayFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />

            );
        case 'waterway':
            return (
                <WaterwayFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />

            );
        case 'roadway':
            return (
                <RoadwayFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />

            );
        case 'fireengine':
            return (
                <FireEngineFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />

            );
        case 'firefightingapparatus':
            return (
                <FireEngineFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />

            );
        case 'evacuationcentre':
            return (
                <EvacuationCentreFields
                    resourceEnums={resourceEnums}
                    faramValues={faramValues}
                    optionsClassName={styles.optionsClassName}
                    iconName={iconName}
                />

            );
        default:
            return null;
    }
};

class AddResourceForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            resourceId,
            resourceDetails,
        } = this.props;

        let faramValues = {};
        if (resourceDetails) {
            const {
                point,
                ward,
            } = resourceDetails;

            faramValues = {
                ...resourceDetails,
                location: point && getLocationDetails(point, ward),
            };
        }

        this.state = {
            faramValues,
            faramErrors: {},
            pristine: true,
            resourceId,
            addResourcePending: false,

        };
    }

    public componentDidUpdate(prevProps, prevState) {
        const { faramValues: { resourceType } } = this.state;
        if (prevState.faramValues.resourceType !== resourceType) {
            this.setState({
                faramValues: { resourceType },
            });
        }
    }

    private getSchema = memoize((resourceType?: ResourceTypeKeys) => {
        if (resourceType) {
            return schemaMap[resourceType];
        }
        return defaultSchema;
    });

    private LoadingSuccessHalt = (data) => {
        this.setState({ addResourcePending: data });
    }

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
        // this.setState({ faramValues });
        if ((faramValues.noOfMaleEmployee)
            || (faramValues.noOfFemaleEmployee)) {
            const { noOfMaleEmployee, noOfOtherEmployee,
                noOfFemaleEmployee, noOfEmployee } = faramValues;
            this.setState({
                faramValues: {
                    ...faramValues,
                    noOfEmployee: (noOfMaleEmployee || 0)
                        + (noOfFemaleEmployee || 0) + (noOfOtherEmployee || 0),
                    noOfOtherEmployee: noOfOtherEmployee || 0,
                },


            });
        } else {
            this.setState({ faramValues });
        }
        if ((faramValues.noOfMaleStudent)
            || (faramValues.noOfFemaleStudent)) {
            const { noOfMaleStudent, noOfFemaleStudent, noOfOtherStudent } = faramValues;
            this.setState({
                faramValues: {
                    ...faramValues,
                    noOfStudent: (noOfMaleStudent || 0)
                        + (noOfFemaleStudent || 0) + (noOfOtherStudent || 0),
                    noOfOtherStudent: noOfOtherStudent || 0,
                },

            });
        }
        if (faramValues.resourceType === 'health') {
            if ((faramValues.hasSafeMotherhood === (false))

            ) {
                this.setState({
                    faramValues: {
                        ...faramValues,
                        hasAntenatalCare: false,
                        hasPostnatalCare: false,
                        birthingCenter: false,
                        hasBasicEmergencyObstetricCare: false,
                        hasComprehensiveEmergencyObstetricCare: false,
                        hasComprehensiveAbortionCare: false,
                        hasPostAbortionCare: false,
                    },
                });
            }

            if ((faramValues.familyPlanning === (false))


            ) {
                this.setState({
                    faramValues: {
                        ...faramValues,
                        hasCondomPillsDepoprovera: false,
                        hasIucd: false,
                        hasImplant: false,
                        hasVasectomy: false,
                        hasMinilap: false,
                    },
                });
            }
            if ((faramValues.hasOpd === (false))

            ) {
                this.setState({
                    faramValues: {
                        ...faramValues,
                        hasGeneral: false,
                        hasPediatric: false,
                        hasObsAndGynae: false,
                        hasDentalOpd: false,
                        hasSurgery: false,
                        hasGastrointestinal: false,
                        hasCardiac: false,
                        hasMental: false,
                        hasRespiratory: false,
                        hasNephrology: false,
                        hasEnt: false,
                        hasDermatology: false,
                        hasEndocrinology: false,
                        hasOncology: false,
                        hasNeurology: false,
                        hasOphthalmology: false,
                    },
                });
            }
            if ((faramValues.hasLaboratoryService === (false))

            ) {
                this.setState({
                    faramValues: {
                        ...faramValues,
                        hasTestHiv: false,
                        hasTestMalaria: false,
                        hasTestTb: false,
                        hasTestKalaazar: false,
                        hasUrineRe: false,
                        hasStoolRe: false,
                        hasGeneralBloodCbc: false,
                        hasCulture: false,
                        hasHormones: false,
                        hasLeprosySmearTest: false,
                        hasTestCovidPcr: false,
                        hasTestCovidAntigen: false,
                    },
                });
            }
            if ((faramValues.hasRadiology === (false))

            ) {
                this.setState({
                    faramValues: {
                        ...faramValues,
                        hasXRay: false,
                        hasXRayWithContrast: false,
                        hasUltrasound: false,
                        hasEchocardiogram: false,
                        hasEcg: false,
                        hasTrademill: false,
                        hasCtScan: false,
                        hasMri: false,
                        hasEndoscopy: false,
                        hasColonoscopy: false,
                    },
                });
            }
            if ((faramValues.hasSurgicalService === (false))

            ) {
                this.setState({
                    faramValues: {
                        ...faramValues,
                        hasCaesarianSection: false,
                        hasGastrointestinalSurgery: false,
                        hasTraumaSurgery: false,
                        hasCardiacSurgery: false,
                        hasNeuroSurgery: false,
                        hasPlasticSurgery: false,
                    },
                });
            }
            if ((faramValues.hasSpecializedService === (false))

            ) {
                this.setState({
                    faramValues: {
                        ...faramValues,
                        hasIcu: false,
                        hasCcu: false,
                        hasNicu: false,
                        hasMicu: false,
                        hasSncu: false,
                        hasPicu: false,
                    },
                });
            }
        }

        this.setState({
            faramErrors,
            pristine: false,
        });
    }

    private handleFaramValidationFailure = (faramErrors: FaramErrors) => {
        this.setState({
            faramErrors,
        });

        const myDiv = document.getElementById('capacityAndResources');

        myDiv.scrollTop = 0;
        this.setState({ addResourcePending: false });
    }

    private handleFaramValidationSuccess = (_: FaramValues, faramValues: FaramValues) => {
        const {
            location,
            ...others
        } = faramValues;

        const {
            resourceId,
        } = this.state;
        const {
            setPalikaRedirect,
            palikaRedirect,
            wards,
        } = this.props;


        const finalValues = others;
        const { picture, ...othersData } = finalValues;

        let values = resourceId ? picture && picture.type ? finalValues : othersData : finalValues;

        if (location && location.wards && location.wards.length) {
            const point = location.geoJson.features[0].geometry;
            const { ward } = location.region;
            // const wardTitle: number | undefined = wards.filter(w => w.id === ward)[0].title;
            values = {
                ...values,
                point,
                // ward: wardTitle || undefined,
                ward,
            };
        }
        const {
            requests: {
                addResourcePostRequest,
                editResourcePutRequest,
            },
        } = this.props;
        this.setState({ addResourcePending: true });
        if (isNotDefined(resourceId)) {
            addResourcePostRequest.do({
                body: values,
                onSuccess: this.handleAddResourceSuccess,
                setFaramErrors: this.handleFaramValidationFailure,
            });
        } else {
            editResourcePutRequest.do({
                resourceId,
                body: values,
                onSuccess: this.handleEditResourceSuccess,
                setFaramErrors: this.handleFaramValidationFailure,
            });
        }
    }


    private handleAddResourceSuccess = (resource: PageType.Resource) => {
        const { onAddSuccess, closeModal, faramValues, updateResourceOnDataAddition } = this.props;

        if (onAddSuccess) {
            onAddSuccess(resource);
        }
        const ResourceType = resource.resourceType;

        updateResourceOnDataAddition(ResourceType);
        this.setState({ addResourcePending: false, faramValues: {} });
        const myDiv = document.getElementById('capacityAndResources');

        myDiv.scrollTop = 0;
    }

    private handleEditResourceSuccess = (resource: PageType.Resource) => {
        const { onEditSuccess, closeModal, faramValues, updateResourceOnDataAddition } = this.props;
        const { setAddResource } = this.context;

        if (onEditSuccess) {
            onEditSuccess(resource.id, resource);
        }
        const ResourceType = resource.resourceType;

        updateResourceOnDataAddition(ResourceType);
        this.setState({ addResourcePending: false, faramValues: {} });


        setAddResource(false);
        const myDiv = document.getElementById('capacityAndResources');

        myDiv.scrollTop = 0;
        closeModal();
    }

    private filterEnumItem = (
        resourceEnums: ModelEnum[],
        resourceType: string,
    ) => {
        const options = resourceEnums.find(({ model }) => model.toLowerCase() === resourceType);
        if (options) {
            return options.enums;
        }
        return [];
    }

    // public componentDidMount(){
    //     this.setState({
    //         resourceId:
    //     })
    // }


    private filterResourceTypeData = (dataResourceType) => {
        const { faramValues } = this.state;
        // if (dataResourceType === 'helipad' || dataResourceType === 'airway' || dataResourceType === 'waterway' || dataResourceType === 'roadway') {
        //     const selectedDataTypeList = (capacityResource.filter(item => item.typeName === 'transportation')[0].Category);
        //     const finaldatas = selectedDataTypeList
        //         .filter(item => item.resourceType === dataResourceType)[0].subCategory;

        //     return finaldatas;
        // } if (dataResourceType === 'fireengine') {
        //     const selectedDataTypeList = (capacityResource.filter(item => item.typeName === 'Fire Fighting Apparatus')[0].Category);
        //     const finaldatas = selectedDataTypeList
        //         .filter(item => item.resourceType === dataResourceType)[0].subCategory;

        //     return finaldatas;
        // }

        const selectedType = faramValues && capacityResource
            .filter(item => item.resourceType === dataResourceType)
            .map(data => data.subCategory)[0];
        return selectedType;
    }

    private filterResourceTypeDataAttribute = (dataResourceType) => {
        const { faramValues } = this.state;
        // if (dataResourceType === 'helipad' || dataResourceType === 'airway' || dataResourceType === 'waterway' || dataResourceType === 'roadway') {
        //     const selectedDataTypeList = (capacityResource.filter(item => item.typeName === 'transportation')[0].Category);
        //     const finaldatas = selectedDataTypeList
        //         .filter(item => item.resourceType === dataResourceType)[0].attribute;

        //     return [finaldatas];
        // } if (dataResourceType === 'fireengine') {
        //     const selectedDataTypeList = (capacityResource.filter(item => item.typeName === 'Fire Fighting Apparatus')[0].Category);
        //     const finaldatas = selectedDataTypeList
        //         .filter(item => item.resourceType === dataResourceType)[0].attribute;

        //     return [finaldatas];
        // }
        const selectedAttribute = faramValues && capacityResource
            .filter(item => item.resourceType === dataResourceType)
            .map(data => data.attribute);
        return selectedAttribute;
    }

    private faramValueSetNull = () => {
        this.setState({ faramValues: {} });
    }

    public render() {
        const {
            className,
            closeModal,
            resourceTypeList,
            enumOptions,
            modalPos,
            requests: {
                editResourcePutRequest: {
                    pending: editResourcePending,
                },
                addResourcePostRequest: {
                    pending,
                }, addResourcePostRequest,
            },
            palikaRedirect,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
            resourceId,
            addResourcePending,
        } = this.state;

        const { resourceType } = faramValues;
        const schema = this.getSchema(resourceType as ResourceTypeKeys);

        let resourceEnums: EnumItem[] = [];
        if (resourceType) {
            resourceEnums = this.filterEnumItem(enumOptions, resourceType);
        }
        const hideButtons = resourceType === 'openspace' || resourceType === 'communityspace';
        const selectedType = this.filterResourceTypeData(faramValues.resourceType);
        const selectedAttribute = this.filterResourceTypeDataAttribute(faramValues.resourceType);
        const industryTypeField = [
            {
                id: 1,
                name: 'Service Oriented',
                type: 'Service Oriented',
            }, {
                id: 2,
                name: 'Production Oriented',
                type: 'Production Oriented',
            },
        ];
        return (

            <>
                <Loading pending={addResourcePending} text={'Submitting Data Please Wait !!'} />
                <Faram
                    className={styles.form}
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={schema}
                    value={faramValues}
                    error={faramErrors}
                >

                    <NonFieldErrors faramElement />

                    <SelectInput
                        addResourceDropdown={'capResAddFormDropdown'}
                        faramElementName="resourceType"
                        options={resourceTypeList}
                        keySelector={labelSelector}
                        labelSelector={selectLabel}
                        label="Resource Type"
                        autoFocus
                        disabled={isDefined(resourceId)}
                        className={styles.resourceType}
                        optionsClassName={styles.optionsClassName}
                        iconName={'capResAddFormDropdown'}


                    />
                    {(faramValues.resourceType !== ('sanitation' || 'watersupply' || 'openspace' || 'helipad' || 'bridge' || 'electricity')) && <h1>INSTITUTION DETAILS</h1>}
                    {(faramValues.resourceType === ('roadway' || 'helipad' || 'waterway' || 'bridge' || 'airway')) && <h1>GENERAL DETAILS</h1>}
                    <TextInput
                        faramElementName="title"
                        label="Name"
                    />
                    {faramValues.resourceType === 'industry'
                        && (
                            <SelectInput
                                addResourceDropdown={'capResAddFormDropdown'}
                                faramElementName={'type'}
                                options={industryTypeField}
                                keySelector={typeSelector}
                                labelSelector={typeSelector}
                                label={'Type'}
                                autoFocus
                                optionsClassName={styles.optionsClassName}
                                iconName={'capResAddFormDropdown'}
                            />
                        )

                    }

                    {selectedAttribute.length && selectedType && selectedType.length ? (
                        <SelectInput
                            addResourceDropdown={'capResAddFormDropdown'}
                            faramElementName={selectedAttribute[0]}
                            options={selectedType}
                            keySelector={typeSelector}
                            labelSelector={typeSelector}
                            label={(faramValues.resourceType
                                === 'health') ? 'Facility Type' : faramValues.resourceType
                                    === 'electricity' ? 'Component' : faramValues.resourceType
                                        === 'watersupply' ? 'Scale' : 'Type'}
                            autoFocus
                            optionsClassName={styles.optionsClassName}
                            iconName={'capResAddFormDropdown'}
                        />
                    ) : ''
                    }

                    {faramValues.type === 'Other'
                        && (
                            <TextInput
                                faramElementName="otherType"
                                label="If type is not mentioned above (other), name it here"
                            />

                        )
                    }
                    {faramValues.components === 'Other'
                        && (
                            <TextInput
                                faramElementName="otherComponents"
                                label="If component is not mentioned above (other), name it here"
                            />

                        )
                    }
                    {faramValues.type === 'Fire Engine'
                        ? (
                            <NumberInput
                                faramElementName="numberOfFireEngine"
                                label="Number of Fire Engine"
                            />
                        ) : ''
                    }
                    {faramValues.type === 'Fire Bike'
                        ? (
                            <NumberInput
                                faramElementName="numberOfFireBike"
                                label="Number of Fire Bike"
                            />
                        ) : ''
                    }
                    {faramValues.type === 'Other'
                        ? (
                            <NumberInput
                                faramElementName="numberOfOtherApparatus"
                                label="Number of Other Apparatus"
                            />
                        ) : ''
                    }
                    {
                        resourceType && (
                            <>
                                <ExtraFields
                                    title={resourceType}
                                    resourceEnums={resourceEnums}
                                    resourceId={resourceId}
                                    faramValues={faramValues}
                                    closeModal={closeModal}
                                    addResourcePostRequest={addResourcePostRequest}
                                    iconName={'capResAddFormDropdown'}
                                    LoadingSuccessHalt={this.LoadingSuccessHalt}
                                    addResourcePending={addResourcePending}
                                    faramValueSetNull={this.faramValueSetNull}
                                    optionsClassName={styles.optionsClassName}
                                    handleFaramValidationFailure={this.handleFaramValidationFailure}
                                />
                                {((faramValues.resourceType === 'communityspace') || (faramValues.resourceType === 'openspace'))

                                    ? (
                                        ''
                                    ) : (
                                        <LocationInput
                                            // className={styles.locationInput}
                                            faramElementName="location"
                                            classCategory={styles.locationInput}
                                            category={'capacityResource'}
                                        />
                                    )}
                            </>
                        )
                    }

                    {/* </ModalBody> */}
                    {
                        !hideButtons && (
                            // <ModalFooter className={styles.footer}>
                            //     <DangerButton onClick={closeModal}>
                            // Close
                            //     </DangerButton>
                            <div className={pristine
                                ? styles.submitButnDisabled : styles.submitButn}
                            >
                                <PrimaryButton
                                    type="submit"
                                    disabled={pristine}
                                    pending={addResourcePending || editResourcePending}
                                >
                                    Submit Changes
                                </PrimaryButton>
                            </div>
                            // </ModalFooter>
                        )}
                </Faram>
            </>
        );
    }
}
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requests),
)(AddResourceForm);
