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
    const [selectedMun, setSelectedMun] = useState([]);
    const [list, setList] = useState(false);
    const [disState, setDisState] = useState('selectDistrict');
    const [disBool, setDisBool] = useState(false);

    const {
        ibfPage,
        district,
        municipality,
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
        result.districtId = municipality.filter(item => item.id === i)[0].district;
        result.isChecked = false;
        return result;
    });

    const [munState, setMunState] = useState([]);

    const refreshHandler = () => {
        props.setIbfPage({ filter: { district: '', municipality: [] } });
        setSelectedMun([]);
        setList(false);
        const resetState = munState.length > 0 && munState.map((munItem) => {
            const munci = {
                ...munItem,
                isChecked: false,
            };
            return munci;
        });
        setMunState(resetState);
        setDisState('selectDistrict');
        setDisBool(false);
    };

    const handleCheckbox = (e, mun) => {
        const munic = {
            ...mun,
            isChecked: e.target.checked,
        };
        setMunState(prevState => [...prevState.filter(item => item.id !== mun.id), munic]);

        if (munic.isChecked) {
            setSelectedMun(prevState => [munic, ...prevState]);
        } else {
            setSelectedMun((prevState) => {
                const filteredMun = prevState.filter(data => data.id !== munic.id);
                return filteredMun;
            });
        }
        setList(false);
    };

    const handleDisState = (disObj) => {
        setDisState(disObj.title);
        setDisBool(false);
        props.setIbfPage({ filter: { district: disObj.id } });
    };

    useEffect(() => {
        props.setIbfPage({ filter: { municipality: selectedMun } });
    }, [props, selectedMun]);

    useEffect(() => {
        refreshHandler();
        setMunState(munName);
    }, [selectedStation]);


    return (
        <>
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

            <div className={_cs(style.munContainer, isFormOpen && style.hideContainer)}>
                <div
                    className={style.selectBar}
                    onClick={() => filter.district && setList(!list)}
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
                    <div className={style.selectContent}>
                        <span>Select Municipality</span>
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
                    list && (
                        <ul className={style.munListContainer}>
                            {
                                munState.length > 0 && munState.sort((a, b) => {
                                    const fI = a.title.toLowerCase();
                                    const lI = b.title.toLowerCase();
                                    if (fI < lI) {
                                        return -1;
                                    }
                                    if (fI > lI) {
                                        return 1;
                                    }
                                    return 0;
                                }).map(mun => (
                                    <li key={mun.id} className={style.munList}>
                                        <input
                                            type="checkbox"
                                            className={style.checkbox}
                                            id={mun.id}
                                            onClick={e => handleCheckbox(e, mun)}
                                            checked={mun.isChecked}
                                        />
                                        <label
                                            htmlFor={mun.id}
                                            className={style.label}
                                        >
                                            {mun.title}
                                        </label>
                                    </li>
                                ))
                            }
                        </ul>
                    )
                }
            </div>
            <button className={_cs(style.reset, isFormOpen && style.hideContainer)} type="button" onClick={refreshHandler}>
                <Icon
                    name="refresh"
                />
            </button>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
