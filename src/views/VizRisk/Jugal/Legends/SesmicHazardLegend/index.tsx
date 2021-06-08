import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

const DemoGraphicsLegends = (props) => {
    const [showPopulationWard, setShowPopulationWard] = useState(false);
    const [showPopulationDensity, setShowPopulationDensity] = useState(true);
    const {
        handleSesmicLayerChange,
    } = props;


    const handlePopulationClick = (val) => {
        handleSesmicLayerChange(val);
        if (val === 'sus') {
            setShowPopulationWard(true);
            setShowPopulationDensity(false);
        }

        if (val === 'ses') {
            setShowPopulationWard(false);
            setShowPopulationDensity(true);
        }
    };

    return (
        <>

            <div className={styles.hazardItemContainer}>
                <button
                    type="button"
                    className={showPopulationWard ? styles.legendBtnSelected : styles.legendBtn}
                    onClick={() => handlePopulationClick('sus')}
                >
                    <Hexagon
                        style={{
                            stroke: '#fff',
                            strokeWidth: 50,
                            fill: showPopulationWard ? '#036ef0' : 'transparent',
                        }}
                        className={styles.educationHexagon}
                    />
                           Landslide Suseptibility Map
                </button>
            </div>
            <div className={styles.hazardItemContainer}>
                <button
                    type="button"
                    className={showPopulationDensity ? styles.legendBtnSelected : styles.legendBtn}
                    onClick={() => handlePopulationClick('ses')}

                >
                    <Hexagon
                        style={{
                            stroke: '#fff',
                            strokeWidth: 50,
                            fill: showPopulationDensity ? '#036ef0' : 'transparent',

                        }}
                        className={styles.educationHexagon}
                    />

                          Seismic Hazard Map
                </button>
            </div>
        </>
    );
};

export default DemoGraphicsLegends;
