import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

const DemoGraphicsLegends = (props) => {
    const [showPopulationWard, setShowPopulationWard] = useState(true);
    const [showPopulationDensity, setShowPopulationDensity] = useState(false);
    const {
        handlePopulationChange,
    } = props;


    const handlePopulationClick = (val) => {
        handlePopulationChange(val);
        if (val === 'ward') {
            setShowPopulationWard(true);
            setShowPopulationDensity(false);
        }

        if (val === 'popdensity') {
            setShowPopulationWard(false);
            setShowPopulationDensity(true);
        }
    };

    return (
        <>
            {showPopulationWard
                ? (
                    <div>
                        <h2>Population by ward</h2>
                        <div className={styles.populationContainer}>
                            <div className={styles.populationIndContainer}>
                                <div className={styles.populationIndicator1} />
                                <div className={styles.populationIndicator2} />
                                <div className={styles.populationIndicator3} />
                                <div className={styles.populationIndicator4} />
                                <div className={styles.populationIndicator5} />
                            </div>
                            <div className={styles.populationTextContainer}>
                                <div className={styles.populationText}>
                                    {/* {'>'}
                                    {' '} */}
                                        7079
                                </div>
                                <div className={styles.populationText}>7000</div>
                                <div className={styles.populationText}>6000</div>
                                <div className={styles.populationText}>5000</div>
                                <div className={styles.populationText}>4000</div>
                                <div className={styles.populationText}>3000</div>
                            </div>

                        </div>

                    </div>
                ) : (
                    <div>
                        <h2>
                            Population density
                            <br />
                            (per 0.06 km
                            <sup>2</sup>
)
                        </h2>

                        <div className={styles.populationContainer}>
                            <div className={styles.populationIndContainer}>
                                <div className={styles.populationIndicator1} />
                                <div className={styles.populationIndicator2} />
                                <div className={styles.populationIndicator3} />
                                <div className={styles.populationIndicator4} />
                                <div className={styles.populationIndicator5} />
                            </div>
                            <div className={styles.populationTextContainer}>
                                <div className={styles.populationText}>16400</div>
                                <div className={styles.populationText}>6800</div>
                                <div className={styles.populationText}>3520</div>
                                <div className={styles.populationText}>1760</div>
                                <div className={styles.populationText}>560</div>
                                <div className={styles.populationText}>0</div>
                            </div>

                        </div>
                    </div>
                )
            }


            <h2>Population</h2>
            <div className={styles.hazardItemContainer}>
                <button
                    type="button"
                    className={showPopulationWard ? styles.legendBtnSelected : styles.legendBtn}
                    onClick={() => handlePopulationClick('ward')}
                >
                    <Hexagon
                        style={{
                            stroke: '#fff',
                            strokeWidth: 50,
                            fill: showPopulationWard ? '#036ef0' : 'transparent',
                        }}
                        className={styles.educationHexagon}
                    />
                            By Ward
                </button>
            </div>
            <div className={styles.hazardItemContainer}>
                <button
                    type="button"
                    className={showPopulationDensity ? styles.legendBtnSelected : styles.legendBtn}
                    onClick={() => handlePopulationClick('popdensity')}

                >
                    <Hexagon
                        style={{
                            stroke: '#fff',
                            strokeWidth: 50,
                            fill: showPopulationDensity ? '#036ef0' : 'transparent',

                        }}
                        className={styles.educationHexagon}
                    />

                           By Density
                </button>
            </div>
        </>
    );
};

export default DemoGraphicsLegends;
