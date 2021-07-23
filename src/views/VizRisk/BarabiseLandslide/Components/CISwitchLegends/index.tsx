import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

const DemoGraphicsLegends = (props) => {
    const {
        handleCIChange,
        handlehideCILegends,
        hideCILegends,
    } = props;
    const [hide, sethide] = useState(hideCILegends);


    const handlePopulationClick = () => {
        sethide(!hide);
        handleCIChange(!hide);
        if (handlehideCILegends) {
            handlehideCILegends(!hide);
        }
    };

    return (

        <div className={styles.hazardItemContainer}>
            <button
                type="button"
                className={hide ? styles.legendBtn : styles.legendBtnSelected}
                onClick={() => handlePopulationClick()}
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

    );
};

export default DemoGraphicsLegends;
