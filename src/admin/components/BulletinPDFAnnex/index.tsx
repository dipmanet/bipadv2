/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { nepaliRef, englishRef } from 'src/admin/components/BulletinForm/formFields';
import { Translation } from 'react-i18next';
import { _cs } from '@togglecorp/fujs';
import {
    languageSelector,
    districtsSelector,
    incidentListSelectorIP,
    hazardTypesSelector,
    bulletinEditDataSelector,
    bulletinPageSelector,
} from '#selectors';

import Response from '../BulletinForm/Response';
import YearlyData from './YearlyData';
import styles from './styles.scss';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),
    language: languageSelector(state),
    districts: districtsSelector(state),
    incidentList: incidentListSelectorIP(state),
    hazardTypes: hazardTypesSelector(state),
    bulletinEditData: bulletinEditDataSelector(state),
});


const BulletinPDFAnnex = (props) => {
    const [provinceWiseTotal, setprovinceWiseTotal] = useState([]);
    const [peopleLossData, setPeopleLossData] = useState([]);

    const {
        handleFeedbackChange,
        // feedback,
        districts,
        hazardTypes,
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
            cumulative,
            deleteFeedbackChange,
            hazardWiseLossData,
            handleSubFieldChange,
        },
    } = props;


    const getHazard = (h) => {
        const filtered = Object.values(hazardTypes).filter(item => item.titleNe === h || item.titleEn === h);
        if (filtered.length > 0 && language === 'np') {
            return filtered[0].titleNe;
        }
        if (filtered.length > 0 && language === 'en') {
            return filtered[0].title;
        }
        return '-';
    };

    const getDistrict = (d) => {
        const filtered = districts.filter(item => item.title_ne === d || item.title_en === d);
        if (filtered.length > 0 && language === 'np') {
            return filtered[0].title_ne;
        }
        if (filtered.length > 0 && language === 'en') {
            return filtered[0].title_en;
        }
        return '-';
    };


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
                {' '}
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
            {/* <Response
                annex
                handleFeedbackChange={handleFeedbackChange}
                feedback={feedback}
                deleteFeedbackChange={deleteFeedbackChange}
                hazardWiseLossData={hazardWiseLossData}
                handleSubFieldChange={handleSubFieldChange}
            /> */}
            <div className={_cs(
                (styles.formContainerAnnex),
                (language === 'np' ? styles.formContainerNepali : styles.formContainerEnglish),
            )
            }
            >
                <div className={styles.pratikriyas}>
                    {
                        feedback && Object.keys(feedback).length > 0

                            && (
                                <table className={styles.responseTable}>
                                    <tr>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('S.N')}</span>
                                                }
                                            </Translation>
                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('Incidents')}</span>
                                                }
                                            </Translation>

                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('District')}</span>
                                                }
                                            </Translation>

                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('death')}</span>
                                                }
                                            </Translation>

                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('missing')}</span>
                                                }
                                            </Translation>

                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('injured')}</span>
                                                }
                                            </Translation>

                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('Incident Details')}</span>
                                                }
                                            </Translation>

                                        </th>
                                        <th>
                                            <Translation>
                                                {
                                                    t => <span>{t('Response')}</span>
                                                }
                                            </Translation>

                                        </th>
                                    </tr>
                                    {
                                        feedback && Object.keys(feedback).map((hwL, i) => (
                                            <tr>
                                                <td>
                                                    {i + 1}
                                                </td>
                                                <td>
                                                    {getHazard(feedback[hwL].hazard) }
                                                </td>
                                                <td>
                                                    {getDistrict(feedback[hwL].district)}
                                                </td>

                                                <td>
                                                    {
                                                        feedback[hwL].deaths
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        feedback[hwL].missing
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        feedback[hwL].injured
                                                    }
                                                </td>
                                                <td>
                                                    <div className={styles.formItemHalf}>
                                                        {
                                                            feedback[hwL].description || ''
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={styles.formItemHalf}>
                                                        {
                                                            feedback[hwL].response || ''

                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    <tr className={styles.lastRow}>
                                        <td>
                                            <Translation>
                                                {
                                                    t => <span>{t('Total')}</span>
                                                }
                                            </Translation>

                                        </td>
                                        <td>{cumulative.incidents}</td>
                                        <td>{cumulative.district}</td>
                                        <td>{cumulative.deaths}</td>
                                        <td>{cumulative.missing}</td>
                                        <td>{cumulative.injured}</td>
                                        <td>{' '}</td>
                                        <td>{' '}</td>
                                    </tr>
                                </table>
                            )
                    }
                </div>
            </div>
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
