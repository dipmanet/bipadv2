import React, { useState } from 'react';
import Icon from '#rscg/Icon';
import Page from '#components/Page';
import styles from './styles.scss';
import Button from '#rsca/Button';

import VizRiskContext, { VizRiskContextProps } from '#components/VizRiskContext';
import Panchpokhari from './Panchpokhari';
import Jugal from './Jugal';


const slides = [
<<<<<<< HEAD
    <Rajapur />,
    // <BarabiseLandslide />,
    // <Gulariya />,
=======
    <Panchpokhari />,
    <Jugal />,
>>>>>>> feature/JugalPanckpokhari

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
<<<<<<< HEAD
                                {/* <Button
=======
                            </div>
                            <div className={styles.vizriskmunicipalityName}>
                                <Button
>>>>>>> feature/JugalPanckpokhari
                                    transparent
                                    onClick={() => handleMenuTitleClick('jugal')}

                                >
                                    <h1
                                        className={styles.menuItems}
                                    >
                                            Jugal Municipality
                                    </h1>

                                </Button> */}
                            </div>
<<<<<<< HEAD
                            {/* <p className={styles.menuTitle}>Visualizing Landslide Exposure </p>
                            <Button
                                transparent
                                onClick={() => handleMenuTitleClick('bharabise')}

                            >
                                <h1 className={styles.menuItems}>Bharabise Municipality</h1>

                            </Button> */}
=======
>>>>>>> feature/JugalPanckpokhari


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
