/* eslint-disable no-tabs */
/* eslint-disable react/jsx-indent */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { Item } from 'semantic-ui-react';
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
import Fireengine from '../../../Common/Icons/Fireengine.svg';
import Heli from '../../../Common/Icons/Heli.svg';
import style from '#mapStyles/rasterStyle';
import ManualIcon from '#resources/images/manualicon.png';


const CriticalInfraLegends = (props) => {
    const { handleCritical, criticalFlood, cITypeName, clickedArr, exposureElementArr, leftElement,	CIState } = props;
    const [showCriticalElements, setshowCriticalElements] = useState(true);

    const handleCriticalToggle = () => {
        const newVal = !showCriticalElements;
        setshowCriticalElements(newVal);
    };

    return (
        <>
            {
                <div className={styles.mainDivPopExposure}>
                    <button
                        type="button"
                        className={styles.toggleCritical}
                        onClick={handleCriticalToggle}
                    >
                        <h4>
	 Infrastructures


                        </h4>

                        {showCriticalElements === true ? (
                            <Icon
                                name="chevronRight"
                                className={styles.chevrontoggle}
                            />
					   )
					    : (
                                <Icon
                                    name="chevronLeft"
                                    className={styles.chevrontoggle}
                                />
						 )}
                    </button>
                    {showCriticalElements && (

                        <div className={styles.criticalIcons}>

                            <div className={styles.toggleContainer}>
                                <div className={styles.infraIconContainer}>

                                    <button
                                        type="button"
                                        className={criticalFlood === 'all' || CIState
                                            ? styles.criticalButtonSelected
                                            : styles.criticalButton}
                                        onClick={() => handleCritical('all')}
                                    >
                                        <Icon
                                            name="circle"
                                            className={criticalFlood === 'all' || CIState ? styles.allIconSelected : styles.allIcon}
                                        />


SHOW ALL
                                    </button>

                                </div>

                                {cITypeName.map((item, i) => (
                                    <div className={styles.infraIconContainer} key={item}>
                                        <button
                                            type="button"
                                            className={criticalFlood === item && !CIState
			 ? styles.criticalButtonSelected
			  : styles.criticalButton}
                                            onClick={() => handleCritical(item)}
                                        >


                                            <ScalableVectorGraphics
                                                className={styles.svgIcon}
                                                src={(item === 'education' && Education)
					 || (item === 'governance' && Governance)
					  || (item === 'health' && Health)
					  || (item === 'cultural' && Culture)
					   || (item === 'finance' && Bank)
						|| (item === 'fireengine' && Fireengine)
						 || (item === 'helipad' && Heli)}
                                            />


                                            { item.toUpperCase()}
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
