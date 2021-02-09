import React, { useState, useContext } from 'react';
import * as PageTypes from '#store/atom/page/types';
import VRLegend from '../../VRLegend';
import Icon from '#rscg/Icon';
import VizRiskContext, { VizRiskContextProps } from '#components/VizRiskContext';
import styles from './styles.scss';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;


const FloodHistoryLegends = (props: Props) => {
    const { showFirstSlide } = useContext(VizRiskContext);
    const [showFirstLayer, setShowFirstLayer] = useState(false);
    const [showSecondLayer, setShowSecondLayer] = useState(false);
    const [showThirdLayer, setShowThirdLayer] = useState(false);
    const [showFourthLayer, setShowFourthLayer] = useState(false);
    const [showFifthLayer, setShowFifthLayer] = useState(false);
    const [showSlide, setShowSlide] = useState('hazard');
    const [showPopulation, setShowPopulationDensity] = useState(true);
    const [showHazard, setShowHazard] = useState(false);
    const [showBothLayer, setShowBothLayer] = useState(false);
    const {
        handleLegendsClick,
        handleSlideChange,
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
        handleLegendsClick(layer);

        if (layer === 0) {
            setShowFirstLayer(!showFirstLayer);
        }

        if (layer === 1) {
            setShowSecondLayer(!showSecondLayer);
        }

        if (layer === 2) {
            setShowThirdLayer(!showThirdLayer);
        }

        if (layer === 3) {
            setShowFourthLayer(!showFourthLayer);
        }

        if (layer === 4) {
            setShowFourthLayer(!showFifthLayer);
        }
    };

    return (
        <VRLegend>
            <div className={styles.legendContainer}>
                <div className={showHazard || showBothLayer
                    ? styles.hazardLegends
                    : styles.legendsHidden}
                >
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
                    <h2>Population Density (population/area)</h2>
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
                <p className={styles.riverIconContainer}>
                    <span className={styles.riverIcon}>
                                ___
                    </span>
                            River
                </p>
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
