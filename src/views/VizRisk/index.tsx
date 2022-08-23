/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import {
    ClientAttributes,
    createConnectedRequestCoordinator,
    createRequestClient, methods,
} from '#request';
import Page from '#components/Page';
import Icon from '#rscg/Icon';
import Button from '#rsca/Button';
import Rajapur from './Rajapur';
import Gulariya from './Gulariya';
import Tikapur from './Tikapur';
import Dhangadi from './Dhangadi';
import Butwal from './Butwal';
import Barabise from './BarabiseLandslide';
import Bhotekoshi from './BhotekoshiLandslide';
import Panchpokhari from './Panchpokhari';
import Jugal from './Jugal';
import ProvinceTwo from './Province2';
import Karnali from './Karnali';
import Ratnanagar from './RatnaNagar';
import styles from './styles.scss';
import Map from './LandingPage/Map';
import LayerToggle from './LandingPage/Components/LayerToggle';
import ThemeSelector from './LandingPage/Components/ThemeSelector';
import LabelSearch from './LandingPage/Components/LabelSearch';
import VisRiskTourSlider from './LandingPage/Components/TourSlider';
import tourContents from './expressions';


const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    vizRiskThemeIdRequest: {
        url: '/vizrisk-theme/',
        method: methods.GET,
        onSuccess: ({ params, response }) => {
            const { results: vizRiskId = [] } = response as Response;
        },
        onMount: true,
    },
};

interface Props { }
const themes = ['All Exposure', 'Flood Exposure', 'Landslide Exposure', 'Multi-hazard Exposure'];

const VizRiskMainPage = (props: Props) => {
    const tourContainerRef = useRef<HTMLElement>();
    const [vizRiskId, setvizRiskId] = useState([]);
    const [selctFieldCurrentValue, setselctFieldCurrentValue] = useState('');
    const [pendingMainPage, setpendingMainPage] = useState<boolean>(true);
    const [vzLabel, setVzLabel] = useState('municipality');
    const [clickedVizrisk, setClickedVizrisk] = useState('');
    const [showMenu, setShowMenu] = useState(true);
    const [searchBbox, setSearchBbox] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [tourStatus, setTourStatus] = useState(true);
    const [tourSectionComplete, setTourSectionComplete] = useState(false);
    const handleMenuIconClick = () => {
        setShowMenu(true);
        setClickedVizrisk('');
    };

    const renderVizRisk = () => {
        switch (clickedVizrisk) {
            case 'Butwal':
                return (
                    <Butwal
                        municipalityId={49001}
                        munThemeId={101}
                    />
                );
            case 'Ratnanagar':
                return <Ratnanagar />;
            case 'Jugal':
                return <Jugal />;
            case 'Dhangadhi':
                return <Dhangadi />;
            case 'Rajapur':
                return <Rajapur />;
            case 'Tikapur':
                return <Tikapur />;
            case 'Gulariya':
                return <Gulariya />;
            case 'Panchpokhari':
                return <Panchpokhari />;
            case 'Janakpur':
                return (
                    <Butwal
                        municipalityId={17010}
                        munThemeId={101}
                    />
                );
            case 'Bhotekoshi':
                return <Bhotekoshi />;
            case 'Barhabise':
                return <Barabise />;
            case 'Karnali':
                return <Karnali />;
            case 'Madhesh':
                return <ProvinceTwo />;
            default:
                break;
        }
        return '';
    };

    const { requests:
        {
            vizRiskThemeIdRequest,

        } } = props;

    const forDisable = (bool: boolean) => {
        setDisabled(bool);
    };

    useEffect(() => {
        if (pendingMainPage) {
            if (vizRiskId.length > 0) {
                setpendingMainPage(false);
            }
        }
    }, [pendingMainPage, vizRiskId.length]);

    const handleScrollClick = () => {
        if (tourContainerRef.current) {
            const cHeight = tourContainerRef.current.clientHeight;
            const scrollTopVal = tourContainerRef.current.scrollTop;
            const scrollHeightVal = tourContainerRef.current.scrollHeight;
            if (scrollTopVal + cHeight === scrollHeightVal) {
                tourContainerRef.current.scroll({
                    top: 0,
                    behavior: 'smooth',
                });
                return;
            }
            tourContainerRef.current.scroll({
                top: scrollTopVal + cHeight,
                behavior: 'smooth',
            });
        }
    };


    vizRiskThemeIdRequest.setDefaultParams({ setvizRiskId });

    return (
        <>
            {
                tourStatus
                && (
                    <div ref={tourContainerRef} className={styles.tourSection}>
                        {
                            tourContents.map((content, index) => (
                                <div className={styles.mainPage}>
                                    <VisRiskTourSlider
                                        tourTilte={content.tourTitle}
                                        tourContent={content.tourContent}
                                        setTourStatus={setTourStatus}
                                        handleScrollClick={handleScrollClick}
                                        tourSectionComplete={tourSectionComplete}
                                        islastPage={index === tourContents.length - 1}
                                    />
                                </div>
                            ))
                        }
                    </div>
                )
            }
            <div className={clickedVizrisk ? styles.mainVzContainerClicked : styles.mainVzContainer}>
                <Page
                    hideFilter
                    hideMap
                />
                {!showMenu
                    && (
                        <div className={styles.hamburgerBtnContainer}>
                            <Button
                                title={'Go back'}
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
                    )
                }

                <Map
                    vzLabel={vzLabel}
                    selctFieldCurrentValue={selctFieldCurrentValue}
                    clickedVizrisk={clickedVizrisk}
                    setClickedVizrisk={setClickedVizrisk}
                    setShowMenu={setShowMenu}
                    searchBbox={searchBbox}
                    showMenu={showMenu}
                />
                {
                    !clickedVizrisk && (
                        <>
                            {
                                !tourStatus && (
                                    <>
                                        <LayerToggle setVzLabel={setVzLabel} vzLabel={vzLabel} />
                                        <ThemeSelector
                                            selectFieldValue={themes}
                                            selctFieldCurrentValue={selctFieldCurrentValue}
                                            setSelctFieldCurrentValue={setselctFieldCurrentValue}
                                            disabled={disabled}
                                        />
                                        <LabelSearch
                                            setSearchBbox={setSearchBbox}
                                            setSelctFieldCurrentValue={setselctFieldCurrentValue}
                                            vzLabel={vzLabel}
                                            forDisable={forDisable}
                                        />
                                    </>
                                )
                            }

                        </>
                    )
                }

                {!showMenu && renderVizRisk()}
            </div>
        </>

    );
};

export default compose(
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(VizRiskMainPage);
