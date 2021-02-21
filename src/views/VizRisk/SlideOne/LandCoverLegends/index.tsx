import React from 'react';
import VRLegend from '#views/VizRisk/VRLegend';
import Icon from '#rscg/Icon';
import styles from './styles.scss';

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
                            Builtup Areas

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
            <p className={styles.agroIconContainer}>
                <span>
                    <Icon
                        name="square"
                        className={styles.otherIcon}
                    />
                </span>
                            Other
            </p>

            <p className={styles.agroIconContainer}>
                {/* <span>
                    <Icon
                        name="square"
                        className={styles.canalIcon}
                    />
                </span> */}
                <span className={styles.canalIcon}>
                        ___
                </span>
                            Canals
            </p>
            <p className={styles.agroIconContainer}>
                {/* <span>
                    <Icon
                        name="square"
                        className={styles.canalIcon}
                    />
                </span> */}
                <span className={styles.bridgeIcon}>
                        ===
                </span>
                            Bridges
            </p>

        </div>

    </VRLegend>
);

export default LandCoverLegends;
