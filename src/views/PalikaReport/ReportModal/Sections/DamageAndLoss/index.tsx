import React from 'react';
import { Table } from 'react-bootstrap';
import styles from './styles.scss';
import WardwiseDeath from './WardwiseDeath';

import deathIcon from './Icons/icon_death.svg';
import incidentIcon from './Icons/icon_incident.svg';
import injuredIcon from './Icons/icon_injured.svg';
import livestockIcon from './Icons/icon_livestock.svg';
import lossIcon from './Icons/icon_loss.svg';
import missingIcon from './Icons/icon_missing.svg';
import roadIcon from './Icons/icon_road.svg';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import NextPrevBtns from '../../NextPrevBtns';


interface Props{

}
const DamageAndLoss = (props: Props) => {
    console.log(props);
    const handleDataSave = () => {
        props.updateTab();
    };
    console.log('damage prop: ', props.hide);
    return (
        <div className={styles.tabsPageContainer}>
            {/* <Table striped bordered hover size="md">
                <thead>
                    <tr>
                        <th>No of Incidents</th>
                        <th>People Death</th>
                        <th>Estimated Loss</th>
                        <th>Infrastructures Destroyed</th>
                        <th>Livestock Destroyed</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                    </tr>
                </tbody>
            </Table> */}

            <div className={styles.damageContainer}>
                <div className={styles.damageItemContainer}>
                    <ScalableVectorGraphics
                        className={styles.bulletPoint}
                        src={deathIcon}
                        alt="Bullet Point"
                    />
                    <div className={styles.damageTitle}>
                        <hr />
                        <p>Deaths</p>
                        <p>123</p>
                    </div>
                </div>
                <div className={styles.damageItemContainer}>
                    <ScalableVectorGraphics
                        className={styles.bulletPoint}
                        src={incidentIcon}
                        alt="Bullet Point"
                    />
                    <div className={styles.damageTitle}>
                        <hr />
                        <p>INCIDENTS</p>
                        <p>123</p>
                    </div>
                </div>
                <div className={styles.damageItemContainer}>
                    <ScalableVectorGraphics
                        className={styles.bulletPoint}
                        src={injuredIcon}
                        alt="Bullet Point"
                    />
                    <div className={styles.damageTitle}>
                        <hr />
                        <p>INJURED</p>
                        <p>123</p>
                    </div>
                </div>
                <div className={styles.damageItemContainer}>
                    <ScalableVectorGraphics
                        className={styles.bulletPoint}
                        src={livestockIcon}
                        alt="Bullet Point"
                    />
                    <div className={styles.damageTitle}>
                        <hr />
                        <p>LIVESTOCK</p>
                        <p>123</p>
                    </div>
                </div>
                <div className={styles.damageItemContainer}>
                    <ScalableVectorGraphics
                        className={styles.bulletPoint}
                        src={lossIcon}
                        alt="Bullet Point"
                    />
                    <div className={styles.damageTitle}>
                        <hr />
                        <p>ESTIMATED LOSS</p>
                        <p>123</p>
                    </div>
                </div>
                <div className={styles.damageItemContainer}>
                    <ScalableVectorGraphics
                        className={styles.bulletPoint}
                        src={missingIcon}
                        alt="Bullet Point"
                    />
                    <div className={styles.damageTitle}>
                        <hr />
                        <p>PEOPLE MISSING</p>
                        <p>123</p>
                    </div>
                </div>
                <div className={styles.damageItemContainer}>

                    <ScalableVectorGraphics
                        className={styles.bulletPoint}
                        src={roadIcon}
                        alt="Bullet Point"
                    />
                    <div className={styles.damageTitle}>
                        <hr />
                        <p>ROAD ACCIDENTS</p>
                        <p>123</p>
                    </div>
                </div>


            </div>
            {
                props.hide !== 1
                    ? (
                        <NextPrevBtns
                            handlePrevClick={props.handlePrevClick}
                            handleNextClick={props.handleNextClick}
                        />
                    )
                    : ''
            }

        </div>
    );
};

export default DamageAndLoss;
