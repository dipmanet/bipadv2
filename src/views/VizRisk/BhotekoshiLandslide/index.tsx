/* eslint-disable max-len */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Loader from 'react-loader';

import {
    Obj,
} from '@togglecorp/fujs';
import memoize from 'memoize-one';
import { FlyToInterpolator } from 'react-map-gl';
import { Spring } from 'react-spring/renderprops';
// import Locations from './locations';

import Deck from './Deck';
import Map from './Map';
import MapWithTimeline from './MapWithTimeline';
import Legends from './Components/Legends';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { getSanitizedIncidents } from '#views/LossAndDamage/common';
import {
    incidentPointToGeojsonVR,
} from '#utils/domain';

import { hazardTypesSelector,
    filtersSelector,
    regionsSelector } from '#selectors';
import Locations from './Data/locations';
import {
    transformRegionToFilter,
    transformDataRangeLocaleToFilter,
} from '#utils/transformations';

import { FiltersElement } from '#types';
import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';
import CriticalData from './Data/criticalInfraData';

import {
    setIncidentListActionIP,
    setEventListAction,
} from '#actionCreators';
import styles from './styles.scss';
import LandslideData from './Data/librariesData';
import legendList from './Components/Legends/legends';
import LeftPaneContainer from '../Common/LeftPaneContainer';
import DemographicsLegends from '../Common/Legends/DemographicsLegends';
import CriticalInfraLegends from '../Common/Legends/CriticalInfraLegends';
import LandCoverLegends from '../Common/Legends/LandCoverLegends';
import NavButtons from '../Common/NavButtons';
import LeftPane1 from './Narratives/LeftPane1';
import LeftPane2 from './Narratives/LeftPane2';
import LeftPane3 from './Narratives/LeftPane3';
import LeftPane4 from './Narratives/LeftPane4';
import LeftPane5 from './Narratives/LeftPane5';
import LeftPane6 from './Narratives/LeftPane6';
import LeftPane7 from './Narratives/LeftPane7';
import LeftPane8 from './Narratives/LeftPane8';
import LeftPane9 from './Narratives/LeftPane9';
import LeftPane10 from './Narratives/LeftPane10';
import LandslideLegend from './Components/LandslideLegend';
import InventoryLegend from './Components/InventoryLegend';
import CISwitchLegends from './Components/CISwitchLegends';
import { getgeoJsonLayer } from '#views/VizRisk/Panchpokhari/utils';
import LandCoverData from './Data/LandCoverChartData';
import DemoData from './Data/demographicsData';

interface Params {
}

interface ComponentProps {
}

interface PropsFromDispatch {
    // setIncidentList: typeof setIncidentListActionIP;
    setEventList: typeof setEventListAction;
}
interface PropsFromAppState {
    // incidentList: PageType.Incident[];
    filters: FiltersElement;
    hazardTypes: Obj<PageType.HazardType>;
    regions: {
        provinces: object;
        districts: object;
        municipalities: object;
        wards: object;
    };
}

type ReduxProps = ComponentProps & PropsFromDispatch & PropsFromAppState;

