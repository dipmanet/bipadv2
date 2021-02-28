import React from 'react';
import Hexagon from 'react-hexagon';
import VRLegend from '#views/VizRisk/VRLegend';
import Icon from '#rscg/Icon';
import styles from './styles.scss';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import BridgeIcon from '#views/VizRisk/SlideOne/Icons/bridge.svg';

const LandCoverLegends = () => (
    <>
        <h2>Land Cover</h2>
        <p className={styles.settlementIconContainer}>
            <span>

                <Hexagon
                    style={{
                        stroke: '#e3acac',
                        strokeWidth: 50,
                        fill: '#e00000',

                    }}
                    className={styles.settlementIcon}
                />
            </span>
                            Buildings

        </p>
        <p className={styles.riverIconContainer}>
            <span>
                <Hexagon
                    style={{
                        stroke: '#a7ced6',
                        strokeWidth: 50,
                        fill: '#0670bc',

                    }}
                    className={styles.riverIcon}
                />

            </span>
                            Water Bodies
        </p>

        <p className={styles.agroIconContainer}>
            <span>
                <Hexagon
                    style={{
                        stroke: '#edf7d2',
                        strokeWidth: 50,
                        fill: '#e6f2a1',

                    }}
                    className={styles.agricultureIcon}
                />

            </span>
                            Agricultural Land
        </p>
        <p className={styles.agroIconContainer}>
            <span>
                <Hexagon
                    style={{
                        stroke: '#a6dea6',
                        strokeWidth: 50,
                        fill: '#00a811',

                    }}
                    className={styles.forestIcon}
                />

            </span>
                            Forest
        </p>

        <div className={styles.agroIconContainer}>
            <div className={styles.canalIcon} />

                            Canals
        </div>

        <div className={styles.agroIconContainer}>
            <div className={styles.roadIcon} />

                            Roads
        </div>
        <div className={styles.agroIconContainer}>
            <div className={styles.bridgeLine} />

                            Bridges
        </div>

        <p className={styles.agroIconContainer}>
            <span>
                <Hexagon
                    style={{
                        stroke: '#fff',
                        strokeWidth: 50,
                        fill: '#b4b4b4',

                    }}
                    className={styles.otherIcon}
                />
            </span>
                            Other
        </p>

    </>

);

export default LandCoverLegends;
