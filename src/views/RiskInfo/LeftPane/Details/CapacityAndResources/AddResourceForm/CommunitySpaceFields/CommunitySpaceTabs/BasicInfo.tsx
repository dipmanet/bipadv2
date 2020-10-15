import React, { FunctionComponent } from 'react';
import TextInput from '#rsci/TextInput';
import NumberInput from '#rsci/NumberInput';
import NonFieldErrors from '#rsci/NonFieldErrors';
import PrimaryButton from '#rsca/Button/PrimaryButton';

interface Props {
    postBasicInfo: () => void;
    openspacePostError: boolean;
}


const BasicInfo: FunctionComponent<Props> = ({ postBasicInfo, openspacePostError }: Props) => (
    <React.Fragment>
        <br />

        <TextInput faramElementName="elevation" label="Elevation" />
        <NumberInput faramElementName="ward" label="Ward" />
        <TextInput faramElementName="totalArea" label="Total Area" />
        {
            openspacePostError && (
                <NonFieldErrors
                    faramElement
                    errors={['Some error occured!']}
                />
            )
        }
        <PrimaryButton
            onClick={() => postBasicInfo()}
        >
            Save and Continue
        </PrimaryButton>
    </React.Fragment>
);

export default BasicInfo;
