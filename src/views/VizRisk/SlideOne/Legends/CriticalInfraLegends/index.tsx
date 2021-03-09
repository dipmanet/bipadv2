import React, { useState, useEffect } from 'react';
import styles from './styles.scss';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Education from '../../Icons/icon_set_school.svg';
import Governance from '../../Icons/icon_set_government.svg';
import Culture from '../../Icons/icon_set_religion.svg';
import Health from '../../Icons/icon_set_health-01.svg';
import Industry from '../../Icons/icon_set_industry.svg';
import Tourism from '../../Icons/icon_set_hotel.svg';
import Bank from '../../Icons/icon_set_bank.svg';
import Icon from '#rscg/Icon';

const LandCoverLegends = (props) => {
    const { handleCritical, handleCriticalShowToggle } = props;
    const [showEducation, setshowEducation] = useState(false);
    const [showFinance, setshowFinance] = useState(false);
    const [showIndustry, setshowIndustry] = useState(false);
    const [showGovernemnt, setshowGovernemnt] = useState(false);
    const [showCulture, setshowCulture] = useState(false);
    const [showHospital, setshowHospital] = useState(false);
    const [showTourism, setshowTourism] = useState(false);
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
        setshowAll(false);
    };

    const handleCriticalToggle = () => {
        const newVal = !showCriticalElements;
        setshowCriticalElements(newVal);
        handleCriticalShowToggle(newVal);
    };

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
        if (layer === 'bank') {
            resetCriticalLayers();
            setshowFinance(true);
        }
        if (layer === 'tourism') {
            resetCriticalLayers();
            setshowTourism(true);
        }
    };


    return (
        <>
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
                                {/* <Hexagon
                style={{
                    stroke: '#9bb4be',
                    // stroke: showAll ? '#9bb4be' : '#9bb4bf',
                    strokeWidth: 50,
                    // fill: showAll ? '#ff0000' : '#456172',
                    // fill: '#ff0000',
                    fill: showAll ? '#ffffff' : 'transparent',

                }}
                className={styles.educationHexagon}
            /> */}

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
                                {/* <Hexagon
                style={{
                    stroke: '#ffdd00',
                    // stroke: showEducation ? '#9bb4be' : '#9bb4bf',
                    strokeWidth: 50,
                    // fill: showEducation ? '#ffdd00' : '#456172' }}
                    // fill: '#ffdd00',
                    fill: showEducation || showAll ? '#ffdd00' : 'transparent',

                }}
                className={styles.educationHexagon}
            /> */}


            Educational Institution
                            </button>
                        </div>
                        <div className={styles.infraIconContainer}>

                            <button
                                type="button"
                                className={showGovernemnt
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('governance')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Governance}
                                />
                                {/* <Hexagon
                style={{
                    stroke: '#66dff4',
                    // stroke: showGovernemnt ? '#9bb4be' : '#9bb4bf',
                    strokeWidth: 50,
                    // fill: showGovernemnt ? '#66dff4' : '#456172' }}
                    // fill: '#66dff4',
                    fill: showGovernemnt || showAll ? '#66dff4' : 'transparent',

                }}
                className={styles.educationHexagon}
            /> */}
            Government Building
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={showCulture
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('culture')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Culture}
                                />
                                {/* <Hexagon
                style={{
                    stroke: '#c8b0b8',
                    // stroke: showCulture ? '#9bb4be' : '#9bb4bf',

                    strokeWidth: 50,
                    // fill: '#c8b0b8',
                    fill: showCulture || showAll ? '#c8b0b8' : 'transparent',

                }}
                        // fill: showCulture ? '#c8b0b8' : '#456172' }}
                className={styles.educationHexagon}
            /> */}
            Cultural Site
                            </button>

                        </div>

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
                                {/* <Hexagon
                style={{
                    stroke: '#c8b09a',
                    // stroke: showHospital ? '#9bb4be' : '#9bb4bf',

                    strokeWidth: 50,
                    // fill: showHospital ? '#c8b09a' : '#456172' }}
                    // fill: '#c8b09a',
                    fill: showHospital || showAll ? '#c8b09a' : 'transparent',

                }}
                className={styles.educationHexagon}
            /> */}
            Hospital
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={showIndustry
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('industry')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Industry}
                                />
                                {/* <Hexagon
                style={{
                    stroke: '#a4ac5e',
                    // stroke: showIndustry ? '#9bb4be' : '#9bb4bf',

                    strokeWidth: 50,
                    // fill: showIndustry ? '#a4ac5e' : '#456172'
                    // fill: '#a4ac5e',
                    fill: showIndustry || showAll ? '#a4ac5e' : 'transparent',


                }}
                className={styles.educationHexagon}
            /> */}
            Industry
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>

                            <button
                                type="button"
                                className={showTourism
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('tourism')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Tourism}
                                />
                                {/* <Hexagon
                style={{
                    stroke: '#62d480',
                    // stroke: '#9bb4be',
                    strokeWidth: 50,
                    // fill: showTourism ? '#62d480' : '#456172'
                    fill: showTourism || showAll ? '#62d480' : 'transparent',
                }}
                className={styles.educationHexagon}
            /> */}
                Hotel or Restaurant
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>

                            <button
                                type="button"
                                className={showFinance
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('bank')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Bank}
                                />
                                {/* <Hexagon
                style={{
                    stroke: '#c58dbf',
                    // stroke: showFinance ? '#9bb4be' : '#9bb4bf',
                    strokeWidth: 50,
                    // fill: showFinance ? '#c58dbf' : '#456172'
                    // fill: '#c58dbf',
                    fill: showFinance || showAll ? '#c58dbf' : 'transparent',
                }}
                className={styles.educationHexagon}
            /> */}
             Bank
                            </button>

                        </div>
                        {/* <div className={styles.infraIconContainer}>
        <button
            type="button"
            className={styles.criticalButton}
            // onClick={() => handleCriticalclick('canals')}
        >
            <div className={styles.canalIcon} />
             Canals
        </button>
    </div>
    <div className={styles.infraIconContainer}>
        <button
            type="button"
            className={styles.criticalButton}
            // onClick={() => handleCriticalclick('roads')}
        >
            <div className={styles.roadIcon} />
             Roads
        </button>
    </div> */}
                    </div>


                </div>
            )
            }

        </>
    );
};

export default LandCoverLegends;
