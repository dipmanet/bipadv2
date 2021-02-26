import React, { useState } from 'react';
import Icon from '#rscg/Icon';
import VRLegend from '../../VRLegend';
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
        <VRLegend>
            <div className={styles.legendContainer}>
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
                                    <div className={styles.populationText}>More than 7000</div>
                                    <div className={styles.populationText}>6001 - 7000</div>
                                    <div className={styles.populationText}>5001 - 6000</div>
                                    <div className={styles.populationText}>4001 - 5000</div>
                                    <div className={styles.populationText}>3000 - 4000</div>
                                </div>

                            </div>

                        </div>
                    ) : (
                        <div>
                            <h2>
                                Population density
                                {' '}
                                <br />
                                (per 0.0625 km
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
                                    <div className={styles.populationText}>6801 - 16400</div>
                                    <div className={styles.populationText}>3521 - 6800</div>
                                    <div className={styles.populationText}>1761 - 3520</div>
                                    <div className={styles.populationText}>561 - 1760</div>
                                    <div className={styles.populationText}>0 - 560</div>
                                </div>

                            </div>
                        </div>
                    )
                }


                <h2>Layers</h2>
                <div className={styles.hazardItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handlePopulationClick('ward')}

                    >
                        <Icon
                            name="circle"
                            className={showPopulationWard === false
                                ? styles.exposedIcons
                                : styles.exposedIconsClicked}
                        />
                           Population by Ward
                    </button>
                </div>
                <div className={styles.hazardItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handlePopulationClick('popdensity')}

                    >
                        <Icon
                            name="circle"
                            className={showPopulationDensity === false
                                ? styles.exposedIcons
                                : styles.exposedIconsClicked}
                        />
                           Population Density
                    </button>
                </div>

            </div>

        </VRLegend>
    );
};

export default DemoGraphicsLegends;
