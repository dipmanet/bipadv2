import React, { useState } from 'react';
import VRLegend from '#views/VizRisk/VRLegend';
import Icon from '#rscg/Icon';
import styles from './styles.scss';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import BridgeIcon from '#views/VizRisk/SlideOne/Icons/bridge.svg';
import Education from '#views/VizRisk/SlideOne/Icons/education.svg';
import Governance from '#views/VizRisk/SlideOne/Icons/governance.svg';
import Culture from '#views/VizRisk/SlideOne/Icons/culture.svg';
import Hospital from '#views/VizRisk/SlideOne/Icons/health.svg';
import Industry from '#views/VizRisk/SlideOne/Icons/industry.svg';
import Rupees from '#views/VizRisk/SlideOne/Icons/bank.svg';
import Tourism from '#views/VizRisk/SlideOne/Icons/tourism.svg';

const LandCoverLegends = () => {
    const [showCriticalLegends, setCritical] = useState(false);
    const handleCriticalclick = () => {
        setCritical(!showCriticalLegends);
    };
    return (
        <VRLegend>
            <div className={styles.lagendMainContainer}>

                <div className={styles.criticalIcons}>
                    <div className={styles.toggleContainer}>
                        <h2>Critical Infrastructures</h2>
                        {/* <button
                            type="button"
                            className={
                                styles.infoContainerBtn}
                            onClick={handleCriticalclick
                            }
                        >
                            {
                                showCriticalLegends ? (
                                    <Icon
                                        name="chevronDown"
                                        className={styles.chevrons}
                                    />
                                ) : (
                                    <Icon
                                        name="chevronRight"
                                        className={styles.chevrons}
                                    />
                                )
                            }

                        </button> */}
                    </div>


                    {/* {showCriticalLegends */}
                    {/* && ( */}
                    {/* <> */}
                    <p className={styles.agroIconContainer}>
                        <ScalableVectorGraphics
                            className={styles.criticalIcon}
                            src={Education}
                            style={{ color: '#111111' }}
                        />
                            School
                    </p>
                    <p className={styles.agroIconContainer}>
                        <ScalableVectorGraphics
                            className={styles.criticalIcon}
                            src={Governance}
                            style={{ color: '#111111' }}
                        />
                            Government Office
                    </p>
                    <p className={styles.agroIconContainer}>
                        <ScalableVectorGraphics
                            className={styles.criticalIcon}
                            src={Culture}
                            style={{ color: '#111111' }}
                        />
                            Cultural Center
                    </p>
                    <p className={styles.agroIconContainer}>
                        <ScalableVectorGraphics
                            className={styles.criticalIcon}
                            src={Hospital}
                            style={{ color: '#111111' }}
                        />
                           Hospital
                    </p>
                    <p className={styles.agroIconContainer}>
                        <ScalableVectorGraphics
                            className={styles.criticalIcon}
                            src={Industry}
                            style={{ color: '#111111' }}
                        />
                            Industry
                    </p>
                    <p className={styles.agroIconContainer}>
                        <ScalableVectorGraphics
                            className={styles.criticalIcon}
                            src={Rupees}
                            style={{ color: '#111111' }}
                        />
                            Financial Institutions
                    </p>
                    <p className={styles.agroIconContainer}>
                        <ScalableVectorGraphics
                            className={styles.criticalIcon}
                            src={Tourism}
                            style={{ color: '#111111' }}
                        />
                           Tourism
                    </p>
                    {/* <h2>Land Cover</h2> */}
                    <p className={styles.settlementIconContainer}>
                        <span>
                            <Icon
                                name="circle"
                                className={styles.clusterIcon}
                            />
                        </span>
                            Cluster

                    </p>
                    <p className={styles.settlementIconContainer}>
                        <span>
                            <Icon
                                name="square"
                                className={styles.settlementIcon}
                            />
                        </span>
                            Buildings

                    </p>
                    {/* <p className={styles.riverIconContainer}>
                    <span>
                        <Icon
                            name="square"
                            className={styles.riverIcon}
                        />
                    </span>
                            Water Bodies
                </p> */}
                    {/* <p className={styles.sandyIconContainer}>
                            <span>
                                <Icon
                                    name="square"
                                    className={styles.sandIcon}
                                />
                            </span>
                            Sandy Area
                        </p> */}
                    {/* <p className={styles.agroIconContainer}>
                    <span>
                        <Icon
                            name="square"
                            className={styles.agricultureIcon}
                        />
                    </span>
                            Agricultural Land
                </p> */}
                    {/* <p className={styles.agroIconContainer}>
                    <span>
                        <Icon
                            name="square"
                            className={styles.forestIcon}
                        />
                    </span>
                            Forest
                </p> */}

                    {/* <p className={styles.agroIconContainer}>
                    <ScalableVectorGraphics
                        className={styles.bridgeIcon}
                        src={BridgeIcon}
                        style={{ color: '#111111' }}
                    />
                            Bridge
                </p> */}

                    <p className={styles.agroIconContainer}>
                        <span className={styles.canalIcon}>
                        ___
                        </span>
                            Canals
                    </p>
                    <p className={styles.agroIconContainer}>
                        <span className={styles.roadIcon}>
                        ___
                        </span>
                            Roads
                    </p>

                    {/* <p className={styles.agroIconContainer}>
                    <span>
                        <Icon
                            name="square"
                            className={styles.otherIcon}
                        />
                    </span>
                            Other
                </p> */}

                    {/* </> */}
                    {/* ) */}
                    {/* } */}
                </div>


            </div>

        </VRLegend>
    );
};

export default LandCoverLegends;
