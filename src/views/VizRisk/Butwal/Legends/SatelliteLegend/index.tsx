import React, { useState, useEffect } from 'react';
import styles from './styles.scss';


const colorArr = [
    '#808080',
    '#3d26a6',
    '#1e96eb',
    '#80cb57',
    '#ff5500',
    '#a80000',
    '#750000',

];
const SatelliteLegends = (props) => {
    const { satelliteImageYears, selectedYear, handleyearClick, satelliteYearDisabled } = props;

    const [initial, setInitial] = useState(true);


    const arr = satelliteImageYears.map(item => item.year);


    return (
        <>
            <div className={styles.landslideCriticalLegend}>
                <div className={styles.criticalIcons}>
                    <p>Select Year</p>
                    {arr.sort((a, b) => a - b).map((item, i) => (
                        <div key={item} className={styles.infraIconContainer}>
                            <button
                                type="button"
                                // eslint-disable-next-line no-nested-ternary
                                className={item === selectedYear
                                    ? styles.criticalButtonSelected
                                    : satelliteYearDisabled
									 ? styles.criticalButtonDisabled : styles.criticalButton}
                                onClick={() => handleyearClick(item)}
                                disabled={satelliteYearDisabled || item === selectedYear}

                            >
                                <div className={styles.section}>
                                    <span className={styles.text}>
                                        {item}
                                    </span>
                                </div>
                            </button>
                        </div>
                    ))
                    }
                </div>
            </div>

        </>
    );
};

export default SatelliteLegends;
