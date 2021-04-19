import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ComposedChart,
    Line,
    Area,
    Bar,
    YAxis,
    XAxis,
    CartesianGrid,
    Legend,
    Scatter,
    ResponsiveContainer,
    BarChart } from 'recharts';
import styles from './styles.scss';
import LineData from './data';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import DamageAndLoss from '../../DamageAndLoss';
import Inventory from '../../Inventory';
import Budget from '../../Budget';
import WardwiseDeath from '../../DamageAndLoss/WardwiseDeath';
import ProgrammeAndPolicies from '../../ProgrammeAndPolicies';
import BudgetActivity from '../../BudgetActivity';

import page2line2 from './page2line2.svg';
import page2line21 from './page2line21.svg';
import page2line3 from './beneficiary.svg';

import govtlogo from '../../../../govtLogo.svg';

import {
    generalDataSelector,
} from '#selectors';

const mapStateToProps = state => ({
    generalData: generalDataSelector(state),
});

interface Props{
    reportData: Element[];
}

const PageTwo = (props: Props) => {
    const { reportData, generalData } = props;
    const [mayorName, setmayorName] = useState('');
    const {
        lineData,
        composedChart,
        scatterChart,
        barChart,
    } = LineData;
    useEffect(() => {
        if (generalData && generalData.mayor) {
            const mayor = generalData.mayor.split(',')[0].split(':')[1];
            setmayorName(mayor);
        }
    }, [generalData]);
    return (
        <div className={styles.previewContainer}>
            {/* {reportData.map(comp => (
                <div key={comp.name} className={styles.previewComps}>

                    {comp}
                </div>
            ))} */}
            <div className={styles.rowOne}>
                <div className={styles.mainTitle}>
                    DISASTER INCIDENT SUMMARY
                    <DamageAndLoss hide={1} />
                </div>
            </div>
            <div className={styles.rowTwo}>
                <div className={styles.columnTwoOne}>
                    <div className={styles.mainTitle}>
                PEOPLE DEATH IN RAJAPUR (TOP 5 WARDS)
                    </div>
                    <ScalableVectorGraphics
                        className={styles.sectionSvg}
                        src={page2line2}
                        alt="Nepal Government"
                    />
                </div>
                <div className={styles.columnTwoTwo}>
                    <div className={styles.mainTitle}>
                HAZARDWISE IMPACT
                    </div>
                    <ScalableVectorGraphics
                        className={styles.sectionSvg}
                        src={page2line21}
                        alt="Nepal Government"
                    />
                </div>

            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                    <div className={styles.mainTitle}>
                    RELIEF
                    </div>
                    <div className={styles.mainTitle}>
                        <p>Total Relief amount: Rs 347688</p>
                        <p>Total number of beneficiary families: 122</p>
                        <div className={styles.colmunText}>
                            <p>Madhesi: 15</p>
                            <p>Disabled: 18</p>
                            <p>Female: 22</p>
                            <p>Janajati: 55</p>
                            <p>Dalit: 44</p>
                        </div>

                    </div>

                    <ScalableVectorGraphics
                        className={styles.sectionSvg}
                        src={page2line3}
                        alt="Nepal Government"
                    />
                    {' '}

                </div>

            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                    Budget
                </div>
                <div className={styles.columnThreeTwo}>
                   Budget Activity
                </div>
            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                RELIEF DATA
                </div>
                <div className={styles.columnThreeTwo}>
                Preparedness Data
                </div>
            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                   Research Data
                </div>
                <div className={styles.columnThreeTwo}>
                    Recovery Data

                </div>
            </div>
            <div className={styles.rowFour}>

                <div className={styles.sectionLeft}>
                    <ScalableVectorGraphics
                        className={styles.bulletPoint}
                        src={govtlogo}
                        alt="Nepal Government"
                    />

                    <div className={styles.address}>
                        <span className={styles.title}>Rajapur Municipality</span>
                        <br />
                        <span className={styles.desc}> Bardiya District, Lumbini Province</span>
                    </div>

                </div>
                <div className={styles.sectionright}>
                    <div className={styles.mayorName}>
                        <ul className={styles.list}>
                            <li className={styles.title}>Mayor/NagarPramukh</li>
                            <li>{mayorName}</li>
                            <li>9858027167 </li>

                        </ul>
                    </div>
                    <div className={styles.mayorName}>
                        <ul className={styles.list}>
                            <li className={styles.title}>CAO</li>
                            <li>No Data </li>
                            <li>No Data </li>
                        </ul>
                    </div>
                    <div className={styles.mayorName}>
                        <ul className={styles.list}>
                            <li className={styles.title}>Focal Person</li>
                            <li>Khusi Ram Tharu</li>
                            <li>9851046372</li>
                        </ul>
                    </div>

                </div>
            </div>

        </div>


    );
};

export default connect(mapStateToProps, undefined)(PageTwo);
