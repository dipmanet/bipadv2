import React from 'react';
import TextInput from '#rsci/TextInput';
import NumberInput from '#rsci/NumberInput';
import NonFieldErrors from '#rsci/NonFieldErrors';
import PrimaryButton from '#rsca/Button/PrimaryButton';

interface Props {
    postBasicInfo: () => void;
    openspacePostError: boolean;
    resourceId: number | undefined;
}


function BasicInfo({ postBasicInfo, openspacePostError, resourceId }: Props) {
    return (
        <React.Fragment>
            <br />

            <TextInput faramElementName="elevation" label="Elevation" />
            {/* <NumberInput faramElementName="ward" label="Ward" /> */}
            <TextInput faramElementName="totalArea" label="Total Area" />
            {openspacePostError && (
                <NonFieldErrors
                    faramElement
                    errors={['Some error occured!']}
                />
            )}
            {resourceId === undefined

                && <span>Please make sure to complete all the steps while filling the form.</span>}
            <PrimaryButton
                onClick={() => postBasicInfo()}
            >
                Save and Continue
            </PrimaryButton>
        </React.Fragment>
    );
}

export default BasicInfo;
