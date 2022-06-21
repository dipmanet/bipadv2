/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import Loader from 'react-loader';
import {
    ClientAttributes,
    createConnectedRequestCoordinator,
    createRequestClient, methods,
} from '#request';
import Page from '#components/Page';
import Loading from '#components/Loading';
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


const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    vizRiskThemeIdRequest: {
        url: '/vizrisk-theme/',
        method: methods.GET,
        onSuccess: ({ params, response }) => {
            const { results: vizRiskId = [] } = response as Response;
            console.log('vizrisk-results', vizRiskId);
        },
        onMount: true,
    },
};

interface Props { }
const themes = ['Select VisRisk Theme', 'Flood Exposure', 'Landslide Exposure', 'Multi-hazard Exposure'];

const VizRiskMainPage = (props: Props) => {
    const [vizRiskId, setvizRiskId] = useState([]);
    const [selctFieldCurrentValue, setselctFieldCurrentValue] = useState('');
    const [pendingMainPage, setpendingMainPage] = useState<boolean>(true);
    const [vzLabel, setVzLabel] = useState('municipality');
    const [clickedVizrisk, setClickedVizrisk] = useState('');
    const [showMenu, setShowMenu] = useState(true);
    const [searchBbox, setSearchBbox] = useState([]);
    const handleMenuIconClick = () => {
        setShowMenu(true);
        setClickedVizrisk('');
    };

    console.log('clickedVizrisk', clickedVizrisk);

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
            case 'Province 2':
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

    useEffect(() => {
        if (pendingMainPage) {
            if (vizRiskId.length > 0) {
                setpendingMainPage(false);
            }
        }
    }, [pendingMainPage, vizRiskId.length]);

    vizRiskThemeIdRequest.setDefaultParams({ setvizRiskId });

    console.log('clickedVizrisk', clickedVizrisk);


    return (
        <div className={styles.mainVzContainer}>
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
            />

            <LayerToggle setVzLabel={setVzLabel} vzLabel={vzLabel} />
            <ThemeSelector
                selectFieldValues={themes}
                selctFieldCurrentValue={selctFieldCurrentValue}
                setSelctFieldCurrentValue={setselctFieldCurrentValue}
            />
            <LabelSearch
                setSearchBbox={setSearchBbox}
            />
            {!showMenu && renderVizRisk()}
        </div>
    );
};

export default compose(
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(VizRiskMainPage);
