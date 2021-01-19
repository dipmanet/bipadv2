import React from 'react';
import { connect } from 'react-redux';
import TextInput from '#rsci/TextInput';
import NonFieldErrors from '#rsci/NonFieldErrors';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import { createConnectedRequestCoordinator } from '#request';
import { AppState } from '#store/types';
import { authStateSelector } from '#selectors';
import { AuthState } from '#store/atom/auth/types';
import styles from './styles.scss';

interface PropsFromState {
    authState: AuthState;
}

type ReduxProps = PropsFromState ;

interface Props {
    postBasicInfo: () => void;
    openspacePostError: boolean;
    resourceId: number | undefined;
}


function BasicInfo({ postBasicInfo, openspacePostError }: Props) {
    return (
        <React.Fragment>
            <br />

            <TextInput faramElementName="elevation" label="Elevation" />
            <div className={styles.inputGroup}>
                <TextInput faramElementName="totalArea" label="Total Area" />
                <TextInput faramElementName="usableArea" label="Usable Area" />
            </div>
            <TextInput faramElementName="adress" label="Address" />
            <TextInput faramElementName="currentLandUse" label="Current Land Use" />
            <TextInput faramElementName="remarks" label="remarks" />
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
