import React from 'react';
import Redux, {
    compose,
} from 'redux';
import { connect } from 'react-redux';
import { encodeDate, _cs, isDefined, isNotDefined } from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
    FaramInputElement,
} from '@togglecorp/faram';

import NonFieldErrors from '#rsci/NonFieldErrors';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Icon from '#rscg/Icon';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import TextInput from '#rsci/TextInput';
// import DateInput from '#rsci/DateInput';
import SelectInput from '#rsci/SelectInput';
import RawFileInput from '#rsci/RawFileInput';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import NormalStepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';

import {
    setEventListAction,
    setDocumentCategoryListAction,
} from '#actionCreators';

import {
    eventListSelector,
    adminLevelListSelector,
    documentCategoryListSelector,
} from '#selectors';


import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

const StepwiseRegionSelectInput = FaramInputElement(NormalStepwiseRegionSelectInput);

interface Params {
    body: object;
    onFailure: (faramErrors: object) => void;
}

interface OwnProps {
    closeModal?: () => void;
    value?: PageType.DocumentItem;
    onUpdate?: (document: PageType.DocumentItem) => void;
    className?: string;
}

interface PropsFromState {
    regionList: PageType.AdminLevel[];
    eventList: PageType.EventType[];
    categoryList: PageType.DocumentCategory[];
}

interface PropsFromDispatch {
    setEventList: typeof setEventListAction;
    setDocumentCategoryList: typeof setDocumentCategoryListAction;
}

interface FaramValues {
    title?: string;
    category?: number;
    region?: 'national' | 'province' | 'district' | 'municipality';
    file?: File;
    event?: number;
    // severity?: string;

    // Temporary
    stepwiseRegion?: PageType.Region;

    // Filled automatically
    province?: number | null;
    district?: number | null;
    municipality?: number | null;
    publishedDate?: string;
}

interface FaramErrors {
    file?: string;
}

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}
const keySelector = (d: PageType.Field) => d.id;
const labelSelector = (d: PageType.Field) => d.title;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    eventTypesGetRequest: {
        url: '/event/',
        method: methods.GET,
        onSuccess: ({ response, props: { setEventList } }) => {
            interface Response { results: PageType.Event[] }
            const { results: eventList = [] } = response as Response;
            setEventList({ eventList });
        },
        onMount: true,
    },
    documentCategoriesGetRequest: {
        url: '/document-category/',
        method: methods.GET,
        onSuccess: ({ response, props: { setDocumentCategoryList } }) => {
            interface Response { results: PageType.DocumentCategory[] }
            const { results: documentCategoryList = [] } = response as Response;
            setDocumentCategoryList({ documentCategoryList });
        },
        onMount: true,
    },

    addDocumentPostRequest: {
        url: ({ props }) => (
            props.value
                ? `/document/${props.value.id}/`
                : '/document/'
        ),
        method: ({ props }) => (
            props.value
                ? methods.PATCH
                : methods.POST
        ),
        body: ({ params: { body } = { body: {} } }) => body,
        onSuccess: ({ response, props }) => {
            if (props.onUpdate) {
                props.onUpdate(response as PageType.DocumentItem);
            }
            if (props.closeModal) {
                props.closeModal();
            }
        },
        onFailure: ({ error, params: { onFailure } = { onFailure: undefined } }) => {
            if (onFailure) {
                onFailure((error as { faramErrors: object }).faramErrors);
            }
        },
        onFatal: ({ params }) => {
            if (params && params.onFailure) {
                params.onFailure({ $internal: ['Some error occurred'] });
            }
        },
        extras: {
            hasFile: true,
        },
    },
};

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    regionList: adminLevelListSelector(state),
    eventList: eventListSelector(state),
    categoryList: documentCategoryListSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setEventList: params => dispatch(setEventListAction(params)),
    setDocumentCategoryList: params => dispatch(setDocumentCategoryListAction(params)),
});

function getAdminLevel(province?: number, district?: number, municipality?: number) {
    if (isDefined(province)) {
        return 1;
    }
    if (isDefined(district)) {
        return 2;
    }
    if (isDefined(municipality)) {
        return 3;
    }
    return 0;
}

function getGeoArea(province?: number, district?: number, municipality?: number) {
    if (isDefined(province)) {
        return province;
    }
    if (isDefined(district)) {
        return district;
    }
    if (isDefined(municipality)) {
        return municipality;
    }
    return undefined;
}

class AddDocumentForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const {
            file,
            province,
            district,
            municipality,
            ...otherValues
        } = props.value || {};

        const adminLevel = getAdminLevel(province, district, municipality);
        const geoarea = getGeoArea(province, district, municipality);

        this.state = {
            faramValues: {
                ...otherValues,
                stepwiseRegion: {
                    adminLevel,
                    geoarea,
                },
            },
            faramErrors: {},
            pristine: true,
        };

        this.schema = {
            fields: {
                title: [requiredCondition],
                file: [requiredCondition],
                category: [],
                region: [],
                event: [],
                stepwiseRegion: [],
                // province: [],
                // district: [],
                // municipality: [],
                // publishedDate: [],
            },
            validation: (faramValues: FaramValues) => {
                const errors: string[] = [];
                const { region, stepwiseRegion } = faramValues;
                if (
                    (isDefined(region) && isNotDefined(stepwiseRegion))
                    || (isDefined(region) && isNotDefined(stepwiseRegion))
                ) {
                    errors.push('Proper region is not selected');
                } if (isDefined(region) && isDefined(stepwiseRegion)) {
                    const { regionList } = this.props;
                    const currentRegion = regionList.find(
                        item => item.id === stepwiseRegion.adminLevel,
                    );
                    if (currentRegion && region !== currentRegion.title) {
                        errors.push('Proper region is not selected');
                    }
                }
                return errors;
            },
        };

        if (props.value) {
            delete this.schema.fields.file;
        }
    }

    private schema: unknown;

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

    private handleFaramValidationSuccess = (_: unknown, faramValues: FaramValues) => {
        const {
            requests: { addDocumentPostRequest },
        } = this.props;
        const {
            // publishedDate: date,
            stepwiseRegion,
            ...others
        } = faramValues;

        const date = new Date();
        const publishedDate = encodeDate(new Date(date));
        const newBody = {
            ...others,
            publishedDate,
        };

        if (stepwiseRegion) {
            switch (stepwiseRegion.adminLevel) {
                case 0:
                    newBody.province = null;
                    newBody.district = null;
                    newBody.municipality = null;
                    break;
                case 1:
                    newBody.province = stepwiseRegion.geoarea;
                    newBody.district = null;
                    newBody.municipality = null;
                    break;
                case 2:
                    newBody.province = null;
                    newBody.district = stepwiseRegion.geoarea;
                    newBody.municipality = null;
                    break;
                case 3:
                    newBody.province = null;
                    newBody.district = null;
                    newBody.municipality = stepwiseRegion.geoarea;
                    break;
                default:
                    break;
            }
        }

        addDocumentPostRequest.do({
            body: newBody,
            onFailure: (faramErrors: object) => {
                this.setState({ faramErrors });
            },
        });
    }

    public render() {
        const {
            className,
            closeModal,
            eventList,
            regionList,
            categoryList,
            requests: {
                addDocumentPostRequest: { pending },
            },
            value,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        return (
            <Modal
                className={_cs(styles.addDocumentModal, className)}
                onClose={closeModal}
                // closeOnEscape
            >
                {pending && <LoadingAnimation />}
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={this.schema}
                    value={faramValues}
                    error={faramErrors}
                    disabled={pending}
                >
                    <ModalHeader
                        title={
                            value ? 'Edit Document' : 'Add Document'
                        }
                    />
                    <ModalBody>
                        <NonFieldErrors faramElement />
                        <TextInput
                            faramElementName="title"
                            label="Title"
                            autoFocus
                        />
                        <SelectInput
                            faramElementName="category"
                            options={categoryList}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            label="Category"
                        />
                        <SelectInput
                            faramElementName="region"
                            options={regionList}
                            keySelector={labelSelector}
                            labelSelector={labelSelector}
                            label="Region"
                        />
                        <StepwiseRegionSelectInput
                            faramElementName="stepwiseRegion"
                            wardsHidden
                        />

                        <SelectInput
                            faramElementName="event"
                            options={eventList}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            label="Event"
                        />
                        {!value && (
                            <RawFileInput
                                className={styles.fileInput}
                                faramElementName="file"
                                // error={faramErrors.file}
                            >
                                <Icon name="upload" />
                                <span className={styles.load}>
                                    Add document
                                </span>
                            </RawFileInput>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <DangerButton onClick={closeModal}>
                            Close
                        </DangerButton>
                        <PrimaryButton
                            type="submit"
                            disabled={pristine}
                            pending={pending}
                        >
                            Save
                        </PrimaryButton>
                    </ModalFooter>
                </Faram>
            </Modal>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requests),
)(AddDocumentForm);
