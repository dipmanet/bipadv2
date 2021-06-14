import React, { useState } from 'react';
import Icon from '#rscg/Icon';
import Page from '#components/Page';
import styles from './styles.scss';
import Button from '#rsca/Button';

import VizRiskContext, { VizRiskContextProps } from '#components/VizRiskContext';
import Panchpokhari from './Panchpokhari';
import Jugal from './Jugal';


const slides = [
    <Panchpokhari />,
    <Jugal />,

];

const VizRiskMainPage = () => {
    const [showMenu, setShowMenu] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [title, setTitle] = useState('');
    const [mun, setMun] = useState('');
    // console.log(props);

    const handleMenuIconClick = () => {
        setShowMenu(true);
    };

    const handleMenuTitleClick = (municipality) => {
        setShowMenu(false);
        setMun(municipality);
        if (municipality === 'rajapur') {
            setCurrentPage(0);
            setTitle('Visualising Flood Exposure');
        } else if (municipality === 'bharabise') {
            setCurrentPage(1);
            setTitle('Visualising Landslide Exposure');
        } else if (municipality === 'jugal') {
            setCurrentPage(1);
            setTitle('Visualising Flood Exposure');
        } else if (municipality === 'pachpokhari') {
            setCurrentPage(0);
            setTitle('Visualising Multihazard Exposure');
        }
    };

    const renderPage = (page: number) => slides[page];
    const vrcontextProps: VizRiskContextProps = {
        currentPage,
        showFirstSlide: false,
        infraChosen: 'all',
        floodInfraChosen: 'all',
        evacChosen: 'all',
    };

    const getBtnStyle = () => {
        if (mun === 'pachpokhari' || mun === 'jugal') {
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

    return (
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
                                        <span className={styles.strong}>
                                            {title}
                                        </span>
                                    </>
                                )
                            }


                        </Button>
                    </div>
                </div>

                <div className={styles.vizrisknmenupagecontainer}>
                    {showMenu ? (
                        <div className={styles.vizrisknmenupage}>
                            <p className={styles.menuTitle}>Visualizing Multi Hazard Exposure </p>

                            <div className={styles.vizriskmunicipalityName}>
                                <Button
                                    transparent
                                    onClick={() => handleMenuTitleClick('pachpokhari')}

                                >
                                    <h1
                                        className={styles.menuItems}
                                    >
                                            Panchpokhari Thangpal Municipality
                                    </h1>

                                </Button>
                            </div>
                            <div className={styles.vizriskmunicipalityName}>
                                <Button
                                    transparent
                                    onClick={() => handleMenuTitleClick('jugal')}

                                >
                                    <h1
                                        className={styles.menuItems}
                                    >
                                            Jugal Municipality
                                    </h1>

                                </Button>
                            </div>


                        </div>
                    ) : (
                        renderPage(currentPage)
                    )}
                </div>

            </div>
        </VizRiskContext.Provider>

    );
};

export default VizRiskMainPage;
