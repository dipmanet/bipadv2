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


import {
    palikaRedirectSelector,
} from '#selectors';

import {
    setPalikaRedirectAction,
} from '#actionCreators';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import nepDat from '#resources/icons/nepdat.svg';
import NepDataProfile from './NepDatProfile';
import styles from './styles.scss';

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

const IndicatorButton = modalize(AccentButton);

class Profile extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeView: 'summary',
        };
    }

    public componentDidMount() {
        const {
            palikaRedirect,
            setPalikaRedirect,

        } = this.props;

        if (palikaRedirect.showForm
            && palikaRedirect.showModal
            && palikaRedirect.showModal === 'contact') {
            this.setState({ activeView: 'contact' });
        }
    }

    private handleSummaryButtonClick = () => {
        this.setState({ activeView: 'summary' });
    }

    private handleProjectButtonClick = () => {
        this.setState({ activeView: 'projectsProfile' });
    }

    private handleContactButtonClick = () => {
        this.setState({ activeView: 'contact' });
    }

    private handleDocumentButtonClick = () => {
        this.setState({ activeView: 'document' });
    }


    public render() {
        return (

            <Translation>
                {
                    t => (
                        <>

                            <Page

                                hideFilter
                                hideMap
                            />

                            <div className={styles.profileMainContainer}>
                                <div className={styles.profileMainDiv}>
                                    <div className={styles.profileHeading}>
                                        <h1>{t('Profile')}</h1>
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
                                                {t('Demographics')}

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
                                                {t('Projects')}

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
                                                {t('Contacts')}

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
                                                {t('Documents')}

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
                                                {t('NEP-DAT Profile')}

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
                    )
                }
            </Translation>


        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
