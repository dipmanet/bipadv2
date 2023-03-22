import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;


const FloodHistoryLegends = (props: Props) => {
    const [activeRasterLayer, setActiveRasterLayer] = useState('5');


    const {
        handleFloodChange,
        showCriticalElements,
    } = props;

    const handleLegendBtnClick = (layer) => {
        handleFloodChange(layer);
        setActiveRasterLayer(layer);
    };

    return (
        <div className={styles.legendContainer}>
            <button
                type="button"
                className={styles.toggleFlood}
                onClick={handleFloodChange}
            >
                <h2>
                    Flood Hazard
                    <br />
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
                        className={activeRasterLayer === '10'
                            ? styles.legendBtnSelected
                            : styles.legendBtn}
                        onClick={() => handleLegendBtnClick('10')}

                    >
                        <Hexagon
                            style={{
                                stroke: '#9dc7fa',
                                strokeWidth: 50,
                                fill: activeRasterLayer === '10'
                                    ? '#036ef0' : 'transparent',

                            }}
                            className={styles.educationHexagon}
                        />


                         10
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
                        className={activeRasterLayer === '50'
                            ? styles.legendBtnSelected
                            : styles.legendBtn}
                        onClick={() => handleLegendBtnClick('50')}
                    >
                        <Hexagon
                            style={{
                                stroke: '#9dc7fa',
                                strokeWidth: 50,
                                fill: activeRasterLayer === '50' ? '#036ef0' : 'transparent',

                            }}
                            className={styles.educationHexagon}
                        />


                         50 years
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
                <div className={styles.floodItemContainer}>
                    <button
                        type="button"
                        className={activeRasterLayer === '200'
                            ? styles.legendBtnSelected
                            : styles.legendBtn}
                        onClick={() => handleLegendBtnClick('200')}
                    >
                        <Hexagon
                            style={{
                                stroke: '#9dc7fa',
                                strokeWidth: 50,
                                fill: activeRasterLayer === '200' ? '#036ef0' : 'transparent',

                            }}
                            className={styles.educationHexagon}
                        />


                         200 years
                    </button>
                </div>
                <div className={styles.floodItemContainer}>
                    <button
                        type="button"
                        className={activeRasterLayer === '250'
                            ? styles.legendBtnSelected
                            : styles.legendBtn}
                        onClick={() => handleLegendBtnClick('250')}
                    >
                        <Hexagon
                            style={{
                                stroke: '#9dc7fa',
                                strokeWidth: 50,
                                fill: activeRasterLayer === '250' ? '#036ef0' : 'transparent',

                            }}
                            className={styles.educationHexagon}
                        />


                         250 years
                    </button>
                </div>
                <div className={styles.floodItemContainer}>
                    <button
                        type="button"
                        className={activeRasterLayer === '500'
                            ? styles.legendBtnSelected
                            : styles.legendBtn}
                        onClick={() => handleLegendBtnClick('500')}
                    >
                        <Hexagon
                            style={{
                                stroke: '#9dc7fa',
                                strokeWidth: 50,
                                fill: activeRasterLayer === '500' ? '#036ef0' : 'transparent',

                            }}
                            className={styles.educationHexagon}
                        />


                         500 years
                    </button>
                </div>
                <div className={styles.floodItemContainer}>
                    <button
                        type="button"
                        className={activeRasterLayer === '1000'
                            ? styles.legendBtnSelected
                            : styles.legendBtn}
                        onClick={() => handleLegendBtnClick('1000')}
                    >
                        <Hexagon
                            style={{
                                stroke: '#9dc7fa',
                                strokeWidth: 50,
                                fill: activeRasterLayer === '1000' ? '#036ef0' : 'transparent',

                            }}
                            className={styles.educationHexagon}
                        />


                         1000 years
                    </button>
                </div>
            </div>
        </div>

    );
};

export default FloodHistoryLegends;
