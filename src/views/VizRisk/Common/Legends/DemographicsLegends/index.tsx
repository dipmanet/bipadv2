import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

const DemoGraphicsLegends = (props) => {
    const [showPopulationWard, setShowPopulationWard] = useState(true);
    const [showPopulationDensity, setShowPopulationDensity] = useState(false);
    const {
        handlePopulationChange,
    } = props;
    const densityVals = [
        '4241-6480',
        '2641-4240',
        '1441-2640',
        '481-1440',
        '0-480',
    ];

    const populationVals = [
        '5000-6000',
        '4000-5000',
        '3000-4000',
        '2000-3000',
        '1000-2000',
        '0-1000',
    ];

    const colors = [
        'rgb(255, 94, 0)',
        'rgb(255,111,0)',
        'rgb(255,143,13)',
        'rgb(202, 150, 78)',
        'rgb(255,207,142)',
        'rgb(255,235,198)',
    ];

    const densityColors = [
        '#ff6e00',
        '#ff8c00',
        '#ffa857',
        '#ffca8a',
        '#ffebcc',
    ];

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
