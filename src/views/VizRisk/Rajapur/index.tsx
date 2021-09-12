import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Loader from 'react-loader';
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
import VRLegend from '#views/VizRisk/Rajapur/Components/VRLegend';
import { getgeoJsonLayer } from './utils';


import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';

const rightelements = [
    <RightElement1 />,
    <RightElement2 />,
    <RightElement3 />,
    <RightElement4 />,
    <RightElement5 />,
    <RightElement6 />,
];

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    cIGetRequest: {
        url: ({ params }) => params.url,
        method: methods.GET,
        onSuccess: ({ params, response }) => {
            // interface Response { results: PageType.Incident[] }
            // const { results: cI = [] } = response as Response;
            params.setCI(response);
        },
        onMount: true,
        // extras: { schemaName: 'incidentResponse' },
    },
    rainRequest: {
        url: '/rain-stations/',
        method: methods.GET,
        query: () => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            station_series_id: 684,

        }),
        onSuccess: ({ params, response }) => {
            // interface Response { results: PageType.Incident[] }
            // const { results:  = [] } = response as Response;
            params.setAvg(response.results[0].averages);
        },
        onMount: true,
        // extras: { schemaName: 'incidentResponse' },
    },
    waterLevelReq: {
        url: '/river-stations/',
        method: methods.GET,
        query: () => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            station_series_id: 4136,

        }),
        onSuccess: ({ params, response }) => {
            // interface Response { results: PageType.Incident[] }
            // const { results:  = [] } = response as Response;
            params.setWaterLevel(response.results[0].waterLevel.toFixed(2));
        },
        onMount: true,
        // extras: { schemaName: 'incidentResponse' },
    },
    pollutionReq: {
        url: '/pollution-stations/',
        method: methods.GET,
        query: () => ({
            name: 'Nepalgunj',
        }),
        onSuccess: ({ params, response }) => {
            // interface Response { results: PageType.Incident[] }
            // const { results:  = [] } = response as Response;
            params.setPollution(response.results[0].observation);
        },
        onMount: true,
        // extras: { schemaName: 'incidentResponse' },
    },
};

class Rajapur extends React.Component {
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
            disableNavRightBtn: false,
            disableNavLeftBtn: false,
            hoveredWard: '',
            showPopulation: 'ward',
            evacElement: 'all',
            showCriticalElements: true,
            cI: [],
            rainFall: null,
            waterLevel: null,
            temperature: null,
        };

        const { requests: {
            cIGetRequest,
            rainRequest,
            waterLevelReq,
            pollutionReq,
        } } = this.props;

        cIGetRequest.setDefaultParams({
            setCI: this.setCI,
            url: getgeoJsonLayer('CI_Rajapur'),
        });
        rainRequest.setDefaultParams({
            setAvg: this.setAvg,
        });
        waterLevelReq.setDefaultParams({
            setWaterLevel: this.setWaterLevel,
        });
        pollutionReq.setDefaultParams({
            setPollution: this.setPollution,
        });
    }

    public setAvg = (averages) => {
        if (averages) {
            const rainFall = averages.filter(item => item.interval === 24)[0].value;
            this.setState({ rainFall });
        }
    }

    public setWaterLevel = (waterLevel) => {
        if (waterLevel) {
            this.setState({ waterLevel });
        }
    }

    public setPollution = (pollution) => {
        if (pollution) {
            const temperature = pollution.filter(p => p.seriesId === 666)[0].data.value;
            this.setState({ temperature });
        }
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
            this.disableNavBtns('both');
        }
    }

    public handlePrev = () => {
        if (this.state.rightElement > 0) {
            this.setState(prevState => ({ rightElement: prevState.rightElement - 1 }));
            this.disableNavBtns('both');
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

    public setCI = (cI) => {
        this.setState({ cI });
        console.log('CI Data:', cI);
    }

    public render() {
        const {
            showRaster,
            rasterLayer,
            exposedElement,
            rightElement,
            disableNavLeftBtn,
            disableNavRightBtn,
            showPopulation,
            criticalElement,
            evacElement,
            criticalFlood,
            showCriticalElements,
            cI,
            rainFall,
            waterLevel,
            temperature,
        } = this.state;

        return (
            <div>
                { (
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


                {
                    cI.features && cI.features.length > 0
                        ? (
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
                                cI={cI}
                                disableNavBtns={this.disableNavBtns}
                            />
                        )
                        : (
                            <div className={styles.loaderClass}>
                                <Loader color="#fff" />
                            </div>
                        )

                }

                {rightElement !== 3 && rightElement !== 0 && rightelements[rightElement]}
                {
                    rightElement === 0
                && (
                    <RightElement1
                        rainFall={rainFall}
                        waterLevel={waterLevel}
                        temperature={temperature}
                    />
                )}
                {
                    rightElement === 1
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
                        <>
                            {
                                cI.features && cI.features.length > 0
                            && (
                                <RightElement4
                                    criticalInfraData={cI}
                                />
                            )}
,
                            <div className={styles.legends}>
                                <VRLegend>
                                    <CriticalInfraLegends
                                        handleCritical={this.handleCriticalInfra}
                                        criticalFlood={criticalElement}
                                        criticalInfraData={cI}
                                    />
                                </VRLegend>
                            </div>
                        </>
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
                                        criticalFlood={criticalFlood}
                                        showBuildingPoints
                                    />
                                </VRLegend>
                                <VRLegend>
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

export default compose(
    connect(undefined, undefined),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(Rajapur);
