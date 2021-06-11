import React from 'react';
import { connect } from 'react-redux';
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
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import EvacLegends from './Legends/EvacLegends';
import Icon from '#rscg/Icon';
import VRLegend from '#views/VizRisk/Biratnagar/Components/VRLegend';

const rightelements = [
    <RightElement1 />,
    <RightElement2 />,
    <RightElement3 />,
    <RightElement4 />,
    <RightElement5 />,
    <RightElement6 />,
];
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    GetCriticalInfrastructure: {
        url: `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/ows`,
        method: methods.GET,
        query: ({ params }) => ({
            version: '1.0.0',
            service: 'WFS',
            request: 'GetFeature',
            typeName: 'Bipad:CI_Biratnagar',
            outputFormat: 'application/json',

        }),
        onSuccess: ({ response, params }) => {
            if (params && params.CriticalInfraData) {
                params.CriticalInfraData(response);
            }
        },

        onMount: true,

    },
};
class Biratnagar extends React.Component {
    public constructor(props) {
        super(props);
        const { requests: { GetCriticalInfrastructure } } = props;
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
            disableNavRightBtn: false,
            disableNavLeftBtn: false,
            criticalInfrastructureData: [],
        };
        GetCriticalInfrastructure.setDefaultParams({
            CriticalInfraData: this.handleCriticalInfraData,
        });
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

    public handleCriticalInfraData=(data) => {
        this.setState({ criticalInfrastructureData: data });
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

    public handleNext = () => {
        if (this.state.rightElement < rightelements.length) {
            this.setState(prevState => ({ rightElement: prevState.rightElement + 1 }));
            this.disableNavBtns('both');
        }
    }

    public handlePrev = () => {
        if (this.state.rightElement > 0) {
            this.setState(prevState => ({ rightElement: prevState.rightElement - 1 }));
            this.disableNavBtns('both');
        }
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

    public enableNavBtns = (val) => {
        if (val === 'Right') {
            this.setState({ disableNavRightBtn: false });
        } else if (val === 'Left') {
            this.setState({ disableNavLeftBtn: false });
        } else {
            this.setState({ disableNavLeftBtn: false });
            this.setState({ disableNavRightBtn: false });
        }
    }


    public disableNavBtns = (val) => {
        if (val === 'Right') {
            this.setState({ disableNavRightBtn: true });
        } else if (val === 'Left') {
            this.setState({ disableNavLeftBtn: true });
        } else {
            this.setState({ disableNavLeftBtn: true });
            this.setState({ disableNavRightBtn: true });
        }
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
            disableNavLeftBtn,
            disableNavRightBtn,
            criticalInfrastructureData,
        } = this.state;
        console.log('This data', criticalInfrastructureData);
        return (
            <div>
                {!disableNavBtns && (
                    <div className={styles.navBtnCont}>
                        <button
                            type="button"
                            onClick={this.handlePrev}
                            className={styles.navbutton}
                            disabled={disableNavLeftBtn}

                        >
                            <Icon
                                name="chevronLeft"
                                className={disableNavLeftBtn
                                    ? styles.btnDisable
                                    : styles.nextPrevBtn
                                }
                            />
                        </button>
                        <button
                            type="button"
                            onClick={this.handleNext}
                            className={styles.navbutton}
                            disabled={disableNavRightBtn}
                        >
                            <Icon
                                name="chevronRight"
                                className={disableNavRightBtn
                                    ? styles.btnDisable
                                    : styles.nextPrevBtn}
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
                    enableNavBtns={this.enableNavBtns}
                    disableNavBtns={this.disableNavBtns}
                    criticalInfrastructureData={criticalInfrastructureData}
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
                        <div className={styles.legends3}>
                            <VRLegend>
                                <CriticalInfraLegends
                                    handleCritical={this.handleCriticalInfra}
                                    criticalFlood={criticalElement}
                                />
                            </VRLegend>
                        </div>
                    )
                    : ''
                }
                {rightElement === 4
                    ? (
                        <>
                            <div className={styles.legends4}>
                                <VRLegend>
                                    <CriticalInfraLegends
                                        handleCritical={this.handleCriticalFlood}
                                        showCriticalElements={showCriticalElements}
                                        criticalFlood={criticalFlood}

                                    />
                                </VRLegend>

                            </div>
                            <div className={styles.floodHazardLegend}>
                                <VRLegend rightElement={4}>
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
                            </VRLegend>
                            <VRLegend>
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
export default connect()(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Biratnagar,
        ),
    ),
);
