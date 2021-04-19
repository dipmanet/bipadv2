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
                <DamageAndLoss hide={1} />
            </div>
            <div className={styles.rowTwo}>
                <div className={styles.columnTwoOne}>
                  fjsdkjhf
                </div>
                <div className={styles.columnTwoTwo}>
                    fslkdjfs
                </div>
                <div className={styles.columnTwoThree}>
                    datda
                </div>

            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                        datad
                    {' '}

                </div>
                <div className={styles.columnThreeTwo}>
                    datda

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
