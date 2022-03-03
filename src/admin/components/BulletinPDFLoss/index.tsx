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
import { Translation } from 'react-i18next';
import styles from './styles.scss';
import { lossObj } from './loss';
import LossItem from './LossItem';
import { nepaliRef, provincesRef } from '../BulletinForm/formFields';
import IncidentMap from './IncidentMap/index';
import {
    bulletinPageSelector, hazardTypeListSelector,
    languageSelector,
} from '#selectors';
import IncidentLegend from '#rscz/Legend';
import HazardsLegend from '#components/HazardsLegend';

const mapStateToProps = state => ({
    bulletinData: bulletinPageSelector(state),
    hazardTypes: hazardTypeListSelector(state),
    language: languageSelector(state),
});

interface Props {

}


const labelSelector = (d: LegendItem, language: string) => {
    if (language === 'en') { return d.label; }
    if (language === 'np') { return d.labelNe; }
    return null;
};
const keySelector = (d: LegendItem) => d.label;
const classNameSelector = (d: LegendItem) => d.style;
const colorSelector = (d: LegendItem) => d.color;
const radiusSelector = (d: LegendItem) => d.radius;
const incidentPointSizeData: LegendItem[] = [
    { label: 'Minor (0)', labelNe: 'मैनेर (0)', style: styles.symbol, color: '#a3a3a3', radius: 8 },
    { label: 'Major (<10)', labelNe: 'मेजर (<10)', style: styles.symbol, color: '#a3a3a3', radius: 11 },
    { label: 'Severe (<100)', labelNe: 'सिविएर (<100)', style: styles.symbol, color: '#a3a3a3', radius: 15 },
    { label: 'Catastrophic (>100)', labelNe: 'कटेस्टरोपिह्क (>100)', style: styles.symbol, color: '#a3a3a3', radius: 20 },
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

    const { hazardTypes, language: { language } } = props;

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
                    payload.map((entry, index) => {
                        console.log('entry.value', entry.value);
                        return (
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
                        );
                    })
                }
            </div>
        );
    };

    useEffect(() => {
        if (hazardTypes && hazardWiseLoss && Object.keys(hazardWiseLoss).length > 0) {
            const getHazardColor = (hazardName) => {
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
            province: language === 'np' ? nepaliRef[pL] : provincesRef[pL],
            death: peopleLoss[pL].death,
            missing: peopleLoss[pL].missing,
            injured: peopleLoss[pL].injured,
        }));
        setProvWiseChart(cD);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);


    return (
        <div className={language === 'np' ? styles.pdfContainer : styles.pdfContainerEnglish}>
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

                                    <Translation>
                                        {
                                            t => <span>{t('Nepal Government')}</span>
                                        }
                                    </Translation>

                                </li>
                                <li>
                                    <Translation>
                                        {
                                            t => <span>{t('Ministry of Home Affairs')}</span>
                                        }
                                    </Translation>

                                </li>
                                <li className={styles.bold}>
                                    <Translation>
                                        {
                                            t => <span>{t('ndrrma')}</span>
                                        }
                                    </Translation>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.reportTitles}>
                        <h1>
                            <Translation>
                                {
                                    t => <span>{t('Daily Bipad Bulletin')}</span>
                                }
                            </Translation>
                        </h1>
                        <p>
                            <NepaliDate />
                            {' '}
                            | SitRep #
                            {sitRep || 0}
                        </p>
                    </div>
                </div>
                <div className={styles.loss}>
                    <h2>
                        <Translation>
                            {
                                t => <span>{t('Disaster Incidents in last 24 hours')}</span>
                            }
                        </Translation>
                    </h2>
                    {/* <p>१-२ पौष २०७८, बिहान १० बजे सम्म </p> */}
                    <div className={styles.lossIconsRow}>
                        {
                            lossObj.map(l => (
                                <LossItem
                                    lossIcon={l.logo}
                                    lossTitle={language === 'np' ? l.title : l.titleEn}
                                    loss={Number(incidentSummary[l.lossKey])}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={styles.pratikriyaContainer}>
                <h2>
                    {' '}
                    <Translation>
                        {
                            t => <span>{t('Disaster Hilights')}</span>
                        }
                    </Translation>


                </h2>
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
                    <h2>
                        <Translation>
                            {
                                t => <span>{t('Province-wise death, missing and injured')}</span>
                            }
                        </Translation>
                    </h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={provWiseLossChart}
                            margin={{
                                top: 20,
                                right: 0,
                                left: 15,
                                bottom: 5,
                            }}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                type="number"
                                allowDecimals={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="province"
                            />
                            {/* <Tooltip /> */}
                            <Legend content={renderLegendContent} />
                            <Bar dataKey="death" stackId="a" fill="#D10000" />
                            <Bar dataKey="missing" stackId="a" fill="#E77677" />
                            <Bar dataKey="injured" stackId="a" fill="#FB989A" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.provinceWiseIncidentsMap}>
                    <h2>
                        <Translation>
                            {
                                t => <span>{t('Hazard-wise breakdown of incidents (last 24 hours)')}</span>
                            }
                        </Translation>
                    </h2>
                    <IncidentMap
                        hazardWiseLoss={hazardWiseLoss}
                        incidentPoints={incidentPoints}
                    />
                    <div className={styles.pointSizeLegendContainer}>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                <Translation>
                                    {
                                        t => <span>{t('Death Count')}</span>
                                    }
                                </Translation>

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
                            labelSelector={d => labelSelector(d, language)}
                            symbolClassNameSelector={classNameSelector}
                        />
                        <div className={styles.hazardLegend}>
                            <div className={styles.legendTitle}>

                                <Translation>
                                    {
                                        t => <span>{t('Hazard Legend')}</span>
                                    }
                                </Translation>
                            </div>
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
