import React from 'react';
import styles from './styles.scss';
import LineData from './data';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Logo from '../../../govtLogo.svg';
import ProgrammeAndPolicies from '../../ProgrammeAndPolicies';
import Contacts from '../../Contacts';
import DRRMembers from '../../Contacts/DRRMembers';
import Simulation from '../../Simulation';
import Organisation from '../../Organisation';
import Inventory from '../../Inventory';
import CriticalInfra from '../../CriticalInfra';

interface Props{
    reportData: Element[];
}

const Preview = (props: Props) => {
    const {
        generalData,
    } = props;

    return (
        <div className={styles.previewContainer}>
            <div className={styles.header}>
                <ScalableVectorGraphics
                    className={styles.logo}
                    src={Logo}
                    // src={BulletIcon}
                    alt="Nepal Government Logo"
                />
                <div className={styles.location}>
                    <h1>Rajapur Municipality</h1>
                    <p>Bardiya District, Lumbini Province</p>
                </div>
                <div className={styles.title}>
                    <p><strong>{generalData.reportTitle}</strong></p>
                    <p>2077/01/12 Lorem Ipsum dolor femet graphics</p>
                </div>

            </div>
            <div className={styles.rowOne}>
                <div className={styles.columnOneOne}>
                    {/* <div className={styles.title}>
                        <p>Table 1</p>
                        <p>Something or the other</p>
                    </div> */}
                    <ul className={styles.rolesDesc}>
                        <li>
                            <h2>Palika Pramukh:</h2>
                            {' '}
                            {generalData.mayor}
                        </li>
                        <li>
                            <h2>Pramukh Prasasakiya Adhikrit:</h2>
                            {' '}
                            {generalData.cao}
                        </li>
                        <li>
                            <h2>Disaster focal person:</h2>
                            {' '}
                            {generalData.focalPerson}
                        </li>
                    </ul>
                    <div className={styles.subTitle}>
                        <p>Local Disaster Management Commitee</p>
                        <div className={styles.dates}>
                            Gathan Samiti: Lorem Ipsum
                            <br />
                            Sadasya Sankhya:
                            {generalData.memberCount}
                        </div>
                    </div>

                    <h4>Members</h4>
                    <ol className={styles.members}>
                        <li>Nabanit ji , Mob: 98376437647, Nepal </li>
                        <li>Arun ji, Mob: 98376437647, Nepal </li>
                        <li>Biplab ji, Mob: 98376437647, Nepal </li>
                    </ol>
                    {/* {reportData[0]} */}
                </div>
                <div className={styles.columnOneTwo}>
                    {/* <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            width={500}
                            height={400}
                            data={composedChart}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis dataKey="name" scale="band" />
                            <YAxis />
                            <Legend />
                            <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
                            <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                            <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                            <Scatter dataKey="cnt" fill="red" />
                        </ComposedChart>
                    </ResponsiveContainer> */}
                    <ProgrammeAndPolicies />
                </div>
            </div>
            <div className={styles.rowTwo}>
                <div className={styles.columnTwoOne}>
                    <Contacts />
                </div>
                <div className={styles.columnTwoTwo}>
                    <div className={styles.title}>
                        <DRRMembers />
                    </div>
                </div>
            </div>
            <div className={styles.rowThree}>
                <div className={styles.columnThreeOne}>
                    <Simulation />
                </div>
                <div className={styles.columnThreeTwo}>
                    <Organisation />
                </div>
            </div>
            <div className={styles.rowFour}>
                <div className={styles.columnFourOne}>
                    <Inventory width={'100%'} height={'60%'} />
                </div>
                <div className={styles.columnFourTwo}>
                    <CriticalInfra width={'100%'} height={'60%'} />
                </div>
            </div>


        </div>


    );
};

export default Preview;
