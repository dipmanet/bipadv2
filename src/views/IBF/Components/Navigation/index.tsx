/* eslint-disable max-len */
import React, { useState } from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import previousIcon from '#resources/icons/Previous-item.svg';

import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import { districtsSelector, ibfPageSelector, municipalitiesSelector, userSelector } from '#selectors';
import { setIbfPageAction } from '#actionCreators';

// import Icon from '#rscg/Icon';
import IbfChart from '#resources/icons/ibf-chart.svg';
import { AppState } from '#types';
import { PropsFromDispatch } from '#views/IBF';
import { User } from '#store/atom/auth/types';
import { District, IbfPage, Municipality } from '#store/atom/page/types';
import { convertJsonToCsv } from '#utils/common';
import { saveAs } from 'file-saver';
import BoxModal from '../Modals';
import Report from '../../Report';
import style from './styles.scss';

interface OwnProps {
    setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PropsFromState {
    ibfPage: IbfPage;
    district: District[];
    user: User;
    municipality: Municipality[];
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;

type Props = ReduxProps

const mapStateToProps = (state: AppState): PropsFromState => ({
    ibfPage: ibfPageSelector(state),
    district: districtsSelector(state),
    municipality: municipalitiesSelector(state),
    user: userSelector(state),

});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

const Navigation = (props: Props) => {
    const [modal, setModal] = useState(false);
    const [reports, setReport] = useState(false);
    const { ibfPage: { selectedStation, stationDetail, filter, householdJson }, setFormOpen, user, municipality, district } = props;
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

    const getDistrict = (houseDistrict: any) => {
        const districtLabel = district.find((data: any) => data.id === houseDistrict).title;
        return districtLabel;
    };

    // eslint-disable-next-line consistent-return
    const getPrecedence = (precedenceValue: number) => {
        // eslint-disable-next-line default-case
        switch (true) {
            case (precedenceValue >= 0 && precedenceValue < 2):
                return 'Very low';
            case (precedenceValue >= 2 && precedenceValue < 3.5):
                return 'Low';
            case (precedenceValue >= 3.5 && precedenceValue < 5):
                return 'Medium';
            case (precedenceValue >= 5 && precedenceValue < 6.5):
                return 'High';
            case (precedenceValue >= 6.5):
                return 'Very high';
        }
    };

    const handleHouseDataTransformation = React.useMemo(() => {
        const householdArray = householdJson.map((houseObj: any) => ({
            Id: houseObj.id,
            'House id': houseObj.houseId,
            'Local unit': houseObj.localUnit,
            Province: houseObj.province,
            District: getDistrict(houseObj.district),
            Municipality: houseObj.municipality,
            Ward: houseObj.ward,
            'Household name': houseObj.householdName,
            'Household contact number': houseObj.householdContactNumber,
            'Normalized risk score': houseObj.normalized_risk_score,
            'Normalized hazard and exposure': houseObj.normalized_hazard_and_exposure,
            'Normalized vulnerability': houseObj.normalized_vulnerability,
            'Normalized lack of coping capacity': houseObj.normalized_lack_of_coping_capacity,
            'Precedence of risk': getPrecedence(houseObj.normalized_risk_score),
            'Precedence of hazard and exposure': getPrecedence(houseObj.normalized_hazard_and_exposure),
            'Precedence of lack of coping capacity': getPrecedence(houseObj.normalized_lack_of_coping_capacity),
            'Precedence of vulnerability': getPrecedence(houseObj.normalized_vulnerability),
            Male: houseObj.male,
            Female: houseObj.female,
            'Less than five': houseObj.lessThanFive,
            'Five to twelve': houseObj.fiveToTwelve,
            'Thirteen to eighteen': houseObj.thirteenToEighteen,
            'Nineteen to thirty': houseObj.nineteenToThirty,
            'Thirty to fifty': houseObj.thirtyToFifty,
            'Fiftyone to seventy': houseObj.fiftyoneToSeventy,
            'Greater than seventy': houseObj.greaterThanSeventy,
            'Number of children': houseObj.numberOfChildren,
            'Number of elderly': houseObj.numberOfElderly,
            'Number of disabled': houseObj.numberOfDisabled,
            'Number of pregnant lactating': houseObj.numberOfPregnantLactating,
            'Income source': houseObj.incomeSource,
            'Annual income': houseObj.annualIncome,
            Business: houseObj.isBusiness,
            'Foreign employment': houseObj.isForeignEmployment,
            Labour: houseObj.isLabour,
            'Agriculture livestock': houseObj.hasAgricultureLivestock,
            'Other job': houseObj.otherJob,
            'Female headed household': houseObj.isFemaleHeadedHousehold,
            'Distance to safe shelter': houseObj.distanceOfSafeShelter,
            'Education level': houseObj.educationLevel,
            'Access to drinking water': houseObj.hasAccessToDrinkingWater,
            'Access to drinking water during flood': houseObj.hasAccessToDrinkingWaterDuringFlood,
            'Access to early warning information': houseObj.hasAccessToEarlyWarningInformation,
            'Access to financial services': houseObj.hasAccessToFinancialServices,
            'Availability of social security': houseObj.hasAvailabilityOfSocialSecurity,
            'House damage': houseObj.hasHouseDamage,
            'Involvment to community group': houseObj.hasInvolvmentToCommunityGroup,
            'Livelihood affect': houseObj.hasLivelihoodAffect,
            'Loss of family members': houseObj.hasLossOfFamilyMembers,
            'House type roof': houseObj.houseTypeRoof,
            'House type wall': houseObj.houseTypeWall,
            'Vicinity to rivers': houseObj.vicinityToRivers,
            Altitude: houseObj.altitude,
            Precision: houseObj.precision,
            'Flood depth': houseObj.floodDepth,
            'Flood impact in thirty years': houseObj.floodImpactInThirtyYears,
            'Flood return period': houseObj.floodReturnPeriod,
        }));
        return householdArray;
    }, [getDistrict, householdJson]);

    const handleDownloadCsv = (title: string) => {
        const transformedData = handleHouseDataTransformation;
        const csv = convertJsonToCsv(transformedData);
        const blob = new Blob([csv], { type: 'text/csv' });

        const currentTimestamp = (new Date()).getTime();
        const fileName = `${title}-${currentTimestamp}.csv`;
        saveAs(blob, fileName);
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
                                    filter.municipality && (
                                        <span>
                                            {' '}
                                            {' ('}
                                            {
                                                <span>
                                                    {municipality.filter((item: any) => item.id === filter.municipality)[0].title}
                                                </span>

                                            }
                                            {')'}
                                        </span>
                                    )
                                }
                            </div>
                            <div className={style.icons}>
                                {
                                    user && filter.municipality && (
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
                                                onClick={() => showReport()}b
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
                {filter.municipality && (
                    <button
                        type="button"
                        onClick={() => handleDownloadCsv('Households')}
                    >
                  Download CSV
                    </button>
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
