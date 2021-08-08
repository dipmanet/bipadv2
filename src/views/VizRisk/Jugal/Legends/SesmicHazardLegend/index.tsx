import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

const DemoGraphicsLegends = (props) => {
    const [showSus, setshowSus] = useState(true);
    const [showSes, setshowSes] = useState(false);
    const [showFlood, setshowFlood] = useState(false);
    const {
        handleSesmicLayerChange,
        handleFloodLayerChange,
    } = props;


    const handlePopulationClick = (val) => {
        handleSesmicLayerChange(val);

        if (val === 'sus') {
            setshowSus(true);
            setshowSes(false);
            setshowFlood(false);
        }

        if (val === 'ses') {
            setshowSus(false);
            setshowSes(true);
            setshowFlood(false);
        }

        if (val === 'flood') {
            setshowSus(false);
            setshowSes(false);
            setshowFlood(true);
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
            <div className={styles.hazardItemContainer}>
                <button
                    type="button"
                    className={showFlood ? styles.legendBtnSelected : styles.legendBtn}
                    onClick={() => handlePopulationClick('flood')}
                >
                    <Hexagon
                        style={{
                            stroke: '#fff',
                            strokeWidth: 50,
                            fill: showFlood ? '#036ef0' : 'transparent',

                        }}
                        className={styles.educationHexagon}
                    />
                          Flood Maps
                </button>
            </div>
        </>
    );
};

export default DemoGraphicsLegends;
