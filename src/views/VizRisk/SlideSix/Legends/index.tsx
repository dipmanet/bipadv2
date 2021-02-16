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
                    </h2>
                    <p className={styles.subHeading}>
                    (population/0.25 sq. km)
                    </p>
                    {/* <p className={styles.subHeading}>Area = 0.25 sq. km</p> */}

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
                <div className={styles.switchMainContainer}>
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

            </div>


        </VRLegend>
    );
};

export default FloodHistoryLegends;
