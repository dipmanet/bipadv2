import React, { useState, useContext } from 'react';
import * as PageTypes from '#store/atom/page/types';
import VRLegend from '../../VRLegend';
import Icon from '#rscg/Icon';
import styles from './styles.scss';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;


const FloodHistoryLegends = (props: Props) => {
    const [showPopulation, setShowPopulationDensity] = useState(true);
    const [showHazard, setShowHazard] = useState(false);
    const [showBothLayer, setShowBothLayer] = useState(false);
    const [activeRasterLayer, setActiveRasterLayer] = useState('5');
    const {
        handleSlideChange,
        handleFloodChange,
    } = props;

    const handleHazardBtnClick = (val) => {
        handleSlideChange(val);
        if (val === 'hazard') {
            setShowHazard(true);
            setShowBothLayer(false);
            setShowPopulationDensity(false);
        }
        if (val === 'population') {
            setShowHazard(false);
            setShowBothLayer(false);
            setShowPopulationDensity(true);
        }
        if (val === 'all') {
            setShowHazard(false);
            setShowBothLayer(true);
            setShowPopulationDensity(false);
        }
    };

    const handleLegendBtnClick = (layer) => {
        handleFloodChange(layer);
        setActiveRasterLayer(layer);
    };

    return (
        <VRLegend>
            <div className={styles.legendContainer}>

                <div className={showHazard || showBothLayer
                    ? styles.hazardLegends
                    : styles.legendsHidden}
                >
                    <h2>Flood Hazard Return Period</h2>
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
                </div>

                <div className={showPopulation || showBothLayer
                    ? styles.populationLegends
                    : styles.legendsHidden}
                >
                    <h2>
                    Population Density
                        {' '}
                        <br />
                        {' '}
                    (population/area)
                    </h2>
                    <p className={styles.subHeading}>Area = 0.25 sq. km</p>

                    <div className={styles.legendItemContainer}>
                        <div className={styles.exposureLegendFirst} />
                        <span className={styles.exposureLegendText}> 0 - 296</span>
                    </div>
                    <div className={styles.legendItemContainer}>
                        <div className={styles.exposureLegendSecond} />
                        <span className={styles.exposureLegendText}> 297 - 592</span>
                    </div>
                    <div className={styles.legendItemContainer}>
                        <div className={styles.exposureLegendThird} />
                        <span className={styles.exposureLegendText}> 593 - 888</span>
                    </div>
                    <div className={styles.legendItemContainer}>
                        <div className={styles.exposureLegendFourth} />
                        <span className={styles.exposureLegendText}> 887 - 1192</span>
                    </div>
                    <div className={styles.legendItemContainer}>
                        <div className={styles.exposureLegendFifth} />
                        <span className={styles.exposureLegendText}> Above 1192</span>
                    </div>
                </div>

                <p className={styles.kmIconContainer}>
                    <span className={styles.fiveKm}>
                                ___
                    </span>
                            5 km from River
                </p>
                <p className={styles.kmIconContainer}>
                    <span className={styles.twoKm}>
                                ___
                    </span>
                            2 km from River
                </p>
                <div className={styles.switchSlides}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleHazardBtnClick('hazard')}
                    >
                        <Icon
                            name="circle"
                            className={showHazard
                                ? styles.yearsIconClicked
                                : styles.yearsIcon}
                        />
                           Show Flood Hazard
                    </button>
                </div>
                <div className={styles.switchSlides}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleHazardBtnClick('population')}
                    >
                        <Icon
                            name="circle"
                            className={showPopulation
                                ? styles.yearsIconClicked
                                : styles.yearsIcon}
                        />
                           Show Population Density
                    </button>
                </div>
                <div className={styles.switchSlides}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleHazardBtnClick('all')}
                    >
                        <Icon
                            name="circle"
                            className={showBothLayer
                                ? styles.yearsIconClicked
                                : styles.yearsIcon}
                        />
                           Show Both
                    </button>
                </div>

            </div>


        </VRLegend>
    );
};

export default FloodHistoryLegends;
