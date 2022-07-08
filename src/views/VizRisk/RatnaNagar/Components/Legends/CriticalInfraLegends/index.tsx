/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { Item } from 'semantic-ui-react';
import styles from './styles.scss';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Education from '#resources/icons/icon_set_school.svg';
import Governance from '#resources/icons/icon_set_government.svg';
import Culture from '#resources/icons/icon_set_religion.svg';
import Health from '#resources/icons/icon_set_health-01.svg';
import Tourism from '#resources/icons/icon_set_hotel.svg';
import Bank from '#resources/icons/icon_set_bank.svg';
import Evacuation from '../../../../Common/Icons/IDP-refugee-camp.svg';
import Water from '#resources/icons/WATERVR.svg';
import Bridge from '#resources/icons/bridge copy.svg';
import Communication from '#resources/icons/communication.svg';
import Sanitation from '../../../../Common/Icons/sanitationviz.svg';
import Hotel from '../../../../Common/Icons/hotelci.svg';
import Industry from '#resources/icons/IndustryVR.svg';
import Electricity from '#resources/icons/Electricity.svg';
import Icon from '#rscg/Icon';
import Fireengine from '../../../../Common/Icons/Fireengine.svg';
import Heli from '../../../../Common/Icons/Heli.svg';
import Road from '../../../../Common/Icons/road2.svg';
import Waterway from '../../../../Common/Icons/Spring-water.svg';


const CriticalInfraLegends = (props) => {
    const { handleResetMap, criticalFlood, cITypeName, CIState } = props;
    const [showCriticalElements, setshowCriticalElements] = useState(true);

    const handleCriticalToggle = () => {
        const newVal = !showCriticalElements;
        setshowCriticalElements(newVal);
    };

    return (
        <>
            {
                <div className={styles.mainDivPop}>
                    <button
                        type="button"
                        className={styles.toggleCritical}

                    >
                        <div onClick={handleResetMap}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={styles.resetIcon}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="white"
                                strokeWidth="1"
                            >
                                <path
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </div>

                        <h4>
                            Infrastructures


                        </h4>
                        <Icon
                            name="chevronRight"
                            onClick={handleCriticalToggle}
                            className={styles.chevrontoggle}
                        />
                    </button>
                    {showCriticalElements && (

                        <div className={styles.criticalIcons}>

                            <div className={styles.toggleContainer}>

                                {cITypeName.map((item, i) => (
                                    <div className={styles.infraIconContainer} key={item}>
                                        <button
                                            type="button"
                                            className={criticalFlood === item && !CIState
                                                ? styles.criticalButtonSelected
                                                : styles.criticalButton}
                                        >


                                            <ScalableVectorGraphics
                                                className={styles.svgIcon}
                                                src={
                                                    (item === 'education' && Education)
                                                    || (item === 'governance' && Governance)
                                                    || (item === 'hotelandrestaurant' && Hotel)
                                                    || (item === 'health' && Health)
                                                    || (item === 'cultural' && Culture)
                                                    || (item === 'finance' && Bank)
                                                    || (item === 'fireengine' && Fireengine)
                                                    || (item === 'bridge' && Bridge)
                                                    || (item === 'airway' && Bridge)
                                                    || (item === 'communication' && Communication)
                                                    || (item === 'watersupply' && Water)
                                                    || (item === 'sanitation' && Sanitation)
                                                    || (item === 'industry' && Industry)
                                                    || (item === 'communityspace' && Communication)
                                                    || (item === 'helipad' && Heli)
                                                    || (item === 'roadway' && Road)
                                                    || (item === 'firefightingapparatus' && Fireengine)
                                                    || (item === 'waterway' && Waterway)
                                                    || (item === 'electricity' && Electricity)
                                                    || (item === 'evacuationcentre' && Evacuation)
                                                }
                                            />


                                            {item.toUpperCase()}
                                        </button>
                                    </div>
                                ))}
                            </div>


                        </div>
                    )}


                </div>
            }
        </>
    );
};

export default CriticalInfraLegends;
