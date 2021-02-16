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
                <h2>Flood Hazard</h2>
                <p className={styles.subHeading}>Return Period (years)</p>
                <div className={styles.floodMainContainer}>
                    <div className={styles.floodSubGroup}>
                        <div className={styles.hazardItemContainer}>
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
                        <div className={styles.hazardItemContainer}>
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
                        <div className={styles.hazardItemContainer}>
                            <button
                                type="button"
                                className={styles.legendBtn}
                                onClick={() => handleLegendBtnClick('20')}

                            >
                                <Icon
                                    name="circle"
                                    className={activeRasterLayer === '20'
                                        ? styles.yearsIconClicked
                                        : styles.yearsIcon}
                                />
                            20
                            </button>
                        </div>
                        <div className={styles.hazardItemContainer}>
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
                        <div className={styles.hazardItemContainer}>
                            <button
                                type="button"
                                className={styles.legendBtn}
                                onClick={() => handleLegendBtnClick('75')}

                            >
                                <Icon
                                    name="circle"
                                    className={activeRasterLayer === '75'
                                        ? styles.yearsIconClicked
                                        : styles.yearsIcon}
                                />
                            75
                            </button>
                        </div>
                    </div>

                    <div className={styles.floodSubGroup}>
                        <div className={styles.hazardItemContainer}>
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
                        <div className={styles.hazardItemContainer}>
                            <button
                                type="button"
                                className={styles.legendBtn}
                                onClick={() => handleLegendBtnClick('200')}

                            >
                                <Icon
                                    name="circle"
                                    className={activeRasterLayer === '200'
                                        ? styles.yearsIconClicked
                                        : styles.yearsIcon}
                                />
                            200
                            </button>
                        </div>
                        <div className={styles.hazardItemContainer}>
                            <button
                                type="button"
                                className={styles.legendBtn}
                                onClick={() => handleLegendBtnClick('250')}

                            >
                                <Icon
                                    name="circle"
                                    className={activeRasterLayer === '250'
                                        ? styles.yearsIconClicked
                                        : styles.yearsIcon}
                                />
                            250
                            </button>
                        </div>
                        <div className={styles.hazardItemContainer}>
                            <button
                                type="button"
                                className={styles.legendBtn}
                                onClick={() => handleLegendBtnClick('500')}

                            >
                                <Icon
                                    name="circle"
                                    className={activeRasterLayer === '500'
                                        ? styles.yearsIconClicked
                                        : styles.yearsIcon}
                                />
                            500
                            </button>
                        </div>
                        <div className={styles.hazardItemContainer}>
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
                <h2>Flood depth (meters)</h2>
                <div className={styles.floodDepthContainer}>
                    <div className={styles.floodDepth}>
                        <div className={styles.floodIndicator1} />
                        <div className={styles.floodIndicator2} />
                        <div className={styles.floodIndicator3} />
                        <div className={styles.floodIndicator4} />
                        <div className={styles.floodIndicator5} />
                        <div className={styles.floodIndicator6} />
                    </div>
                    <div className={styles.floodDepthText}>
                        <div className={styles.floodText}>0</div>
                        <div className={styles.floodText}>1</div>
                        <div className={styles.floodText}>2</div>
                        <div className={styles.floodText}>3</div>
                        <div className={styles.floodText}>4</div>
                        <div className={styles.floodText}>5</div>
                    </div>
                </div>
                <h2>Exposed Elements</h2>
                <div className={styles.hazardItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleExposedClick('all')}

                    >
                        <Icon
                            name="circle"
                            className={showExposedAll === false
                                ? styles.exposedIcons
                                : styles.exposedIconsClicked}
                        />
                           All
                    </button>
                </div>
                <div className={styles.hazardItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleExposedClick('school')}

                    >
                        <Icon
                            name="circle"
                            className={showExposedSchool === false
                                ? styles.exposedIcons
                                : styles.exposedIconsClicked}
                        />
                           School
                    </button>
                </div>
                <div className={styles.hazardItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleExposedClick('building')}

                    >
                        <Icon
                            name="circle"
                            className={showExposedBuilding === false
                                ? styles.exposedIcons
                                : styles.exposedIconsClicked}
                        />
                           Building
                    </button>
                </div>
                <div className={styles.hazardItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleExposedClick('roads')}

                    >
                        <Icon
                            name="circle"
                            className={showRoads === false
                                ? styles.exposedIcons
                                : styles.exposedIconsClicked}
                        />
                           Roads
                    </button>
                </div>
                <div className={styles.hazardItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleExposedClick('canals')}

                    >
                        <Icon
                            name="circle"
                            className={showCanals === false
                                ? styles.exposedIcons
                                : styles.exposedIconsClicked}
                        />
                           Canals
                    </button>
                </div>
                <div className={styles.hazardItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleExposedClick('safeshelters')}
                    >
                        <Icon
                            name="circle"
                            className={showSafeShelter === false
                                ? styles.exposedIcons
                                : styles.exposedIconsClicked}
                        />
                           Safe Shelters
                    </button>
                </div>
                <h2>Others</h2>
                <div className={styles.hazardItemContainer}>
                    <img src={ManualIcon} alt="" height="20" />
                    <button
                        type="button"
                        className={styles.chisapaniText}
                        onClick={handleChisapaniBtn}
                    >
                        Chisapani Station
                    </button>
                </div>

            </div>

        </VRLegend>
    );
};

export default FloodHistoryLegends;
