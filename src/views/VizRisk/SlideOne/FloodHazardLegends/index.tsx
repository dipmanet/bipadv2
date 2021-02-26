import React, { useState, useContext } from 'react';
import * as PageTypes from '#store/atom/page/types';
import VRLegend from '../../VRLegend';
import Icon from '#rscg/Icon';
import VizRiskContext, { VizRiskContextProps } from '#components/VizRiskContext';
import styles from './styles.scss';
import ManualIcon from '#resources/images/chisapanistation.png';

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
        <VRLegend>
            <div className={styles.legendContainer}>

                <h2>Flood Hazard in Return Periods (years)</h2>
                {/* <p className={styles.subHeading}>Return Period </p> */}
                <div className={styles.floodMainContainer}>
                    <div className={styles.floodSubGroup}>
                        <div className={styles.floodItemContainer}>
                            <button
                                type="button"
                                className={styles.legendBtn}
                                onClick={() => handleLegendBtnClick('5')}
                            >
                                <Icon
                                    name="circle"
                                    className={activeRasterLayer === '5'
                                        ? styles.yearsIconClicked
                                        : styles.yearsIcon}
                                />
                            5
                            </button>
                        </div>
                        <div className={styles.floodItemContainer}>
                            <button
                                type="button"
                                className={styles.legendBtn}
                                onClick={() => handleLegendBtnClick('10')}

                            >
                                <Icon
                                    name="circle"
                                    className={activeRasterLayer === '10'
                                        ? styles.yearsIconClicked
                                        : styles.yearsIcon}
                                />
                            10
                            </button>
                        </div>
                        <div className={styles.floodItemContainer}>
                            <button
                                type="button"
                                className={styles.legendBtn}
                                onClick={() => handleLegendBtnClick('50')}

                            >
                                <Icon
                                    name="circle"
                                    className={activeRasterLayer === '50'
                                        ? styles.yearsIconClicked
                                        : styles.yearsIcon}
                                />
                            50
                            </button>
                        </div>
                    </div>
                    <div className={styles.floodSubGroup}>
                        <div className={styles.floodItemContainer}>
                            <button
                                type="button"
                                className={styles.legendBtn}
                                onClick={() => handleLegendBtnClick('100')}

                            >
                                <Icon
                                    name="circle"
                                    className={activeRasterLayer === '100'
                                        ? styles.yearsIconClicked
                                        : styles.yearsIcon}
                                />
                            100
                            </button>
                        </div>

                        <div className={styles.floodItemContainer}>
                            <button
                                type="button"
                                className={styles.legendBtn}
                                onClick={() => handleLegendBtnClick('1000')}

                            >
                                <Icon
                                    name="circle"
                                    className={activeRasterLayer === '1000'
                                        ? styles.yearsIconClicked
                                        : styles.yearsIcon}
                                />
                            1000
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
2)
                        </div>
                        <div className={styles.floodText}>Medium (1-2)</div>
                        <div className={styles.floodText}>
Low (
                            {'<'}
                            {' '}
1)
                        </div>
                    </div>
                </div>

            </div>
        </VRLegend>
    );
};

export default FloodHistoryLegends;
