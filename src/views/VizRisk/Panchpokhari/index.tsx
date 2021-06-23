import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import Map from './Map';
// import Legends from './Legends';
import styles from './styles.scss';
import RightElement1 from './RightPaneContents/RightPane1';
import RightElement2 from './RightPaneContents/RightPane2';
import RightElement3 from './RightPaneContents/RightPane3';
import RightElement4 from './RightPaneContents/RightPane4';
import RightElement5 from './RightPaneContents/RightPane5';
import RightElement6 from './RightPaneContents/RightPane6';
import RightElement7 from './RightPaneContents/RightPane7';
import DemographicsLegends from './Legends/DemographicsLegends';
import CriticalInfraLegends from './Legends/CriticalInfraLegends';
import { getSanitizedIncidents } from '#views/LossAndDamage/common';
import { getgeoJsonLayer } from './utils';
import {
    incidentPointToGeojson,
} from '#utils/domain';
import {
    regionsSelector,
    filtersSelector,
    hazardTypesSelector,
    incidentListSelectorIP,
} from '#selectors';

import {
    setIncidentListActionIP,
    setEventListAction,
} from '#actionCreators';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';

import VRLegend from '#views/VizRisk/Panchpokhari/Components/VRLegend';
import { transformDataRangeLocaleToFilter, transformRegionToFilter } from '#utils/transformations';
import MapWithTimeline from './MapWithTimeline';
import SesmicHazardLegend from './Legends/SesmicHazardLegend';
import SesmicHazardVULLegend from './Legends/SesmicHazardVULLegend';
import MapWithDraw from './MapWithDraw';
import MapVenerability from './MapVenerability';
import LandCoverLegends from './Legends/LandCoverLegends';


const rightelements = [
    <RightElement1 />,
    <RightElement2 />,
    <RightElement3 />,
    <RightElement4 />,
    <RightElement5 />,
    <RightElement6 />,
    <RightElement7 />,
];

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    hazardTypes: hazardTypesSelector(state),
    regions: regionsSelector(state),
    filters: filtersSelector(state),
    hazards: hazardTypesSelector(state),
    incidentList: incidentListSelectorIP(state),

});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setIncidentList: params => dispatch(setIncidentListActionIP(params)),
    setEventList: params => dispatch(setEventListAction(params)),
});

const transformFilters = ({
    dataDateRange,
    region,
    ...otherFilters
}: FiltersElement) => ({
    ...otherFilters,
    // ...transformDataRangeToFilter(dataDateRange, 'incident_on'),
    ...transformDataRangeLocaleToFilter(dataDateRange, 'incident_on'),
    ...transformRegionToFilter(region),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        query: () => {
            const filters = {
                region: { adminLevel: 3, geoarea: 23010 },
                hazard: [],
                dataDateRange: {
                    rangeInDays: 'custom',
                    startDate: '2011-01-01',
                    endDate: new Date().toISOString().substring(0, 10),
                },
            };
            return ({
                ...transformFilters(filters),
                expand: ['loss', 'event', 'wards'],
                ordering: '-incident_on',
                limit: -1,
            });
        },
        onSuccess: ({ params, response, props: { setIncidentList } }) => {
            interface Response { results: PageType.Incident[] }
            const { results: incidentList = [] } = response as Response;
            setIncidentList({ incidentList });
            params.setIncidentList(incidentList);
        },
        onMount: true,
        onPropsChanged: {
            filters: ({
                props: { filters },
                prevProps: { filters: prevFilters },
            }) => {
                const shouldRequest = filters !== prevFilters;

                return shouldRequest;
            },
        },
        // extras: { schemaName: 'incidentResponse' },
    },
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
    buildingsGetRequest: {
        url: ({ params }) => params.url,
        method: methods.GET,
        onSuccess: ({ params, response }) => {
            // interface Response { results: PageType.Incident[] }
            // const { results: cI = [] } = response as Response;
            params.setBuilding(response);
        },
        onMount: true,
        // extras: { schemaName: 'incidentResponse' },
    },
    vulnerabilityData: {
        url: '/vizrisk-building/',
        method: methods.GET,
        query: () => ({
            municipality: 23010,
            limit: -1,
        }),
        onSuccess: ({ params, response }) => {
            const { results: vulData = [] } = response;
            params.setVulData(vulData);
            params.setPending(false);
        },
        onMount: true,
        // extras: { schemaName: 'incidentResponse' },
    },
};

