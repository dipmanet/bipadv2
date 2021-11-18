/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Item } from 'semantic-ui-react';
import Loader from 'react-loader';
import Icon from '#rscg/Icon';
import Page from '#components/Page';
import styles from './styles.scss';
import Button from '#rsca/Button';
import Rajapur from './Rajapur';
import Gulariya from './Gulariya';
import Tikapur from './Tikapur';
import Dhangadi from './Dhangadi';
import Butwal from './Butwal';
import Barabise from './BarabiseLandslide';
import Bhotekoshi from './BhotekoshiLandslide';
import VizRiskContext, { VizRiskContextProps } from '#components/VizRiskContext';
import Panchpokhari from './Panchpokhari';
import Jugal from './Jugal';
import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { incidentListSelectorIP } from '#selectors';
import { setIncidentListActionIP } from '#actionCreators';
import Loading from '#components/Loading';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    incidentList: incidentListSelectorIP(state),
});
const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setIncidentList: params => dispatch(setIncidentListActionIP(params)),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    vizRiskThemeIdRequest: {
        url: '/vizrisk-theme/',
        method: methods.GET,
        query: ({ params }) => ({
            limit: -1,
        }),
        onSuccess: ({ params, response }) => {
            const { results: vizRiskId = [] } = response as Response;
            params.setvizRiskId(vizRiskId);
            // params.setPending(false);
        },
        onMount: true,
    },
};

const VizRiskMainPage = (props) => {
    const [showMenu, setShowMenu] = useState(true);
    const [mun, setMun] = useState('');
    const [vizRiskId, setvizRiskId] = useState([]);
    const [munThemeId, setmunThemeId] = useState(null);
    const [municipalityId, setmunicipalityId] = useState(null);
    const [pendingMainPage, setpendingMainPage] = useState(true);


    const handleMenuIconClick = () => {
        setShowMenu(true);
    };

    const handleMenuTitleClick = (municipality, themeid, munId) => {
        setShowMenu(false);
        setMun(municipality);
        setmunThemeId(themeid);
        setmunicipalityId(munId);
    };


    const floodMunicipality = vizRiskId.filter(item => item.category === 'Visualizing Flood Exposure');
    const LandslideMunicipality = vizRiskId.filter(item => item.category === 'Visualizing Landslide Exposure');
    const MultiHazradMunicipality = vizRiskId.filter(item => item.category === 'Visualizing Multi Hazard Exposure');
    const vrcontextProps: VizRiskContextProps = {
        showFirstSlide: false,
        infraChosen: 'all',
        floodInfraChosen: 'all',
        evacChosen: 'all',
    };

    const getBtnStyle = () => {
        if (mun === 'pachpokhari'
        || mun === 'jugal'
        || mun === 'barabise'
        || mun === 'bhotekoshi'

        ) {
            if (showMenu) {
                return styles.hamburgerBtnContMenu;
            }
            return styles.hamburgerBtnContainer;
        }

        if (showMenu) {
            return styles.hamburgerBtnContainerOther;
        }
        return styles.hamburgerBtnContMenu;
    };

    const { requests:
		{
		    vizRiskThemeIdRequest,

		} } = props;

    useEffect(() => {
        if (pendingMainPage) {
            if (vizRiskId.length > 0) {
                setpendingMainPage(false);
            }
        }
    }, [pendingMainPage, vizRiskId.length]);

    vizRiskThemeIdRequest.setDefaultParams({ setvizRiskId });


    return (
        <>
            {pendingMainPage ? <Loader color="#fff" className={styles.loader} />

                : (
                    <VizRiskContext.Provider value={vrcontextProps}>
                        <div className={styles.mainVzContainer}>
                            <Page
                                hideMap
                                hideFilter
                            />
                            <div className={styles.navBtnsContainer}>
                                <div className={getBtnStyle()}>
                                    <Button
                                        transparent
                                        onClick={handleMenuIconClick}
                                        className={styles.hamburgerBtn}
                                    >
                                        <Icon
                                            name="menu"
                                            className={styles.hamburgerBtnIcon}
                                        />
                                        {!showMenu
				&& (
				    <>
    <span className={styles.strong} />
				    </>
				)
                                        }
                                    </Button>
                                </div>
                            </div>
                            {pendingMainPage ? <Loading />

                                : (
                                    <div className={styles.vizrisknmenupagecontainer}>
                                        {showMenu ? (
                                            <>
                                                <div className={styles.vizrisknmenupage}>
                                                    <p className={styles.menuTitle}>Visualizing Flood Exposure </p>
                                                    {floodMunicipality.map(munName => (

                                                        <div key={munName.id} className={styles.vizriskmunicipalityName}>
                                                            <Button
                                                                transparent
                                                                onClick={() => handleMenuTitleClick(munName.title, munName.themeId, munName.municipality)}
                                                            >
                                                                <h1
                                                                    className={styles.menuItems}
                                                                >
                                                                    {munName.title}
                                                                </h1>

                                                            </Button>
                                                        </div>

                                                    ))}
                                                </div>
                                            </>
                                        ) : ((munThemeId === 103 && <Rajapur />)
		 || (munThemeId === 104 && <Tikapur />)
		  || (munThemeId === 106 && <Dhangadi />)
		  || (munThemeId === 105 && <Gulariya />)
		  )
                                        }
                                        {showMenu ? (
                                            <>
                                                <div className={styles.vizrisknmenupage}>
                                                    {/* {showMenu ? ( */}

                                                    <p className={styles.menuTitle}>Visualizing Landslide Exposure </p>
                                                    {LandslideMunicipality.map(munName => (

                                                        <div key={munName.id} className={styles.vizriskmunicipalityName}>
                                                            <Button
                                                                transparent
                                                                onClick={() => handleMenuTitleClick(munName.title, munName.themeId, munName.municipality)}
                                                            >
                                                                <h1
                                                                    className={styles.menuItems}
                                                                >
                                                                    {munName.title}
                                                                </h1>
                                                            </Button>
                                                        </div>
                                                    ))}

                                                </div>
                                            </>
                                        ) : ((munThemeId === 107 && <Barabise />)
		 || (munThemeId === 108 && <Bhotekoshi />)
		  )
                                        }
                                        {showMenu ? (
                                            <>
                                                <div className={styles.vizrisknmenupage}>


                                                    <p className={styles.menuTitle}>Visualizing Multi Hazard Exposure </p>
                                                    {MultiHazradMunicipality.map(munName => (

                                                        <div key={munName.id} className={styles.vizriskmunicipalityName}>
                                                            <Button
                                                                transparent
                                                                onClick={() => handleMenuTitleClick(munName.title, munName.themeId, munName.municipality)}
                                                            >
                                                                <h1
                                                                    className={styles.menuItems}
                                                                >
                                                                    {munName.title}
                                                                </h1>

                                                            </Button>

                                                        </div>

                                                    ))}

                                                </div>
                                            </>
                                        ) : ((munThemeId === 101 && <Butwal municipalityId={municipalityId} />)
		 || (munThemeId === 109 && <Jugal />)
		 || (munThemeId === 110 && <Panchpokhari />))
                                        }

                                    </div>
                                )
                            }
                        </div>
                    </VizRiskContext.Provider>
                )
            }


        </>
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(VizRiskMainPage);
