import React from 'react';
import VRLegend from '#views/VizRisk/VRLegend';
import Icon from '#rscg/Icon';
import styles from './styles.scss';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import BridgeIcon from '#views/VizRisk/SlideOne/Icons/bridge.svg';

const LandCoverLegends = () => (
    <VRLegend>
        <div className={styles.lagendMainContainer}>
            <h2>Land Cover</h2>
            <p className={styles.settlementIconContainer}>
                <span>
                    <Icon
                        name="square"
                        className={styles.settlementIcon}
                    />
                </span>
                            Buildings

            </p>
            <p className={styles.riverIconContainer}>
                <span>
                    <Icon
                        name="square"
                        className={styles.riverIcon}
                    />
                </span>
                            Water Bodies
            </p>
            {/* <p className={styles.sandyIconContainer}>
                            <span>
                                <Icon
                                    name="square"
                                    className={styles.sandIcon}
                                />
                            </span>
                            Sandy Area
                        </p> */}
            <p className={styles.agroIconContainer}>
                <span>
                    <Icon
                        name="square"
                        className={styles.agricultureIcon}
                    />
                </span>
                            Agricultural Land
            </p>
            <p className={styles.agroIconContainer}>
                <span>
                    <Icon
                        name="square"
                        className={styles.forestIcon}
                    />
                </span>
                            Forest
            </p>
            {/* <p className={styles.agroIconContainer}>
                <ScalableVectorGraphics
                    className={styles.bridgeIcon}
                    src={BridgeIcon}
                    style={{ color: '#111111' }}
                />
                            Bridges
            </p> */}


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
                    <Icon
                        name="square"
                        className={styles.otherIcon}
                    />
                </span>
                            Other
            </p>

        </div>

    </VRLegend>
);

export default LandCoverLegends;
