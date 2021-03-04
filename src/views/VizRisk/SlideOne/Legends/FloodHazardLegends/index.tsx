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
    const {
        handleFloodChange,
        handleExposedElementChange,
        handleChisapani,
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
            const newVal = !showExposedAll;
            resetExposedLayers();
            setShowExposedAll(true);
        }
        if (layer === 'school') {
            const newVal = !showExposedSchool;
            resetExposedLayers();
            setShowExposedSchool(true);
        }

        if (layer === 'roads') {
            const newVal = !showRoads;
            resetExposedLayers();
            setShowExposedRoads(true);
        }
        if (layer === 'building') {
            const newVal = !showExposedBuilding;
            resetExposedLayers();
            setShowExposedBuilding(true);
        }
        if (layer === 'canals') {
            const newVal = !showCanals;
            resetExposedLayers();
            setShowExposedCanals(true);
        }
        if (layer === 'safeshelters') {
            const newVal = !showSafeShelter;
            resetExposedLayers();
            setShowSafeShelter(true);
        }
    };
    const handleLegendBtnClick = (layer) => {
        handleFloodChange(layer);
        setActiveRasterLayer(layer);
    };

    return (
        <>
            <h3>
                Flood Hazard
                {' '}
                <br />
                in Return Periods (years)
            </h3>
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
                                    stroke: '#ddd',
                                    strokeWidth: 50,
                                    fill: activeRasterLayer === '5' ? 'rgba(255,255,255,0.67)' : 'transparent',

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
                                    stroke: '#ddd',
                                    strokeWidth: 50,
                                    fill: activeRasterLayer === '10'
                                    ? 'rgba(255,255,255,0.67)' : 'transparent',

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
                            className={activeRasterLayer === '50'
                                ? styles.legendBtnSelected
                                : styles.legendBtn}
                            onClick={() => handleLegendBtnClick('50')}

                        >
                            <Hexagon
                                style={{
                                    stroke: '#ddd',
                                    strokeWidth: 50,
                                    fill: activeRasterLayer === '50' ? 'rgba(255,255,255,0.67)' : 'transparent',

                                }}
                                className={styles.educationHexagon}
                            />


                            50years
                            {' '}

                        </button>
                    </div>
                </div>
                <div className={styles.floodSubGroup}>
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
                                    stroke: '#ddd',
                                    strokeWidth: 50,
                                    fill: activeRasterLayer === '100' ? 'rgba(255,255,255,0.67)' : 'transparent',

                                }}
                                className={styles.educationHexagon}
                            />


                            100 years
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
                                    stroke: '#ddd',
                                    strokeWidth: 50,
                                    fill: activeRasterLayer === '1000' ? 'rgba(255,255,255,0.67)' : 'transparent',

                                }}
                                className={styles.educationHexagon}
                            />


                            1000 years
                        </button>
                    </div>
                </div>
            </div>

            <h2>Flood depth (in meters)</h2>
            <div className={styles.floodDepthContainer}>
                <div className={styles.floodDepth}>
                    <div className={styles.floodIndicator1} />
                    <div className={styles.floodIndicator2} />
                    <div className={styles.floodIndicator3} />

                </div>
                <div className={styles.floodDepthText}>
                    <div className={styles.floodText}>
                    High (
                        {'>'}
                        {' '}
                        2m)
                    </div>
                    <div className={styles.floodText}>Medium (1m - 2m)</div>
                    <div className={styles.floodText}>
                    Low (
                        {'<'}
                        {' '}
                    1m)
                    </div>
                </div>
            </div>
        </>

    );
};

export default FloodHistoryLegends;
