import React from 'react';
import TextInput from '#rsci/TextInput';
import NumberInput from '#rsci/NumberInput';
import styles from '../styles.scss';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import NonFieldErrors from '#rsci/NonFieldErrors';


interface Props {
    postBasicInfo: () => void;
    handleTabClick: (tab: string) => void;
    openspacePostError: boolean;
}
// eslint-disable-next-line max-len
export const BasicInfo: React.FC<Props> = ({ handleTabClick, postBasicInfo, openspacePostError }: Props) => (
    <React.Fragment>
        <br />
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
            <NumberInput faramElementName="ward" label="Ward" />
        </div>
        <div className={styles.inputGroup}>
            {/* <NumberInput faramElementName="capacity" label="Capacity" /> */}
            <TextInput faramElementName="totalArea" label="Total Area" />
            <TextInput
                faramElementName="usableArea"
                label="Usable Area"
            />
        </div>
        {
            openspacePostError && (
                <NonFieldErrors
                    faramElement
                    errors={['Some error occured!']}
                />
            )
        }
        <div className={styles.stepButtons}>
            <PrimaryButton
                type="submit"
                // disabled={pristine}
                // pending={addResourcePending || editResourcePending}
                onClick={() => handleTabClick('closeModal')}
            >
                Close
            </PrimaryButton>
            <PrimaryButton
                onClick={() => postBasicInfo()}
            >
                Save and Continue
            </PrimaryButton>
        </div>
    </React.Fragment>
);

export default BasicInfo;
