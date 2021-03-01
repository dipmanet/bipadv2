import React, { useState, useEffect } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';
import VRLegend from '#views/VizRisk/VRLegend';

const EvacLegends = (props) => {
    const { handleEvac, evacElement } = props;
    const [showEducation, setshowEducation] = useState(false);
    const [showCulture, setshowCulture] = useState(false);
    const [showSafe, setshowSafe] = useState(false);
    const [showAll, setshowAll] = useState(false);
    const resetCriticalLayers = () => {
        setshowEducation(false);
        setshowCulture(false);
        setshowAll(false);
        setshowSafe(false);
    };

    useEffect(
        () => {
            console.log('evac element: ', evacElement);
            if (evacElement === 'all') {
                resetCriticalLayers();
                setshowAll(true);
            } else if (evacElement === 'education') {
                resetCriticalLayers();
                setshowEducation(true);
            } else if (evacElement === 'safe') {
                resetCriticalLayers();
                setshowSafe(true);
            } else if (evacElement === 'culture') {
                resetCriticalLayers();
                setshowCulture(true);
            }
        }, [evacElement],

    );


    const handleEvacclick = (layer) => {
        handleEvac(layer);
        if (layer === 'all') {
            resetCriticalLayers();
            setshowAll(true);
        }

        if (layer === 'education') {
            resetCriticalLayers();
            setshowEducation(true);
        }

        if (layer === 'culture') {
            resetCriticalLayers();
            setshowCulture(true);
        }

        if (layer === 'safe') {
            resetCriticalLayers();
            setshowSafe(true);
        }
    };
    return (
        <>
            {/* <VRLegend> */}
            <h2>Evacuation Centers</h2>

            <div className={styles.criticalIcons}>

                <div className={styles.toggleContainer}>
                    <div className={styles.infraIconContainer}>

                        <button
                            type="button"
                            className={styles.criticalButton}
                            onClick={() => handleEvacclick('all')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#9bb4be',
                                    // stroke: showAll ? '#9bb4be' : '#9bb4bf',
                                    strokeWidth: 50,
                                    // fill: showAll ? '#ff0000' : '#456172',
                                    // fill: '#ff0000',
                                    fill: showAll ? '#ffffff' : 'transparent',

                                }}
                                className={styles.educationHexagon}
                            />

                                Show All
                        </button>

                    </div>
                    <div className={styles.infraIconContainer}>
                        <button
                            type="button"
                            className={styles.criticalButton}
                            onClick={() => handleEvacclick('education')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#ffdd00',
                                    // stroke: showEducation ? '#9bb4be' : '#9bb4bf',
                                    strokeWidth: 50,
                                    // fill: showEducation ? '#ffdd00' : '#456172' }}
                                    // fill: '#ffdd00',
                                    fill: showEducation
                                    || showAll
                                        ? '#ffdd00' : 'transparent',

                                }}
                                className={styles.educationHexagon}
                            />


                            Education
                        </button>
                    </div>

                    <div className={styles.infraIconContainer}>
                        <button
                            type="button"
                            className={styles.criticalButton}
                            onClick={() => handleEvacclick('culture')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#c8b0b8',
                                    // stroke: showCulture ? '#9bb4be' : '#9bb4bf',

                                    strokeWidth: 50,
                                    // fill: '#c8b0b8',
                                    fill: showCulture
                                    || showAll
                                        ? '#c8b0b8' : 'transparent',

                                }}
                                        // fill: showCulture ? '#c8b0b8' : '#456172' }}
                                className={styles.educationHexagon}
                            />
                            Culture
                        </button>
                    </div>
                    <div className={styles.infraIconContainer}>
                        <button
                            type="button"
                            className={styles.criticalButton}
                            onClick={() => handleEvacclick('safe')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#c8b0b8',
                                    // stroke: showCulture ? '#9bb4be' : '#9bb4bf',

                                    strokeWidth: 50,
                                    // fill: '#c8b0b8',
                                    fill: showSafe
                                    || showAll
                                        ? '#159d50' : 'transparent',

                                }}
                                        // fill: showCulture ? '#c8b0b8' : '#456172' }}
                                className={styles.educationHexagon}
                            />
                            Safe Shelter
                        </button>
                    </div>
                </div>


            </div>
            {/* </VRLegend> */}
        </>
    );
};

export default EvacLegends;