class Jugal extends React.Component {
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
            clickedIncidentItem: 'all',
            incidentFilterYear: '2011',
            incidentDetailsData: [],
            drawChartData: [],
            sesmicLayer: 'sus',
            cI: [],
            singularBuilding: false,
            score: 7,
            buildings: [],
            vulData: [],
            singularBuldingData: {},
            resetDrawData: false,
            sesmicLayerVul: '',
            pending: true,
            indexArray: [],
        };

        const { requests:
            {
                incidentsGetRequest,
                cIGetRequest,
                buildingsGetRequest,
                vulnerabilityData,
            } } = this.props;

        incidentsGetRequest.setDefaultParams({
            setIncidentList: this.setIncidentList,
        });
        cIGetRequest.setDefaultParams({
            setCI: this.setCI,
            url: getgeoJsonLayer('CI_Panchpokhari'),
        });
        buildingsGetRequest.setDefaultParams({
            setBuilding: this.setBuilding,
            url: getgeoJsonLayer('panchpokhari_buildings'),
        });
        vulnerabilityData.setDefaultParams({
            setVulData: this.setVulData,
            setPending: this.setPending,

        });
    }

    public getIncidentYear = (incidentOn: string) => {
        if (incidentOn) {
            const date = incidentOn.split('T')[0];
            return date.split('-')[0];
        }
        return 0;
    }

    public setPending = (pending) => {
        this.setState({ pending });
    }

    public setCI = (cI) => {
        this.setState({ cI });
    }

    public setBuilding = (buildings) => {
        this.setState({ buildings });
    }

    public setVulData = (vulData) => {
        this.setState({ vulData });
        const indexArray = {};
        vulData.map((item, i) => {
            const dd = String(item.point.coordinates);
            indexArray[dd] = vulData[i];
            return null;
        });
        this.setState({ indexArray });

        // console.log('data with vulnerability score:',
        //     vulData.filter(item => item.vulnerabilityScore !== undefined)
        //         .map(o => ({ osmid: o.osmId, vscore: o.vulnerabilityScore })));
    }

    public setSingularBuilding = (singularBuilding, singularBuldingData) => {
        this.setState({ singularBuilding });
        this.setState({ singularBuldingData });
    }

    public setScore = (score) => {
        this.setState({ score });
    }

    public setIncidentList = (year: string) => {
        const { incidentList } = this.props;
        if (incidentList.length > 0) {
            const inciTotal = incidentList
                .filter(y => this.getIncidentYear(y.incidentOn) === year)
                .map(item => item.loss)
                .filter(f => f !== undefined);

            if (inciTotal.length > 0) {
                const incidentDetails = inciTotal.reduce((a, b) => ({
                    peopleDeathCount: (a.peopleDeathCount || 0) + (b.peopleDeathCount || 0),
                    infrastructureDestroyedHouseCount:
                    a.infrastructureDestroyedHouseCount + b.infrastructureDestroyedHouseCount,
                    infrastructureAffectedHouseCount:
                    a.infrastructureAffectedHouseCount + b.infrastructureAffectedHouseCount,
                    peopleMissingCount:
                    a.peopleMissingCount + b.peopleMissingCount,
                    infrastructureEconomicLoss:
                    a.infrastructureEconomicLoss + b.infrastructureEconomicLoss,
                    agricultureEconomicLoss:
                    a.agricultureEconomicLoss + b.agricultureEconomicLoss,
                    totalAnnualincidents: inciTotal.length,
                }));
                this.setState({ incidentDetailsData: incidentDetails });
            }
        }
    }

    public handleSesmicLayerChange = (sesmicLayer) => {
        this.setState({ sesmicLayer });
    }

    public handleSesmicLayerChangeVUL = (sesmicLayerVul) => {
        this.setState({ sesmicLayerVul });
    }

    public handleDrawResetData = (resetDrawData) => {
        this.setState({ resetDrawData });
    }

    public setIncidents = (incidents) => {
        this.setState({ incidents });
    }

    public handleCriticalShowToggle = (showCriticalElements: string) => {
        this.setState({
            showCriticalElements,
        });
    }

    public handleDrawSelectedData = (drawChartData) => {
        this.setState({ drawChartData });
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

    private getSanitizedIncidents = memoize(getSanitizedIncidents);

    private getPointFeatureCollectionOriginal = memoize(incidentPointToGeojson);

    private handleIncidentItemClick = (clickedIncidentItem) => {
        this.setState({ clickedIncidentItem });
    };

    private handleIncidentChange = (incidentYear) => {
        const y = `${Number(incidentYear) + 2011}`;
        this.setState({ incidentFilterYear: y });
    };


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
            clickedIncidentItem,
            incidentFilterYear,
            incidentDetailsData,
            drawChartData,
            sesmicLayer,
            cI,
            buildings,
            vulData,
            singularBuldingData,
            resetDrawData,
            sesmicLayerVul,
            pending,
            indexArray,
        } = this.state;

        const {
            incidentList,
            regions,
            hazardTypes,
            hazards,
        } = this.props;
        const sanitizedIncidentList = this.getSanitizedIncidents(
            incidentList,
            regions,
            hazardTypes,
        );
        const pointFeatureCollection = this.getPointFeatureCollectionOriginal(
            sanitizedIncidentList,
            hazards,
        );

        return (
            <div>
                {
                    rightElement === 0
                && (
                    <>
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
                            disableNavBtns={this.disableNavBtns}
                            enableNavBtns={this.enableNavBtns}
                            incidentList={pointFeatureCollection}
                            CIData={cI}

                        />
                        <RightElement1
                            handleNext={this.handleNext}
                            handlePrev={this.handlePrev}
                            disableNavLeftBtn={disableNavLeftBtn}
                            disableNavRightBtn={disableNavRightBtn}
                            pagenumber={rightElement + 1}
                            pending={pending}
                            totalPages={rightelements.length}
                        />
                    </>
                )
                }
                {rightElement === 1
                && (
                    <>
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
                            disableNavBtns={this.disableNavBtns}
                            enableNavBtns={this.enableNavBtns}
                            incidentList={pointFeatureCollection}
                            CIData={cI}

                        />
                        <RightElement3
                            handleNext={this.handleNext}
                            handlePrev={this.handlePrev}
                            disableNavLeftBtn={disableNavLeftBtn}
                            disableNavRightBtn={disableNavRightBtn}
                            pagenumber={rightElement + 1}
                            totalPages={rightelements.length}
                            CIData={cI}
                        />
                    </>

                )
                }
                {rightElement === 2
                && (
                    <>
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
                            disableNavBtns={this.disableNavBtns}
                            enableNavBtns={this.enableNavBtns}
                            incidentList={pointFeatureCollection}
                            CIData={cI}

                        />
                        <RightElement2
                            handleNext={this.handleNext}
                            handlePrev={this.handlePrev}
                            disableNavLeftBtn={disableNavLeftBtn}
                            disableNavRightBtn={disableNavRightBtn}
                            pagenumber={rightElement + 1}
                            totalPages={rightelements.length}
                        />
                    </>

                )
                }
                {rightElement === 3
                && (
                    <>
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
                            disableNavBtns={this.disableNavBtns}
                            enableNavBtns={this.enableNavBtns}
                            incidentList={pointFeatureCollection}
                            CIData={cI}

                        />
                        <RightElement4
                            handleNext={this.handleNext}
                            handlePrev={this.handlePrev}
                            disableNavLeftBtn={disableNavLeftBtn}
                            disableNavRightBtn={disableNavRightBtn}
                            pagenumber={rightElement + 1}
                            totalPages={rightelements.length}
                            CIData={cI}
                        />
                    </>

                )
                }
                {
                    rightElement === 4
                && (
                    <>
                        <MapWithTimeline
                            disableNavBtns={this.disableNavBtns}
                            enableNavBtns={this.enableNavBtns}
                            incidentList={pointFeatureCollection}
                            clickedItem={clickedIncidentItem}
                            incidentFilterYear={incidentFilterYear}
                            handleIncidentChange={this.handleIncidentChange}
                            CIData={cI}

                        />
                        <RightElement5
                            incidentDetailsData={incidentDetailsData}
                            handleNext={this.handleNext}
                            handlePrev={this.handlePrev}
                            disableNavLeftBtn={disableNavLeftBtn}
                            disableNavRightBtn={disableNavRightBtn}
                            pagenumber={rightElement + 1}
                            totalPages={rightelements.length}
                            incidentList={pointFeatureCollection}
                            incidentData={incidentList}
                            clickedItem={clickedIncidentItem}
                            handleIncidentItemClick={this.handleIncidentItemClick}
                            incidentFilterYear={incidentFilterYear}
                            getIncidentData={this.setIncidentList}
                            CIData={cI}

                        />
                    </>
                )
                }
                {/* {rightelements[rightElement]} */}


                {rightElement === 1
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
                {rightElement === 2
                    ? (
                        <div className={styles.legends}>
                            <VRLegend>
                                <LandCoverLegends />
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
                                    criticalFlood={criticalElement}
                                />
                            </VRLegend>
                        </div>
                    )
                    : ''
                }

                {rightElement === 5
                && (

                    <>
                        <MapWithDraw
                            disableNavBtns={this.disableNavBtns}
                            enableNavBtns={this.enableNavBtns}
                            incidentList={pointFeatureCollection}
                            clickedItem={clickedIncidentItem}
                            incidentFilterYear={incidentFilterYear}
                            handleIncidentChange={this.handleIncidentChange}
                            handleDrawSelectedData={this.handleDrawSelectedData}
                            sesmicLayer={sesmicLayer}
                            CIData={cI}
                            handleDrawResetData={this.handleDrawResetData}
                            buildings={buildings}
                        />
                        <RightElement6
                            handleDrawResetData={this.handleDrawResetData}
                            handleNext={this.handleNext}
                            handlePrev={this.handlePrev}
                            disableNavLeftBtn={disableNavLeftBtn}
                            disableNavRightBtn={disableNavRightBtn}
                            pagenumber={rightElement + 1}
                            totalPages={rightelements.length}
                            incidentList={pointFeatureCollection}
                            clickedItem={clickedIncidentItem}
                            handleIncidentItemClick={this.handleIncidentItemClick}
                            incidentFilterYear={incidentFilterYear}
                            drawChartData={drawChartData}
                            sesmicLayer={sesmicLayer}
                            vulData={vulData}
                            buildings={buildings}
                            resetDrawData={resetDrawData}
                            CIData={cI}
                        />
                        <VRLegend>
                            <SesmicHazardLegend
                                handleSesmicLayerChange={this.handleSesmicLayerChange}
                            />
                        </VRLegend>
                    </>
                )
                }
                {rightElement === 6
                && (

                    <>
                        <MapVenerability
                            disableNavBtns={this.disableNavBtns}
                            enableNavBtns={this.enableNavBtns}
                            incidentList={pointFeatureCollection}
                            clickedItem={clickedIncidentItem}
                            incidentFilterYear={incidentFilterYear}
                            handleIncidentChange={this.handleIncidentChange}
                            handleDrawSelectedData={this.handleDrawSelectedData}
                            sesmicLayer={sesmicLayerVul}
                            singularBuilding={this.state.singularBuilding}
                            setSingularBuilding={this.setSingularBuilding}
                            setScore={this.setScore}
                            CIData={cI}
                            buildings={vulData}
                            buildinggeojson={buildings}
                            handleDrawResetData={this.handleDrawResetData}
                        />

                        <RightElement7
                            handleDrawResetData={this.handleDrawResetData}
                            handleNext={this.handleNext}
                            handlePrev={this.handlePrev}
                            disableNavLeftBtn={disableNavLeftBtn}
                            disableNavRightBtn={disableNavRightBtn}
                            pagenumber={rightElement + 1}
                            totalPages={rightelements.length}
                            incidentList={pointFeatureCollection}
                            clickedItem={clickedIncidentItem}
                            handleIncidentItemClick={this.handleIncidentItemClick}
                            incidentFilterYear={incidentFilterYear}
                            drawChartData={drawChartData}
                            sesmicLayer={sesmicLayer}
                            singularBuilding={this.state.singularBuilding}
                            score={this.state.score}
                            setSingularBuilding={this.setSingularBuilding}
                            singularBuldingData={this.state.singularBuldingData}
                            vulData={vulData}
                            resetDrawData={resetDrawData}
                            indexArray={indexArray}
                        />
                        <VRLegend>
                            <SesmicHazardVULLegend
                                handleSesmicLayerChange={this.handleSesmicLayerChangeVUL}
                            />
                        </VRLegend>
                    </>
                )
                }
            </div>

        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(Jugal);
