/* eslint-disable max-len */
import React, { useState } from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import previousIcon from '#resources/icons/Previous-item.svg';

import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import { ibfPageSelector, userSelector } from '#selectors';
import { setIbfPageAction } from '#actionCreators';

// import Icon from '#rscg/Icon';
import IbfChart from '#resources/icons/ibf-chart.svg';
import { AppState } from '#types';
import { PropsFromDispatch } from '#views/IBF';
import { User } from '#store/atom/auth/types';
import { IbfPage } from '#store/atom/page/types';
import BoxModal from '../Modals';
import Report from '../../Report';

import style from './styles.scss';

interface OwnProps {
    setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PropsFromState {
    ibfPage: IbfPage;
    user: User;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;

type Props = ReduxProps

const mapStateToProps = (state: AppState): PropsFromState => ({
    ibfPage: ibfPageSelector(state),
    user: userSelector(state),

});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

const Navigation = (props: Props) => {
    const [modal, setModal] = useState(false);
    const [reports, setReport] = useState(false);
    const { ibfPage: { selectedStation, stationDetail, filter }, setFormOpen, user } = props;
    const handleBtnClick = () => {
        props.setIbfPage({
            selectedStation: {},
            calendarData: [],
            returnPeriod: 0,
            leadTime: 0,
            overallFloodHazard: [],
            filter: { district: '', municipality: [], ward: '' },
            showHouseHold: 0,
            selectedIndicator: '',
            selectedLegend: '',
            householdJson: [],
            indicators: [],
            wtChange: 0,
            weights: [],
        });
        setFormOpen(false);
    };

    const mystationdata = stationDetail && stationDetail.results > 0 && stationDetail.results.filter(item => item.station === selectedStation.id);

    function showModal() {
        setModal(true);
    }
    function showReport() {
        setReport(true);
    }
    const handleModalClose = () => {
        setModal(false);
    };
    const handleReportClose = () => {
        setReport(false);
    };

    return (
        <>
            <div className={style.container}>
                {(Object.keys(selectedStation).length > 0)
                    ? (
                        <div className={style.menu}>
                            <div className={style.nav}>
                                <button type="button" onClick={() => handleBtnClick()}>
                                    <ScalableVectorGraphics
                                        className={style.previousIcon}
                                        src={previousIcon}
                                    />
                                </button>
                                {`${selectedStation.properties.station_name.toUpperCase()} STATION`}
                                {
                                    filter.municipality.length > 0 && (
                                        <span>
                                            {' '}
                                            {' ('}
                                            {
                                                filter.municipality.map((mun, i) => {
                                                    if (i !== filter.municipality.length - 1) {
                                                        return (
                                                            <span
                                                                key={mun.title}
                                                            >

                                                                {mun.title}
                                                                ,
                                                                {' '}

                                                            </span>
                                                        );
                                                    }
                                                    return (
                                                        <span
                                                            key={mun.title}
                                                        >

                                                            {mun.title}

                                                        </span>
                                                    );
                                                })
                                            }
                                            {')'}
                                        </span>
                                    )
                                }
                            </div>
                            <div className={style.icons}>
                                {
                                    user && filter.municipality.length > 0 && (
                                        <div
                                            className={style.household}
                                            role="presentation"
                                            onClick={() => {
                                                setFormOpen(true);
                                            }}
                                        >
                                            <span>&#43;</span>
Add Household Level Data
                                        </div>
                                    )
                                }
                                <div
                                    className={style.chart}
                                    onClick={() => showModal()}
                                    role="presentation"
                                    title="View discharge hydrograaph"
                                >
                                    <img src={IbfChart} alt="chart" />
                                </div>
                                {/* {
                                    returnPeriod && returnPeriod !== 0 && mystationdata.length > 0
                                        ? (
                                            <div
                                                className={style.download}
                                                onClick={() => showReport()}
                                                role="presentation"
                                                title="Preview and download Report"
                                            >
                                                <Icon name="filePdf" />
                                            </div>
                                        )
                                        : ''
                                } */}
                            </div>
                        </div>

                    ) : (
                        <>
                            <div className={style.title}>
                                IBF DASHBOARD
                            </div>
                        </>
                    )}

                {(modal) ? (
                    <BoxModal
                        handleModalClose={handleModalClose}
                    />
                ) : ''}
                {(reports) ? (
                    <Report
                        handleModalClose={handleReportClose}
                    />
                ) : ''}
            </div>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