type Props = NewProps<ReduxProps, Params>;
const mapStateToProps = (state: AppState): PropsFromAppState => ({
    // incidentList: incidentListSelectorIP(state),
    hazardTypes: hazardTypesSelector(state),
    regions: regionsSelector(state),
    filters: filtersSelector(state),
    hazards: hazardTypesSelector(state),


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
        // We have to transform dateRange to incident_on__lt and incident_on__gt
        query: () => {
            const filters = {
                // municipality: 23003,
                hazard: [17],
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
        onSuccess: ({ response, params }) => {
            interface Response { results: PageType.Incident[] }
            const { results: incidentList = [] } = response as Response;
            params.setIncidentList(incidentList);
        },
        onMount: true,
    },
    incidentsGetRequestBB: {
        url: '/incident/',
        method: methods.GET,
        // We have to transform dateRange to incident_on__lt and incident_on__gt
        query: () => {
            const filters = {
                municipality: 23003,
                hazard: [17],
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
        onSuccess: ({ response, params }) => {
            interface Response { results: PageType.Incident[] }
            const { results: incidentList = [] } = response as Response;
            params.setBarabiseIncidents(incidentList);
        },
        onMount: true,
    },
    ciRequest: {
        url: '/resource/',
        method: methods.GET,
        // We have to transform dateRange to incident_on__lt and incident_on__gt
        query: () => ({
            municipality: 23003,
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageType.Incident[] }
            const { results: incidentList = [] } = response as Response;
            params.handleCI(incidentList);
        },
        onMount: true,
    },
    buildingCountRequest: {
        url: '/overpass-element/',
        method: methods.GET,
        query: ({ params: { polygon } }) => ({
            limit: 0,
            count: true,
            municipality: 23003,
            bbox: polygon,
            selector: `${'"'}building${'"'}`,
        }),
        onSuccess: ({ response, params: { handleBuidingResponse } }) => {
            // const {  buildingCount = [] } = response;
            handleBuidingResponse(response);
        },
        onMount: true,
    },
    landslidePolyRequest: {
        url: ({ params }) => params.url,
        method: methods.GET,
        onSuccess: ({ params: { handlePolyRes }, response }) => {
            handlePolyRes(response);
        },
        onMount: true,
        // extras: { schemaName: 'incidentResponse' },
    },
};


const leftElements = [
    <LeftPane1 />,
    <LeftPane2 />,
    <LeftPane3 />,
    <LeftPane4 />,
    <LeftPane5 />,
    <LeftPane6 />,
    <LeftPane7 />,
    <LeftPane8 />,
    <LeftPane9 />,
    <LeftPane10 />,
];

const BarabiseLandslide = (props) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [location, setLocation] = useState(Locations.nepal);
    const [viewState, setViewState] = useState(Locations.nepal);
    const [reAnimate, setReanimate] = useState(false);
    const [delay, setDelay] = useState(4000);
    const [pending, setPending] = useState(true);
    const handleChangeViewChange = ({ viewState }) => setViewState(viewState);
    const [population, setPopulation] = useState('ward');
    const [criticalElement, setCriticalElement] = useState('all');
    // 2
    const [ci, setCI] = useState([]);
    const [incidentFilterYear, setincidentFilterYear] = useState('2020');
    // 1
    const [incidents, setIncidents] = useState([]);
    // 5
    const [bahrabiseIncidents, setBarabise] = useState([]);
    const [landslideYear, setLandSlideYear] = useState([]);
    const [yearClicked, setyearClicked] = useState(false);
    // 3
    const [buildingCount, setBuildingCount] = useState(0);
    const [defaultBuildcount, setDefault] = useState(0);
    const [polygon, setPolygon] = useState([]);
    // 4
    const [polygonResponse, setPolygonResponse] = useState({});
    const [drawData, setDrawData] = useState([]);
    const [chartReset, setChartReset] = useState(null);
    const [showCI, setShowCI] = useState(false);
    const [hideCILegends, sethideCILegends] = useState(true);
    const [hideOSMLayers, setHideOSM] = useState(true);
    const [livesLost, setLivesLost] = useState(0);
    const [req1, setReq1] = useState(false);
    const [req2, setReq2] = useState(false);
    const [req3, setReq3] = useState(false);
    const [req4, setReq4] = useState(false);
    const [req5, setReq5] = useState(false);
    const [drawpending, setDrawPending] = useState(false);
    const [idle, setIdle] = useState(false);

    const {
        // incidentList,
        hazardTypes,
        regions,
        requests: {
            ciRequest,
            incidentsGetRequest,
            incidentsGetRequestBB,
            buildingCountRequest,
            landslidePolyRequest,
        },
    } = props;
    const handleAnimationStart = () => setReanimate(false);
    const getSanitizedIncident = memoize(getSanitizedIncidents);
    // eslint-disable-next-line no-shadow
    const incidentList = CriticalData.criticalInfraData;
    const sanitizedIncidentList = getSanitizedIncident(
        incidentList,
        regions,
        hazardTypes,
    );

    const getPointFeatureCollection = memoize(incidentPointToGeojsonVR);
    const pointFeatureCollection = getPointFeatureCollection(
        sanitizedIncidentList,
        hazardTypes,
        { ini: 1293819300000, fin: 1609438500000 },
    );
    const cood = Object.values(pointFeatureCollection)[1]
        .map(item => ({ position: item.geometry.coordinates, date: item.properties.incidentOn }));

    const librariesData = Object.values(cood).map(item => ({ position: item }));
    const setNarrationDelay = delayinMS => setDelay(delayinMS);

    const handleCI = (data) => {
        setCI(data);
        setReq2(true);
    };

    ciRequest.setDefaultParams({
        handleCI,
    });

    const handlePolyRes = (res) => {
        setPolygonResponse(res);
        setReq5(true);
    };

    landslidePolyRequest.setDefaultParams({
        handlePolyRes,
        url: getgeoJsonLayer('Bhotekoshi_landslide'),
    });

    const setIncidentData = (data) => {
        const a = data.map(inc => ({
            position: inc.point.coordinates,
            date: new Date(inc.incidentOn).getTime(),
            title: inc.title,
            loss: inc.loss || {},
        }));
        // 1
        setIncidents(a);
        const lossArr = a.map(item => item.loss).filter(l => l !== undefined);
        const pdC = lossArr
            .reduce((a, b) => ({ peopleDeathCount: (b.peopleDeathCount || 0) + a.peopleDeathCount }));
        setLivesLost(pdC.peopleDeathCount);
        setReq1(true);
        // setPending(false);
    };

    const setBarabiseIncidents = (data) => {
        const bi = data.map(inc => ({
            position: inc.point.coordinates,
            date: new Date(inc.incidentOn).getTime(),
            title: inc.title,
            loss: inc.loss || {},
        }));
        setBarabise(bi);

        setReq3(true);
    };

    const handlechartReset = () => {
        setChartReset(!chartReset);
    };

    incidentsGetRequest.setDefaultParams({
        setIncidentList: setIncidentData,
        setPending,
    });
    incidentsGetRequestBB.setDefaultParams({
        setBarabiseIncidents,
    });

    const handleBuidingResponse = (data) => {
        setBuildingCount(data);
        if (defaultBuildcount === 0) {
            setDefault(data.count);
        }
        setReq4(true);
        setDrawPending(false);
    };
    const getPolygon = (p) => {
        setPolygon(p);
    };

    buildingCountRequest.setDefaultParams({
        handleBuidingResponse,
        setPending,
        // polygon,
    });

    const getPolygonString = (p) => {
        const poly = { type: 'Polygon', coordinates: p };
        return JSON.stringify(poly);
    };

    useEffect(() => {
        if (req1 && req2 && req3 && req4 && req5) {
            setPending(false);
        } else {
            setPending(true);
        }
    }, [req1,
        req2,
        req3,
        req4,
        req5]);

    const handleChangeViewState = ({ viewState }) => setViewState(viewState);
    const handleFlyTo = (destination) => {
        setViewState({
            ...viewState,
            ...destination,
            transitionDuration: 3000,
            transitionInterpolator: new FlyToInterpolator(),
        });
    };

    const handlePopulationChange = (population) => {
        setPopulation(population);
    };

    const handleCIChange = (val) => {
        setShowCI(val);
    };


    const handleNext = () => {
        if (currentPage < leftElements.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleCritical = (data) => {
        setCriticalElement(data);
    };

    const handleIncidentChange = (incidentYear) => {
        const y = `${Number(incidentYear) + 2011}`;
        setincidentFilterYear(y);
    };

    const handleYearSelect = (landSlideYear) => {
        setLandSlideYear(landSlideYear);
        setyearClicked(!yearClicked);
    };

    const handleDrawSelectedData = (result, dataArr) => {
        setDrawData(result);
        // buildingCountRequest.do();
        if (dataArr) {
            buildingCountRequest.do({
                polygon: getPolygonString(dataArr),
            });
        }
        setDrawPending(true);
    };

    const handlehideCILegends = (data) => {
        sethideCILegends(data);
    };

    const handlehideOSMLayers = (data) => {
        setHideOSM(data);
    };

    const getIdle = (d: boolean) => {
        setIdle(d);
    };

    useEffect(() => {
        setIdle(false);
    }, [currentPage]);

    return (
        <>
            { (pending || drawpending)
                && (
                    <div className={styles.loaderClass}>
                        <Loader color="#fff" />
                        <p>Loading Data...</p>
                    </div>
                )
            }
            {
                (currentPage < 4)
                && !pending
                && (
                    <Deck
                        librariesData={librariesData}
                        location={location}
                        viewState={viewState}
                        onViewStateChange={handleChangeViewState}
                        libraries={incidents}
                        bahrabiseLandSlide={bahrabiseIncidents}
                        currentPage={currentPage}
                        handleFlyTo={handleFlyTo}
                        setNarrationDelay={setNarrationDelay}
                        ci={ci}
                        getIdle={getIdle}
                    />
                )
            }

            {
                (currentPage === 4
                || currentPage === 5)
                && (
                    <Map
                        population={population}
                        ci={ci}
                        currentPage={currentPage}
                        criticalElement={criticalElement}
                    />
                )

            }
            {
                (currentPage >= 6)

                && (
                    <>
                        <MapWithTimeline
                            currentPage={currentPage}
                            bahrabiseLandSlide={bahrabiseIncidents}
                            handleIncidentChange={handleIncidentChange}
                            landslideYear={landslideYear}
                            yearClicked={yearClicked}
                            getPolygon={getPolygon}
                            cidata={ci}
                            chartReset={chartReset}
                            handlechartReset={handlechartReset}
                            handleDrawSelectedData={handleDrawSelectedData}
                            hideCI={hideCILegends}
                            criticalElement={criticalElement}
                            polygonResponse={polygonResponse}
                            hideOSMLayers={hideOSMLayers}
                        />
                    </>
                )


            }

            <Spring
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}
                config={
                    { duration: 1000,
                        delay }
                }
                onStart={handleAnimationStart}
                reset={reAnimate}
            >
                {
                    springProps => (

                        <LeftPaneContainer render={props => (
                            <div className={styles.leftPane}>
                                {
                                    currentPage === 0
                                    && (
                                        <LeftPane1
                                            data={props}
                                            incidentsCount={incidents.length}
                                            livesLost={livesLost}
                                            currentPage={currentPage}
                                        />
                                    )
                                }
                                {
                                    currentPage === 1
                                    && (
                                        // <LeftPane2
                                        //     data={props}
                                        // />
                                        <LeftPane1
                                            data={props}
                                            currentPage={currentPage}
                                            incidentsCount={incidents.length}
                                            livesLost={livesLost}
                                        />
                                    )
                                }
                                {
                                    currentPage === 2
                                    && (
                                        <LeftPane3
                                            data={props}
                                        />
                                    )
                                }
                                {
                                    currentPage === 3
                                    && (
                                        <LeftPane4
                                            data={props}
                                        />
                                    )
                                }
                                {
                                    currentPage === 4
                                    && (
                                        <LeftPane5
                                            data={props}
                                        />
                                    )
                                }
                                {
                                    currentPage === 5
                                    && (
                                        <LeftPane6
                                            data={props}
                                            ci={ci}
                                        />
                                    )
                                }
                                {
                                    currentPage === 6
                                    && (
                                        <LeftPane7
                                            data={props}
                                            ci={ci}
                                            incidentFilterYear={incidentFilterYear}
                                            bahrabiseLandSlide={incidents}
                                            landSlide={bahrabiseIncidents}

                                        />
                                    )
                                }
                                {
                                    currentPage === 7
                                    && (
                                        <LeftPane8
                                            data={props}
                                            ci={ci}
                                            incidentFilterYear={incidentFilterYear}
                                            bahrabiseLandSlide={incidents}
                                            landSlide={bahrabiseIncidents}
                                            landslideYear={landslideYear}
                                            drawData={drawData}
                                            chartReset={chartReset}
                                            polygonResponse={polygonResponse}
                                        />
                                    )
                                }
                                {
                                    currentPage === 8
                                    && (
                                        <LeftPane9
                                            data={props}
                                            ci={ci}
                                            incidentFilterYear={incidentFilterYear}
                                            bahrabiseLandSlide={incidents}
                                            landSlide={bahrabiseIncidents}
                                            landslideYear={landslideYear}
                                            drawData={drawData}
                                            chartReset={chartReset}
                                            polygonResponse={polygonResponse}
                                        />
                                    )
                                }
                                {
                                    currentPage === 9
                                    && (
                                        <LeftPane10
                                            data={props}
                                            ci={ci}
                                            incidentFilterYear={incidentFilterYear}
                                            bahrabiseLandSlide={incidents}
                                            landSlide={bahrabiseIncidents}
                                            landslideYear={landslideYear}
                                            drawData={drawData}
                                            chartReset={chartReset}
                                            pending={pending}
                                            buildingCount={buildingCount}
                                            overallBuildingsCount={defaultBuildcount}
                                        />
                                    )
                                }
                                <NavButtons
                                    handleNext={handleNext}
                                    handlePrev={handlePrev}
                                    pagenumber={currentPage + 1}
                                    totalPages={leftElements.length}
                                    pending={pending}
                                    idle={idle}
                                />
                            </div>
                        )}
                        />
                    )

                }
            </Spring>

            {currentPage === 4
                && (
                    <DemographicsLegends
                        handlePopulationChange={handlePopulationChange}
                        legends={DemoData.demographicsLegends}
                    />
                )
            }
            {currentPage === 3
                && (
                    <LandCoverLegends
                        legends={LandCoverData.landcoverLegends}
                    />
                )
            }
            {currentPage === 5
                && (
                    <CriticalInfraLegends
                        handlePopulationChange={handlePopulationChange}
                        handleCritical={handleCritical}
                        criticalElement={criticalElement}
                        hide={false}
                        right
                        showHelipad
                    />
                )
            }
            {currentPage === 6
                && (
                    <LandslideLegend />

                )
            }
            {currentPage === 7
                && (
                    <>
                        <InventoryLegend
                            handleYearSelect={handleYearSelect}
                        />
                        <CISwitchLegends
                            handleCIChange={handleCIChange}
                            handlehideCILegends={handlehideCILegends}
                            handlehideOSMLayers={handlehideOSMLayers}
                            hideCILegends={hideCILegends}
                            hideOSMLayers={hideOSMLayers}
                            showOSMSwitch
                        />
                        <CriticalInfraLegends
                            handlePopulationChange={handlePopulationChange}
                            handleCritical={handleCritical}
                            criticalElement={criticalElement}
                            hide={hideCILegends}
                            showHelipad
                        />
                    </>
                )
            }
            {currentPage === 8
                && (
                    <>
                        <InventoryLegend
                            handleYearSelect={handleYearSelect}
                        />
                        <CISwitchLegends
                            hideCILegends={hideCILegends}
                            handleCIChange={handleCIChange}
                            handlehideOSMLayers={handlehideOSMLayers}
                            handlehideCILegends={handlehideCILegends}
                            hideOSMLayers={hideOSMLayers}
                            showOSMSwitch

                        />
                        <CriticalInfraLegends
                            handlePopulationChange={handlePopulationChange}
                            handleCritical={handleCritical}
                            criticalElement={criticalElement}
                            hide={hideCILegends}
                            showHelipad
                        />

                    </>
                )
            }
            {currentPage === 9
                && (
                    <>
                        <CISwitchLegends
                            hideCILegends={hideCILegends}
                            handleCIChange={handleCIChange}
                            handlehideCILegends={handlehideCILegends}
                        />
                        <CriticalInfraLegends
                            handlePopulationChange={handlePopulationChange}
                            handleCritical={handleCritical}
                            criticalElement={criticalElement}
                            hide={hideCILegends}
                            showHelipad
                        />
                    </>
                )
            }
            {Object.keys(legendList).indexOf(currentPage.toString()) !== -1
                ? <Legends page={currentPage} />
                : ''
            }

        </>
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(BarabiseLandslide);
