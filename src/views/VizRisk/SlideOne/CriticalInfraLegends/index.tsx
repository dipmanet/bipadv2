import React, { useState } from 'react';
import Icon from '#rscg/Icon';
import VRLegend from '../../VRLegend';
import styles from './styles.scss';

const CriticalInfraLegends = (props) => {
    const [showPopulationWard, setShowPopulationWard] = useState(false);
    const [showPopulationDensity, setShowPopulationDensity] = useState(true);
    const {
        handlePopulationChange,
    } = props;


    const handlePopulationClick = (val) => {
        handlePopulationChange(val);
        if (val === 'ward') {
            setShowPopulationWard(true);
            setShowPopulationDensity(false);
        } else {
            setShowPopulationWard(false);
            setShowPopulationDensity(true);
        }
    };

    return (
        <VRLegend>
            <div className={styles.legendContainer}>
                <div>
                    <h2>Critical Infrastructures</h2>
                </div>
                <div>

                    <div className={styles.populationContainer}>
                        Legends go here

                    </div>
                </div>
            </div>

        </VRLegend>
    );
};

export default CriticalInfraLegends;
