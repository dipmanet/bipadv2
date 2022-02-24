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
    bulletinPageSelector, hazardTypeListSelector,
} from '#selectors';
import IncidentLegend from '#rscz/Legend';
import HazardsLegend from '#components/HazardsLegend';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),
    hazardTypes: hazardTypeListSelector(state),
});

interface Props {

}


const labelSelector = (d: LegendItem) => d.label;
const keySelector = (d: LegendItem) => d.label;
const classNameSelector = (d: LegendItem) => d.style;
const colorSelector = (d: LegendItem) => d.color;
const radiusSelector = (d: LegendItem) => d.radius;
const incidentPointSizeData: LegendItem[] = [
    { label: 'Minor (0)', style: styles.symbol, color: '#a3a3a3', radius: 8 },
    { label: 'Major (<10)', style: styles.symbol, color: '#a3a3a3', radius: 11 },
    { label: 'Severe (<100)', style: styles.symbol, color: '#a3a3a3', radius: 15 },
    { label: 'Catastrophic (>100)', style: styles.symbol, color: '#a3a3a3', radius: 20 },
];

// const filteredHazardTypes = [{
//     title: 'fire',
//     color: '#E53935',
// }];

const BulletinPDF = (props: Props) => {
    const {
        sitRep,
        incidentSummary,
        peopleLoss,
        hilight,
        hazardWiseLoss,
        feedback,
    } = props.bulletinData;

    const [provWiseLossChart, setProvWiseChart] = useState([]);
    const [filteredHazardTypes, setHazardLegends] = useState([]);
    const [newHazardGeoJson, setHazardGeoJson] = useState([]);
    const [incidentPoints, setincidentPoints] = useState({});

    const { hazardTypes } = props;

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

    useEffect(() => {
        if (hazardTypes && hazardWiseLoss && Object.keys(hazardWiseLoss).length > 0) {
            const getHazardColor = (hazardName) => {
                console.log('hazar name supplied', hazardName);
                const h = Object
                    .keys(hazardTypes)
                    .filter(k => hazardTypes[k].titleNe === hazardName);
                return hazardTypes[h[0]] ? hazardTypes[h[0]].color : '#000000';
            };

            const getSeverity = (deaths) => {
                if (deaths) {
                    if (Number(deaths) === 0) {
                        return 8;
                    }
                    if (Number(deaths) < 10) {
                        return 11;
                    } if (Number(deaths) >= 10 && Number(deaths) < 100) {
                        return 15;
                    } if (Number(deaths) >= 100) {
                        return 20;
                    }
                }
                return 8;
            };

            const obj = Object.keys(hazardWiseLoss).map(hazardName => (
                {
                    title: hazardName,
                    color: getHazardColor(hazardName),
                }
            ));

            const allHazardsAdded = Object.keys(feedback)
                .map(item => feedback[item])
                .filter(item => item.coordinates)
                .map(item => item.hazard);
            const uniqueAddedHazards = [...new Set(allHazardsAdded)];
            const newhazardLegends = uniqueAddedHazards.map(h => ({
                title: h,
                color: getHazardColor(h),
            }));

            setHazardLegends([...obj, ...newhazardLegends]);

            const features = [];
            Object.keys(hazardWiseLoss).map((h) => {
                if (Object.keys(hazardWiseLoss[h]).length > 2) {
                    // setHazardGeoJson([...newHazardGeoJson,
                    features.push({
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: hazardWiseLoss[h].coordinates },
                        properties: {
                            hazardColor: getHazardColor(h),
                            severityScale: getSeverity(hazardWiseLoss[h].deaths),
                        },
                    // }]);
                    });
                }
                return null;
            });

            Object.keys(feedback)
                .map(item => feedback[item])
                .filter(item => item.coordinates)
                .map((f) => {
                    features.push({
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: f.coordinates },
                        properties: {
                            hazardColor: getHazardColor(f.hazard),
                            severityScale: getSeverity(f.deaths),
                        },
                    });

                    return null;
                });


            console.log('features', features);
            setincidentPoints({
                type: 'FeatureCollection',
                features,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feedback, hazardWiseLoss]);

    useEffect(() => {
        const cD = Object.keys(peopleLoss).map(pL => ({
            province: nepaliRef[pL],
            मृत्यु: peopleLoss[pL].death,
            बेपत्ता: peopleLoss[pL].missing,
            घाईते: peopleLoss[pL].injured,
        }));
        setProvWiseChart(cD);
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
                                राष्ट्रिय बिपद जोखिम न्युनिकरन तथा व्यवस्थापन प्राधिकरण
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
                                    loss={Number(incidentSummary[l.lossKey])}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={styles.pratikriyaContainer}>
                <h2>बिपद्का हाइलाईट</h2>
                <div className={styles.pratikriyas}>
                    <ul>
                        {
                            <li>
                                {hilight}
                            </li>
                        }
                    </ul>
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
                    <IncidentMap
                        hazardWiseLoss={hazardWiseLoss}
                        incidentPoints={incidentPoints}
                    />
                    <div className={styles.pointSizeLegendContainer}>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                मृत्‍यु संख्या
                            </h4>
                        </header>
                        <IncidentLegend
                            className={styles.pointSizeLegend}
                            colorSelector={colorSelector}
                            radiusSelector={radiusSelector}
                            data={incidentPointSizeData}
                            emptyComponent={null}
                            itemClassName={styles.legendItem}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            symbolClassNameSelector={classNameSelector}
                        />
                        <div className={styles.hazardLegend}>
                            <div className={styles.legendTitle}>प्रकोप लेजेन्ड</div>
                            <HazardsLegend
                                filteredHazardTypes={filteredHazardTypes}
                                className={styles.legend}
                                itemClassName={styles.legendItem}
                            />
                        </div>
                    </div>
                </div>
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
