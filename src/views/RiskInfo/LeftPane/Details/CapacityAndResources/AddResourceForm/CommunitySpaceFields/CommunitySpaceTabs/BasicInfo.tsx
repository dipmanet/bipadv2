import React from 'react';
import { connect } from 'react-redux';
import TextInput from '#rsci/TextInput';
import NumberInput from '#rsci/NumberInput';
import NonFieldErrors from '#rsci/NonFieldErrors';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import { createConnectedRequestCoordinator } from '#request';
import { AppState } from '#store/types';
import { authStateSelector } from '#selectors';
import { AuthState } from '#store/atom/auth/types';

interface PropsFromState {
    authState: AuthState;
}

type ReduxProps = PropsFromState ;

interface Props {
    postBasicInfo: () => void;
    openspacePostError: boolean;
    resourceId: number | undefined;
}


function BasicInfo({ postBasicInfo, openspacePostError, resourceId, authState }: Props) {
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
            {/*
            {authState.authenticated
                 && ( */}
            <PrimaryButton
                onClick={() => postBasicInfo()}
            >
                 Save and Continue
            </PrimaryButton>
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
