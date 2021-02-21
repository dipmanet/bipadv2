import React from 'react';
import VRLegend from '../../VRLegend';
import styles from './styles.scss';

const DemoGraphicsLegends = () => (
    <VRLegend>
        <div className={styles.lagendMainContainer}>
            <h2>POPULATION</h2>
            <div className={styles.legendContainer}>
                <div className={styles.populationLegend} />
                <div className={styles.populationText}>
                    <p>High</p>
                    <p>Low</p>
                </div>
            </div>
        </div>
    </VRLegend>
);

export default DemoGraphicsLegends;
