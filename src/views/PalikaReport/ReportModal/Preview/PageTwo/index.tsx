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
                <DamageAndLoss />
            </div>
            <div className={styles.rowTwo}>
                <div className={styles.columnTwoOne}>
                    <p>
                        <strong>
                            Top 5 ward in Rajapur Mun that had highest number of deaths
                        </strong>
                    </p>
                    <Inventory width={'100%'} height={'50%'} />
                </div>
                <div className={styles.columnTwoTwo}>
                    <div className={styles.title}>
                        <p><strong>Hazard Wise number of incidents and death </strong></p>
                    </div>
                    <WardwiseDeath width={'100%'} height={'50%'} />
                </div>
                <div className={styles.columnTwoThree}>
                    <Budget />
                </div>

            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                    <ProgrammeAndPolicies />
                </div>
                <div className={styles.columnThreeTwo}>
                    <ProgrammeAndPolicies />

                </div>
            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                    <Budget />
                </div>
                <div className={styles.columnThreeTwo}>
                    <BudgetActivity />
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

        </div>


    );
};

export default Preview;
