 
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { ibfPageSelector, districtsSelector, municipalitiesSelector, wardsSelector } from '#selectors';
import { setIbfPageAction } from '#actionCreators';
import { createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import * as utils from '#views/IBF/utils';

import style from './styles.module.scss';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
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
            // eslint-disable-next-line @typescript-eslint/camelcase
            return_period: params.returnPeriod,
            // district: params.district,
            municipality: params.municipality,
        }),
        onSuccess: ({ props, response, params }) => {
            params.addToArray([response]);
            // params.setPending(false);
        },
    },
};
let result;
const finalData = {};
// const summary = [];
const ExposedSummary = (props) => {
    const { ibfPage: {
        selectedStation,
        stationDetail,
        overallFloodHazard,
        returnPeriod,
    },
    district,
    municipality,
    ward } = props;

    const [summary, setSummary] = useState(null);

    const sortData = data => data.sort((a, b) => (b[Object.keys(b)[0]] - a[Object.keys(a)[0]]));

    const reportData = (data) => {
        let newSummary;
        if (data) {
            newSummary = [...data];
            const newResult = Object.keys(newSummary[0].types)
                .map(item => newSummary[0].types[item].map((row) => {
                    let house;
                    let finalHouse;
                    if (item === 'building') {
                        house = newSummary[0].types[item]
                            .filter(k => Object.keys(k)[0] === 'yes' || Object.keys(k)[0] === 'house')
                            .reduce((a, b) => a[Object.keys(a)[0]].totalCount
                            + b[Object.keys(b)[0]].totalCount);

                        const rest = newSummary[0].types[item]
                            .filter(k => Object.keys(k)[0] !== 'yes')
                            .filter(k => Object.keys(k)[0] !== 'house');

                        const newRest = rest.map(obj => ({
                            [Object.keys(obj)[0]]: obj[Object.keys(obj)[0]].totalCount,
                        }));

                        const newArray = [{ house }, ...newRest];

                        const sorted = sortData(newArray);
                        const firstFour = sorted.slice(0, 4);
                        let othersArray;
                        let others;
                        if (sorted.length > 4) {
                            othersArray = sorted.slice(4, sorted.length);
                            if (othersArray.length > 0) {
                                others = othersArray.reduce(
                                    (a, b) => a + b[Object.keys(b)[0]], 0,
                                );
                            }
                            if (others !== 0) {
                                finalHouse = [...firstFour, { Others: others }];
                            } else {
                                finalHouse = [...firstFour];
                            }
                        }
                        finalData.building = [...finalHouse];
                    }

                    let others;
                    let finalHighway;
                    if (item === 'highway') {
                        const rest = newSummary[0].types[item]
                            .filter(k => Object.keys(k)[0] !== 'unclassified');

                        const newRest = rest.map(obj => ({
                            [Object.keys(obj)[0]]: Number(Number(obj[Object.keys(obj)[0]]
                                .totalLength / 1000).toFixed(2)),
                        }));

                        const newArray = [...newRest];

                        const sorted = sortData(newArray);


                        const firstFour = sorted.slice(0, 4);

                        let othersArray;
                        if (sorted.length > 4) {
                            othersArray = sorted.slice(6, sorted.length);
                            if (othersArray.length > 0) {
                                others = othersArray.reduce(
                                    (a, b) => a + b[Object.keys(b)[0]], 0,
                                );
                            }
                            const unclassified = newSummary[0].types[item]
                                .filter(k => Object.keys(k)[0] === 'unclassified');


                            const finalOthers = Number(Number((others
                                   + unclassified[0].unclassified.totalLength) / 1000).toFixed(2));

                            const temp = (Number(finalOthers) / 1000).toFixed(2);
                            if (finalOthers !== 0) {
                                finalHighway = [...firstFour, { Others: finalOthers }];
                            } else {
                                finalHighway = [...firstFour];
                            }
                        }

                        finalData.highway = [...finalHighway];
                    }
                    let farmland;
                    let grassland;
                    let landuse;
                    if (item === 'landuse') {
                        farmland = (newSummary[0].types[item]
                            .filter(k => Object.keys(k)[0] === 'farmland' || Object.keys(k)[0] === 'farmyard')
                            .reduce((a, b) => a[Object.keys(a)[0]].totalArea
                            + b[Object.keys(b)[0]].totalArea) * 1e-6).toFixed(2);

                        grassland = (newSummary[0].types[item]
                            .filter(k => Object.keys(k)[0] === 'grass' || Object.keys(k)[0] === 'meadow')
                            .reduce((a, b) => a[Object.keys(a)[0]].totalArea
                            + b[Object.keys(b)[0]].totalArea) * 1e-6).toFixed(2);

                        const rest = newSummary[0].types[item]
                            .filter(k => Object.keys(k)[0] !== 'farmland')
                            .filter(k => Object.keys(k)[0] !== 'farmyard')
                            .filter(k => Object.keys(k)[0] !== 'grass')
                            .filter(k => Object.keys(k)[0] !== 'meadow');

                        const newRest = rest.map(obj => ({
                            [Object.keys(obj)[0]]: Number((Number(obj[Object.keys(obj)[0]]
                                .totalArea) * 1e-6).toFixed(2)),
                        }));

                        const newArray = [...newRest];

                        const sorted = sortData(newArray);

                        const firstFour = sorted.slice(0, 4);

                        let othersArray;
                        if (sorted.length > 4) {
                            othersArray = sorted.slice(4, sorted.length);
                            if (othersArray.length > 0) {
                                others = othersArray.reduce(
                                    (a, b) => a + b[Object.keys(b)[0]], 0,
                                );
                            }
                            // const farmland = newSummary[0].types[item]
                            //     .filter(k => Object.keys(k)[0] === 'farmland');

                            const finalOthers = others;

                            if (finalOthers !== 0) {
                                landuse = [...firstFour,
                                    { grassland },
                                    { farmland },
                                    { Others: finalOthers }];
                            } else {
                                landuse = [...firstFour,
                                    { grassland },
                                    { farmland }];
                            }
                        }

                        finalData.landuse = [...landuse];
                    }
                    return house;
                }));
        }
        return finalData;
    };


    const addToArray = (res) => {
        setSummary(res);
    };


    useEffect(() => {
        props.requests.floodHazard.do({ addToArray, municipality: props.muni, returnPeriod });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        result = reportData(summary);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [summary]);

    const mystationdata = stationDetail.results.filter(item => item.station === selectedStation.id);

    const capitalize = name => (
        name[0].charAt(0).toUpperCase() + name[0].slice(1)
    );

    return (
        <div className={style.main}>
            <table id={`exposed-table-${props.muni}`} className={style.table}>
                <th>
                    <tr className={style.header}>
                        <td className={style.col1}>Dristict</td>
                        <td className={style.col2}>
                            {utils.getDistrictName(district, mystationdata[0].district)}
                        </td>
                    </tr>
                    <tr className={style.header}>
                        <td className={style.col1}>Municipality</td>
                        <td className={style.col2}>
                            {utils.getMunicipalityRow(mystationdata,
                                props.muni,
                                municipality,
                                ward)}
                        </td>
                    </tr>
                </th>
                <tbody className={style.body}>
                    {
                        result && Object.keys(result).map(item => (
                            <tr className={style.row}>
                                <td className={style.col1}>
                                    {(item === 'building') ? 'Buildings'
                                        : (item === 'highway') ? 'Roads (Km)'
                                            : (item === 'landuse') ? 'Landuse (SqKm)'
                                                : '' }
                                </td>
                                <td className={style.col2}>
                                    {result[item].map(row => (
                                        <tr className={style.innerRow}>
                                            <td className={style.col2}>
                                                {capitalize(Object.keys(row))}
                                            </td>
                                            <td className={style.col1}>
                                                {row[Object.keys(row)[0]]}
                                            </td>
                                        </tr>
                                    ))}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className={style.export} data-html2canvas-ignore="true">
                <ReactHTMLTableToExcel
                    id="exposed-button"
                    className={style.downloadXcel}
                    table={`exposed-table-${props.muni}`}
                    filename={`exposed-table-${props.muni}`}
                    sheet={`exposed-table-${props.muni}`}
                    buttonText="Export"
                />
            </div>

        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            ExposedSummary,
        ),
    ),
);
