/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Loader from 'react-loader';
import { _cs } from '@togglecorp/fujs';
import Page from '#components/Page';
import { calendarData as cd, defaultValues } from '#views/IBF/utils';
import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods, NewProps } from '#request';
import { setIbfPageAction } from '#actionCreators';
import { ibfPageSelector, userSelector } from '#selectors';
import { AppState } from '#types';
import { IbfPage } from '#store/atom/page/types';
import { User } from '#store/atom/auth/types';
import Dashboard from './Dashboard';
import ForDrag from './Components/ForDrag';

import Navigation from './Components/Navigation';
import Map from './Map';
// import Calendar from './Calender';
import style from './styles.scss';


// for testing
import testStations from './Api/stationsList';
import testStationDetail from './Api/stationDetail';


import Legend from './Legend';
// import SourceCon from './SourceCon';
import RiskAndImpactCon from './RiskAndImpactCon';
import SummaryCon from './SummaryCon';
import Filter from './Filter';
import LegendDrag from './Components/LegendDrag';
import HouseForm from './Components/HouseForm';
import { getRequest } from './Requests/apiCalls';
import { calculation } from './Components/RiskAndImpact/expression';
// import HouseForm from './Components/HouseForm';

interface OwnProps {

}
export interface PropsFromState {
    ibfPage: IbfPage;
    user: User;
}

export interface PropsFromDispatch {
    setIbfPage: typeof setIbfPageAction;
}

