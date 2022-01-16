/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { nepaliRef } from 'src/admin/components/BulletinForm/formFields';
import styles from './styles.scss';
import LossItem from '../BulletinPDFLoss/LossItem';
import { covidObj24HRs, covidObj24HRsRow2, covidObjTotal, vaccineStatObj } from './covid';
import GenderStat from './GenderStat';
import KhopBanner from './KhopBanner';

interface Props {

}

const covid24hrsStat = {
    affected: 45,
    femaleAffected: 2,
    maleAffected: 43,
    deaths: 45,
    recovered: 45,
};

const covidTotalStat = {
    totalAffected: 0,
    totalActive: 0,
    totalRecovered: 0,
    totalDeaths: 0,
};


const vaccineStat = {
    firstDosage: 100,
    secondDosage: 70,
};

const covidProvinceWiseTotal = {
    p1: {
        totalAffected: 1,
        totalActive: 2,
        totalDeaths: 3,
    },
    p2: {
        totalAffected: 4,
        totalActive: 5,
        totalDeaths: 6,
    },
    bagmati: {
        totalAffected: 7,
        totalActive: 8,
        totalDeaths: 9,
    },
    gandaki: {
        totalAffected: 10,
        totalActive: 11,
        totalDeaths: 12,
    },
    lumbini: {
        totalAffected: 13,
        totalActive: 14,
        totalDeaths: 15,
    },
    karnali: {
        totalAffected: 16,
        totalActive: 17,
        totalDeaths: 18,
    },
    sudurpaschim: {
        totalAffected: 19,
        totalActive: 20,
        totalDeaths: 21,
    },
};

const feedback = [
    'अविरल वर्षाका कारण स्थानीयवासीलाई उपचारका लागि अस्पताल पठाइएको र आकस्मिक सेवा परिचालन गरिएको छ',
    'अविरल वर्षाका कारण स्थानीयवासीलाई उपचारका लागि अस्पताल पठाइएको र आकस्मिक सेवा परिचालन गरिएको छ',
    'अविरल वर्षाका कारण स्थानीयवासीलाई उपचारका लागि अस्पताल पठाइएको र आकस्मिक सेवा परिचालन गरिएको छ',
    'अविरल वर्षाका कारण स्थानीयवासीलाई उपचारका लागि अस्पताल पठाइएको र आकस्मिक सेवा परिचालन गरिएको छ',
    'अविरल वर्षाका कारण स्थानीयवासीलाई उपचारका लागि अस्पताल पठाइएको र आकस्मिक सेवा परिचालन गरिएको छ',
    'अविरल वर्षाका कारण स्थानीयवासीलाई उपचारका लागि अस्पताल पठाइएको र आकस्मिक सेवा परिचालन गरिएको छ',
];

const BulletinPDFLoss = (props: Props) => {
    const [provinceWiseTotal, setprovinceWiseTotal] = useState([]);
    const bullets = [
        <div style={{ width: '10px', height: '10px', backgroundColor: '#A6B2DE', marginRight: '3px' }} />,
        <div style={{ width: '10px', height: '10px', backgroundColor: '#3F69C8', marginRight: '3px' }} />,
        <div style={{ width: '10px', height: '10px', backgroundColor: '#3457A6', marginRight: '3px' }} />,
    ];
    useEffect(() => {
        const cD = Object.keys(covidProvinceWiseTotal).map(c => ({
            province: nepaliRef[c],
            'कुल संक्रमित संन्ख्या': covidProvinceWiseTotal[c].totalAffected,
            'कुल सक्रिय संक्रमित संन्ख्या': covidProvinceWiseTotal[c].totalActive,
            'कुल मृत्‍यु संन्ख्या': covidProvinceWiseTotal[c].totalDeaths,
        }));
        console.log('cD', cD);

        setprovinceWiseTotal(cD);
    }, []);

    return (
        <div className={styles.covidPDFContainer}>
            <div className={styles.covid24}>
                <h2>२४ घण्टा मा COVID-19 को विवरणहरु </h2>
                <div className={styles.lossIconsRow}>
                    {
                        covidObj24HRs.map(l => (
                            <LossItem
                                lossIcon={l.logo}
                                lossTitle={l.title}
                                loss={covid24hrsStat[l.lossKey]}
                            />
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
                                    value={covid24hrsStat[l.lossKey]}
                                    icon={l.logo}
                                />
                            </div>
                        ))
                    }
                </div>

                <div className={styles.khopContainer}>
                    <h2>खोपको विवरण </h2>
                    <div className={styles.khopRow}>
                        {
                            vaccineStatObj.map((l, i) => {
                                if (i === 0) {
                                    return (
                                        <KhopBanner
                                            value={vaccineStat[l.khopKey]}
                                            title={l.title}
                                            percentage={null}
                                        />
                                    );
                                }
                                return (
                                    <KhopBanner
                                        value={vaccineStat[l.khopKey]}
                                        title={l.title}
                                        percentage={
                                            ((vaccineStat.secondDosage / vaccineStat.firstDosage) * 100).toFixed(0)
                                        }
                                    />
                                );
                            })
                        }
                    </div>
                </div>

            </div>
            <div className={styles.covidTotal}>
                <div className={styles.lossIconsRow}>
                    {
                        covidObjTotal.map(l => (
                            <LossItem
                                lossIcon={l.logo}
                                lossTitle={l.title}
                                loss={covidTotalStat[l.lossKey]}
                            />
                        ))
                    }
                </div>
                <div className={styles.provinceWiseTotal}>
                    <h2>खोप अनुसार अहिले सम्म को कुल तथ्यांक </h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={provinceWiseTotal}
                            margin={{
                                top: 20,
                                right: 0,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis type="number" />
                            <YAxis
                                type="category"
                                dataKey="province"
                            />

                            <Tooltip />
                            <Bar stackId={'a'} dataKey="कुल संक्रमित संन्ख्या" fill="#A6B2DE" barSize={12} />
                            <Bar stackId={'a'} dataKey="कुल सक्रिय संक्रमित संन्ख्या" fill="#3F69C8" barSize={12} />
                            <Bar stackId={'a'} dataKey="कुल मृत्‍यु संन्ख्या" fill="#3457A6" barSize={12} />
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
                                        <td>
                                            {bullets[i]}
                                            {nepaliRef[pwT]}
                                        </td>
                                        {
                                            Object.keys(covidProvinceWiseTotal)
                                                .map(prov => (
                                                    <td key={prov}>
                                                        {covidProvinceWiseTotal[prov][pwT]}
                                                    </td>
                                                ))

                                        }

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className={styles.pratikriyaContainer}>
                    <h2>२४ घण्टामा बिपद्का घटनाहरुमा भएको प्रतिकृया</h2>
                    <div className={styles.pratikriyas}>
                        <ul>
                            {
                                feedback.map(p => (
                                    <li key={p}>
                                        {p}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulletinPDFLoss;
