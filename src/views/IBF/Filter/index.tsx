/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';
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
    const [disState, setDisState] = useState('selectDistrict');
    // const [filterHover, setFilterHover] = useState({
    //     municipality: true,
    //     ward: true,
    // });
    const [munState, setMunState] = useState('selectMunicipality');
    const [wardState, setWardState] = useState([]);
    const [disBool, setDisBool] = useState(false);
    const [munBool, setMunBool] = useState(false);
    const [wardBool, setWardBool] = useState(false);
    const disDropdownRef = useRef(null);
    const munDropdownRef = useRef(null);
    // const wardDropdownRef = useRef(null);


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


    const mystationdata = stationDetail.results
        .filter(item => item.station === selectedStation.id);

    const uniqueDistrict = [...new Set(mystationdata.map(item => item.district))];

    const disName = uniqueDistrict.map((i) => {
        const result = {};
        result.id = i;
        result.title = district.filter(item => item.id === i)[0].title;
        return result;
    });


    const uniqueMunicipality = [...new Set(mystationdata.map(item => item.municipality))];

    const munName = uniqueMunicipality.map((i) => {
        const result = {};
        result.id = i;
        result.title = municipality.filter(item => item.id === i)[0].title;
        return result;
    });

    const handleWardCheckbox = (e: any, wardItem: any) => {
        const wardData = {
            ...wardItem,
            isChecked: e.target.checked,
        };
        setWardState(prevState => [...prevState.filter(item => item.id !== wardItem.id), wardData]);
        // setWardBool(false);
    };

    const handleDisState = (disObj: any) => {
        setDisState(disObj.title);
        setDisBool(false);
        props.setIbfPage({ filter: { district: disObj.id } });
    };

    const handleMunState = (munObj: any) => {
        setMunState(munObj);
        setMunBool(false);
        props.setIbfPage({ filter: { municipality: munObj.id } });
    };

    const refreshHandler = () => {
        setDisState('selectDistrict');
        setDisBool(false);
        setMunState('selectMunicipality');
        setMunBool(false);
        setWardState([]);
        setWardBool(false);
        // setFilterHover({
        //     municipality: true, ward: true,
        // });
        props.setIbfPage({ filter: { district: '', municipality: '', ward: [] } });
    };

    useEffect(() => {
        if (munState !== 'selectMunicipality') {
            // const uniqueWard = mystationdata
            //     .filter((item: any) => item.municipality === munState.id)
            //     .map((mapItem: any) => mapItem.ward);
            const uniqueWard = ward
                .filter(wardItem => wardItem.municipality === munState.id)
                .map(item => item.id);

            const wardName = uniqueWard && uniqueWard.map((i) => {
                const result = {};
                result.id = i;
                result.title = ward.filter(item => item.id === i)[0].title;
                result.municipalityId = ward.filter(item => item.id === i)[0].municipality;
                result.isChecked = false;
                return result;
            });
            setWardState([...wardName]);
        }
    }, [munState]);

    useEffect(() => {
        if (wardState) {
            const toPushArray = wardState
                .filter(wardItem => wardItem && wardItem.isChecked === true);
            props.setIbfPage({ filter: { ward: toPushArray } });
        }
    }, [wardState]);

    // useEffect(() => {
    //     if (filter.district) {
    //         setFilterHover({ ...filterHover, municipality: true });
    //     }
    //     if (filter.municipality) {
    //         setFilterHover({ ...filterHover, ward: true });
    //     }
    // }, [filter.district, filter.municipality]);


    const handleDocumentClick = (event: any) => {
        if (disDropdownRef.current && !disDropdownRef.current.contains(event.target)) {
            setDisBool(false);
        }
        if (munDropdownRef.current && !munDropdownRef.current.contains(event.target)) {
            setMunBool(false);
        }
        // if (wardDropdownRef.current && !wardDropdownRef.current.contains(event.target)) {
        //     setWardBool(false);
        // }
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    return (
        <>
            {/* District Dropdown */}
            <div
                className={_cs(style.disContainer, isFormOpen && style.hideContainer)}
                ref={disDropdownRef}
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
                ref={munDropdownRef}

            >
                <div
                    className={style.selectBar}
                    onClick={() => filter.district && setMunBool(!munBool)}
                    data-html
                    data-tip={
                        ReactDOMServer.renderToString(
                            filter.district === ''
                                ? (
                                    <div className={style.popup}>
                                Please select district first to view municipal level data
                                    </div>
                                ) : (<span />),
                        )}
                    data-place="bottom"
                    data-offset="{ 'top': 60, 'left': 140 }"
                    data-background-color="transparent"
                >
                    <button
                        style={{ cursor: !filter.district && 'not-allowed' }}
                        className={style.munBtnDefault}
                        onClick={() => filter.district && setMunBool(!munBool)}
                    >
                        {munState === 'selectMunicipality'
                            ? (<span className={style.munTitle}>Select Municipality</span>)
                            : (<span className={style.munTitle}>{munState.title}</span>)}
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
            <div
                className={_cs(style.wardContainer, isFormOpen && style.hideContainer)}
                // ref={wardDropdownRef}
            >
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
                    <div
                        style={{ cursor: !filter.municipality && 'not-allowed' }}
                        className={style.selectContent}
                    >
                        <span>Select Ward</span>
                    </div>
                    <button type="button" className={style.arrowDown}>
                        <img src={IbfDownArrow} alt="downArrow" />
                    </button>
                </div>
                {
                    filter.district && filter.municipality === '' && (
                        <ReactTooltip />
                    )
                }
                {
                    wardBool && (
                        <ul className={style.wardListContainer}>
                            {
                                wardState
                                && wardState.length > 0
                                && wardState
                                    .sort((a, b) => a.title - b.title)
                                    .map((wardItem: any) => (
                                        <li key={wardItem.id} className={style.wardList}>
                                            <input
                                                type="checkbox"
                                                className={style.checkbox}
                                                id={wardItem.id}
                                                onClick={e => handleWardCheckbox(e, wardItem)}
                                                checked={wardItem.isChecked}
                                            />
                                            <label
                                                htmlFor={wardItem.id}
                                                className={style.label}
                                            >
                                                {wardItem.title}
                                            </label>
                                        </li>
                                    ))
                            }
                        </ul>
                    )
                }
            </div>
            <button
                className={_cs(style.reset, isFormOpen && style.hideContainer)}
                type="button"
                onClick={refreshHandler}
            >
                <Icon
                    name="refresh"
                />
            </button>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
