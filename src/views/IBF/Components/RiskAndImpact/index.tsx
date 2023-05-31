/* eslint-disable prefer-const */
/* eslint-disable space-infix-ops */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Redux, { compose } from 'redux';
import { _cs } from '@togglecorp/fujs';
import { districtsSelector, ibfPageSelector, municipalitiesSelector, wardsSelector } from '#selectors';
import { setIbfPageAction } from '#actionCreators';
import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods, NewProps } from '#request';
import { AppState } from '#types';


import Cross from '#resources/icons/IbfCross.svg';
import { PropsFromDispatch, PropsFromState } from '#views/IBF';
import { District, Municipality, Ward } from '#store/atom/page/types';
import style from './styles.scss';
import CountLegend from '../CountLegend';
import ExistingRisk from '../ExistingRisk';
import PotentiallyImpacted from '../PotentiallyImpacted';
import PotentiallyExposed from '../PotentiallyExposed';
import { calculation, getImpactedValue } from './expression';

interface OwnProps {
    riskClassName: string;
    setToggleRisk: React.Dispatch<React.SetStateAction<boolean>>;
    toggleRisk: boolean;
    handleWidth: (bool: boolean) => void;
}

interface PropsFromRiskImpactState extends PropsFromState {
    district: District[];
    municipality: Municipality[];
    ward: Ward[];
}

interface Params {
    returnPeriod: number;
    municipality: string;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromRiskImpactState

type Props = NewProps<ReduxProps, Params>

const mapStateToProps = (state: AppState): PropsFromRiskImpactState => ({
    ibfPage: ibfPageSelector(state),
    district: districtsSelector(state),
    municipality: municipalitiesSelector(state),
    ward: wardsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    floodHazard: {
        url: '/osm-meteor-flood-hazard/',
        method: methods.GET,
        onMount: true,
        query: ({ params }) => ({
            format: 'json',
            summary: true,
            return_period: params && params.returnPeriod,
            // district: params.district,
            municipality: params && params.municipality,
        }),
        onSuccess: ({ props, response }) => {
            props.setIbfPage({ overallFloodHazard: [response] });
        },
    },
};

const RiskAndImpact = (props: Props) => {
    const [isCountActive, setCountActive] = useState(false);
    const [impactedValue, setImpactedValue] = useState({});
    const [contentShowingParam, setContent] = useState('risk');

    // const [houseHoldData, setHouseHoldData] = useState([]);
    // const [indicators, setIndicators] = useState([]);
    // const [averageData, setAverageData] = useState({});


    const { ibfPage,
        riskClassName,
        toggleRisk,
        setToggleRisk,
        handleWidth,
        setIbfPage } = props;

    const {
        selectedStation,
        stationDetail,
        returnPeriod,
        overallFloodHazard,
        filter,
        filter: { municipality },
        householdJson,
        selectedIndicator,
    } = ibfPage;

    const riskAndImpactParams = [
        {
            btnName: 'Existing Risk',
            btnActive: 'risk',
            countActive: true,
        },
        {
            btnName: 'Potentially Exposed',
            btnActive: 'exposed',
            countActive: false,
        },
        {
            btnName: 'Potentially Impacted',
            btnActive: 'impacted',
            countActive: true,
        },
    ];

    const filteredRiskAndImpactParams = returnPeriod ? riskAndImpactParams : riskAndImpactParams.slice(0, 1);

    const setSelectedIndicator = (value) => {
        setIbfPage({ selectedIndicator: value });
    };

    const getMunicipalityIdString = (munArray) => {
        const munExposed = munArray.length > 0 && munArray.map(munItem => munItem.id);
        const munString = munExposed.join(',');
        return munString;
    };

    const mystationdata = stationDetail.results.filter(item => item.station === selectedStation.id);

    const impactedHandler = () => {
        setIbfPage({ showHouseHold: 1 });
        setImpactedValue({});
        if (returnPeriod) {
            setSelectedIndicator('impactScore');
        }
    };
    const riskHandler = () => {
        setIbfPage({ showHouseHold: 1 });
        setSelectedIndicator('risk');
    };

    const btnClickHandler = (activeValue, countActive) => {
        setContent(activeValue);
        setCountActive(countActive);
        if (countActive) {
            if (activeValue === 'impacted') {
                impactedHandler();
            }
            if (activeValue === 'risk') {
                riskHandler();
            }
        } else {
            setIbfPage({ showHouseHold: 0 });
        }
    };

    const impactedValueHandler = (indicatorValue, countValue) => {
        getImpactedValue(indicatorValue, countValue, setImpactedValue);
    };

    const resetHandler = () => {
        setContent('risk');
        setCountActive(false);
        setToggleRisk(true);
        handleWidth(true);
        setSelectedIndicator('');
        setIbfPage({ showHouseHold: 0 });
    };
    // useEffect(() => {
    //     if (filter.municipality.length > 0) {
    //         setIbfPage({ selectedIndicator: 'risk' });
    //         setIbfPage({ showHouseHold: 1 });
    //     }
    // }, [filter.municipality.length]);

    useEffect(() => {
        if (contentShowingParam === 'risk') {
            setSelectedIndicator('risk');
            setIbfPage({ showHouseHold: 1 });
            setCountActive(true);
        }
        if (returnPeriod !== 0) {
            props.requests.floodHazard.setDefaultParams({
                returnPeriod,
                municipality: getMunicipalityIdString(filter.municipality) || '',
            });
            props.requests.floodHazard.do();
        }
    }, [returnPeriod]);


    return (
        <>
            <div
                className={_cs(
                    style.container,
                    riskClassName,
                    toggleRisk ? style.hidden : style.visible,
                )}
            >
                <div className={style.btnContainer}>
                    {
                        filteredRiskAndImpactParams.length > 0 && filteredRiskAndImpactParams.map(({ btnName, btnActive, countActive }) => (
                            <button
                                key={btnName}
                                type="button"
                                className={_cs(style.button, contentShowingParam === btnActive && style.activeBtnStyle)}
                                onClick={() => {
                                    btnClickHandler(btnActive, countActive);
                                }}
                            >
                                {btnName}
                            </button>
                        ))
                    }
                </div>
                <div className={style.mainContentContainer}>
                    {
                        contentShowingParam === 'risk'
                        && (
                            (householdJson.length > 0 && filter.municipality.length > 0)
                            && (
                                <ExistingRisk
                                    // contentShowingParam={contentShowingParam}
                                    setCountActive={setCountActive}
                                />
                            )
                        )
                    }
                    {
                        contentShowingParam === 'exposed'
                        && (
                            (returnPeriod && returnPeriod !== 0 && mystationdata.length > 0)
                            && (
                                <PotentiallyExposed
                                    overallFloodHazard={overallFloodHazard}
                                />
                            )
                        )
                    }
                    {
                        contentShowingParam === 'impacted'
                        && (
                            (householdJson.length > 0 && returnPeriod && returnPeriod !== 0)
                            && (
                                <PotentiallyImpacted
                                    impactedValue={impactedValue}
                                    setImpactedValue={setImpactedValue}
                                />
                            )
                        )
                    }
                </div>
                <button
                    type="button"
                    style={{ opacity: toggleRisk ? 0 : 1 }}
                    className={style.closeBtn}
                    onClick={resetHandler}
                >
                    <img src={Cross} alt="cross" />
                </button>
                {isCountActive && (
                    <CountLegend
                        isActive={contentShowingParam}
                        getImpactedValue={impactedValueHandler}
                    />
                )}
            </div>
        </>

    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(RiskAndImpact);
