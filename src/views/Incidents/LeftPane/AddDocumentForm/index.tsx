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
import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import SelectInput from '#rsci/SelectInput';
import FileInput from '#rsci/FileInput';
import DangerButton from '#rsca/Button/DangerButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';

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
    category?: string;
    region?: string;
    province?: string;
    district?: string;
    municipality?: string;
    event?: string;
    publishedDate?: string;
    severity?: string;
}

interface FaramErrors {
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
        url: '/document/category/',
        method: methods.GET,
        onSuccess: ({ response, props: { setDocumentCategoryList } }) => {
            interface Response { results: PageType.DocumentCategory[] }
            const { results: documentCategoryList = [] } = response as Response;
            setDocumentCategoryList({ documentCategoryList });
        },
        onMount: true,
    },
    addDocumentPostRequest: {
        url: '/document/',
        method: methods.POST,
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

class AddDocumentForm extends React.PureComponent<Props, State> {
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
            file: [requiredCondition],
            category: [],
            region: [],
            province: [],
            district: [],
            municipality: [],
            event: [],
            publishedDate: [],
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
        const { requests: { addDocumentPostRequest }, onUpdate, closeModal } = this.props;
        const {
            publishedDate: date,
            ...others
        } = faramValues;

        let publishedDate;
        if (date) {
            publishedDate = new Date(date).toISOString();
        }

        addDocumentPostRequest.do({
            body: { publishedDate, ...others },
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
            eventList,
            regionList,
            categoryList,
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
                closeOnEscape
            >
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={AddDocumentForm.schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalHeader title="Add Document" />
                    <ModalBody>
                        <TextInput
                            faramElementName="title"
                            label="Title"
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
                        <SelectInput
                            faramElementName="event"
                            options={eventList}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            label="Event"
                        />
                        <FileInput
                            faramElementName="file"
                        />
                        <DateInput
                            faramElementName="publishedDate"
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
    connect(mapStateToProps, mapDispatchToProps),
    createRequestClient(requests),
)(AddDocumentForm);
