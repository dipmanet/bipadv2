import React from 'react';
import Map from './Map';
// import Legends from './Legends';
import styles from './styles.scss';
import RightElement1 from './RightPaneContents/RightPane1';
import RightElement2 from './RightPaneContents/RightPane2';
import RightElement3 from './RightPaneContents/RightPane3';
import RightElement4 from './RightPaneContents/RightPane4';
import RightElement5 from './RightPaneContents/RightPane5';
import RightElement6 from './RightPaneContents/RightPane6';
import LandcoverLegends from './Legends/LandCoverLegends';
import DemographicsLegends from './Legends/DemographicsLegends';
import CriticalInfraLegends from './Legends/CriticalInfraLegends';
import FloodHazardLegends from './Legends/FloodHazardLegends';
import FloodDepthLegend from './Legends/FloodDepthLegend';


import EvacLegends from './Legends/EvacLegends';
import Icon from '#rscg/Icon';
import VRLegend from '../VRLegend';

const rightelements = [
    <RightElement1 />,
    <RightElement2 />,
    <RightElement3 />,
    <RightElement4 />,
    <RightElement5 />,
    <RightElement6 />,
];

export default class SlideFour extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            showRaster: true,
            rasterLayer: '5',
            exposedElement: 'all',
            criticalElement: 'all',
            criticalFlood: 'all',
            rightElement: 0,
            legendElement: 0,
            showLegend: false,
            disableNavBtns: false,
            hoveredWard: '',
            showPopulation: 'ward',
            evacElement: 'all',
            showCriticalElements: true,
        };
    }

    public handleCriticalShowToggle = (showCriticalElements: string) => {
        this.setState({
            showCriticalElements,
        });
    }

    public handleCriticalFlood = (criticalFlood: string) => {
        this.setState({
            criticalFlood,
        });
    }

    public handleCriticalInfra = (criticalElement: string) => {
        this.setState({
            criticalElement,
        });
    }

    public handleEvac = (evacElement: string) => {
        this.setState({
            evacElement,
        });
    }


    public handleLegendsClick = (rasterLayer: string, showRasterRec: boolean) => {
        this.setState({
            rasterLayer,
            showRaster: showRasterRec,
        });
    }

    public handleExposedElementChange = (exposed: string) => {
        this.setState({
            exposedElement: exposed,
        });
    }

    public handleNext = () => {
        if (this.state.rightElement < rightelements.length) {
            this.setState(prevState => ({ rightElement: prevState.rightElement + 1 }));
        }
    }

    public handlePrev = () => {
        if (this.state.rightElement > 0) {
            this.setState(prevState => ({ rightElement: prevState.rightElement - 1 }));
        }
    }

    public handleMoveEnd = (value) => {
        this.setState({ disableNavBtns: false });
        // console.log('moveend: ', value);
    }

    public handlePopulationChange =(showPopulation) => {
        this.setState({ showPopulation });
    }

    public handleFloodChange = (rasterLayer: string) => {
        this.setState({
            rasterLayer,
        });
    }

    public handleChisapani = () => {
        this.setState(prevState => ({
            chisapaniClicked: !prevState.chisapaniClicked,
        }));
    }

    public handleExposedElementChange = (exposed: string) => {
        this.setState({
            exposedElement: exposed,
        });
    }

    public render() {
        const {
            showRaster,
            rasterLayer,
            exposedElement,
            rightElement,
            disableNavBtns,
            showPopulation,
            criticalElement,
            evacElement,
            criticalFlood,
            showCriticalElements,
        } = this.state;

        return (
            <div>
                {!disableNavBtns && (
                    <div className={styles.navBtnCont}>
                        <button
                            type="button"
                            onClick={this.handlePrev}
                            className={styles.navbutton}
                            disabled={rightElement === 0}
                        >
                            <Icon
                                name="chevronLeft"
                                className={rightElement === 0
                                    ? styles.btnDisable
                                    : styles.nextPrevBtn
                                }
                            />
                        </button>
                        <button
                            type="button"
                            onClick={this.handleNext}
                            className={styles.navbutton}
                            disabled={(rightElement === (rightelements.length) - 1)}
                        >
                            <Icon
                                name="chevronRight"
                                className={(rightElement === rightelements.length - 1)
                                    ? styles.btnDisable
                                    : styles.nextPrevBtn
                                }
                            />
                        </button>

                    </div>
                )}


                <Map
                    showRaster={showRaster}
                    rasterLayer={rasterLayer}
                    exposedElement={exposedElement}
                    rightElement={rightElement}
                    handleMoveEnd={this.handleMoveEnd}
                    showPopulation={showPopulation}
                    criticalElement={criticalElement}
                    criticalFlood={criticalFlood}
                    evacElement={evacElement}
                />
                {rightelements[rightElement]}
                {rightElement === 1
                    ? (
                        <div className={styles.legends}>
                            <VRLegend>
                                <LandcoverLegends />
                            </VRLegend>
                        </div>

                    )
                    : ''}
                {rightElement === 2
                    ? (
                        <div className={styles.legends}>
                            <VRLegend>
                                <DemographicsLegends
                                    handlePopulationChange={this.handlePopulationChange}
                                />
                            </VRLegend>
                        </div>
                    )
                    : ''
                }
                {rightElement === 3
                    ? (
                        <div className={styles.legends}>
                            <VRLegend>
                                <CriticalInfraLegends
                                    handleCritical={this.handleCriticalInfra}
                                    handleCriticalShowToggle={this.handleCriticalShowToggle}
                                />
                            </VRLegend>
                        </div>
                    )
                    : ''
                }
                {rightElement === 4
                    ? (
                        <>
                            <div className={styles.legends}>
                                <VRLegend>
                                    <CriticalInfraLegends
                                        handleCritical={this.handleCriticalFlood}
                                        showCriticalElements={showCriticalElements}
                                        handleCriticalShowToggle={this.handleCriticalShowToggle}

                                    />
                                    <FloodHazardLegends
                                        handleFloodChange={this.handleFloodChange}
                                        handleExposedElementChange={this.handleExposedElementChange}
                                        handleChisapani={this.handleChisapani}
                                        showCriticalElements={showCriticalElements}
                                    />
                                </VRLegend>
                                <VRLegend>
                                    <FloodDepthLegend />
                                </VRLegend>
                            </div>
                        </>
                    )
                    : ''
                }
                {rightElement === 5
                    ? (
                        <div className={styles.legends}>

                            <VRLegend>
                                <EvacLegends
                                    handleEvac={this.handleEvac}
                                    evacElement={evacElement}

                                />
                                <FloodHazardLegends
                                    handleFloodChange={this.handleFloodChange}
                                    handleExposedElementChange={this.handleExposedElementChange}
                                    handleChisapani={this.handleChisapani}
                                />
                            </VRLegend>
                            <VRLegend>
                                <FloodDepthLegend />
                            </VRLegend>
                        </div>

                    )
                    : ''
                }
            </div>
        );
    }
}
