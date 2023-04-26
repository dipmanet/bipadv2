import React from 'react';
import { connect } from 'react-redux';
import TextInput from '#rsci/TextInput';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import NonFieldErrors from '#rsci/NonFieldErrors';
import { createConnectedRequestCoordinator } from '#request';
import { AppState } from '#store/types';
import { authStateSelector } from '#selectors';
import { AuthState } from '#store/atom/auth/types';
import NumberInput from '#rsci/NumberInput';
import LocationInput from '#components/LocationInput';
import RegionSelectInput from './RegionSelectInput';
import styles from '../styles.scss';

interface PropsFromState {
    authState: AuthState;
}

type ReduxProps = PropsFromState;


interface Props {
    postBasicInfo: () => void;
    setAdministrativeParameters: (name: string, value: string) => void;
    handleTabClick: (tab: string) => void;
    openspacePostError: boolean;
    resourceId: number | undefined;
    authState: any;
}
// eslint-disable-next-line max-len
const BasicInfo: React.FC<Props> = ({ handleTabClick, postBasicInfo, openspacePostError, resourceId, setAdministrativeParameters }: Props) => (

    <React.Fragment>
        <br />
        {/* <RegionSelectInput setAdministrativeParameters={setAdministrativeParameters} /> */}
        <TextInput
            faramElementName="oid"
            label="OID"
        />
        <TextInput
            faramElementName="hlcitMunicipalty"
            label="HLCIT-MUN"
        />

        <TextInput
            faramElementName="issue"
            label="Issue"
        />
        <div className={styles.inputGroup}>
            <TextInput
                faramElementName="currentLandUse"
                label="Current Land Use"
            />
            <TextInput
                faramElementName="catchmentArea"
                label="Catchment Area"
            />
        </div>
        <div className={styles.inputGroup}>
            <TextInput faramElementName="ownership" label="Ownership" />
            <TextInput faramElementName="elevation" label="Elevation" />
        </div>
        <TextInput faramElementName="accessToSite" label="Access to Site" />
        <TextInput
            faramElementName="specialFeature"
            label="Special Feature"
        />
        <div className={styles.inputGroup}>
            <TextInput faramElementName="address" label="Address" />
            {/* <NumberInput faramElementName="ward" label="Ward" /> */}
        </div>
        <div className={styles.inputGroup}>
            {/* <NumberInput faramElementName="capacity" label="Capacity" /> */}
            <TextInput faramElementName="totalArea" label="Total Area" />
            <TextInput
                faramElementName="usableArea"
                label="Usable Area"
            />
        </div>
        <TextInput
            faramElementName="usableAreaSecond"
            label="Usable-2013"
        />
        <div className={styles.inputGroup}>
            <NumberInput
                faramElementName="areaChange"
                label="Area Changed"
            />
            <TextInput
                faramElementName="perimeter"
                label="Perimeter"
            />
        </div>
        <TextInput
            faramElementName="changeRemarks"
            label="Change Remarks"
        />

        {/* {
            openspacePostError && (
                <NonFieldErrors
                    faramElement
                    errors={['Some error occured!']}
                />
            )
        } */}
        <LocationInput
            // className={styles.locationInput}
            faramElementName="location"
            classCategory={styles.locationInputOpenSpace}
            category={'capacityResource'}
        />
        {resourceId === undefined

            && <span>Please make sure to complete all the steps while filling the form.</span>}
        <div className={styles.stepButtons}>
            {/* <PrimaryButton
                type="submit"
                // disabled={pristine}
                // pending={addResourcePending || editResourcePending}
                onClick={() => handleTabClick('closeModal')}
            >
            Close
            </PrimaryButton> */}

            <PrimaryButton
                onClick={() => postBasicInfo()}
            >
                Save and Continue
            </PrimaryButton>


        </div>
    </React.Fragment>


);

const mapStateToProps = (state: AppState) => ({
    authState: authStateSelector(state),
});

export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(BasicInfo),
);
