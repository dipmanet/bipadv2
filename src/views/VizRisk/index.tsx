import React, { useState } from 'react';
import Icon from '#rscg/Icon';
import Page from '#components/Page';
import styles from './styles.scss';
import Button from '#rsca/Button';
import SlideOne from './SlideOne';
import SlideTwo from './SlideTwo';
import SlideThree from './SlideThree';
import VizRiskContext, { VizRiskContextProps } from '#components/VizRiskContext';
import VRSetting from './Setting';

const slides = [<SlideOne />, <SlideTwo />, <SlideThree />];

const VizRiskMainPage = () => {
    const [showMenu, setShowMenu] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    // console.log(props);

    const handleMenuIconClick = () => {
        console.log('Menu clicked');
        console.log(showMenu);
        setShowMenu(true);
    };

    const handleMenuTitleClick = () => {
        setShowMenu(false);
    };

    const handleChevronRightClick = () => {
        if (currentPage < (slides.length - 1)) { setCurrentPage(currentPage + 1); }
    };

    const handleSettingsIconClick = () => {
        console.log('settings cliekd');
    };

    const handleChevronLeftClick = () => {
        if (currentPage > 0) { setCurrentPage(currentPage - 1); }
    };
    const renderPage = (page: number) => slides[page];
    const vrcontextProps: VizRiskContextProps = {
        currentPage,
    };

    return (
        <VizRiskContext.Provider value={vrcontextProps}>
            <div className={styles.mainVzContainer}>
                <Page
                    hideMap
                    hideFilter
                />
                <div className={styles.navBtnsContainer}>
                    {!showMenu && (
                        <div className={styles.nextPrevBtnContainer}>
                            <Button
                                transparent
                                onClick={handleChevronLeftClick}
                                disabled={currentPage === 0}
                            >
                                <Icon
                                    name="chevronLeft"
                                    className={currentPage === 0
                                        ? styles.prevBtnDisable : styles.nextPrevBtn}
                                />
                            </Button>
                            <Button
                                transparent
                                onClick={handleChevronRightClick}
                                disabled={currentPage === (slides.length - 1)}
                            >
                                <Icon
                                    name="chevronRight"
                                    className={currentPage === (slides.length - 1)
                                        ? styles.prevBtnDisable : styles.nextPrevBtn}
                                />
                            </Button>
                        </div>
                    )}

                    <div className={styles.hamburgerBtn}>
                        <Button
                            transparent
                            onClick={handleMenuIconClick}
                        >
                            <Icon
                                name="menu"
                                className={styles.hamburgerBtn}
                            />
                        </Button>

                        <div className={styles.cropper} />
                    </div>
                    {showMenu && <VRSetting /> }

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
