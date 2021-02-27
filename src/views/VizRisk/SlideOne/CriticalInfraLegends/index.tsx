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
import Rupees from '../Icons/bank.svg';
import Tourism from '#views/VizRisk/SlideOne/Icons/tourism.svg';

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
    };

    const handleLegendText = (layer) => {
        setshowLT(layer);
    };

    const handleCriticalclick = (layer) => {
        handleCritical(layer);


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
            setshowCulture(true);
            resetCriticalLayers();
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
            <div className={styles.lagendMainContainerInfra}>

                <div className={styles.criticalIcons}>
                    <div className={styles.toggleContainer}>
                        <h1>Infrastructures</h1>
                        <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={styles.criticalButton}
                                onClick={() => handleCriticalclick('all')}
                            >

                                <h2>Show All</h2>
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={styles.criticalButton}
                                onClick={() => handleCriticalclick('education')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.criticalIcon}
                                    src={Tourism}
                                />
                            School
                            </button>
                        </div>
                        <div className={styles.infraIconContainer}>

                            <button
                                type="button"
                                className={styles.criticalButton}
                                onClick={() => handleCriticalclick('governance')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.criticalIcon}
                                    src={Tourism}
                                />
                            Government Off.
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={styles.criticalButton}
                                onClick={() => handleCriticalclick('culture')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.criticalIcon}
                                    src={Tourism}
                                />
                            Cultural Cen.
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>

                            <button
                                type="button"
                                className={styles.criticalButton}
                                onClick={() => handleCriticalclick('health')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.criticalIcon}
                                    src={Tourism}
                                />
                            Hospital
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={styles.criticalButton}
                                onClick={() => handleCriticalclick('industry')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.criticalIcon}
                                    src={Tourism}
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
                                <ScalableVectorGraphics
                                    className={styles.criticalIcon}
                                    src={Tourism}
                                    style={{ color: '#4666b0' }}
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
                                <ScalableVectorGraphics
                                    className={styles.criticalIcon}
                                    src={Tourism}
                                    style={{ color: '#4666b0' }}
                                />
                             Financial Inst.
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* </VRLegend> */}


            {/* <VRLegend> */}
            <div className={styles.lagendMainContainer}>
                {/*
                <div className={styles.clusterIconContainer}>
                    <span>
                        <Icon
                            name="circle"
                            className={styles.clusterIcon}
                        />
                    </span>
                            Clusters of
                    {' '}
                    {showLegendText}

                </div> */}

                <div className={styles.infraIconContainer}>
                    <div className={styles.canalIcon} />

                            Canals
                </div>
                <div className={styles.infraIconContainer}>
                    <div className={styles.roadIcon} />

                            Roads
                </div>
            </div>
            {/* </VRLegend> */}
        </>
    );
};

export default LandCoverLegends;
