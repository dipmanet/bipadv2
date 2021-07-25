import React, { useState, useEffect } from 'react';
import styles from './styles.scss';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Education from '#resources/icons/icon_set_school.svg';
import Governance from '#resources/icons/icon_set_government.svg';
import Culture from '#resources/icons/icon_set_religion.svg';
import Health from '#resources/icons/icon_set_health-01.svg';
import Industry from '#resources/icons/icon_set_industry.svg';
import Tourism from '#resources/icons/icon_set_hotel.svg';
import Bank from '#resources/icons/icon_set_bank.svg';
import Trade from '#resources/icons/trade.svg';
import Water from '#resources/icons/WATERVR.svg';
import Icon from '#rscg/Icon';

const LandCoverLegends = (props) => {
    const { handleCritical, criticalElement, hide } = props;
    const [showEducation, setshowEducation] = useState(false);
    const [showFinance, setshowFinance] = useState(false);
    const [showIndustry, setshowIndustry] = useState(false);
    const [showGovernemnt, setshowGovernemnt] = useState(false);
    const [showCulture, setshowCulture] = useState(false);
    const [showHospital, setshowHospital] = useState(false);
    const [showTourism, setshowTourism] = useState(false);
    const [showWater, setshowWater] = useState(false);
    const [showTrade, setshowTrade] = useState(false);
    const [showAll, setshowAll] = useState(true);
    const [showCriticalElements, setshowCriticalElements] = useState(true);

    const resetCriticalLayers = () => {
        setshowEducation(false);
        setshowFinance(false);
        setshowIndustry(false);
        setshowGovernemnt(false);
        setshowCulture(false);
        setshowHospital(false);
        setshowTourism(false);
        setshowTrade(false);
        setshowWater(false);
        setshowAll(false);
    };

    const handleCriticalToggle = () => {
        const newVal = !showCriticalElements;
        setshowCriticalElements(newVal);
    };

    useEffect(
        () => {
            if (criticalElement === 'all') {
                resetCriticalLayers();
                setshowAll(true);
            } else if (criticalElement === 'education') {
                resetCriticalLayers();
                setshowEducation(true);
            } else if (criticalElement === 'culture') {
                resetCriticalLayers();
                setshowCulture(true);
            } else if (criticalElement === 'governance') {
                resetCriticalLayers();
                setshowGovernemnt(true);
            } else if (criticalElement === 'health') {
                resetCriticalLayers();
                setshowHospital(true);
            } else if (criticalElement === 'industry') {
                resetCriticalLayers();
                setshowIndustry(true);
            } else if (criticalElement === 'finance') {
                resetCriticalLayers();
                setshowFinance(true);
            } else if (criticalElement === 'tourism') {
                resetCriticalLayers();
                setshowTourism(true);
            } else if (criticalElement === 'trade and business') {
                resetCriticalLayers();
                setshowTrade(true);
            } else if (criticalElement === 'water sources') {
                resetCriticalLayers();
                setshowWater(true);
            } else if (criticalElement === 'tourism') {
                resetCriticalLayers();
                setshowTourism(true);
            }
        }, [criticalElement],

    );

    const handleCriticalclick = (layer) => {
        handleCritical(layer);
        if (layer === 'all') {
            resetCriticalLayers();
            setshowAll(true);
        }
        if (layer === 'education') {
            resetCriticalLayers();
            setshowEducation(true);
        }
        if (layer === 'governance') {
            resetCriticalLayers();
            setshowGovernemnt(true);
        }
        if (layer === 'culture') {
            resetCriticalLayers();
            setshowCulture(true);
        }
        if (layer === 'health') {
            resetCriticalLayers();
            setshowHospital(true);
        }
        if (layer === 'industry') {
            resetCriticalLayers();
            setshowIndustry(true);
        }
        if (layer === 'finance') {
            resetCriticalLayers();
            setshowFinance(true);
        }
        if (layer === 'tourism') {
            resetCriticalLayers();
            setshowTourism(true);
        }
        if (layer === 'trade and business') {
            resetCriticalLayers();
            setshowTrade(true);
        }
        if (layer === 'water sources') {
            resetCriticalLayers();
            setshowWater(true);
        }
    };

    useEffect(() => {
        console.log('hide:', hide);
    }, [hide]);

    return (
        <div
            className={styles.mainDiv}
            style={{
                position: 'fixed',
                bottom: '15px',
                right: props.right ? '75px' : '70%',
                zIndex: 200,
                backgroundColor: 'rgb(18,31,57)',
                padding: '15px',
                // display: hide ? 'none' : 'block',

            }}
        >
            <button
                type="button"
                className={styles.toggleCritical}
                onClick={handleCriticalToggle}
            >
                <h2>Infrastructures</h2>
                {showCriticalElements === true
                    ? (
                        <Icon
                            name="chevronRight"
                            className={styles.chevrontoggle}
                        />
                    )
                    : (
                        <Icon
                            name="chevronDown"
                            className={styles.chevrontoggle}
                        />
                    )
                }
            </button>


            {showCriticalElements && (
                <div className={styles.criticalIcons}>

                    <div className={styles.toggleContainer}>
                        <div className={styles.infraIconContainer}>

                            <button
                                type="button"
                                className={showAll
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('all')}
                            >
                                <Icon
                                    name="circle"
                                    className={showAll ? styles.allIconSelected : styles.allIcon}
                                />


                              Show All
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={showEducation
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('education')}
                            >

                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Education}
                                />


                                 Educational Institution
                            </button>
                        </div>
                        <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={showFinance
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('finance')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Bank}
                                />
                                Finance
                            </button>
                        </div>
                        {/* <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={showCulture
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('Culture')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Culture}
                                />

                             Cultural Site
                            </button>

                        </div> */}
                        {/* <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={showGovernemnt
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('Governance')}
                            >

                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Governance}
                                />


                                 Government Buildings
                            </button>
                        </div> */}

                        <div className={styles.infraIconContainer}>

                            <button
                                type="button"
                                className={showHospital
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('health')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Health}
                                />

                                 Hospital
                            </button>

                        </div>
                        {/* <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={showTourism
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('Tourism')}
                            >

                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Tourism}
                                />
                                Hotels/Restaurants
                            </button>
                        </div> */}
                    </div>


                </div>
            )
            }

        </div>
    );
};

export default LandCoverLegends;
