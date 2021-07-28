import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

const DemoGraphicsLegends = (props) => {
    const [showPopulationWard, setShowPopulationWard] = useState(true);
    const [showPopulationDensity, setShowPopulationDensity] = useState(false);
    const {
        handlePopulationChange,
        legends,
    } = props;
    console.log('legends', legends);
    const {
        densityVals,
        populationVals,
        colors,
        densityColors,
    } = legends;
    const getLegendStyle = (i, c, colorsArr) => {
        if (i === colorsArr.length - 1) {
            return {
                width: '12px',
                height: '25px',
                backgroundColor: c,
                borderRadius: '0 0 6px 6px',
            };
        }
        if (i === 0) {
            return {
                width: '12px',
                height: '25px',
                backgroundColor: c,
                borderRadius: '6px 6px 0 0',
            };
        }
        return {
            width: '12px',
            height: '25px',
            backgroundColor: c,
        };
    };

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
        <div
            className={styles.mainDiv}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '75px',
                zIndex: 200,
            }}
        >
            {showPopulationWard
                ? (
                    <div>
                        <h2>POPULATION BY WARD</h2>
                        <div className={styles.populationContainer}>
                            <div className={styles.populationIndContainer}>
                                {colors.map((c, i) => (
                                    <div
                                        key={c}
                                        style={getLegendStyle(i, c, colors)}
                                    />
                                ))}
                            </div>
                            <div className={styles.populationTextContainer}>

                                {
                                    populationVals
                                        .map(d => (
                                            <div
                                                key={d}
                                                className={styles.populationText}
                                            >
                                                {d}
                                            </div>
                                        ))
                                }

                            </div>

                        </div>

                    </div>
                ) : (
                    <div>
                        <h2>
                            POPULATION DENSITY
                            <br />
                            (per 0.06 km
                            <sup>2</sup>
)
                        </h2>

                        <div className={styles.populationContainer}>
                            <div className={styles.populationIndContainer}>
                                {densityColors.map((c, i) => (
                                    <div
                                        key={c}
                                        style={getLegendStyle(i, c, densityColors)}
                                    />
                                ))}
                            </div>
                            <div className={styles.populationTextContainer}>
                                {
                                    densityVals
                                        .map(d => (
                                            <div
                                                key={d}
                                                className={styles.populationText}
                                            >
                                                {d}
                                            </div>
                                        ))
                                }

                            </div>

                        </div>
                    </div>
                )
            }

            <h2>POPULATION</h2>
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
        </div>
    );
};

export default DemoGraphicsLegends;
