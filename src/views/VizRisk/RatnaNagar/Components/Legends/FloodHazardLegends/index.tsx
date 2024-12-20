import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

interface Props { }

const FloodHazardLegends = (props: Props) => {
    const [activeRasterLayer, setActiveRasterLayer] = useState('5');


    const {
        handleFloodChange,
        setFloodLayer,
        hazardLegendClickedArr,
    } = props;

    const handleLegendBtnClick = (layer) => {
        setFloodLayer(layer);
        setActiveRasterLayer(layer);
    };

    return (
        <>

            <div className={styles.legendContainer}>
                <button
                    type="button"
                    className={styles.toggleFlood}
                    onClick={handleFloodChange}
                >
                    <h2 className={styles.floodHazard}>
                        Flood Hazard
                        in Return Period
                    </h2>
                </button>

                <div className={styles.floodMainContainer}>
                    <div className={styles.floodItemContainer}>
                        <button
                            type="button"
                            className={activeRasterLayer === '5'
                                ? styles.legendBtnSelected
                                : styles.legendBtn}
                            onClick={() => handleLegendBtnClick('5')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#9dc7fa',
                                    strokeWidth: 50,
                                    fill: activeRasterLayer === '5' ? '#036ef0' : 'transparent',

                                }}
                                className={styles.educationHexagon}
                            />

                            5
                            years
                            {' '}

                        </button>
                    </div>

                    <div className={styles.floodItemContainer}>
                        <button
                            type="button"
                            className={activeRasterLayer === '20'
                                ? styles.legendBtnSelected
                                : styles.legendBtn}
                            onClick={() => handleLegendBtnClick('20')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#9dc7fa',
                                    strokeWidth: 50,
                                    fill: activeRasterLayer === '20' ? '#036ef0' : 'transparent',

                                }}
                                className={styles.educationHexagon}
                            />


                            20years
                            {' '}

                        </button>
                    </div>


                    <div className={styles.floodItemContainer}>
                        <button
                            type="button"
                            className={activeRasterLayer === '100'
                                ? styles.legendBtnSelected
                                : styles.legendBtn}
                            onClick={() => handleLegendBtnClick('100')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#9dc7fa',
                                    strokeWidth: 50,
                                    fill: activeRasterLayer === '100' ? '#036ef0' : 'transparent',

                                }}
                                className={styles.educationHexagon}
                            />


                            100 years
                        </button>
                    </div>

                </div>
            </div>


        </>

    );
};

export default FloodHazardLegends;
