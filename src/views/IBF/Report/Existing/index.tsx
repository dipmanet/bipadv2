/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { ibfPageSelector, districtsSelector, municipalitiesSelector, wardsSelector } from '#selectors';
import { createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import riskScore from '#resources/icons/Risk-score-green.svg';
import hazardScore from '#resources/icons/Hazard-score-green.svg';
import vulnerabilityScore from '#resources/icons/Vulnerability-green.svg';
import lackOfCoping from '#resources/icons/Lack-of-coping-green.svg';
import * as utils from '#views/IBF/utils';
import Map from '../Map';
import style from './styles.scss';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    ibfPage: ibfPageSelector(state),
    district: districtsSelector(state),
    municipality: municipalitiesSelector(state),
    ward: wardsSelector(state),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    householdJson: {
        url: '/ibf-household/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            municipality: params.mun,
            limit: -1,
        }),
        onSuccess: ({ response, params }) => {
            params.setHousehold({ response });
        },
    },

    householdDistrictAverage: {
        url: '/ibf-household/',
        method: methods.GET,
        onMount: false,
        query: ({ params }) => ({
            format: 'json',
            summary: 'true',
            municipality: params.mun,
            limit: -1,
        }),
        onSuccess: ({ response, params }) => {
            params.setScore({ response });
        },
    },
};

const myStyle = {
    position: 'relative',
    top: '50',
    left: '100',
    width: '85%',
    height: '400px',
    marginLeft: '50px',
};
const countHouse = (max, min, household) => {
    const count = (household.response.results
        .filter(item => item.normalized_risk_score < max
            && item.normalized_risk_score >= min)).length;
    return count;
};


const Existing = (props) => {
    const { ibfPage: {
        selectedStation,
        stationDetail,
    },
        district,
        municipality } = props;

    const [score, setScore] = useState();
    const [household, setHousehold] = useState();
    const mystationdata = stationDetail.results
        .filter(item => item.station === selectedStation.id);

    const munName = utils.getMunicipalityName(municipality, props.mun);
    useEffect(() => {
        props.requests.householdDistrictAverage.do({ setScore, mun: props.mun });
        props.requests.householdJson.do({ setHousehold, mun: props.mun });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalDistrict = district.filter(item => item.id === Number(mystationdata[0].district));

    return (
        <>
            <div className={style.section}>
                {score
                    && (
                        <div className={style.info}>
                            <div className={style.title}>
                                {`Existing Risk at ${munName} Municipality, ${utils.getDistrictName(district, mystationdata[0].district)}`}
                            </div>
                            <div className={style.blurpContainer}>
                                <div className={style.blurp}>
                                    <div><img className={style.icon} src={riskScore} alt="source" /></div>
                                    <div className={style.text}>
                                        {`Risk Score: ${Number(score.response.avg_normalized_risk_score).toFixed(2)}`}
                                    </div>
                                </div>
                                <div className={style.blurp}>
                                    <div><img className={style.icon} src={hazardScore} alt="link" /></div>
                                    <div className={style.text}>
                                        {`Hazard Score: ${Number(score.response.avg_hazard_and_exposure).toFixed(2)}`}
                                    </div>
                                </div>
                                <div className={style.blurp}>
                                    <div><img className={style.icon} src={vulnerabilityScore} alt="source" /></div>
                                    <div className={style.text}>
                                        {`Vulnerability Score: ${Number(score.response.avg_vulnerability).toFixed(2)}`}
                                    </div>
                                </div>
                                <div className={style.blurp}>
                                    <div><img className={style.icon} src={lackOfCoping} alt="event" /></div>
                                    <div className={style.text}>
                                        {`Lack of Coping Capacity: ${Number(score.response.avg_lack_of_coping_capacity).toFixed(2)}`}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )
                }
            </div>
            <Map
                myStyle={myStyle}
                effectedDristict={totalDistrict}
                effectedMunicipality={[props.mun]}
            />

            <div className={style.section}>
                {household && (
                    <>
                        <table id={`existing-table-${props.mun}`} className={style.table}>
                            <thead className={style.header}>

                                <th className={style.col1}>Risk Level</th>
                                <th className={style.col2}>Number of Household</th>


                            </thead>
                            <tbody className={style.body}>
                                <tr className={style.row}>
                                    <td className={style.col1}>Very High (6.5-10)</td>
                                    <td className={style.col2}>{countHouse(10, 6.5, household)}</td>
                                </tr>
                                <tr className={style.row}>
                                    <td className={style.col1}>High (5-6.4)</td>
                                    <td className={style.col2}>{countHouse(6.5, 5, household)}</td>
                                </tr>
                                <tr className={style.row}>
                                    <td className={style.col1}>Medium (3.5-4.9)</td>
                                    <td className={style.col2}>
                                        {countHouse(4.9, 3.5, household)}
                                    </td>
                                </tr>
                                <tr className={style.row}>
                                    <td className={style.col1}>Low (2-3.4)</td>
                                    <td className={style.col2}>{countHouse(3.4, 2, household)}</td>
                                </tr>
                                <tr className={style.row}>
                                    <td className={style.col1}>Very Low (1.9-0)</td>
                                    <td className={style.col2}>{countHouse(1.9, 0, household)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={style.export} data-html2canvas-ignore="true">
                            <ReactHTMLTableToExcel
                                id="existing-button"
                                className="download-table-xls-button"
                                table={`existing-table-${props.mun}`}
                                filename={`existing-table-${props.mun}`}
                                sheet={`existing-table-${props.mun}`}
                                buttonText="Export"
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};


export default connect(mapStateToProps, undefined)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Existing,
        ),
    ),
);
