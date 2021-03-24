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
import Locations from './Deck/locations';
import {
    transformRegionToFilter,
    transformDataRangeLocaleToFilter,
} from '#utils/transformations';

import { FiltersElement } from '#types';
import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';


import {
    setIncidentListActionIP,
    setEventListAction,
} from '#actionCreators';
import NavButtons from './Components/NavButtons';
import styles from './styles.scss';
import LandslideData from './Deck/librariesData';
import ItemDrag from '#rscv/SortableListView/ListView/ListItem/ItemDrag';
import Narratives from './Narratives';
import legendList from './Components/Legends/legends';
import { flatVulnerabilityTypes } from '#views/RiskInfo/LeftPane/Details/Vulnerability/vulnerabilityTypes';

interface Params {
}

interface ComponentProps {
}

interface PropsFromDispatch {
    setIncidentList: typeof setIncidentListActionIP;
    setEventList: typeof setEventListAction;
}
interface PropsFromAppState {
    incidentList: PageType.Incident[];
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
    incidentList: incidentListSelectorIP(state),
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
console.log('just keys: ', Object.keys(legendList));
console.log('object: ', legendList);
const BarabiseLandslide = (props) => {
    const [landSlidePoints, setlandSlidePoints] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [destination, setDestination] = useState(1);
    const [location, setLocation] = useState(Locations.nepal);
    const [viewState, setViewState] = useState(Locations.nepal);
    const [transitionEnd, setTransitionEnd] = useState(false);
    const [reAnimate, setReanimate] = useState(false);
    const [delay, setDelay] = useState(10000);
    const handleChangeViewChange = ({ viewState }) => setViewState(viewState);
    const {
        incidentList,
        hazardTypes,
        regions,
    } = props;
    const handleAnimationStart = () => setReanimate(false);
    const getSanitizedIncident = memoize(getSanitizedIncidents);
    // eslint-disable-next-line no-shadow
    const setDestinationhandle = destination => setDestination(destination);

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

    const setPage = (val: number) => {
        setCurrentPage(val);
        setReanimate(true);
        setDelay(3000);
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
    return (
        <>
            {/* <Map
                incidentList={sanitizedIncidentList}
                hazardTypes={hazardTypes}
                page={currentPage}
            /> */}
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
                    // destination={destination}
                />

            }

            <NavButtons
                getPage={setPage}
                maxPage={3}
                setDestination={setDestinationhandle}
            />
            <Spring
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}
                config={
                    { duration: 2000,
                        delay }
                }
                onStart={handleAnimationStart}
                reset={reAnimate}
            >
                {
                    springProps => (
                        <div
                            style={{
                                opacity: springProps.opacity,
                            }}
                            className={styles.narrativesContainer}
                        >
                            {/* {Narratives.currentPage} */}
                            <div className={styles.narrativeTitle}>
                                {Narratives[currentPage].title}
                            </div>
                            <div className={styles.narrativeDescription}>
                                {Narratives[currentPage].description}
                            </div>
                        </div>
                    )

                }
            </Spring>
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
