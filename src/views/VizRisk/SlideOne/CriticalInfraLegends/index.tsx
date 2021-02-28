import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';
import VRLegend from '#views/VizRisk/VRLegend';

const LandCoverLegends = (props) => {
    const { handleCritical } = props;
    const [showCriticalLegends, setCritical] = useState(false);
    const [showEducation, setshowEducation] = useState(false);
    const [showFinance, setshowFinance] = useState(false);
    const [showIndustry, setshowIndustry] = useState(false);
    const [showGovernemnt, setshowGovernemnt] = useState(false);
    const [showCulture, setshowCulture] = useState(false);
    const [showHospital, setshowHospital] = useState(false);
    const [showTourism, setshowTourism] = useState(false);
    const [showLegendText, setshowLT] = useState('All Infrastructures');
    const [showAll, setshowAll] = useState(true);


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

    const handleLegendText = (layer) => {
        setshowLT(layer);
    };

    const handleCriticalclick = (layer) => {
        handleCritical(layer);
        if (layer === 'all') {
            resetCriticalLayers();
            setshowAll(true);
            handleLegendText('Education Inst.');
        }

        if (layer === 'education') {
            const newVal = !showEducation;
            resetCriticalLayers();
            setshowEducation(true);
            handleLegendText('Education Inst.');
        }
        if (layer === 'governance') {
            const newVal = !showGovernemnt;
            resetCriticalLayers();
            setshowGovernemnt(true);
            handleLegendText('Government Off.');
        }

        if (layer === 'culture') {
            const newVal = !showCulture;
            resetCriticalLayers();
            setshowCulture(true);
            handleLegendText('Cultural Centers');
        }
        if (layer === 'health') {
            const newVal = !showHospital;
            resetCriticalLayers();
            setshowHospital(true);
            handleLegendText('Health Centers');
        }
        if (layer === 'industry') {
            const newVal = !showIndustry;
            resetCriticalLayers();
            setshowIndustry(true);
            handleLegendText('Industries');
        }
        if (layer === 'bank') {
            const newVal = !showFinance;
            resetCriticalLayers();
            setshowFinance(true);
            handleLegendText('Financial Inst.');
        }
        if (layer === 'tourism') {
            const newVal = !showTourism;
            resetCriticalLayers();
            setshowTourism(true);
            handleLegendText('Tourism');
        }
    };
    return (
        <>
            {/* <VRLegend> */}
            <h1>Infrastructures</h1>

            <div className={styles.criticalIcons}>

                <div className={styles.toggleContainer}>
                    <div className={styles.infraIconContainer}>

                        <button
                            type="button"
                            className={styles.criticalButton}
                            onClick={() => handleCriticalclick('all')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#9bb4be',
                                    // stroke: showAll ? '#9bb4be' : '#9bb4bf',
                                    strokeWidth: 100,
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
                            onClick={() => handleCriticalclick('education')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#ffdd00',
                                    // stroke: showEducation ? '#9bb4be' : '#9bb4bf',
                                    strokeWidth: 100,
                                    // fill: showEducation ? '#ffdd00' : '#456172' }}
                                    // fill: '#ffdd00',
                                    fill: showEducation ? '#ffdd00' : 'transparent',

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
                            onClick={() => handleCriticalclick('governance')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#66dff4',
                                    // stroke: showGovernemnt ? '#9bb4be' : '#9bb4bf',
                                    strokeWidth: 100,
                                    // fill: showGovernemnt ? '#66dff4' : '#456172' }}
                                    // fill: '#66dff4',
                                    fill: showGovernemnt ? '#66dff4' : 'transparent',

                                }}
                                className={styles.educationHexagon}
                            />
                            Government
                        </button>

                    </div>
                    <div className={styles.infraIconContainer}>
                        <button
                            type="button"
                            className={styles.criticalButton}
                            onClick={() => handleCriticalclick('culture')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#c8b0b8',
                                    // stroke: showCulture ? '#9bb4be' : '#9bb4bf',

                                    strokeWidth: 100,
                                    // fill: '#c8b0b8',
                                    fill: showCulture ? '#c8b0b8' : 'transparent',

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
                            onClick={() => handleCriticalclick('health')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#c8b09a',
                                    // stroke: showHospital ? '#9bb4be' : '#9bb4bf',

                                    strokeWidth: 100,
                                    // fill: showHospital ? '#c8b09a' : '#456172' }}
                                    // fill: '#c8b09a',
                                    fill: showHospital ? '#c8b09a' : 'transparent',

                                }}
                                className={styles.educationHexagon}
                            />
                            Health
                        </button>

                    </div>
                    <div className={styles.infraIconContainer}>
                        <button
                            type="button"
                            className={styles.criticalButton}
                            onClick={() => handleCriticalclick('industry')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#a4ac5e',
                                    // stroke: showIndustry ? '#9bb4be' : '#9bb4bf',

                                    strokeWidth: 100,
                                    // fill: showIndustry ? '#a4ac5e' : '#456172'
                                    // fill: '#a4ac5e',
                                    fill: showIndustry ? '#a4ac5e' : 'transparent',


                                }}
                                className={styles.educationHexagon}
                            />
                            Industry
                        </button>

                    </div>
                    <div className={styles.infraIconContainer}>

                        <button
                            type="button"
                            className={styles.criticalButton}
                            onClick={() => handleCriticalclick('tourism')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#62d480',
                                    // stroke: '#9bb4be',
                                    strokeWidth: 100,
                                    // fill: showTourism ? '#62d480' : '#456172'
                                    fill: showTourism ? '#62d480' : 'transparent',
                                }}
                                className={styles.educationHexagon}
                            />
                                Tourism
                        </button>

                    </div>
                    <div className={styles.infraIconContainer}>

                        <button
                            type="button"
                            className={styles.criticalButton}
                            onClick={() => handleCriticalclick('bank')}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#c58dbf',
                                    // stroke: showFinance ? '#9bb4be' : '#9bb4bf',
                                    strokeWidth: 100,
                                    // fill: showFinance ? '#c58dbf' : '#456172'
                                    // fill: '#c58dbf',
                                    fill: showFinance ? '#c58dbf' : 'transparent',
                                }}
                                className={styles.educationHexagon}
                            />
                             Financial
                        </button>

                    </div>
                    <div className={styles.infraIconContainer}>
                        <button
                            type="button"
                            className={styles.criticalButton}
                            onClick={() => handleCriticalclick('canals')}
                        >
                            <div className={styles.canalIcon} />
                             Canals
                        </button>
                    </div>
                    <div className={styles.infraIconContainer}>
                        <button
                            type="button"
                            className={styles.criticalButton}
                            onClick={() => handleCriticalclick('roads')}
                        >
                            <div className={styles.roadIcon} />
                             Roads
                        </button>
                    </div>
                </div>


            </div>
            {/* </VRLegend> */}
        </>
    );
};

export default LandCoverLegends;
