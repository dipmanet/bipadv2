import React from 'react';
import Redux, {
    compose,
} from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
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
import styles from './styles.scss';

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
    resourceTypeList: PageType.ResourceType[];
}
interface PropsFromDispatch {
}
interface FaramValues {
    title?: string;
    description?: string;
    point?: string;
    ward?: number;
    type?: number;
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

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
});

const labelSelector = (d: PageType.Field) => d.title;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
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
}

const ExtraFields = ({ title }: ExtraFieldProps) => {
    switch (title) {
        case 'education':
            return (<EducationFields />);

        case 'health':
            return (<HealthFields />);

        case 'finance':
            return (<FinanceFields />);

        case 'governance':
            return (<GovernanceFields />);

        case 'cultural':
            return (<CulturalFields />);
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

    private static schema = {
        fields: {
            title: [requiredCondition],
            description: [],
            point: [],
            ward: [],
            resourceType: [],
            type: [requiredCondition],
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
        const { requests: { addResourcePostRequest }, onUpdate, closeModal } = this.props;
        addResourcePostRequest.do({
            body: faramValues,
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

    public render() {
        const {
            className,
            closeModal,
            resourceTypeList,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            pristine,
        } = this.state;

        const { resourceType } = faramValues;

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
                    schema={AddResourceForm.schema}
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
                            label="Hazard"
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
                            resourceType && (
                                <ExtraFields
                                    title={resourceType}
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
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requests),
)(AddResourceForm);
