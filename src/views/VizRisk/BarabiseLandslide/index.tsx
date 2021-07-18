/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Anime from 'react-anime';

import {
    _cs,
    Obj,
    listToMap,
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
import ItemDrag from '#rscv/SortableListView/ListView/ListItem/ItemDrag';
import legendList from './Components/Legends/legends';
import chartData from './Data/demographicsData';
import LeftPaneContainer from '../Common/LeftPaneContainer';
import DemographicsLegends from '../Common/Legends/DemographicsLegends';
import CriticalInfraLegends from '../Common/Legends/CriticalInfraLegends';
import NavButtons from '../Common/NavButtons';
import LeftPane1 from './Narratives/LeftPane1';
import LeftPane2 from './Narratives/LeftPane2';
import LeftPane3 from './Narratives/LeftPane3';
import LeftPane4 from './Narratives/LeftPane4';
import LeftPane5 from './Narratives/LeftPane5';
import LeftPane6 from './Narratives/LeftPane6';
import LeftPane7 from './Narratives/LeftPane7';

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
                region: {},
                hazard: [17],
                dataDateRange: {
                    rangeInDays: 'custom',
                    startDate: '2011-01-01',
                    endDate: '2021-01-01',
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
            setIncidentList({ incidentList });
        },
        onMount: false,
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
    ciRequest: {
        url: '/resource/',
        method: methods.GET,
        // We have to transform dateRange to incident_on__lt and incident_on__gt
        query: () => ({
            municipality: 23002,
        }),
        onSuccess: ({ params, response }) => {
            interface Response { results: PageType.Incident[] }
            const { results: incidentList = [] } = response as Response;
            params.handleCI(incidentList);
        },
        onMount: true,
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

];

const BarabiseLandslide = (props) => {
    const [landSlidePoints, setlandSlidePoints] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [destination, setDestination] = useState(1);
    const [location, setLocation] = useState(Locations.nepal);
    const [viewState, setViewState] = useState(Locations.nepal);
    const [transitionEnd, setTransitionEnd] = useState(false);
    const [reAnimate, setReanimate] = useState(false);
    const [delay, setDelay] = useState(4000);
    const [showDemoChart, setShowDemoChart] = useState(true);
    const [disableNavRightBtn, setdisableNavRightBtn] = useState(false);
    const [disableNavLeftBtn, setdisableNavLeftBtn] = useState(false);
    const [pending, setPending] = useState(false);
    const handleChangeViewChange = ({ viewState }) => setViewState(viewState);
    const [population, setPopulation] = useState('ward');
    const [criticalElement, setCriticalElement] = useState('all');
    const [ci, setCI] = useState([]);
    const [incidentFilterYear, setincidentFilterYear] = useState('2011');
    const {
        // incidentList,
        hazardTypes,
        regions,
        requests: {
            ciRequest,
        },
    } = props;
    const handleAnimationStart = () => setReanimate(false);
    const getSanitizedIncident = memoize(getSanitizedIncidents);
    // eslint-disable-next-line no-shadow
    const setDestinationhandle = destination => setDestination(destination);
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
    const setPage = (val: number) => {
        setCurrentPage(val);
        setReanimate(true);
    };
    const handleCI = (data) => {
        setCI(data);
        console.log('CI:', data);
    };

    ciRequest.setDefaultParams({
        handleCI,
    });
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

    const disableNavBtns = (val) => {
        if (val === 'Right') {
            setdisableNavRightBtn(true);
        } else if (val === 'Left') {
            setdisableNavLeftBtn(true);
        } else {
            setdisableNavLeftBtn(true);
            setdisableNavRightBtn(true);
        }
    };

    const enableNavBtns = (val) => {
        if (val === 'Right') {
            setdisableNavRightBtn(false);
        } else if (val === 'Left') {
            setdisableNavLeftBtn(false);
        } else {
            setdisableNavLeftBtn(false);
            setdisableNavRightBtn(false);
        }
    };

    const handleNext = () => {
        if (currentPage < leftElements.length) {
            setCurrentPage(currentPage + 1);
            disableNavBtns('both');
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            disableNavBtns('both');
        }
    };

    const handleCritical = (data) => {
        setCriticalElement(data);
    };

    const handleIncidentChange = (incidentYear) => {
        const y = `${Number(incidentYear) + 2011}`;
        setincidentFilterYear(y);
    };

    return (
        <>
            {
                (currentPage < 4)
                && (
                    <Deck
                        librariesData={librariesData}
                        location={location}
                        viewState={viewState}
                        onViewStateChange={handleChangeViewState}
                        libraries={LandslideData.librariesData}
                        bahrabiseLandSlide={LandslideData.bahrabiseLandSlide}
                        currentPage={currentPage}
                        handleFlyTo={handleFlyTo}
                        setNarrationDelay={setNarrationDelay}
                        ci={ci}
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
                currentPage === 6

                && (
                    <MapWithTimeline
                        bahrabiseLandSlide={LandslideData.bahrabiseLandSlide}
                        handleIncidentChange={handleIncidentChange}
                    />
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
                                        />
                                    )
                                }
                                {
                                    currentPage === 1
                                    && (
                                        <LeftPane2
                                            data={props}
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
                                        />
                                    )
                                }
                                <NavButtons
                                    handleNext={handleNext}
                                    handlePrev={handlePrev}
                                    pagenumber={currentPage + 1}
                                    totalPages={leftElements.length}
                                    pending={pending}
                                />
                            </div>
                        )}
                        />
                    )

                }
            </Spring>

            {currentPage === 4
                ? (
                    <DemographicsLegends
                        handlePopulationChange={handlePopulationChange}
                    />
                ) : ''
            }
            {currentPage === 5
                ? (
                    <CriticalInfraLegends
                        handlePopulationChange={handlePopulationChange}
                        handleCritical={handleCritical}
                        criticalElement={criticalElement}
                    />
                ) : ''
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
