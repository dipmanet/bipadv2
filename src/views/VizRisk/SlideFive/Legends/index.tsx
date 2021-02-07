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
    const {
        handleLegendsClick,
    } = props;
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
            <h2>Flood Hazard Return Period</h2>
            <div className={styles.legendContainer}>
                <div className={styles.legendItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleLegendBtnClick(0)}
                    >
                        <Icon
                            name="circle"
                            className={showFirstLayer
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
                        />
                            5 Years
                    </button>
                </div>
                <div className={styles.legendItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleLegendBtnClick(1)}

                    >
                        <Icon
                            name="circle"
                            className={showSecondLayer === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
                        />
                            10 Years
                    </button>
                </div>
                <div className={styles.legendItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleLegendBtnClick(2)}

                    >
                        <Icon
                            name="circle"
                            className={showThirdLayer === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
                        />
                            25 Years
                    </button>
                </div>
                <div className={styles.legendItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleLegendBtnClick(3)}

                    >
                        <Icon
                            name="circle"
                            className={showFourthLayer === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
                        />
                            100 Years
                    </button>
                </div>
                <div className={styles.legendItemContainer}>
                    <button
                        type="button"
                        className={styles.legendBtn}
                        onClick={() => handleLegendBtnClick(4)}

                    >
                        <Icon
                            name="circle"
                            className={showFifthLayer === false
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

            </div>

        </VRLegend>
    );
};

export default FloodHistoryLegends;