interface Params {
    setPending: React.Dispatch<React.SetStateAction<boolean>>;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;

type Props = NewProps<ReduxProps, Params>

const mapStateToProps = (state: AppState): PropsFromState => ({
    ibfPage: ibfPageSelector(state),
    user: userSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    floodStations: {
        url: '/flood-station/',
        method: methods.GET,
        onMount: false,
        query: () => ({
            format: 'geojson',
        }),
        onSuccess: ({ response, props, params }) => {
            props.setIbfPage({ stations: response });
            if (params) {
                params.setPending(false);
            }
        },
    },

    stationDetail: {
        url: '/station-location/',
        method: methods.GET,
        onMount: false,
        query: () => ({
            format: 'json',
        }),
        onSuccess: ({ response, props, params }) => {
            props.setIbfPage({ stationDetail: response });
            if (params) {
                params.setPending(false);
            }
        },
    },

};

const Ibf = (props: Props) => {
    const {
        ibfPage: {
            stations,
            stationDetail,
            selectedStation,
            filter,
            indicators,
            wtChange,
            householdJson,
            householdTemp,
            weights,
        },
        setIbfPage,
        user,
    } = props;

    const [pending, setPending] = useState(false);
    const [viewDashboard, setDashboard] = useState(false);
    const [widthToggle, setWidthToggle] = useState(false);
    const [isDemo, setIsDemo] = useState(true);
    const [isSelectionActive, setMapSelectionActive] = useState(false);
    const [coordinates, setCoordinates] = useState({});
    const [isFormOpen, setFormOpen] = useState(false);
    const [editValue, setEditState] = useState({});
    // console.log('stations-selectedStations', stations, selectedStation);


    let calendar;

    const reset = () => {
        props.setIbfPage({
            selectedStation: {},
            returnPeriod: 0,
            leadTime: 0,
            overallFloodHazard: [],
            filter: { district: '', municipality: '', ward: [] },
            householdJson: [],
            householdTemp: [],
            showHouseHold: 0,
            selectedIndicator: '',
            householdDistrictAverage: {},
            selectedLegend: '',
            indicators: [],
            wtChange: 0,
            weights: [],
        });
    };

    // const getMunicipalityId = (munArray) => {
    //     const munExposed = munArray.map(munItem => munItem.id);
    //     const munString = munExposed.join(',');
    //     return munString;
    // };

    useEffect(() => {
        if (viewDashboard) {
            if (isDemo) {
                props.setIbfPage({ stations: testStations });
                props.setIbfPage({ stationDetail: testStationDetail });
                if (stations.features) {
                    calendar = cd(stations, selectedStation);
                    props.setIbfPage({ calendarData: calendar });
                }
            }

            if (!isDemo) {
                setPending(true);
                props.requests.stationDetail.do();
                props.requests.floodStations.do({ setPending });
            }
        }

        return function cleanup() {
            reset();
        };
    }, [isDemo, viewDashboard]);


    useEffect(() => {
        if (stations && stations.features) {
            calendar = cd(stations, selectedStation);
            props.setIbfPage({ calendarData: calendar });
        }
    }, [stations, selectedStation]);

    // console.log('household-json__check', householdJson, householdJson.map((jsonData: any) => jsonData.incomeSource));

    useEffect(() => {
        const getCall = async () => {
            if (filter.municipality) {
                props.setIbfPage({ householdJson: [] });
                setPending(true);
                const indicatorData = await getRequest(
                    'ibf-vulnerability-indicator',
                    {
                        // municipality: getMunicipalityId(filter.municipality),
                        municipality: String(filter.municipality),
                    },
                );
                const houseData = await getRequest(
                    'ibf-households',
                    {
                        limit: -1,
                        municipality: String(filter.municipality),
                    },
                    user,
                );
                setPending(false);
                const calculatedData = calculation(houseData.results, indicatorData.results);
                const { averageDatas, houseHoldDatas, weight_Data } = calculatedData[0];

                // const modifiedHouseData = houseDataKeyModifier(houseHoldDatas);
                setIbfPage({
                    weights: weight_Data,
                });
                setIbfPage({
                    indicators: indicatorData.results,
                });
                setIbfPage({
                    householdDistrictAverage: averageDatas,
                });
                setIbfPage({
                    householdJson: houseHoldDatas,
                });
                setIbfPage({
                    householdTemp: houseHoldDatas,
                });
            }
        };
        getCall();
    }, [filter.municipality]);

    useEffect(() => {
        if (filter.ward.length > 0) {
            const tempWard = filter.ward.map(wardItem => wardItem.id);
            const wardHouseData = [...householdTemp];
            const wardLevelHouseData = wardHouseData.filter(houseData => tempWard.includes(houseData.ward));
            const calculatedData = calculation(wardLevelHouseData, indicators);
            const { averageDatas, houseHoldDatas, weight_Data } = calculatedData[0];
            setIbfPage({
                weights: weight_Data,
            });
            setIbfPage({
                householdDistrictAverage: averageDatas,
            });
            setIbfPage({
                householdJson: houseHoldDatas,
            });
        } else {
            setIbfPage({
                householdJson: householdTemp,
            });
        }
    }, [filter.ward.length]);

    useEffect(() => {
        const getCall = async () => {
            if (wtChange === 1) {
                setPending(true);
                const indicatorData = await getRequest(
                    'ibf-vulnerability-indicator',
                    {
                        municipality: String(filter.municipality),
                    },
                );
                setPending(false);

                const calculatedData = calculation(householdJson, indicatorData.results);
                const { averageDatas, houseHoldDatas, weight_Data } = calculatedData[0];

                // const modifiedHouseData = houseDataKeyModifier(houseHoldDatas);
                setIbfPage({
                    weights: weight_Data,
                });
                setIbfPage({
                    householdDistrictAverage: averageDatas,
                });
                setIbfPage({
                    householdJson: houseHoldDatas,
                });
                // setIbfPage({
                //     wtChange: 0,
                // });
            }
        };
        getCall();
    }, [wtChange]);


    const dashboardViewHandler = () => {
        setDashboard(true);
    };

    const handleWidthToggle = (bool) => {
        setWidthToggle(bool);
    };

    const mapSelectHandler = (bool) => {
        setMapSelectionActive(bool);
    };

    const getEditHouseValue = (stateValue) => {
        const coord = {
            lng: stateValue.data.longitude.value,
            lat: stateValue.data.latitude.value,
        };
        setCoordinates(coord);
        setEditState(stateValue);
        setFormOpen(true);
    };

    return (
        <>
            <Page hideFilter hideMap />
            <div className={style.ibfContainer}>
                {!viewDashboard && <Dashboard dashboardViewHandler={dashboardViewHandler} />}
                {pending
                    && (
                        <div className={style.loader}>
                            <Loader color="white" />
                        </div>
                    )
                }
                {(stations.features && Object.keys(stationDetail).length > 0)
                    && (
                        <>
                            <Navigation
                                setFormOpen={setFormOpen}
                            />
                            {isSelectionActive
                                && (
                                    <div
                                        className={_cs(
                                            style.mapSelection,
                                            isSelectionActive ? style.fadeIn : style.fadeOut,
                                        )}
                                    >
                                        Map Selection On
                                    </div>
                                )}
                            {viewDashboard && (
                                <>
                                    {/* {
                                        !isFormOpen && (
                                            <> */}
                                    {
                                        (
                                            Object.keys(selectedStation).length > 0
                                            && selectedStation.properties
                                            && Object.keys(selectedStation.properties).length > 0
                                            && selectedStation.properties.has_household_data
                                            && selectedStation.properties.has_household_data
                                        )
                                            ? <Filter isFormOpen={isFormOpen} />
                                            : ''
                                    }
                                    {/* </>
                                        )
                                    } */}

                                    <Map
                                        isSelectionActive={isSelectionActive}
                                        setCoordinates={setCoordinates}
                                        setFormOpen={setFormOpen}
                                        getEditHouseValue={getEditHouseValue}
                                    />
                                    {!isFormOpen && (
                                        <>
                                            {
                                                Object.keys(selectedStation).length > 0 && (
                                                    <>
                                                        {
                                                            filter.district && (
                                                                <ForDrag
                                                                    widthToggle={widthToggle}
                                                                    defaultPosition={
                                                                        defaultValues.summaryDefaultPosition
                                                                    }
                                                                >
                                                                    <SummaryCon
                                                                        handleWidthToggle={
                                                                            handleWidthToggle
                                                                        }
                                                                    />
                                                                </ForDrag>
                                                            )
                                                        }
                                                        {
                                                            filter.municipality && (
                                                                <ForDrag
                                                                    widthToggle={widthToggle}
                                                                    defaultPosition={
                                                                        defaultValues.impactDefaultPosition
                                                                    }
                                                                >
                                                                    <RiskAndImpactCon
                                                                        handleWidthToggle={
                                                                            handleWidthToggle
                                                                        }
                                                                    />
                                                                </ForDrag>
                                                            )
                                                        }
                                                    </>
                                                )
                                            }
                                            {/* <ForDrag
                                                widthToggle={widthToggle}
                                                defaultPosition={defaultValues.sourceDefaultPosition}
                                            >
                                                <SourceCon
                                                    handleWidthToggle={handleWidthToggle}
                                                />
                                            </ForDrag> */}
                                        </>
                                    )}
                                    <LegendDrag
                                        defaultPosition={defaultValues.legendDefaultPosition}
                                    >
                                        <Legend />
                                    </LegendDrag>
                                    {/* <Calendar /> */}
                                    {
                                        isFormOpen && (
                                            <ForDrag
                                                widthToggle={widthToggle}
                                                defaultPosition={
                                                    defaultValues.householdFormPosition
                                                }
                                            >
                                                <HouseForm
                                                    mapSelectHandler={mapSelectHandler}
                                                    coordinates={coordinates}
                                                    setCoordinates={setCoordinates}
                                                    setFormOpen={setFormOpen}
                                                    editValue={editValue}
                                                    setEditState={setEditState}
                                                />
                                            </ForDrag>
                                        )
                                    }
                                </>
                            )}

                        </>
                    )
                }
                <button type="button" onClick={() => setIsDemo(prev => !prev)} className={style.invisibleBtn} />
            </div>
        </>
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(Ibf);
