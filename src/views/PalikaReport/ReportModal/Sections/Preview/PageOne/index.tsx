import React from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './styles.scss';
import LineData from './data';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Logo from '../../govtLogo.svg';
import ProgrammeAndPolicies from '../../ProgrammeAndPolicies';
import Contacts from '../../Contacts';
import DRRMembers from '../../Contacts/DRRMembers';
import Simulation from '../../Simulation';
import Organisation from '../../Organisation';
import Inventory from '../../Inventory';
import CriticalInfra from '../../CriticalInfra';

import govtlogo from '../../../../govtLogo.svg';

interface Props{
    reportData: Element[];
}


const data02 = [
    { name: 'Group A', value: 2400 },
    { name: 'Group B', value: 4567 },
    { name: 'Group C', value: 1398 },

];


const Preview = (props: Props) => {
    const {
        generalData,
    } = props;

    return (
        <div className={styles.previewContainer}>
            <div className={styles.header}>


                <div className={styles.address}>
                    <ScalableVectorGraphics
                        className={styles.bulletPoint}
                        src={govtlogo}
                        alt="Nepal Government"
                    />

                    <div className={styles.desc}>
                        <ul>
                            <li className={styles.pageOneTitle}>Rajapur Municipality</li>
                            <li>Bardiya District, Lumbini Province</li>

                        </ul>

                    </div>

                </div>
                <div className={styles.location}>
                    <ul>
                        <li className={styles.pageOneTitle}>Disaster Report</li>
                        <li>FY 2075/76</li>
                        {/* <li>Date: 1/1/2021</li> */}

                    </ul>


                </div>


            </div>
            <div className={styles.rowOne}>
                <div className={styles.columnOneOne}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400}>
                            <Pie
                                dataKey="value"
                                isAnimationActive={false}
                                data={data02}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            />
                            <Pie dataKey="value" data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" label />
                            <Tooltip />
                            <Legend />

                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.columnOneTwo}>
                    Section 2
                </div>
            </div>
            <div className={styles.rowTwo}>
                <div className={styles.columnTwoOne}>
                    Section 3
                </div>
                <div className={styles.columnTwoTwo}>
                    <div className={styles.title}>
                        Section 4
                    </div>
                </div>
            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                   Section 5
                </div>
                <div className={styles.columnThreeTwo}>
                    Section 6
                </div>
            </div>
            <div className={styles.rowFour}>
                <div className={styles.columnFourOne}>
                    Section 7
                </div>
                <div className={styles.columnFourTwo}>
                    Section 8
                </div>
            </div>


        </div>


    );
};

export default Preview;
