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
import {
    Bar, BarChart,
    CartesianGrid, Legend,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import Deck from './Deck';
// import Map from './MapOriginal';
import Legends from './Components/Legends';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { getSanitizedIncidents } from '#views/LossAndDamage/common';
import { hazardTypesList,
    incidentPointToGeojsonVR,
    getWardFilter } from '#utils/domain';

import { hazardTypesSelector,
    incidentListSelectorIP,
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
import Narratives from './Narratives';
import legendList from './Components/Legends/legends';
import chartData from './Data/demographicsData';
import CriticalInfraLegends from './Components/CriticalInfraLegends';
import LeftPaneContainer from '../Common/LeftPaneContainer';
import NavButtons from '../Common/NavButtons';
import LeftPane1 from './Narratives/LeftPane1';
import LeftPane2 from './Narratives/LeftPane2';
import LeftPane3 from './Narratives/LeftPane3';

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
// const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
//     incidentsGetRequest: {
//         url: '/incident/',
//         method: methods.GET,
//         // We have to transform dateRange to incident_on__lt and incident_on__gt
//         query: () => {
//             const filters = {
//                 region: {},
//                 hazard: [17],
//                 dataDateRange: {
//                     rangeInDays: 'custom',
//                     startDate: '2011-01-01',
//                     endDate: '2021-01-01',
//                 },
//             };
//             return ({
//                 ...transformFilters(filters),
//                 expand: ['loss', 'event', 'wards'],
//                 ordering: '-incident_on',
//                 limit: -1,
//             });
//         },
//         onSuccess: ({ response, props: { setIncidentList } }) => {
//             interface Response { results: PageType.Incident[] }
//             const { results: incidentList = [] } = response as Response;
//             setIncidentList({ incidentList });
//         },
//         onMount: true,
//         onPropsChanged: {
//             filters: ({
//                 props: { filters },
//                 prevProps: { filters: prevFilters },
//             }) => {
//                 const shouldRequest = filters !== prevFilters;

//                 return shouldRequest;
//             },
//         },
//         // extras: { schemaName: 'incidentResponse' },
//     },
// };


const leftElements = [
    <LeftPane1 />,
    <LeftPane2 />,
    <LeftPane3 />,

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
    const {
        // incidentList,
        hazardTypes,
        regions,
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

    const handleChangeViewState = ({ viewState }) => setViewState(viewState);
    const handleFlyTo = (destination) => {
        setViewState({
            ...viewState,
            ...destination,
            transitionDuration: 3000,
            transitionInterpolator: new FlyToInterpolator(),
        });
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

    return (
        <>
            {
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
                />
            }

            {/* <NavButtons
                getPage={setPage}
                maxPage={Object.keys(Narratives).length}
                setDestination={setDestinationhandle}
            /> */}
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

                        <LeftPaneContainer render={p => (
                            <div className={styles.leftPane}>
                                {leftElements[currentPage]}
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
                    <div className={styles.chartDiv}>
                        <ResponsiveContainer width="70%" height={'80%'}>
                            <BarChart
                            // width={1000}
                            // height={1000}
                                data={chartData.demographicsData}
                                layout="vertical"
                                margin={{ top: 30, bottom: 10, right: 20, left: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tick={{ fill: '#94bdcf' }} />
                                <YAxis type="category" dataKey="name" tick={{ fill: '#94bdcf' }} />
                                <Tooltip />
                                {/* <Legend /> */}
                                {/* <Legend iconType="square" iconSize={10}
                            align="center" content={this.renderLegend} /> */}
                                <Bar dataKey="MalePop" stackId="a" fill="#ffbf00" />
                                <Bar dataKey="FemalePop" stackId="a" fill="#00d725" />
                                <Bar dataKey="TotalHousehold" fill="#347eff" />
                                {/* <Bar background label dataKey="foo" fill="#8884d8" /> */}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : ''
            }
            {currentPage === 6
                ? (
                    <CriticalInfraLegends />
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
    // createConnectedRequestCoordinator<ReduxProps>(),
    // createRequestClient(requests),
)(BarabiseLandslide);
