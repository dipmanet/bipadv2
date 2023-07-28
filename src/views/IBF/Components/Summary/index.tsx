/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import Table from '#views/IBF/Components/Table';

import { districtsSelector, ibfPageSelector, municipalitiesSelector, wardsSelector } from '#selectors';

import { setIbfPageAction } from '#actionCreators';
import * as utils from '#views/IBF/utils';
import Cross from '#resources/icons/IbfCross.svg';
import { PropsFromDispatch, PropsFromState } from '#views/IBF';
import { District, Municipality, Ward } from '#store/atom/page/types';
import { AppState } from '#types';
import style from './styles.scss';

interface OwnProps {
    summaryClassName: string;
    setToggleSummary: React.Dispatch<React.SetStateAction<boolean>>;
    toggleSummary: boolean;
    handleWidth: (bool: boolean) => void;
}

interface PropsFromSummaryState extends PropsFromState {
    district: District[];
    municipality: Municipality[];
    ward: Ward[];
}

type Props = OwnProps & PropsFromDispatch & PropsFromSummaryState

const mapStateToProps = (state: AppState): PropsFromSummaryState => ({
    ibfPage: ibfPageSelector(state),
    district: districtsSelector(state),
    municipality: municipalitiesSelector(state),
    ward: wardsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

const Summary = (props: Props) => {
    const { ibfPage,
        summaryClassName,
        toggleSummary,
        setToggleSummary,
        handleWidth } = props;

    const {
        selectedStation,
        stationDetail,
        filter,
    } = ibfPage;

    const { district, municipality, ward } = props;

    const theadData = ['District', 'Municipalities', 'Wards'];
    const theadDistrictData = ['Municipality', 'Total Wards'];
    const theadMunicipalityData = ['Municipality', 'Impacted Wards'];

    const mystationdata = stationDetail.results.filter(item => item.station === selectedStation.id);

    const totalDistrict = utils.uniquePlace(mystationdata, 'district');

    const totalMunicipality = utils.uniquePlace(mystationdata, 'municipality');

    const row = totalDistrict.map(item => utils.getRow(item, district, mystationdata));

    const districtRow = totalMunicipality
        .map(item => utils.getTotalDistrictRow(item, municipality, ward));

    const municipalityRow = utils.getMunicipalityRow(mystationdata,
        filter.municipality,
        municipality,
        ward);

    // const getMunicipalityId = (munArr) => {
    //     const munData = munArr.length > 0 && munArr.map(munItem => munItem.id);
    //     return munData;
    // };

    // useEffect(() => {
    //     const munArrData = getMunicipalityId(filter.municipality);
    //     setMunForTable(munArrData);
    // }, [filter.municipality]);


    return (
        <>
            <div className={_cs(
                style.Container,
                summaryClassName,
                toggleSummary ? style.hidden : style.visible,
            )
            }
            >
                <div className={style.heading}>
                    {filter.municipality
                        ? 'Municipality summary'
                        : filter.district
                            ? 'District Summary'
                            : 'Overall Summary'}
                </div>
                <div className={style.line} />
                <div>
                    {filter.municipality
                        ? (
                            <Table
                                theadData={theadMunicipalityData}
                                tbodyData={[municipalityRow]}
                            />
                        )
                        : filter.district
                            ? (
                                <Table
                                    theadData={theadDistrictData}
                                    tbodyData={districtRow}
                                />
                            )
                            : <Table theadData={theadData} tbodyData={row} />
                    }
                </div>
                <button
                    type="button"
                    style={{ opacity: toggleSummary ? 0 : 1 }}
                    className={style.closeBtn}
                    onClick={
                        () => {
                            setToggleSummary(true);
                            handleWidth(true);
                        }
                    }
                >
                    <img src={Cross} alt="cross" />
                </button>
            </div>
        </>

    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    Summary,
);
