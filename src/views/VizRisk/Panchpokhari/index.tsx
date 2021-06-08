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
import MapWithDraw from './MapWithDraw';
import MapVenerability from './MapVenerability';

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
        onSuccess: ({ response, props: { setIncidentList } }) => {
            interface Response { results: PageType.Incident[] }
            const { results: incidentList = [] } = response as Response;
            console.log('incidents:', incidentList);
            setIncidentList({ incidentList });
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
            sesmicLayer: 'ses',
        };

        const { requests: { incidentsGetRequest } } = this.props;

        incidentsGetRequest.setDefaultParams({
            onSuccess: this.setIncidents,
        });
    }

    public setIncidents = (incidents) => {
        this.setState({ incidents });
        console.log('incidents data:', incidents);
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
                        />
                        <RightElement1
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
                        />
                        <RightElement3
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
                        />
                        <RightElement4
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
                        />
                        <RightElement6
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
                            sesmicLayer={sesmicLayer}
                        />
                        <RightElement7
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

                        />
                        <VRLegend>
                            <SesmicHazardLegend
                                handleSesmicLayerChange={this.handleSesmicLayerChange}
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
