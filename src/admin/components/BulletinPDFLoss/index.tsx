/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';

import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
} from 'recharts';
import { connect } from 'react-redux';
import GovLogo from 'src/admin/resources/govtLogo.svg';
import NepaliDate from 'src/admin/components/NepaliDate';
import styles from './styles.scss';
import { lossObj } from './loss';
import LossItem from './LossItem';
import { nepaliRef } from '../BulletinForm/formFields';
import IncidentMap from './IncidentMap/index';
import {
    bulletinPageSelector,
} from '#selectors';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),

});

interface Props {

}

const COLORS_CHART = ['#DC4325', '#EC7F56', '#D6C3AF'];

const BulletinPDF = (props: Props) => {
    const {
        sitRep,
        incidentSummary,
        hazardWiseLoss,
        genderWiseLoss,
        peopleLoss,
    } = props.bulletinData;
    const [provWiseLossChart, setProvWiseChart] = useState([]);
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
                        <div key={index} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginRight: '20px' }}>
                            <div style={{ width: '15px', height: '15px', marginRight: '4px', backgroundColor: `${entry.color}` }} />
                            <span>{entry.value}</span>
                        </div>
                    ))
                }
            </div>
        );
    };
    const renderLegendPie = (p, layout) => {
        const { payload } = p;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '100%', height: '50mm', paddingTop: '20px' }}>
                {
                    payload.map((entry, index) => (
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
    useEffect(() => {
        const cD = Object.keys(peopleLoss).map(pL => ({
            province: nepaliRef[pL],
            मृत्यु: peopleLoss[pL].death,
            बेपत्ता: peopleLoss[pL].missing,
            घाईते: peopleLoss[pL].injured,
        }));
        setProvWiseChart(cD);
        const hcD = Object.keys(hazardWiseLoss).map(h => (
            {
                hazard: h,
                घटना: hazardWiseLoss[h].incidents,
                मृत्यु: hazardWiseLoss[h].deaths,
            }
        ));
        setHazardWiseChart(hcD);
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
    return (
        <div className={styles.pdfContainer}>
            <div className={styles.headerNLoss}>
                <div className={styles.header}>
                    <div className={styles.subDiv}>
                        <img
                            src={GovLogo}
                            alt="Nepal Government"
                        />
                        <div className={styles.govTitles}>
                            <ul>
                                <li>
                                नेपाल सरकार
                                </li>
                                <li>
                                गृह मन्त्रालय
                                </li>
                                <li className={styles.bold}>
                                राष्ट्रिय बिपद जोखिम न्युनिकरन तथा व्यवस्थापना प्राधिकरण
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.reportTitles}>
                        <h1>दैनिक बिपद बुलेटिन</h1>
                        <p>
                            <NepaliDate />
                            {' '}
                            | SitRep #
                            {sitRep || 0}
                        </p>
                    </div>
                </div>
                <div className={styles.loss}>
                    <h2>२४ घण्टा मा बिपदका विवरणहरु </h2>
                    {/* <p>१-२ पौष २०७८, बिहान १० बजे सम्म </p> */}
                    <div className={styles.lossIconsRow}>
                        {
                            lossObj.map(l => (
                                <LossItem
                                    lossIcon={l.logo}
                                    lossTitle={l.title}
                                    loss={incidentSummary[l.lossKey]}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={styles.provinceWiseLoss}>
                <div className={styles.provinceWiseChart}>
                    <h2>प्रदेश अनुसार मृत्‍यु, बेपत्ता र घाइते संख्या को बर्गिकरण    </h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={provWiseLossChart}
                            margin={{
                                top: 20,
                                right: 0,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="province" angle={-45} tickMargin={20} padding={{ right: 20 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend content={renderLegendContent} />
                            <Bar dataKey="मृत्यु" stackId="a" fill="#D10000" />
                            <Bar dataKey="बेपत्ता" stackId="a" fill="#E77677" />
                            <Bar dataKey="घाईते" stackId="a" fill="#FB989A" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.provinceWiseIncidentsMap}>
                    <h2>प्रकोप अनुसार घटनाको विवरण (२४ घण्टा)</h2>
                    <IncidentMap />
                </div>
            </div>
            <div className={styles.hazardWiseStats}>
                <h2>प्रकोप अनुसार घटना र मृत्‍यु संख्याको बर्गिकरण </h2>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={hazardWiseLossChart}
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
                                genderWiseLossChart.map((entry, index) => <Cell label key={`cell-${entry.name}`} fill={COLORS_CHART[index % COLORS_CHART.length]} />)
                            }
                        </Pie>
                        <Tooltip />
                        <Legend layout="vertical" align="right" content={renderLegendPie} />
                    </PieChart>

                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default connect(mapStateToProps)(
    // createConnectedRequestCoordinator<ReduxProps>()(
    // createRequestClient(requests)(
    BulletinPDF,
    // ),
    // ),
);
