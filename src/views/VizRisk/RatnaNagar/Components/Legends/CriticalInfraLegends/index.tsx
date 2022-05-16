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
import Fireengine from '../../../../Common/Icons/Fireengine.svg';
import Heli from '../../../../Common/Icons/Heli.svg';
import style from '#mapStyles/rasterStyle';
import ManualIcon from '#resources/images/manualicon.png';


const CriticalInfraLegends = (props) => {
    const { cITypeName } = props;
    const [showCriticalElements, setshowCriticalElements] = useState(true);


    return (
        <>
            {(
                <div className={styles.mainDivPop}>
                    <button
                        type="button"
                        className={styles.toggleCritical}
                    >
                        <h3 style={{ fontSize: 14 }}>
                            Infrastructures
                        </h3>
                    </button>
                    {showCriticalElements && (

                        <div className={styles.criticalIcons}>

                            <div className={styles.toggleContainer}>

                                {cITypeName.map((item, i) => (
                                    <div className={styles.infraIconContainer} key={item}>
                                        <button
                                            type="button"
                                            className={
                                                styles.criticalButton}
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


                                            {item.toUpperCase()}
                                        </button>
                                    </div>
                                ))}
                            </div>


                        </div>
                    )}


                </div>
            )}
        </>
    );
};

export default CriticalInfraLegends;
