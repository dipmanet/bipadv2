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
    const { showFirstSlide } = useContext(VizRiskContext);
    const [showFiveYears, setShowFiveYears] = useState(true);
    const [showTenYears, setShowTenYears] = useState(false);
    const [showTwentyYears, setShowTwentyYears] = useState(false);
    const [showFiftyYears, setShowFiftyYears] = useState(false);
    const [showSeventyFiveYears, setShowSeventyFiveYears] = useState(false);
    const [showHundredYears, setShowHundredYears] = useState(false);
    const [showTwoHundredYears, setShowTwoHundredYears] = useState(false);
    const [showTwoFiftyYears, setShowTwoFiftyYears] = useState(false);
    const [showFiveHundredYears, setShowFiveHundredYears] = useState(false);
    const [showThousandYears, setShowThousandYears] = useState(false);

    const [showExposedAll, setShowExposedAll] = useState(true);
    const [showExposedSchool, setShowExposedSchool] = useState(false);
    const [showExposedBuilding, setShowExposedBuilding] = useState(false);
    const {
        handleFloodChange,
        handleExposedElementChange,
    } = props;
    const handleExposedClick = (layer) => {
        if (layer === 'all') {
            const newVal = !showExposedAll;
            handleExposedElementChange(layer);
            setShowExposedAll(true);
            setShowExposedSchool(false);
            setShowExposedBuilding(false);
        }
        if (layer === 'school') {
            const newVal = !showExposedSchool;
            handleExposedElementChange(layer);
            setShowExposedAll(false);
            setShowExposedSchool(true);
            setShowExposedBuilding(false);
        }

        if (layer === 'building') {
            const newVal = !showExposedBuilding;
            handleExposedElementChange(layer);
            setShowExposedAll(false);
            setShowExposedSchool(false);
            setShowExposedBuilding(true);
        }
    };
    const handleLegendBtnClick = (layer) => {
        if (layer === '5') {
            const newVal = !showFiveYears;
            handleFloodChange(layer, newVal);
            setShowFiveYears(newVal);
        }
        if (layer === '10') {
            const newVal = !showTenYears;
            handleFloodChange(layer, newVal);
            setShowTenYears(newVal);
        }
        if (layer === '20') {
            const newVal = !showTwentyYears;
            handleFloodChange(layer, newVal);
            setShowTwentyYears(newVal);
        }
        if (layer === '50') {
            const newVal = !showFiftyYears;
            handleFloodChange(layer, newVal);
            setShowFiftyYears(newVal);
        }
        if (layer === '75') {
            const newVal = !showSeventyFiveYears;
            handleFloodChange(layer, newVal);
            setShowSeventyFiveYears(newVal);
        }
        if (layer === '100') {
            const newVal = !showHundredYears;
            handleFloodChange(layer, newVal);
            setShowHundredYears(newVal);
        }
        if (layer === '200') {
            const newVal = !showTwoHundredYears;
            handleFloodChange(layer, newVal);
            setShowTwoHundredYears(newVal);
        }
        if (layer === '250') {
            const newVal = !showTwoFiftyYears;
            handleFloodChange(layer, newVal);
            setShowTwoFiftyYears(newVal);
        }
        if (layer === '500') {
            const newVal = !showFiveHundredYears;
            handleFloodChange(layer, newVal);
            setShowFiveHundredYears(newVal);
        }
        if (layer === '1000') {
            const newVal = !showThousandYears;
            handleFloodChange(layer, newVal);
            setShowThousandYears(newVal);
        }
    };

    return (
        <VRLegend>
            <div className={styles.legendContainer}>
                <h2>Flood Hazard Return Period</h2>
                <div className={styles.hazardItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleLegendBtnClick('5')}
                    >
                        <Icon
                            name="circle"
                            className={showFiveYears === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
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
                            className={showTenYears === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
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
                            className={showTwentyYears === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
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
                            className={showFiftyYears === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
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
                            className={showSeventyFiveYears === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
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
                            className={showHundredYears === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
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
                            className={showTwoHundredYears === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
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
                            className={showTwoFiftyYears === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
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
                            className={showFiveHundredYears === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
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
                            className={showThousandYears === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
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
                <h2>Others</h2>
                <div className={styles.hazardItemContainer}>

                    {/* <Icon
                            name="circle"
                            className={showExposedBuilding === false
                                ? styles.exposedIcons
                                : styles.exposedIconsClicked}
                        /> */}
                    <img src={ManualIcon} alt="" height="20" />
                    <span className={styles.chisapaniText}>Chisapani Station</span>
                </div>

            </div>

        </VRLegend>
    );
};

export default FloodHistoryLegends;
