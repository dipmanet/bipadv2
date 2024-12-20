import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

const DemoGraphicsLegends = (props) => {
    const {
        handleCIChange,
        handlehideCILegends,
        hideCILegends,
        hideOSMLayers,
        showOSMSwitch,
        handlehideOSMLayers,
    } = props;
    const [hide, sethide] = useState(hideCILegends);
    const [hideOSM, sethideOSM] = useState(hideOSMLayers);


    const handleCIClick = () => {
        sethide(!hide);
        handleCIChange(!hide);
        if (handlehideCILegends) {
            handlehideCILegends(!hide);
        }
    };

    const handleOSMClick = () => {
        sethideOSM(!hideOSM);
        handlehideOSMLayers(!hideOSM);
    };

    return (

        <>
            <div className={styles.hazardItemContainer}>
                <button
                    type="button"
                    className={hide ? styles.legendBtn : styles.legendBtnSelected}
                    onClick={() => handleCIClick()}
                >
                    <Hexagon
                        style={{
                            stroke: '#fff',
                            strokeWidth: 50,
                            fill: hide ? 'transparent' : '#036ef0',
                        }}
                        className={styles.educationHexagon}
                    />
                          Community Infrastructure
                </button>
            </div>
            {
                showOSMSwitch
                && (
                    <div className={styles.OSMSwitch}>
                        <button
                            type="button"
                            className={hideOSM ? styles.legendBtn : styles.legendBtnSelected}
                            onClick={() => handleOSMClick()}
                        >
                            <Hexagon
                                style={{
                                    stroke: '#fff',
                                    strokeWidth: 50,
                                    fill: hideOSM ? 'transparent' : '#036ef0',
                                }}
                                className={styles.educationHexagon}
                            />
                          OPENSTREETMAP
                        </button>
                    </div>
                )
            }
        </>
    );
};

export default DemoGraphicsLegends;
