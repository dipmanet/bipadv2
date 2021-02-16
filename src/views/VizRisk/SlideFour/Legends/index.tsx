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
    const {
        handleFloodChange,
        handleExposedElementChange,
    } = props;

    const resetExposedLayers = () => {
        setShowExposedAll(false);
        setShowExposedSchool(false);
        setShowExposedBuilding(false);
        setShowExposedRoads(false);
        setShowExposedCanals(false);
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
    };
    const handleLegendBtnClick = (layer) => {
        handleFloodChange(layer);
        setActiveRasterLayer(layer);
    };

    return (
        <VRLegend>
            <div className={styles.legendContainer}>
                <h2>Flood Hazard</h2>
                <p>Return Period</p>
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
                            5 Years
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
                            10 Years
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
                            20 Years
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
                            50 Years
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
                            75 Years
                    </button>
                </div>
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
                            100 Years
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
                            200 Years
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
                            250 Years
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
                            500 Years
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
                            1000 Years
                    </button>
                </div>
                <h2>Flood depth in meters</h2>
                <div className={styles.hazardItemContainer}>
                    <div className={styles.hazardIndicator1} />
                    <span className={styles.hazardIndicatorText}>
                        0
                    </span>
                </div>
                <div className={styles.hazardItemContainer}>
                    <div className={styles.hazardIndicator2} />
                    <span className={styles.hazardIndicatorText}>
                        1
                    </span>
                </div>
                <div className={styles.hazardItemContainer}>
                    <div className={styles.hazardIndicator3} />
                    <span className={styles.hazardIndicatorText}>
                        2
                    </span>
                </div>
                <div className={styles.hazardItemContainer}>
                    <div className={styles.hazardIndicator4} />
                    <span className={styles.hazardIndicatorText}>
                        3
                    </span>
                </div>
                <div className={styles.hazardItemContainer}>
                    <div className={styles.hazardIndicator5} />
                    <span className={styles.hazardIndicatorText}>
                        4
                    </span>
                </div>
                <div className={styles.hazardItemContainer}>
                    <div className={styles.hazardIndicator6} />
                    <span className={styles.hazardIndicatorText}>
                        5
                    </span>
                </div>
                <div className={styles.hazardItemContainer}>
                    <Icon
                        name="circle"
                        className={styles.safeshelter}
                    />
                    <span className={styles.hazardIndicatorText}>
                        Safe Shelters
                    </span>
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
                <h2>Others</h2>
                <div className={styles.hazardItemContainer}>
                    <img src={ManualIcon} alt="" height="20" />
                    <span className={styles.chisapaniText}>Chisapani Station</span>
                </div>

            </div>

        </VRLegend>
    );
};

export default FloodHistoryLegends;
