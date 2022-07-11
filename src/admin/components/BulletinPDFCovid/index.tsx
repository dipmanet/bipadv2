/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

import { nepaliRef, provincesRef, provincesTitleRef } from 'src/admin/components/BulletinForm/formFields';
import { Translation } from 'react-i18next';
import styles from './styles.scss';
import LossItem from '../BulletinPDFLoss/LossItem';
import { covidObj24HRs, covidObj24HRsRow2, covidObjTotal, vaccineStatObj } from './covid';
import GenderStat from './GenderStat';
import KhopBanner from './KhopBanner';

import {
    bulletinPageSelector,
    hazardTypesSelector,
    languageSelector,
} from '#selectors';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),
    hazardTypes: hazardTypesSelector(state),
    language: languageSelector(state),
});

interface Props {

}

const COLORS_CHART = ['#DC4325', '#EC7F56', '#D6C3AF'];


const BulletinPDFLoss = (props: Props) => {
    const {
        covid24hrsStat,
        covidTotalStat,
        vaccineStat,
        covidProvinceWiseTotal,
        hazardWiseLoss,
        genderWiseLoss,
        feedback,
    } = props.bulletinData;

    const { language: { language }, hazardTypes } = props;
    const [provinceWiseTotal, setprovinceWiseTotal] = useState([]);
    const [hazardWiseLossChart, setHazardWiseChart] = useState([]);
    const [genderWiseLossChart, setGenderWiseChart] = useState([]);

    const renderLegendContent = (p, layout) => {
        const { payload } = p;
        let gap;
        if (layout === 'vertical') {
            gap = '10px';
        } else {
            gap = '35px';
        }
        return (
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: gap }}>
                {
                    payload.map((entry, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={index} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginRight: '20px' }}>
                            <div style={{ width: '15px', height: '15px', marginRight: '4px', backgroundColor: `${entry.color}` }} />
                            <span>
                                {
                                    <Translation>
                                        {
                                            t => <span>{t(`${entry.value}`)}</span>
                                        }
                                    </Translation>

                                }

                            </span>
                        </div>
                    ))
                }
            </div>
        );
    };

    useEffect(() => {
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

        const getDeathCount = (arr, f) => {
            const obj = Object.values(hazardTypes).filter(k => k.titleNe === f || k.titleEn === f);
            let fnepali = null;

            if (obj && obj.length > 0) {
                if (obj[0] && obj[0].titleNe) {
                    fnepali = obj[0].titleNe;
                }
            }
            const filteredArr = arr.filter((a) => {
                if (a.hazardEn) {
                    return a.hazardNp === fnepali;
                }
                return a.hazard === fnepali;
            });
            if (filteredArr && filteredArr.length > 0) {
                const deathObj = filteredArr.reduce((a, b) => ({ deaths: a.deaths + Number(b.deaths) })).deaths;
                return deathObj;
            }
            return 0;
        };

        const getIncidentCount = (arr, f) => {
            // first check if there is hazard field with nepali version of f

            const obj = Object.values(hazardTypes).filter(k => k.titleNe === f || k.titleEn === f);
            let fnepali = null;

            if (obj && obj.length > 0) {
                if (obj[0] && obj[0].titleNe) {
                    fnepali = obj[0].titleNe;
                }
            }
            const fil = arr.filter((a) => {
                if (a.hazardEn) {
                    return a.hazardNp === fnepali;
                }
                return a.hazard === fnepali;
            });
            return fil.length;
        };
        // get feedback object and get its values in an array and extract unique hazard fields
        const newAddedHazardArr = Object.values(feedback);
        const uniqueFieldArr = [...new Set(newAddedHazardArr.map(n => n.hazard))];

        // get unique hazard fields of the added hazard object
        const uniqueFieldHazard = Object.keys(hazardWiseLoss);

        // final combined unique hazard fields and convert all fields into same language
        const uniqueField = [...new Set([...uniqueFieldHazard, ...uniqueFieldArr].map(j => getHazard(j)))];

        const hazardsChartObj = uniqueField.filter(i => !!i).map(f => ({
            hazard: f,
            incident: getIncidentCount(newAddedHazardArr, f),
            death: Number(getDeathCount(newAddedHazardArr, f)),
        }));

        setHazardWiseChart(hazardsChartObj);
        const pieChart = [
            {
                name: language === 'np' ? 'पुरुष' : 'Male',
                value: Number(genderWiseLoss.male),
            },
            {
                name: language === 'np' ? 'महिला' : 'Female',
                value: Number(genderWiseLoss.female),
            },
            {
                name: language === 'np' ? 'पहिचान नभएको' : 'Unknown',
                value: Number(genderWiseLoss.unknown),
            },
        ];
        setGenderWiseChart(pieChart);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);


    const renderLegendPie = (p, layout) => {
        const { payload } = p;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '100%', height: '60mm', paddingBottom: '40px' }}>
                {
                    payload.map((entry, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginRight: '20px' }}>
                            <div style={{ width: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30px', color: '#fff', borderRadius: '50%', marginRight: '4px', backgroundColor: `${entry.color}` }}>
                                {entry.payload.value}
                            </div>
                            <span>{entry.value}</span>
                        </div>
                    ))
                }
            </div>
        );
    };

    const bullets = [
        <div style={{ width: '10px', height: '10px', backgroundColor: '#A6B2DE', marginRight: '3px' }} />,
        <div style={{ width: '10px', height: '10px', backgroundColor: '#3F69C8', marginRight: '3px' }} />,
        <div style={{ width: '10px', height: '10px', backgroundColor: '#3457A6', marginRight: '3px' }} />,
    ];

    useEffect(() => {
        const cD = Object.keys(covidProvinceWiseTotal).map(c => ({
            province: language === 'np' ? nepaliRef[c] : provincesRef[c],
            [language === 'np' ? 'कुल संक्रमित संन्ख्या' : 'Total Affected']: covidProvinceWiseTotal[c].totalAffected,
            [language === 'np' ? 'कुल सक्रिय संक्रमित संन्ख्या' : 'Total Active']: covidProvinceWiseTotal[c].totalActive ? covidProvinceWiseTotal[c].totalActive : 0,
            [language === 'np' ? 'कुल मृत्‍यु संन्ख्या' : 'Total Deaths']: covidProvinceWiseTotal[c].totalDeaths ? covidProvinceWiseTotal[c].totalDeaths : 0,
        }));
        setprovinceWiseTotal(cD);
    }, [covidProvinceWiseTotal, language]);

    const DataFormater = (number, lang) => {
        if (lang === 'np') {
            if (number > 10000000) {
                return `${(number / 10000000).toLocaleString()}करोड`;
            } if (number > 1000000) {
                return `${(number / 100000).toLocaleString()}लाख`;
            } if (number > 1000) {
                return `${(number / 1000).toLocaleString()}हजार`;
            }
        } else {
            if (number > 1000000000) {
                return `${(number / 1000000).toLocaleString()}B`;
            } if (number > 1000000) {
                return `${(number / 100000).toLocaleString()}M`;
            } if (number > 1000) {
                return `${(number / 1000).toLocaleString()}K`;
            }
        }
        return number.toLocaleString();
    };

    const getChartNull = (data = [{ value: 0 }]) => {
        if (data && data.reduce(
            (a, b) => ({
                value: a.value + b.value,
            }), { value: 0 },
        ).value === 0) {
            return true;
        }
        return false;
    };

    return (
        <div className={language === 'np' ? styles.covidPDFContainer : styles.covidPDFContainerEnglish}>
            <div className={styles.container1}>
                <div className={styles.hazardWiseStats}>
                    <h2>
                        <Translation>
                            {
                                t => <span>{t('Hazardwise Breakdown of Incidents and Deaths')}</span>
                            }
                        </Translation>
                    </h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={hazardWiseLossChart}
                            margin={{
                                top: 20,
                                right: 0,
                                left: 15,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                type="number"
                                tickFormatter={e => DataFormater(e, language)}
                            />
                            <YAxis
                                type="category"
                                dataKey="hazard"
                            />

                            <Legend content={e => renderLegendContent(e, 'vertical')} />
                            <Bar dataKey="death" fill="#D10000" barSize={7} />
                            <Bar dataKey="incident" fill="#D4A367" barSize={7} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.genderWiseStats}>
                    <h2>
                        <Translation>
                            {
                                t => <span>{t('Genderwise Breakdown of Deaths')}</span>
                            }
                        </Translation>
                    </h2>
                    {
                        getChartNull(genderWiseLossChart)
                            ? (
                                <div className={styles.noDataPie}>
                                    <Translation>
                                        {
                                            t => <h1>{t('No Deaths Reported')}</h1>
                                        }
                                    </Translation>
                                </div>
                            )
                            : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart
                                        width={200}
                                        height={150}
                                        margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                                    >
                                        <Pie
                                            data={genderWiseLossChart}
                                            innerRadius={40}
                                            outerRadius={60}
                                            fill="#8884d8"
                                            paddingAngle={0}
                                            dataKey="value"
                                            stroke="none"
                                            label
                                            startAngle={90}
                                            endAngle={450}
                                        >
                                            {
                                                genderWiseLossChart.map((entry, index) => (
                                                    <Cell
                                                        label
                                                        key={`cell-${entry.name}`}
                                                        fill={COLORS_CHART[index % COLORS_CHART.length]}
                                                    />
                                                ))
                                            }
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="vertical" align="right" content={renderLegendPie} />
                                    </PieChart>

                                </ResponsiveContainer>
                            )
                    }
                </div>
            </div>
            <div className={styles.container2}>
                <div className={styles.covid24}>

                    <h2>
                        <Translation>
                            {
                                t => <span>{t('COVID-19 Stats for last 24 hours')}</span>
                            }
                        </Translation>

                    </h2>
                    <div className={styles.lossIconsRow}>
                        {

                            covidObj24HRs.map(l => (
                                <Translation>
                                    {
                                        t => (
                                            <LossItem
                                                lossIcon={l.logo}
                                                lossTitle={t(`${l.title}`)}
                                                loss={Number(covid24hrsStat[l.lossKey]).toLocaleString()}
                                            />
                                        )
                                    }
                                </Translation>

                            ))
                        }
                    </div>

                    <div className={styles.middle} />
                    <div className={styles.genderRow}>
                        {
                            covidObj24HRsRow2.map(l => (
                                <div className={styles.maleFemale}>
                                    <GenderStat
                                        title={l.title}
                                        value={Number(covid24hrsStat[l.lossKey]).toLocaleString()}
                                        icon={l.logo}
                                    />
                                </div>
                            ))
                        }
                    </div>

                    <div className={styles.khopContainer}>
                        <h2>
                            <Translation>
                                {
                                    t => <span>{t('Vaccine Stats')}</span>
                                }
                            </Translation>

                        </h2>
                        <div className={styles.khopRow}>
                            {
                                vaccineStatObj.map((l, i) => {
                                    if (i === 0) {
                                        return (
                                            <Translation>
                                                {
                                                    t => (
                                                        <KhopBanner
                                                            value={Number(vaccineStat[l.khopKey]).toLocaleString()}
                                                            title={t(`${l.title}`)}
                                                            percentage={null}
                                                        />
                                                    )
                                                }
                                            </Translation>


                                        );
                                    }
                                    return (
                                        <Translation>
                                            {
                                                t => (
                                                    <KhopBanner
                                                        value={Number(vaccineStat[l.khopKey]).toLocaleString()}
                                                        title={t(`${l.title}`)}
                                                        percentage={
                                                            (Math.round((vaccineStat.secondDosage / vaccineStat.firstDosage) * 100))
                                                        }
                                                    />
                                                )
                                            }
                                        </Translation>

                                    );
                                })
                            }
                        </div>
                    </div>

                </div>
                <div className={styles.covidTotal}>
                    <h2>
                        <Translation>
                            {
                                t => <span>{t('COVID-19 Stats till date')}</span>
                            }
                        </Translation>
                    </h2>
                    <div className={styles.lossIconsRow}>
                        {
                            covidObjTotal.map(l => (
                                <Translation>
                                    {
                                        t => (
                                            <LossItem
                                                lossIcon={l.logo}
                                                lossTitle={t(`${l.title}`)}
                                                loss={Number(covidTotalStat[l.lossKey]).toLocaleString()}
                                            />
                                        )
                                    }
                                </Translation>

                            ))
                        }
                    </div>

                </div>
            </div>
            <div className={styles.provinceWiseTotal}>
                <h2>
                    <Translation>
                        {
                            t => <span>{t('Province-wise death, missing and injured')}</span>
                        }
                    </Translation>

                </h2>
                <ResponsiveContainer width="90%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={provinceWiseTotal}
                        margin={{
                            top: 20,
                            right: 10,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            type="number"
                            // tickFormatter={tick => tick.toLocaleString()}
                            tickFormatter={e => DataFormater(e, language)}
                            tick={{ fontSize: 10, width: 250 }}
                        // unit={'लाख'}
                        />
                        <YAxis
                            type="category"
                            dataKey="province"
                            tick={{ fontSize: 11, width: 250 }}
                        />

                        {/* <Tooltip /> */}
                        <Bar
                            stackId={'a'}
                            dataKey={
                                language === 'np' ? 'कुल संक्रमित संन्ख्या' : 'Total Affected'}
                            fill="#A6B2DE"
                            barSize={12}
                        />
                        {/* <Bar
                            stackId={'a'}
                            dataKey={language === 'np' ? 'कुल सक्रिय संक्रमित संन्ख्या' : 'Total Active'}
                            fill="#3F69C8"
                            barSize={12}
                        />
                        <Bar

                            stackId={'a'}
                            dataKey={language === 'np' ? 'कुल मृत्‍यु संन्ख्या' : 'Total Deaths'}
                            fill="#3457A6"
                            barSize={12}
                        /> */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div>
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
                                    {pwT === 'totalActive' || pwT === 'totalDeaths' ? '' : (
                                        <Translation>
                                            {
                                                t => (
                                                    <td>
                                                        {bullets[i]}
                                                        {t(`${pwT}`)}
                                                    </td>
                                                )
                                            }
                                        </Translation>
                                    )}


                                    {Object.keys(covidProvinceWiseTotal)
                                        .map(prov => (
                                            pwT === 'totalActive' || pwT === 'totalDeaths' ? ''
                                                : (
                                                    <td key={prov}>
                                                        {Number(covidProvinceWiseTotal[prov][pwT]).toLocaleString() === 'NaN'
                                                            ? '-'
                                                            : Number(covidProvinceWiseTotal[prov][pwT]).toLocaleString()}
                                                    </td>
                                                )
                                        ))
                                    }

                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default connect(mapStateToProps)(
    // createConnectedRequestCoordinator<ReduxProps>()(
    // createRequestClient(requests)(
    BulletinPDFLoss,
    // ),
    // ),
);
