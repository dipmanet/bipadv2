import React from 'react';
import Redux, {
    compose,
} from 'redux';
import { connect } from 'react-redux';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    setCountryListAction,
} from '#actionCreators';

import {
    countryListSelector,
    peopleLossStatusListSelector,
    genderListSelector,
} from '#selectors';

import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import Cloak from '#components/Cloak';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Modal from '#rscv/Modal';
import ModalBody from '#rscv/Modal/Body';
import ModalHeader from '#rscv/Modal/Header';
import ModalFooter from '#rscv/Modal/Footer';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';
import Checkbox from '#rsci/Checkbox';
import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import DangerButton from '#rsca/Button/DangerButton';

import styles from './styles.scss';

interface FaramValues {
}

interface FaramErrors {
}

interface PeopleLoss {
    id: number;
    loss: number;
    name: string;
    createdOn: string;
    modifiedOn: string;
    belowPoverty?: boolean;
    disability?: boolean;
    gender: 'male' | 'female' | 'other';
    count?: number;
    status?: 'missing' | 'dead' | 'injured' | 'affected';
    age?: number;
}

interface OwnProps {
    className?: string;
    lossServerId: number;
    onAddSuccess: (peopleLoss: PeopleLoss) => void;
    closeModal: () => void;
}

interface PropsFromState {
    countryList: PageType.Country[];
    peopleLossStatusList: PageType.Status[];
    genderList: PageType.Gender[];
}

interface PropsFromDispatch {
    setCountryList: typeof setCountryListAction;
}
interface Params {
    body: object;
    onFailure: (faramErrors: object) => void;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

interface State {
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    pristine: boolean;
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    countryList: countryListSelector(state),
    peopleLossStatusList: peopleLossStatusListSelector(state),
    genderList: genderListSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setCountryList: params => dispatch(setCountryListAction(params)),
});

const keySelector = (d: PageType.Field) => d.id;
const labelSelector = (d: PageType.Field) => d.title;

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    countryGetRequest: {
        url: '/country/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ response, props: { setCountryList } }) => {
            interface Response { results: PageType.Country[] }
            const { results: countryList = [] } = response as Response;
            setCountryList({ countryList });
        },
    },
    addPeopleLossRequest: {
        url: '/loss-people/',
        method: methods.POST,
        body: ({ params: { body } = { body: { } } }) => body,
        onSuccess: ({ props, response }) => {
            const {
                onAddSuccess,
                closeModal,
            } = props;

            if (onAddSuccess) {
                onAddSuccess(response);
            }
            closeModal();
        },
        onFailure: ({ error, params: { onFailure } = { onFailure: undefined } }) => {
            if (onFailure) {
                onFailure((error as { faramErrors: object }).faramErrors);
            }
        },
    },
};

class AddPeopleLoss extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            faramValues: {
                verified: false,
            },
            faramErrors: {},
            pristine: true,
        };
    }

    private static schema = {
        fields: {
            status: [requiredCondition],
            count: [requiredCondition],
            name: [],
            age: [],
            gender: [],
            belowPoverty: [],
            verified: [requiredCondition],
            verificationMessage: [],
            nationality: [],
        },
    }

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
        const {
            requests: { addPeopleLossRequest },
            lossServerId,
        } = this.props;

        addPeopleLossRequest.do({
            body: {
                ...faramValues,
                loss: lossServerId,
            },
            onFailure: (faramErrors: object) => {
                this.setState({ faramErrors });
            },
        });
    }

    public render() {
        const {
            genderList,
            countryList,
            peopleLossStatusList,
            className,
            closeModal,
            requests: {
                addPeopleLossRequest: {
                    pending,
                },
            },
        } = this.props;

        const {
            pristine,
            faramValues,
            faramErrors,
        } = this.state;

        return (
            <Modal className={className}>
                <ModalHeader
                    title="Add People Loss"
                    rightComponent={(
                        <Button
                            iconName="close"
                            onClick={closeModal}
                            title="Close Modal"
                            transparent
                        />
                    )}
                />
                <Faram
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={AddPeopleLoss.schema}
                    value={faramValues}
                    error={faramErrors}
                >
                    <ModalBody className={styles.modalBody}>
                        {pending && <LoadingAnimation />}
                        <SelectInput
                            faramElementName="status"
                            label="Status"
                            options={peopleLossStatusList}
                            keySelector={labelSelector}
                            labelSelector={labelSelector}
                        />
                        <TextInput
                            faramElementName="name"
                            label="Name"
                        />
                        <NumberInput
                            faramElementName="age"
                            label="Age"
                        />
                        <SelectInput
                            faramElementName="gender"
                            label="Gender"
                            options={genderList}
                            keySelector={labelSelector}
                            labelSelector={labelSelector}
                        />
                        <Checkbox
                            faramElementName="belowPoverty"
                            label="Below Poverty"
                        />
                        <NumberInput
                            faramElementName="count"
                            label="Count"
                        />
                        <Cloak hiddenIf={p => !p.verify_people}>
                            <>
                                <Checkbox
                                    faramElementName="verified"
                                    label="Verified"
                                />
                                <TextInput
                                    faramElementName="verificationMessage"
                                    label="Verification Message"
                                />
                            </>
                        </Cloak>
                        <SelectInput
                            faramElementName="nationality"
                            label="Nationality"
                            options={countryList}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <DangerButton
                            onClick={closeModal}
                        >
                            Cancel
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
)(AddPeopleLoss);
