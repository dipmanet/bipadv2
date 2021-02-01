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
    const {
        handleLegendsClick,
    } = props;
    const handleLegendBtnClick = () => {
        if (showFirstLayer === false) {
            setShowFirstLayer(true);
            handleLegendsClick(false);
        } else {
            setShowFirstLayer(false);
            handleLegendsClick(true);
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
                        onClick={handleLegendBtnClick}
                    >
                        <Icon
                            name="circle"
                            className={showFirstLayer === false
                                ? styles.yearsIcon
                                : styles.yearsIconClicked}
                        />
                            5 Years
                    </button>
                </div>

            </div>

        </VRLegend>
    );
};

export default FloodHistoryLegends;
