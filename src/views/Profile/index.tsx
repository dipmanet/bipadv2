/* eslint-disable max-len */
import React from 'react';
import { isDefined, _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';

import { navigate } from '@reach/router';

import { Translation } from 'react-i18next';
import AccentButton from '#rsca/Button/AccentButton';
import Icon from '#rscg/Icon';
import modalize from '#rscg/Modalize';
import Page from '#components/Page';


import styles from './styles.scss';
import {
    palikaRedirectSelector,
} from '#selectors';

import {
    setPalikaRedirectAction,
} from '#actionCreators';
import NepDataProfile from './NepDatProfile';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import nepDat from '#resources/icons/nepdat.svg';

const mapStateToProps = (state: AppState): PropsFromState => ({
    palikaRedirect: palikaRedirectSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setPalikaRedirect: params => dispatch(setPalikaRedirectAction(params)),
});


type TabKeys = 'summary' | 'projectsProfile' | 'contact' | 'document' | 'nepDatProfile';

interface Props {
}

interface State {
    activeView: TabKeys;
}


class Profile extends React.PureComponent<Props, State> {
    public render() {
        return (
            <>

                <Page


                    hideFilter
                    hideMap


                />

                <div className={styles.profileMainContainer}>
                    <div className={styles.profileMainDiv}>
                        <div className={styles.profileHeading}>
                            <h1>Profile</h1>
                        </div>
                        <div className={styles.profileList}>
                            <div
                                className={styles.profileListContent}
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate('/profile/demography')}
                                onKeyDown={undefined}


                            >
                                <h1>
                                    Demographics

                                </h1>
                                <div style={{ fontSize: '50px' }}>
                                    <Icon
                                        className={styles.visualizationIcon}
                                        name="bars"
                                    />
                                </div>

                            </div>
                            <div
                                className={styles.profileListContent}
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate('/profile/projects')}
                                onKeyDown={undefined}


                            >


                                <h1>
                                    Projects

                                </h1>
                                <div style={{ fontSize: '50px' }}>
                                    <Icon
                                        className={styles.visualizationIcon}
                                        name="briefcase"
                                    />
                                </div>
                            </div>
                            <div
                                className={styles.profileListContent}
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate('/profile/contacts')}
                                onKeyDown={undefined}


                            >

                                <h1>
                                    Contacts

                                </h1>
                                <div style={{ fontSize: '50px' }}>
                                    <Icon
                                        className={styles.visualizationIcon}
                                        name="contacts"
                                    />
                                </div>
                            </div>
                            <div
                                className={styles.profileListContent}
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate('/profile/documents')}
                                onKeyDown={undefined}


                            >
                                <h1>
                                    Documents

                                </h1>
                                <div style={{ fontSize: '50px' }}>
                                    <Icon
                                        className={styles.visualizationIcon}
                                        name="document"
                                    />
                                </div>
                            </div>
                            <div
                                className={styles.profileListContent}
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate('/profile/nepDat-profile')}
                                onKeyDown={undefined}


                            >
                                <h1>
                                    NEP-DAT Profile

                                </h1>
                                <div style={{ fontSize: '50px' }}>
                                    <ScalableVectorGraphics
                                        className={styles.nepDatIcon}
                                        src={nepDat}
                                    // style={{ color: hazardDetail.color || '#4666b0' }}
                                    />

                                </div>
                            </div>


                        </div>
                    </div>

                </div>

            </>
        );
    }
}
export default (Profile);
