import React, { useState } from 'react';
import Icon from '#rscg/Icon';
import Page from '#components/Page';
import styles from './styles.scss';
import Button from '#rsca/Button';
import SlideOne from './SlideOne';

import VizRiskContext, { VizRiskContextProps } from '#components/VizRiskContext';
import VRSetting from './Setting';


const slides = [
    <SlideOne />,

];

const VizRiskMainPage = () => {
    const [showMenu, setShowMenu] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    // console.log(props);

    const handleMenuIconClick = () => {
        setShowMenu(true);
    };

    const handleMenuTitleClick = () => {
        setShowMenu(false);
    };

    const handleChevronRightClick = () => {
        if (currentPage < (slides.length - 1)) { setCurrentPage(currentPage + 1); }
    };

    const handleChevronLeftClick = () => {
        if (currentPage > 0) { setCurrentPage(currentPage - 1); }
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
                                        Visualising Flood Exposure
                                        </span>
                                    </>
                                )
                            }


                        </Button>

                        <div className={styles.cropper} />
                    </div>
                    {/* {showMenu && <VRSetting /> } */}

                </div>

                <div className={styles.vizrisknmenupagecontainer}>
                    {showMenu ? (
                        <div className={styles.vizrisknmenupage}>
                            <p className={styles.menuTitle}>Visualizing Flood Exposure</p>
                            <Button
                                transparent
                                onClick={handleMenuTitleClick}
                            >
                                <h1 className={styles.menuItems}>Rajapur Municipality</h1>

                            </Button>
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
