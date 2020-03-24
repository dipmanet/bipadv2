import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import SelectInput from '#rsci/SelectInput';
import TextInput from '#rsci/TextInput';
import TextArea from '#rsci/TextArea';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import {
} from '#actionCreators';

import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';
import { ResourceEnum, ModelEnum, ResourceTypeKeys } from '#types';
import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    resourceTypeListSelector,
} from '#selectors';

import EducationFields from './EducationFields';
import HealthFields from './HealthFields';
import FinanceFields from './FinanceFields';
import GovernanceFields from './GovernanceFields';
import CulturalFields from './CulturalFields';
import TourismFields from './TourismFields';
import CommunicationFields from './CommunicationFields';
import IndustryFields from './IndustryFields';
import schemaMap, { defaultSchema } from './schema';

import styles from './styles.scss';

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
    resourceTypeList: PageType.ResourceType[];
}
interface PropsFromDispatch {
}
interface FaramValues {
    title?: string;
    description?: string;
    point?: string;
    ward?: number;
    resourceType?: string;
}
interface FaramErrors {
}
interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    resourceTypeList: resourceTypeListSelector(state),
});

const labelSelector = (d: PageType.Field) => d.title;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    resourceEnumGetRequest: {
        url: '/resource-enum/',
        method: methods.GET,
        onMount: true,
    },
    addResourcePostRequest: {
        url: '/resource/',
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

interface ExtraFieldProps {
    title: string;
    resourceEnums: ResourceEnum[];
}

const ExtraFields = ({ title, resourceEnums }: ExtraFieldProps) => {
    switch (title) {
        case 'education':
            return (
                <EducationFields
                    resourceEnums={resourceEnums}
                />
            );

        case 'health':
            return (
                <HealthFields
                    resourceEnums={resourceEnums}
                />
            );

        case 'finance':
            return (
                <FinanceFields
                    resourceEnums={resourceEnums}
                />
            );

        case 'governance':
            return (
                <GovernanceFields
                    resourceEnums={resourceEnums}
                />
            );

        case 'cultural':
            return (
                <CulturalFields
                    resourceEnums={resourceEnums}
                />
            );
        case 'tourism':
            return (
                <TourismFields />
            );
        case 'communication':
            return (
                <CommunicationFields
                    resourceEnums={resourceEnums}
                />
            );
        case 'industry':
            return (
                <IndustryFields />
            );
        default:
            return null;
    }
};

class AddResourceForm extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            faramValues: {},
            faramErrors: {},
            pristine: true,
        };
    }

    private getSchema = memoize((resourceType?: ResourceTypeKeys) => {
        if (resourceType) {
            return schemaMap[resourceType];
        }
        return defaultSchema;
    });

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

    private handleFaramValidationSuccess = (_: FaramValues, faramValues: FaramValues) => {
        const { requests: { addResourcePostRequest }, onUpdate, closeModal } = this.props;
        addResourcePostRequest.do({
            body: faramValues,
            onSuccess: () => {
                if (onUpdate) {
                    onUpdate();
                    if (closeModal) {
                        closeModal();
                    }
                } else if (closeModal) {
                    closeModal();
                }
            },
            onFailure: (faramErrors: object) => {
                this.setState({ faramErrors });
            },
        });
    }

    private filterResourceEnum = (
        resourceEnums: ModelEnum[],
        resourceType: string,
    ) => {
        const options = resourceEnums.find(({ model }) => model.toLowerCase() === resourceType);
        if (options) {
            return options.enums;
        }
        return [];
    }

    public render() {
        const {
            className,
            closeModal,
            resourceTypeList,
            requests: {
                resourceEnumGetRequest: {
                    response = [],
                    pending,
                },
            },
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        const { resourceType } = faramValues;
        const schema = this.getSchema(resourceType as ResourceTypeKeys);

        let resourceEnums: ResourceEnum[] = [];
        if (resourceType && !pending) {
            resourceEnums = this.filterResourceEnum(response as ModelEnum[], resourceType);
        }

        return (
            <Modal
                className={_cs(styles.addResourceModal, className)}
                onClose={closeModal}
                closeOnEscape
            >
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalHeader title="Add Resource" />
                    <ModalBody>
                        <SelectInput
                            className={styles.hazardInput}
                            faramElementName="resourceType"
                            options={resourceTypeList}
                            keySelector={labelSelector}
                            labelSelector={labelSelector}
                            label="Resource Type"
                        />
                        <TextInput
                            faramElementName="title"
                            label="Title"
                        />
                        <TextArea
                            faramElementName="description"
                            label="Description"
                        />
                        {
                            !pending && resourceType && (
                                <ExtraFields
                                    title={resourceType}
                                    resourceEnums={resourceEnums}
                                />
                            )
                        }
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
)(AddResourceForm);
