import React, { useState, useEffect } from 'react';
import Hexagon from 'react-hexagon';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Icon from '#rscg/Icon';
import Communication from '#resources/icons/communication.svg';
import Electricity from '#resources/icons/Electricity.svg';
import Transportation from '#resources/icons/Transport.svg';
import Tourism from '#resources/icons/icon_set_hotel.svg';
import styles from './styles.scss';
import Education from '../../Icons/icon_set_school.svg';
import Governance from '../../Icons/icon_set_government.svg';
import Culture from '../../Icons/icon_set_religion.svg';
import Health from '../../Icons/icon_set_health-01.svg';
import Industry from '../../Icons/icon_set_industry.svg';
import Building from '../../Icons/homeNew.svg';
import Bank from '../../Icons/icon_set_bank.svg';

const LandCoverLegends = (props) => {
    const {
        handleCritical,
        criticalFlood,
        showBuildingPoints,
        criticalInfraData,
    } = props;
    const [showEducation, setshowEducation] = useState(false);
    const [finance, setshowFinance] = useState(false);
    const [showBuilding, setshowBuilding] = useState(false);
    const [showIndustry, setshowIndustry] = useState(false);
    const [showGovernemnt, setshowGovernemnt] = useState(false);
    const [showCulture, setshowCulture] = useState(false);
    const [showHospital, setshowHospital] = useState(false);
    const [showTourism, setshowTourism] = useState(false);
    const [showAll, setshowAll] = useState(true);
    const [showCriticalElements, setshowCriticalElements] = useState(true);
    const [showElectricity, setshowElectricity] = useState(false);
    const [showTransportation, setshowTransportation] = useState(false);
    const [showBank, setshowBank] = useState(false);
    const [showCommunication, setshowCommunication] = useState(false);

    const resetCriticalLayers = () => {
        setshowAll(false);
        setshowEducation(false);
        setshowCulture(false);
        setshowGovernemnt(false);
        setshowHospital(false);
        setshowIndustry(false);
        setshowFinance(false);
        setshowTourism(false);
        setshowCommunication(false);
        setshowBank(false);
        setshowBuilding(false);
        setshowElectricity(false);
        setshowTransportation(false);
    };

    const handleCriticalToggle = () => {
        const newVal = !showCriticalElements;
        setshowCriticalElements(newVal);
    };

    useEffect(
        () => {
            if (criticalFlood === 'all') {
                resetCriticalLayers();
                setshowAll(true);
            } else if (criticalFlood === 'Education') {
                resetCriticalLayers();
                setshowEducation(true);
            } else if (criticalFlood === 'Culture') {
                resetCriticalLayers();
                setshowCulture(true);
            } else if (criticalFlood === 'Governance') {
                resetCriticalLayers();
                setshowGovernemnt(true);
            } else if (criticalFlood === 'Health') {
                resetCriticalLayers();
                setshowHospital(true);
            } else if (criticalFlood === 'Industry') {
                resetCriticalLayers();
                setshowIndustry(true);
            } else if (criticalFlood === 'Bank ATM') {
                resetCriticalLayers();
                setshowFinance(true);
            } else if (criticalFlood === 'Tourism') {
                resetCriticalLayers();
                setshowTourism(true);
            } else if (criticalFlood === 'Communication') {
                resetCriticalLayers();
                setshowCommunication(true);
            } else if (criticalFlood === 'Electricity') {
                resetCriticalLayers();
                setshowElectricity(true);
            } else if (criticalFlood === 'Bank') {
                resetCriticalLayers();
                setshowBank(true);
            } else if (criticalFlood === 'buildings') {
                resetCriticalLayers();
                setshowBuilding(true);
            } else if (criticalFlood === 'Transportation') {
                resetCriticalLayers();
                setshowTransportation(true);
            }
        }, [criticalFlood],

    );

    const handleCriticalclick = (layer) => {
        handleCritical(layer);
        if (layer === 'all') {
            resetCriticalLayers();
            setshowAll(true);
        }
        if (layer === 'Education') {
            resetCriticalLayers();
            setshowEducation(true);
        }
        if (layer === 'Governance') {
            resetCriticalLayers();
            setshowGovernemnt(true);
        }
        if (layer === 'Culture') {
            resetCriticalLayers();
            setshowCulture(true);
        }
        if (layer === 'Health') {
            resetCriticalLayers();
            setshowHospital(true);
        }
        if (layer === 'Industry') {
            resetCriticalLayers();
            setshowIndustry(true);
        }
        if (layer === 'Bank ATM') {
            resetCriticalLayers();
            setshowFinance(true);
        }
        if (layer === 'Tourism') {
            resetCriticalLayers();
            setshowTourism(true);
        }
        if (layer === 'buildings') {
            resetCriticalLayers();
            setshowBuilding(true);
        }
        if (layer === 'Electricity') {
            resetCriticalLayers();
            setshowElectricity(true);
        }
        if (layer === 'Transportation') {
            resetCriticalLayers();
            setshowTransportation(true);
        }
        if (layer === 'Bank') {
            resetCriticalLayers();
            setshowBank(true);
        }
        if (layer === 'Communication') {
            resetCriticalLayers();
            setshowCommunication(true);
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
                                Show All
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={showEducation
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('Education')}
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
                                className={showGovernemnt
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('Governance')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Governance}
                                />
                                Government Building
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>

                            <button
                                type="button"
                                className={showCommunication
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('Communication')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Communication}
                                />
                                Communication
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>

                            <button
                                type="button"
                                className={showBank
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('Bank')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Bank}
                                />
                                Bank
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>
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
                                Culture Site
                            </button>

                        </div>

                        <div className={styles.infraIconContainer}>

                            <button
                                type="button"
                                className={showHospital
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('Health')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Health}
                                />
                                Hospital
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={showIndustry
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('Industry')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Industry}
                                />

                                Industry
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>

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
                                Tourism
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>

                            <button
                                type="button"
                                className={showElectricity
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('Electricity')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Electricity}
                                />
                                Electricity
                            </button>

                        </div>
                        <div className={styles.infraIconContainer}>

                            <button
                                type="button"
                                className={showTransportation
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleCriticalclick('Transportation')}
                            >
                                <ScalableVectorGraphics
                                    className={styles.svgIcon}
                                    src={Transportation}
                                />
                                Transportation
                            </button>

                        </div>
                        {showBuildingPoints
                            && (
                                <div className={styles.infraIconContainer}>

                                    <button
                                        type="button"
                                        className={showBuilding
                                            ? styles.criticalButtonSelected
                                            : styles.criticalButton}
                                        onClick={() => handleCriticalclick('buildings')}
                                    >
                                        <Hexagon
                                            style={{
                                                stroke: showBuilding ? '#036ef0' : '#d3d3d3',
                                                strokeWidth: 50,
                                                fill: '#a4a4a2',
                                            }}
                                            className={styles.educationHexagon}
                                        />
                                        Buildings
                                    </button>

                                </div>
                            )
                        }
                    </div>
                </div>
            )
            }

        </>
    );
};

export default LandCoverLegends;
