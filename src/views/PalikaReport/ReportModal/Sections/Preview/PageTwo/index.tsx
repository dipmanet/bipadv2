import React from 'react';
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

interface Props{
    reportData: Element[];
}

const Preview = (props: Props) => {
    const { reportData } = props;
    const {
        lineData,
        composedChart,
        scatterChart,
        barChart,
    } = LineData;
    return (
        <div className={styles.previewContainer}>
            {/* {reportData.map(comp => (
                <div key={comp.name} className={styles.previewComps}>

                    {comp}
                </div>
            ))} */}
            <div className={styles.rowOne}>
               fsdjfksh
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
                            <li className={styles.title}>Mr Mayor</li>
                            <li>Designation</li>
                            <li>983869220</li>

                        </ul>
                    </div>
                    <div className={styles.mayorName}>
                        <ul className={styles.list}>
                            <li className={styles.title}>CAO</li>
                            <li>Designation</li>
                            <li>983869220</li>
                        </ul>
                    </div>
                    <div className={styles.mayorName}>
                        <ul className={styles.list}>
                            <li className={styles.title}>Focal Person</li>
                            <li>Designation</li>
                            <li>983869220</li>
                        </ul>
                    </div>

                </div>
            </div>

        </div>


    );
};

export default Preview;
