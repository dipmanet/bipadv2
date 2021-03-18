import React, { useState } from 'react';
import Icon from '#rscg/Icon';
import Page from '#components/Page';
import styles from './styles.scss';
import Button from '#rsca/Button';
import Rajapur from './Rajapur';
import Gulariya from './Gulariya';

import VizRiskContext, { VizRiskContextProps } from '#components/VizRiskContext';
import BarabiseLandslide from './BarabiseLandslide';


const slides = [
    <Rajapur />,
    // <BarabiseLandslide />,
    // <Gulariya />,

];

const VizRiskMainPage = () => {
    const [showMenu, setShowMenu] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [title, setTitle] = useState('');
    // console.log(props);

    const handleMenuIconClick = () => {
        setShowMenu(true);
    };

    const handleMenuTitleClick = (municipality) => {
        console.log('This is final muni>>>', municipality);
        setShowMenu(false);
        if (municipality === 'rajapur') {
            setCurrentPage(0);
            setTitle('Visualising Flood Exposure');
        } else if (municipality === 'bharabise') {
            setCurrentPage(1);
            setTitle('Visualising Landslide Exposure');
        } else if (municipality === 'gulariya') {
            setCurrentPage(2);
            setTitle('Visualising Flood Exposure');
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

    return (
        <VizRiskContext.Provider value={vrcontextProps}>
            <div className={styles.mainVzContainer}>
                <Page
                    hideMap
                    hideFilter
                />
                <div className={styles.navBtnsContainer}>


                    <div className={styles.hamburgerBtnContainer}>
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
                            <p className={styles.menuTitle}>Visualizing Flood Exposure</p>
                            <div className={styles.vizriskmunicipalityName}>
                                <Button
                                    transparent
                                    onClick={() => handleMenuTitleClick('rajapur')}
                                >
                                    <h1 className={styles.menuItems}>Rajapur Municipality</h1>

                                </Button>
                                {/* <Button
                                    transparent
                                    onClick={() => handleMenuTitleClick('gulariya')}
                                >
                                    <h1 className={styles.menuItems}>Gulariya Municipality</h1>

                                </Button> */}
                            </div>
                            {/* <p className={styles.menuTitle}>Visualizing Landslide Exposure </p>
                            <Button
                                transparent
                                onClick={() => handleMenuTitleClick('bharabise')}

                            >
                                <h1 className={styles.menuItems}>Bharabise Municipality</h1>

                            </Button> */}


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
