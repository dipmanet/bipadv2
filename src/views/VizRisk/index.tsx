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
import SlideFour from './SlideFour';
import SlideFive from './SlideFive';
import SlideSix from './SlideSix';


const slides = [
    <SlideOne />, <SlideTwo />, <SlideThree />,
    <SlideFour />, <SlideSix />,

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
                            {/* <span>
                                {' '}
                                <strong>Visualising Flood</strong>
                                {' '}
                            Exposure

                            </span> */}

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


// import React from 'react';
// import Panel from './Panel';
// import Map from './SlideFour/Map';
// import Filter from './Filter';
// import Legends from './SlideFour/Legends';

// export default class App extends React.Component {
//     public constructor(props) {
//         super(props);

//         this.state = {
//             chapterName: 'marikina',
//             buildingType: 'all',
//             amenity: 'all',
//             layer: 'flood',
//             floodYear: 'fhm005yrs',
//             minutes: 5,
//             suitabilityYear: 'mcda005yrs',
//             showRaster: true,
//         };

//         this.updateChapter = this.updateChapter.bind(this);
//         this.updateAmenity = this.updateAmenity.bind(this);
//         this.updateBuildingType = this.updateBuildingType.bind(this);
//         this.updateLayer = this.updateLayer.bind(this);
//         this.updateFloodYear = this.updateFloodYear.bind(this);
//         this.updateMinutes = this.updateMinutes.bind(this);
//         this.updateSuitabilityYear = this.updateSuitabilityYear.bind(this);
//     }

//     public updateChapter = (chapterName) => {
//         let { layer } = this.state;

//         if (chapterName === 'typhoon') {
//             layer = 'flood';
//         }

//         this.setState({
//             chapterName,
//             layer,
//         });
//     }

//     public updateAmenity = (event) => {
//         this.setState({
//             amenity: event.target.value,
//         });
//     }

//     public updateBuildingType = (event) => {
//         this.setState({
//             buildingType: event.target.value,
//         });
//     }

//     public updateLayer = (event) => {
//         this.setState({
//             layer: event.target.value,
//         });
//     }

//     public updateFloodYear = (event) => {
//         this.setState({
//             floodYear: event.target.value,
//         });
//     }

//     public updateMinutes = (event) => {
//         this.setState({
//             minutes: parseInt(event.target.value, 10),
//         });
//     }

//     public updateSuitabilityYear = (event) => {
//         this.setState({
//             suitabilityYear: event.target.value,
//         });
//     }

//     public handleLegendsClick = () => {
//         if (this.state.showRaster) {
//             this.setState({
//                 showRaster: false,
//             });
//         } else {
//             this.setState({
//                 showRaster: true,
//             });
//         }
//     }

//     public render() {
//         const {
//             chapterName, buildingType, amenity, layer,
//             floodYear, minutes, suitabilityYear, showRaster,
//         } = this.state;

//         return (
//             <div>
//                 <Map
//                     chapterName={chapterName}
//                     buildingType={buildingType}
//                     amenity={amenity}
//                     layer={layer}
//                     floodYear={floodYear}
//                     minutes={minutes}
//                     suitabilityYear={suitabilityYear}
//                     showRaster={showRaster}
//                 />
//                 {/* <Panel
//                     chapterName={chapterName}
//                     updateChapter={this.updateChapter}
//                 /> */}
//                 {/* <Filter
//                     chapterName={chapterName}
//                     buildingType={buildingType}
//                     amenity={amenity}
//                     layer={layer}
//                     floodYear={floodYear}
//                     minutes={minutes}
//                     suitabilityYear={suitabilityYear}
//                     updateAmenity={this.updateAmenity}
//                     updateBuildingType={this.updateBuildingType}
//                     updateLayer={this.updateLayer}
//                     updateFloodYear={this.updateFloodYear}
//                     updateMinutes={this.updateMinutes}
//                     updateSuitabilityYear={this.updateSuitabilityYear}
//                 /> */}
//                 <Legends
//                     handleLegendsClick={this.handleLegendsClick}
//                 />
//             </div>
//         );
//     }
// }
