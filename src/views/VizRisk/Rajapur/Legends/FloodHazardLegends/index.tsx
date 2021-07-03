import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;


const FloodHistoryLegends = (props: Props) => {
    const [activeRasterLayer, setActiveRasterLayer] = useState('5');

    const [showExposedAll, setShowExposedAll] = useState(true);
    const [showExposedSchool, setShowExposedSchool] = useState(false);
    const [showExposedBuilding, setShowExposedBuilding] = useState(false);
    const [showRoads, setShowExposedRoads] = useState(false);
    const [showCanals, setShowExposedCanals] = useState(false);
    const [showSafeShelter, setShowSafeShelter] = useState(false);
    const [showFloodElements, setshowFloodElements] = useState(true);

    const [showReturnPeriods, setshowReturnPeriods] = useState(false);
    const {
        handleFloodChange,
        handleExposedElementChange,
        handleChisapani,
        showCriticalElements,
    } = props;

    const resetExposedLayers = () => {
        setShowExposedAll(false);
        setShowExposedSchool(false);
        setShowExposedBuilding(false);
        setShowExposedRoads(false);
        setShowExposedCanals(false);
        setShowSafeShelter(false);
    };
    const handleChisapaniBtn = () => {
        handleChisapani();
    };
    const handleExposedClick = (layer) => {
        handleExposedElementChange(layer);

        if (layer === 'all') {
            resetExposedLayers();
            setShowExposedAll(true);
        }
        if (layer === 'school') {
            resetExposedLayers();
            setShowExposedSchool(true);
        }

        if (layer === 'roads') {
            resetExposedLayers();
            setShowExposedRoads(true);
        }
        if (layer === 'building') {
            resetExposedLayers();
            setShowExposedBuilding(true);
        }
        if (layer === 'canals') {
            resetExposedLayers();
            setShowExposedCanals(true);
        }
        if (layer === 'safeshelters') {
            resetExposedLayers();
            setShowSafeShelter(true);
        }
    };
    const handleLegendBtnClick = (layer) => {
        handleFloodChange(layer);
        setActiveRasterLayer(layer);
    };

    const handleFloodtoggle = () => {
        setshowFloodElements(!showCriticalElements);
    };

    return (
        <>
            <button
                type="button"
                className={styles.toggleFlood}
                onClick={handleFloodtoggle}
            >
                <h2>
                    Flood Hazard
                    in Return Period
                </h2>
            </button>

            <div className={styles.floodMainContainer}>
                <div className={styles.floodSubGroup}>
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
                    {/* <div className={styles.floodItemContainer}>
                     <button
                         type="button"
                         className={styles.legendBtn}
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
                 </div> */}
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
                </div>
                <div className={styles.floodSubGroup}>
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
                </div>
            </div>
        </>

    );
};

export default FloodHistoryLegends;
