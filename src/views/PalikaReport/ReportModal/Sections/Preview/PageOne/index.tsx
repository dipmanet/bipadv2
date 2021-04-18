import React from 'react';
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
                   Section 1
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
