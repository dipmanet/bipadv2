import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

const DemoGraphicsLegends = (props) => {
    const [showSus, setshowSus] = useState(false);
    const [showSes, setshowSes] = useState(true);
    const {
        handleSesmicLayerChange,
    } = props;


    const handlePopulationClick = (val) => {
        handleSesmicLayerChange(val);

        if (val === 'sus') {
            setshowSus(true);
            setshowSes(false);
        }

        if (val === 'ses') {
            setshowSus(false);
            setshowSes(true);
        }
    };

    return (
        <>

            <div className={styles.hazardItemContainer}>
                <button
                    type="button"
                    className={showSus ? styles.legendBtnSelected : styles.legendBtn}
                    onClick={() => handlePopulationClick('sus')}
                >
                    <Hexagon
                        style={{
                            stroke: '#fff',
                            strokeWidth: 50,
                            fill: showSus ? '#036ef0' : 'transparent',
                        }}
                        className={styles.educationHexagon}
                    />
                           Landslide Suseptibility Map
                </button>
            </div>
            <div className={styles.hazardItemContainer}>
                <button
                    type="button"
                    className={showSes ? styles.legendBtnSelected : styles.legendBtn}
                    onClick={() => handlePopulationClick('ses')}

                >
                    <Hexagon
                        style={{
                            stroke: '#fff',
                            strokeWidth: 50,
                            fill: showSes ? '#036ef0' : 'transparent',

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
