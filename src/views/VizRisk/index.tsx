import React, { useState } from 'react';
import Icon from '#rscg/Icon';
import Page from '#components/Page';
import styles from './styles.scss';
import Button from '#rsca/Button';
import SlideOne from './SlideOne';
import SlideTwo from './SlideTwo';

interface Props {
    handleOptionClick: Function;
}

const slides = [<SlideOne />, <SlideTwo />];

const VizRiskMainPage = (props: Props) => {
    const [showMenu, setShowMenu] = useState(true);
    const [pageToShow, setPageToShow] = useState(0);
    console.log(props);

    const handleMenuIconClick = () => {
        setShowMenu(true);
    };

    const handleMenuTitleClick = () => {
        setShowMenu(false);
    };

    const renderPage = (page: number) => slides[page];
    return (

        <div className={styles.mainVzContainer}>
            <Page
                hideMap
                hideFilter
            />
            <div className={styles.navBtnsContainer}>
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
                    renderPage(pageToShow)
                )}
            </div>

        </div>
    );
};

export default VizRiskMainPage;
