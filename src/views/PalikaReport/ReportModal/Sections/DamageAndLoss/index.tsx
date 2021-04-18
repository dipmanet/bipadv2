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

interface Props{

}
const DamageAndLoss = (props: Props) => {
    console.log(props);
    const handleDataSave = () => {
        props.updateTab();
    };
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
                <ScalableVectorGraphics
                    className={styles.bulletPoint}
                    src={deathIcon}
                    alt="Bullet Point"
                />
                <ScalableVectorGraphics
                    className={styles.bulletPoint}
                    src={incidentIcon}
                    alt="Bullet Point"
                />
                <ScalableVectorGraphics
                    className={styles.bulletPoint}
                    src={injuredIcon}
                    alt="Bullet Point"
                />
                <ScalableVectorGraphics
                    className={styles.bulletPoint}
                    src={livestockIcon}
                    alt="Bullet Point"
                />
                <ScalableVectorGraphics
                    className={styles.bulletPoint}
                    src={lossIcon}
                    alt="Bullet Point"
                />
                <ScalableVectorGraphics
                    className={styles.bulletPoint}
                    src={missingIcon}
                    alt="Bullet Point"
                />
                <ScalableVectorGraphics
                    className={styles.bulletPoint}
                    src={roadIcon}
                    alt="Bullet Point"
                />
            </div>

            <button
                type="button"
                onClick={handleDataSave}
                className={styles.savebtn}
            >
                Next
            </button>
        </div>
    );
};

export default DamageAndLoss;
