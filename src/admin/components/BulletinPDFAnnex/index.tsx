/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { nepaliRef, englishRef } from 'src/admin/components/BulletinForm/formFields';
import { Translation } from 'react-i18next';
import {
    bulletinPageSelector, languageSelector,
} from '#selectors';

import Response from '../BulletinForm/Response';
import YearlyData from './YearlyData';
import styles from './styles.scss';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),
    language: languageSelector(state),
});

const BulletinPDFAnnex = (props) => {
    const [provinceWiseTotal, setprovinceWiseTotal] = useState([]);
    const [peopleLossData, setPeopleLossData] = useState([]);

    const {
        handleFeedbackChange,
        // feedback,
        language: { language },
        bulletinData: {
            incidentSummary,
            peopleLoss,
            hazardWiseLoss,
            genderWiseLoss,
            covid24hrsStat,
            covidTotalStat,
            vaccineStat,
            covidProvinceWiseTotal,
            feedback,
            deleteFeedbackChange,
            hazardWiseLossData,
            handleSubFieldChange,
        },
    } = props;


    useEffect(() => {
        if (language === 'np') {
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
        } else {
            const cD = Object.keys(covidProvinceWiseTotal).map(c => ({
                province: englishRef[c],
                'Total Affected': covidProvinceWiseTotal[c].totalAffected,
                'Total Active': covidProvinceWiseTotal[c].totalActive,
                'Total Deaths': covidProvinceWiseTotal[c].totalDeaths,
            }));
            setprovinceWiseTotal(cD);
            const plD = Object.keys(peopleLoss).map(c => ({
                province: englishRef[c],
                Deaths: peopleLoss[c].death,
                Missing: peopleLoss[c].missing,
                Injured: peopleLoss[c].injured,
            }));
            setPeopleLossData(plD);
        }
    }, [covidProvinceWiseTotal, peopleLoss, language]);


    return (
        <div className={language === 'np' ? styles.footerPDFContainer : styles.footerPDFContainerEnglish}>
            <h1>
                <Translation>
                    {
                        t => <span>{t('Annex')}</span>
                    }
                </Translation>
                1
            </h1>

            <YearlyData />
            <h3>
                <Translation>
                    {
                        t => <span>{t('Incident Summary')}</span>
                    }
                </Translation>

            </h3>
            <Response
                annex
                handleFeedbackChange={handleFeedbackChange}
                feedback={feedback}
                deleteFeedbackChange={deleteFeedbackChange}
                hazardWiseLossData={hazardWiseLossData}
                handleSubFieldChange={handleSubFieldChange}
            />
            <Translation>
                {
                    t => <h3>{t('Disaster details of the last 24 hours')}</h3>
                }
            </Translation>
            <table className={styles.annexTable}>
                <thead>
                    <tr>
                        {incidentSummary && Object.keys(incidentSummary).map(iS => (
                            <th key={iS}>

                                {language === 'np'
                                    ? nepaliRef[iS]
                                    : englishRef[iS]
                                }

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
            <Translation>
                {
                    t => <h3>{t('Provincewise Death, Missing and Injured Counts')}</h3>
                }
            </Translation>

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

                                    {
                                        language === 'np'
                                            ? nepaliRef[pwT]
                                            : englishRef[pwT]
                                    }
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

            {/* {
                typeof hazardWiseLoss === 'object'
                && Object.keys(hazardWiseLoss).length > 0
                && (
                    <table className={styles.provTable}>
                        <thead>
                            <tr>
                                <th>{' '}</th>
                                {
                                    hazardWiseLoss && Object.keys(hazardWiseLoss).map(pwT => (
                                        <th key={pwT}>
                                            {pwT}
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                hazardWiseLoss && Object.keys(hazardWiseLoss[Object.keys(hazardWiseLoss)[0]])
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
                )
            } */}
            <div className={styles.twoCols}>
                <div>
                    <Translation>
                        {
                            t => <h3>{t('Genderwise Deaths')}</h3>
                        }
                    </Translation>

                    <table className={styles.annexTable}>
                        <thead>
                            <tr>
                                {genderWiseLoss && Object.keys(genderWiseLoss).map(iS => (
                                    <th key={iS}>
                                        {
                                            language === 'np'
                                                ? nepaliRef[iS]
                                                : englishRef[iS]
                                        }
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
                    <Translation>
                        {
                            t => <h3>{t('COVID-19 details of the last 24 hrs')}</h3>
                        }
                    </Translation>

                    <table className={styles.annexTable}>
                        <thead>
                            <tr>
                                {covid24hrsStat && Object.keys(covid24hrsStat).map(iS => (
                                    <th key={iS}>
                                        {
                                            language === 'np'
                                                ? nepaliRef[iS]
                                                : englishRef[iS]
                                        }
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
                    <Translation>
                        {
                            t => <h3>{t('Stats till date')}</h3>
                        }
                    </Translation>

                    <table className={styles.annexTable}>
                        <thead>
                            <tr>
                                {covidTotalStat && Object.keys(covidTotalStat).map(iS => (
                                    <th key={iS}>
                                        {
                                            language === 'np'
                                                ? nepaliRef[iS]
                                                : englishRef[iS]
                                        }
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
                    <Translation>
                        {
                            t => <h3>{t('Vaccine Stats')}</h3>
                        }
                    </Translation>
                    <table className={styles.annexTable}>
                        <thead>
                            <tr>
                                {vaccineStat && Object.keys(vaccineStat).map(iS => (
                                    <th key={iS}>
                                        {
                                            language === 'np'
                                                ? nepaliRef[iS]
                                                : englishRef[iS]
                                        }
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
            <Translation>
                {
                    t => <h3>{t('Provincewise stats till date')}</h3>
                }
            </Translation>

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
                                    {
                                        language === 'np'
                                            ? nepaliRef[pwT]
                                            : englishRef[pwT]
                                    }
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
