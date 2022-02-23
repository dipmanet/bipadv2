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

import { nepaliRef } from 'src/admin/components/BulletinForm/formFields';
import styles from './styles.scss';
import LossItem from '../BulletinPDFLoss/LossItem';
import { covidObj24HRs, covidObj24HRsRow2, covidObjTotal, vaccineStatObj } from './covid';
import GenderStat from './GenderStat';
import KhopBanner from './KhopBanner';
import {
    bulletinPageSelector,
    hazardTypesSelector,
} from '#selectors';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),
    hazardTypes: hazardTypesSelector(state),
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
                            <span>{entry.value}</span>
                        </div>
                    ))
                }
            </div>
        );
    };

    useEffect(() => {
        const hcD = Object.keys(hazardWiseLoss).map(h => (
            {
                hazard: h,
                घटना: hazardWiseLoss[h].incidents,
                मृत्यु: hazardWiseLoss[h].deaths,
            }
        ));
        const newAddedHazardArr = Object.keys(feedback).map(f => feedback[f]);

        const uniqueFieldArr = [...new Set(newAddedHazardArr.map(n => n.hazard))];
        const uniqueFieldHazard = Object.keys(hazardWiseLoss);
        const uniqueField = [...new Set([...uniqueFieldHazard, ...uniqueFieldArr])];
        const newAddedHazard = uniqueField.map(f => ({
            hazard: f,
            घटना: newAddedHazardArr.filter(item => item.hazard === f).length,
            मृत्यु: newAddedHazardArr.filter(item => item.hazard === f).reduce((a, b) => ({ deaths: Number(a.deaths) + Number(b.deaths) })).deaths,
        }));

        setHazardWiseChart(newAddedHazard);
        const pieChart = [
            {
                name: 'पुरुष',
                value: Number(genderWiseLoss.male),
            },
            {
                name: 'महिला',
                value: Number(genderWiseLoss.female),
            },
            {
                name: 'पहिचान नभएको ',
                value: Number(genderWiseLoss.unknown),
            },
        ];
        setGenderWiseChart(pieChart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


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
            province: nepaliRef[c],
            'कुल संक्रमित संन्ख्या': covidProvinceWiseTotal[c].totalAffected,
            'कुल सक्रिय संक्रमित संन्ख्या': covidProvinceWiseTotal[c].totalActive,
            'कुल मृत्‍यु संन्ख्या': covidProvinceWiseTotal[c].totalDeaths,
        }));
        setprovinceWiseTotal(cD);
    }, [covidProvinceWiseTotal]);

    const DataFormater = number => number / 100000;
    // if(number > 10000000){
    //   return (number/1000000000).toString() + 'B';
    // }else if(number > 1000000){
    //   return (number/1000000).toString() + 'M';
    // }else if(number > 1000){
    //   return (number/1000).toString() + 'K';
    // }else{
    //   return number.toString();
    // }


    return (
        <div className={styles.covidPDFContainer}>

            <div className={styles.container1}>
                <div className={styles.hazardWiseStats}>
                    <h2>प्रकोप अनुसार घटना र मृत्‍यु संख्याको बर्गिकरण </h2>
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
                            <XAxis type="number" />
                            <YAxis
                                type="category"
                                dataKey="hazard"
                            />

                            <Tooltip />
                            <Legend content={e => renderLegendContent(e, 'vertical')} />
                            <Bar dataKey="मृत्यु" fill="#D10000" barSize={7} />
                            <Bar dataKey="घटना" fill="#D4A367" barSize={7} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.genderWiseStats}>
                    <h2>लिङ अनुसार मृत्‍युको बर्गिकरण </h2>
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
                </div>
            </div>
            <div className={styles.container2}>
                <div className={styles.covid24}>
                    <h2>२४ घण्टा मा COVID-19 को विवरणहरु </h2>
                    <div className={styles.lossIconsRow}>
                        {
                            covidObj24HRs.map(l => (
                                <LossItem
                                    lossIcon={l.logo}
                                    lossTitle={l.title}
                                    loss={Number(covid24hrsStat[l.lossKey]).toLocaleString()}
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
                                        value={Number(covid24hrsStat[l.lossKey]).toLocaleString()}
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
                                                value={Number(vaccineStat[l.khopKey]).toLocaleString()}
                                                title={l.title}
                                                percentage={null}
                                            />
                                        );
                                    }
                                    return (
                                        <KhopBanner
                                            value={Number(vaccineStat[l.khopKey]).toLocaleString()}
                                            title={l.title}
                                            percentage={
                                                (Math.round((vaccineStat.secondDosage / vaccineStat.firstDosage) * 100))
                                            }
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>

                </div>
                <div className={styles.covidTotal}>
                    <h2>हालसम्मको COVID-19 को कुल तथ्याङ्क</h2>
                    <div className={styles.lossIconsRow}>
                        {
                            covidObjTotal.map(l => (
                                <LossItem
                                    lossIcon={l.logo}
                                    lossTitle={l.title}
                                    loss={Number(covidTotalStat[l.lossKey]).toLocaleString()}
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
                                <XAxis
                                    type="number"
                                    tickFormatter={tick => tick.toLocaleString()}
                                    // unit={'लाख'}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="province"
                                />

                                {/* <Tooltip /> */}
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
                </div>
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
