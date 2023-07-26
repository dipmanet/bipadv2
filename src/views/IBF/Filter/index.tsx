/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import ReactDOMServer from 'react-dom/server';
import { _cs } from '@togglecorp/fujs';
import IbfDownArrow from '#resources/icons/IbfDownArrow.svg';
import { setIbfPageAction } from '#actionCreators';
import { districtsSelector, ibfPageSelector, municipalitiesSelector, wardsSelector } from '#selectors';
import Icon from '#rscg/Icon';
import { AppState } from '#types';
import { District, Municipality, Ward } from '#store/atom/page/types';
import style from './styles.scss';
import { PropsFromDispatch, PropsFromState } from '..';

interface OwnProps {
    isFormOpen: boolean;
}

interface PropsFromFilterState extends PropsFromState {
    district: District[];
    municipality: Municipality[];
    ward: Ward[];
}

type Props = OwnProps & PropsFromFilterState & PropsFromDispatch

const mapStateToProps = (state: AppState): PropsFromFilterState => ({
    ibfPage: ibfPageSelector(state),
    district: districtsSelector(state),
    municipality: municipalitiesSelector(state),
    ward: wardsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

const Filter = (props: Props) => {
    // const [selectedMun, setSelectedMun] = useState([]);
    const [disState, setDisState] = useState('selectDistrict');
    const [munState, setMunState] = useState('selectMunicipality');
    const [disBool, setDisBool] = useState(false);
    const [munBool, setMunBool] = useState(false);
    const [wardBool, setWardBool] = useState(false);

    // console.log('selectedMun,list,disState,disBool', selectedMun, list, disState, disBool);

    const {
        ibfPage,
        district,
        municipality,
        ward,
        isFormOpen,
    } = props;

    const
        {
            selectedStation,
            stationDetail,
            filter,
        } = ibfPage;

    const filterDisable = Object.keys(selectedStation).length > 0
        && selectedStation.properties
        && selectedStation.properties.has_household_data;

    console.log('selectedStation,stationDetail,filter,ward', selectedStation, stationDetail, filter, ward);

    const mystationdata = stationDetail.results
        .filter(item => item.station === selectedStation.id);

    const uniqueDistrict = [...new Set(mystationdata.map(item => item.district))];

    const disName = uniqueDistrict.map((i) => {
        console.log('i', i);
        const result = {};
        result.id = i;
        result.title = district.filter(item => item.id === i)[0].title;
        return result;
    });


    const uniqueMunicipality = [...new Set(mystationdata.map(item => item.municipality))];

    const munName = uniqueMunicipality.map((i) => {
        console.log('i', i);
        const result = {};
        result.id = i;
        result.title = municipality.filter(item => item.id === i)[0].title;
        return result;
    });

    const uniqueWard = [...new Set(mystationdata.map(item => item.ward))];
    console.log('uniqureWard', uniqueWard);

    const wardName = uniqueWard.map((i) => {
        const result = {};
        result.id = i;
        result.title = ward.filter(item => item.id === i)[0].title;
        result.municipalityId = ward.filter(item => item.id === i)[0].municipality;
        result.isChecked = false;
        return result;
    });

    // const refreshHandler = () => {
    //     props.setIbfPage({ filter: { district: '', municipality: [] } });
    //     setSelectedMun([]);
    //     setWardBool(false);
    //     const resetState = munState.length > 0 && munState.map((munItem) => {
    //         const munci = {
    //             ...munItem,
    //             isChecked: false,
    //         };
    //         return munci;
    //     });
    //     setMunState(resetState);
    //     setDisState('selectDistrict');
    //     setDisBool(false);
    // };

    // const handleCheckbox = (e, mun) => {
    //     const munic = {
    //         ...mun,
    //         isChecked: e.target.checked,
    //     };
    //     setMunState(prevState => [...prevState.filter(item => item.id !== mun.id), munic]);

    //     if (munic.isChecked) {
    //         setSelectedMun(prevState => [munic, ...prevState]);
    //     } else {
    //         setSelectedMun((prevState) => {
    //             const filteredMun = prevState.filter(data => data.id !== munic.id);
    //             return filteredMun;
    //         });
    //     }
    //     setWardBool(false);
    // };

    const handleDisState = (disObj) => {
        setDisState(disObj.title);
        setDisBool(false);
        props.setIbfPage({ filter: { district: disObj.id } });
    };

    const handleMunState = (munObj) => {
        setMunState(munObj.title);
        setMunBool(false);
        props.setIbfPage({ filter: { municipality: munObj.id } });
    };

    // useEffect(() => {
    //     props.setIbfPage({ filter: { municipality: selectedMun } });
    // }, [props, selectedMun]);

    // useEffect(() => {
    //     refreshHandler();
    //     // setMunState(munName);
    // }, [selectedStation]);


    return (
        <>
            {/* District Dropdown */}
            <div
                className={_cs(style.disContainer, isFormOpen && style.hideContainer)}
            >
                <button
                    style={{ cursor: !filterDisable && 'not-allowed' }}
                    className={style.disBtnDefault}
                    onClick={() => filterDisable && setDisBool(!disBool)}
                >
                    {disState === 'selectDistrict'
                        ? (<span className={style.disTitle}>Select District</span>)
                        : (<span className={style.disTitle}>{disState}</span>)}
                    <span className={style.arrowDown}>
                        <img src={IbfDownArrow} alt="downArrow" />
                    </span>
                </button>
                {filterDisable && disName.length > 0 && disBool && (
                    <div className={style.scrollCon}>
                        {
                            disName.length > 0 && disName.map(dis => (
                                <button
                                    key={dis.id}
                                    className={style.disBtnScroll}
                                    onClick={() => handleDisState(dis)}
                                >
                                    {dis.title}
                                </button>
                            ))
                        }
                    </div>
                )}
            </div>
            {/* Municipality Dropdown */}
            <div
                className={_cs(style.munContainer, isFormOpen && style.hideContainer)}
            >
                <div
                    className={style.selectBar}
                    onClick={() => filter.district && setMunBool(!munBool)}
                    data-html
                    data-tip={
                        ReactDOMServer.renderToString(
                            <div className={style.popup}>
                                Please select district first to view municipal level data
                            </div>,
                        )}
                    data-place="bottom"
                    data-offset="{ 'top': 60, 'left': 140 }"
                    data-background-color="transparent"
                >
                    <button
                        style={{ cursor: !filterDisable && 'not-allowed' }}
                        className={style.munBtnDefault}
                        onClick={() => filter.district && setMunBool(!munBool)}
                    >
                        {munState === 'selectMunicipality'
                            ? (<span className={style.munTitle}>Select Municipality</span>)
                            : (<span className={style.munTitle}>{munState}</span>)}
                        <span className={style.arrowDown}>
                            <img src={IbfDownArrow} alt="downArrow" />
                        </span>
                    </button>
                </div>
                {
                    filter.district === '' && (
                        <ReactTooltip />
                    )
                }
                {munName.length > 0 && munBool && (
                    <div className={style.scrollCon}>
                        {
                            munName.length > 0 && munName.map(mun => (
                                <button
                                    key={mun.id}
                                    className={style.munBtnScroll}
                                    onClick={() => handleMunState(mun)}
                                >
                                    {mun.title}
                                </button>
                            ))
                        }
                    </div>
                )}
            </div>
            {/* Ward Dropdown */}
            <div className={_cs(style.wardContainer, isFormOpen && style.hideContainer)}>
                <div
                    className={style.selectBar}
                    onClick={() => filter.municipality && setWardBool(!wardBool)}
                    data-html
                    data-tip={
                        ReactDOMServer.renderToString(
                            <div className={style.popup}>
                                Please select municipality first to view ward level data
                            </div>,
                        )}
                    data-place="bottom"
                    data-offset="{ 'top': 60, 'left': 140 }"
                    data-background-color="transparent"
                >
                    <div className={style.selectContent}>
                        <span>Select Ward</span>
                    </div>
                    <button type="button" className={style.arrowDown}>
                        <img src={IbfDownArrow} alt="downArrow" />
                    </button>
                </div>
                {
                    filter.district === '' && (
                        <ReactTooltip />
                    )
                }
                {
                    wardBool && (
                        <ul className={style.wardListContainer}>
                            {
                                wardName.length > 0 && wardName.map((wardItem: any) => (
                                    <li key={wardItem.id} className={style.munList}>
                                        <input
                                            type="checkbox"
                                            className={style.checkbox}
                                            id={wardItem.id}
                                            // onClick={e => handleCheckbox(e, mun)}
                                            checked={wardItem.isChecked}
                                        />
                                        <label
                                            htmlFor={wardItem.id}
                                            className={style.label}
                                        >
                                            {wardItem.title}
                                        </label>
                                        <button

                                            className={style.disBtnScroll}
                                            // onClick={() => handleDisState(dis)}
                                        >
                                            {wardItem.title}
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>
                    )
                }
            </div>
            {/* <button
            className={_cs(style.reset, isFormOpen && style.hideContainer)}
            type="button" onClick={refreshHandler}>
                <Icon
                    name="refresh"
                />
            </button> */}
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
