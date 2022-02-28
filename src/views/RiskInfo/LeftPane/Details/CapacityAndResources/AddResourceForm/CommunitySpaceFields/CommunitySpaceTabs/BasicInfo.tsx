import React from 'react';
import { connect } from 'react-redux';
import SelectInput from '#rsci/SelectInput';
import TextInput from '#rsci/TextInput';
import NonFieldErrors from '#rsci/NonFieldErrors';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import { createConnectedRequestCoordinator } from '#request';
import { AppState } from '#store/types';
import { authStateSelector } from '#selectors';
import { AuthState } from '#store/atom/auth/types';
import styles from './styles.scss';
import RegionSelectInput from '../../OpenspaceFields/AddOpenspaceTabs/RegionSelectInput';
import NumberInput from '#rsci/NumberInput';

interface PropsFromState {
    authState: AuthState;
}

type ReduxProps = PropsFromState;

interface Props {
    postBasicInfo: () => void;
    setAdministrativeParameters: (name: string, value: string) => void;
    openspacePostError: boolean;
    resourceId: number | undefined;
}
const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

function BasicInfo({ postBasicInfo, openspacePostError,
    setAdministrativeParameters, faramValues, optionsClassName }: Props) {
    const booleanCondition = [{ key: true, label: 'yes' }, { key: false, label: 'No' }];
    return (
        <React.Fragment>
            <br />
            {/* <RegionSelectInput setAdministrativeParameters={setAdministrativeParameters} /> */}
            <TextInput faramElementName="elevation" label="Elevation" />
            <div className={styles.inputGroup}>
                <NumberInput
                    faramElementName="totalArea"
                    label="Total Area"
                />
                <NumberInput
                    faramElementName="usableArea"
                    label="Usable Area"
                />

            </div>
            <TextInput faramElementName="address" label="Address" />
            <div className={styles.inputGroup}>
                <TextInput faramElementName="currentLandUse" label="Current Land Use" />
                <NumberInput
                    faramElementName="capacity"
                    label="Capacity of Community Space"
                />
            </div>
            <SelectInput
                faramElementName="usedAsHelipad"
                label="Used for emergency landing as helipad?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}

                optionsClassName={optionsClassName}

            />
            <SelectInput
                faramElementName="isDrinkingWaterAvailable"
                label="Is drinking water facility available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
            />
            <SelectInput
                faramElementName="isToiletAvailable"
                label="Is toilet available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
            />
            {faramValues.isToiletAvailable
                && (
                    <NumberInput
                        faramElementName="noOfToilets"
                        label="How Many Toilet Are Available?"
                    />

                )}
            <TextInput
                faramElementName="otherFacilities"
                label="What other facilities are available? Please specify."
            />
            <TextInput faramElementName="remarks" label="remarks" />
            {/* {openspacePostError && (
                <NonFieldErrors
                    faramElement
                    errors={['Some error occured!']}
                />
            )} */}
            {/*
            {authState.authenticated
                 && ( */}
            <div className={styles.submitButn}>
                <PrimaryButton
                    onClick={() => postBasicInfo()}
                >
                    Save and Continue
                </PrimaryButton>
            </div>
            {/* )} */}

        </React.Fragment>
    );
}


const mapStateToProps = (state: AppState) => ({
    authState: authStateSelector(state),
});

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(BasicInfo),
);
