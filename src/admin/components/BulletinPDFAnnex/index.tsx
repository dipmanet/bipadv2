/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { nepaliRef } from 'src/admin/components/BulletinForm/formFields';
import {
    bulletinPageSelector,
} from '#selectors';
import styles from './styles.scss';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),
});

const BulletinPDFAnnex = (props) => {
    const [provinceWiseTotal, setprovinceWiseTotal] = useState([]);
    const [peopleLossData, setPeopleLossData] = useState([]);

    const {
        bulletinData: {
            incidentSummary,
            peopleLoss,
            hazardWiseLoss,
            genderWiseLoss,
            covid24hrsStat,
            covidTotalStat,
            vaccineStat,
            covidProvinceWiseTotal,
        },
    } = props;

    useEffect(() => {
        const cD = Object.keys(covidProvinceWiseTotal).map(c => ({
            province: nepaliRef[c],
            'कुल संक्रमित संन्ख्या': covidProvinceWiseTotal[c].totalAffected,
            'कुल सक्रिय संक्रमित संन्ख्या': covidProvinceWiseTotal[c].totalActive,
            'कुल मृत्‍यु संन्ख्या': covidProvinceWiseTotal[c].totalDeaths,
        }));
        setprovinceWiseTotal(cD);
        const plD = Object.keys(peopleLoss).map(c => ({
            province: nepaliRef[c],
            'मृत्यु संख्या': peopleLoss[c].death,
            'हराइरहेको संख्या': peopleLoss[c].missing,
            'घाइतेको संख्या': peopleLoss[c].injured,
        }));
        setPeopleLossData(plD);
    }, [covidProvinceWiseTotal, peopleLoss]);


    return (
        <div className={styles.footerPDFContainer}>
            <h1>अनुसूची १</h1>
            <h3>२४ घण्टामा बिपद्को विवरणहरु</h3>
            <table className={styles.annexTable}>
                <thead>
                    <tr>
                        {incidentSummary && Object.keys(incidentSummary).map(iS => (
                            <th key={iS}>
                                {nepaliRef[iS]}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {incidentSummary && Object.keys(incidentSummary).map(iS => (
                            <td key={iS}>
                                {Number(incidentSummary[iS]).toLocaleString()}
                            </td>
                        ))}
                    </tr>
                </tbody>

            </table>
            <h3>प्रदेश अनुसार मृत्यू, बेपत्ता र घाइते संन्ख्याको बर्गिकरण</h3>
            <table className={styles.provTable}>
                <thead>
                    <tr>
                        <th>{' '}</th>
                        {
                            peopleLossData.map(pwT => (
                                <th key={pwT.province}>
                                    {pwT.province}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(peopleLoss.p1).map((pwT, i) => (
                            <tr>
                                <td>
                                    {nepaliRef[pwT]}
                                </td>
                                {
                                    Object.keys(peopleLoss)
                                        .map(prov => (
                                            <td key={prov}>
                                                {Number(peopleLoss[prov][pwT]).toLocaleString()}
                                            </td>
                                        ))

                                }

                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <h3>प्रकोप अनुसार मृत्यू, बेपत्ता र घाइते संन्ख्याको बर्गिकरण</h3>
            <table className={styles.provTable}>
                <thead>
                    <tr>
                        <th>{' '}</th>
                        {
                            Object.keys(hazardWiseLoss).map(pwT => (
                                <th key={pwT}>
                                    {pwT}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(hazardWiseLoss[Object.keys(hazardWiseLoss)[0]])
                            .map((pwT, i) => (
                                <tr>
                                    <td>
                                        {nepaliRef[pwT]}
                                    </td>
                                    {
                                        Object.keys(hazardWiseLoss)
                                            .map(haz => (
                                                <td key={haz}>
                                                    {Number(hazardWiseLoss[haz][pwT])
                                                        .toLocaleString()}
                                                </td>
                                            ))

                                    }

                                </tr>
                            ))
                    }
                </tbody>
            </table>
            <div className={styles.twoCols}>
                <div>
                    <h3>लिङ्ग अनुसार मृत्यूको बर्गिकरण</h3>
                    <table className={styles.annexTable}>
                        <thead>
                            <tr>
                                {genderWiseLoss && Object.keys(genderWiseLoss).map(iS => (
                                    <th key={iS}>
                                        {nepaliRef[iS]}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {genderWiseLoss && Object.keys(genderWiseLoss).map(iS => (
                                    <td key={iS}>
                                        {Number(genderWiseLoss[iS]).toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                        </tbody>

                    </table>
                </div>
                <div>
                    <h3>२४ घण्टामा COVID-19 को विवरण</h3>
                    <table className={styles.annexTable}>
                        <thead>
                            <tr>
                                {covid24hrsStat && Object.keys(covid24hrsStat).map(iS => (
                                    <th key={iS}>
                                        {nepaliRef[iS]}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {covid24hrsStat && Object.keys(covid24hrsStat).map(iS => (
                                    <td key={iS}>
                                        {Number(covid24hrsStat[iS]).toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                        </tbody>

                    </table>
                </div>
            </div>
            <div className={styles.twoCols}>
                <div>
                    <h3>हालसम्मको कुल तथ्याङ्क</h3>
                    <table className={styles.annexTable}>
                        <thead>
                            <tr>
                                {covidTotalStat && Object.keys(covidTotalStat).map(iS => (
                                    <th key={iS}>
                                        {nepaliRef[iS]}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {covidTotalStat && Object.keys(covidTotalStat).map(iS => (
                                    <td key={iS}>
                                        {Number(covidTotalStat[iS]).toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                        </tbody>

                    </table>
                </div>
                <div>
                    <h3>खोपको विवरण </h3>
                    <table className={styles.annexTable}>
                        <thead>
                            <tr>
                                {vaccineStat && Object.keys(vaccineStat).map(iS => (
                                    <th key={iS}>
                                        {nepaliRef[iS]}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {vaccineStat && Object.keys(vaccineStat).map(iS => (
                                    <td key={iS}>
                                        {Number(vaccineStat[iS]).toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                        </tbody>

                    </table>
                </div>
            </div>
            <h3>प्रदेश अनुसार हालसम्मको कुल तथ्याङ्क</h3>
            <table className={styles.provTable}>
                <thead>
                    <tr>
                        <th>{' '}</th>
                        {
                            provinceWiseTotal.map(pwT => (
                                <th key={pwT.province}>
                                    {pwT.province}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(covidProvinceWiseTotal.p1).map((pwT, i) => (
                            <tr>
                                <td>
                                    {nepaliRef[pwT]}
                                </td>
                                {
                                    Object.keys(covidProvinceWiseTotal)
                                        .map(prov => (
                                            <td key={prov}>
                                                {Number(covidProvinceWiseTotal[prov][pwT]).toLocaleString()}
                                            </td>
                                        ))

                                }

                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </div>

    );
};


export default connect(mapStateToProps)(
    BulletinPDFAnnex,
);
