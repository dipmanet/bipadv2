import React from 'react';
import { connect } from 'react-redux';
import * as utils from '#views/IBF/utils';

import { districtsSelector, ibfPageSelector, municipalitiesSelector, wardsSelector } from '#selectors';
import { setIbfPageAction } from '#actionCreators';
import style from './styles.scss';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    ibfPage: ibfPageSelector(state),
    district: districtsSelector(state),
    municipality: municipalitiesSelector(state),
    ward: wardsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});


const getDistrictName = (district, districtId) => {
    const result = district.filter(item => item.id === Number(districtId));
    return result[0].title;
};

// const getMunicipalityRow = (mystationdata, municipalityid, municipality, ward) => {
//     // Get name of the municipality
//     const result = municipality.filter(item => item.id === Number(municipalityid));
//     const mun = result[0].title;
//     // Get name of the ward
//     const temp = mystationdata.filter(item => item.municipality === Number(municipalityid));
//     const wardname = temp.map(item => ward.filter(t => t.id === item.ward)[0].title);
//     const wardResult = wardname.toString();
//     return `${mun} (Ward ${wardResult})`;
// };
export const getMunicipalityRow = (mystationdata, municipalityid, municipality, ward) => {
    // Get name of the municipality
    const result = municipality.filter(item => item.id === Number(municipalityid));
    const mun = result[0].title;
    // Get name of the ward
    const temp = mystationdata.filter(item => item.municipality === Number(municipalityid));
    const wardname = (temp[0].ward !== null) ? (
        temp.map(item => ward.filter(t => t.id === item.ward)[0].title)
    ) : (
        'N/A'
    );
    const wardResult = wardname.toString();
    return `${mun} (Ward ${wardResult})`;
    // return [mun, wardResult];
};

const uniquePlace = (data, comparator) => {
    const uniqueArr = [...new Set(data.map(item => item[comparator]))];
    return uniqueArr;
};


const SummaryTable = (props) => {
    const { ibfPage: { selectedStation, stationDetail }, district, municipality, ward } = props;

    const mystationdata = stationDetail.results.filter(item => item.station === selectedStation.id);

    const totalMunicipality = uniquePlace(mystationdata, 'municipality');

    return (

        <div className={style.container}>
            <div className={style.title}>Overall Summary of Potentially Exposed Area</div>

            <table className={style.table}>
                <tr className={style.header}>
                    <th className={style.col1}>District</th>
                    <th className={style.col2}>Muncipality/Wards</th>
                </tr>
                <tbody className={style.body}>
                    <td className={style.col1}>
                        {getDistrictName(district, mystationdata[0].district)}
                    </td>
                    <td className={style.col2}>
                        {totalMunicipality.map(item => (
                            <tr className={style.row}>
                                {getMunicipalityRow(mystationdata,
                                    item,
                                    municipality,
                                    ward)}
                            </tr>
                        ))}
                    </td>
                </tbody>
            </table>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryTable);
