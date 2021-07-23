import React, { useState, useEffect } from 'react';
import styles from './styles.scss';
import Icon from '#rscg/Icon';

const colorArr = [
    '#808080',
    '#3d26a6',
    '#1e96eb',
    '#80cb57',
    '#ff5500',
    '#a80000',
    '#750000',

];
const LandCoverLegends = (props) => {
    const { handleYearSelect, criticalFlood } = props;
    const [compareMode, setCompare] = useState(false);
    const [initial, setInitial] = useState(true);
    const [showCriticalElements, setshowCriticalElements] = useState(true);


    const generateYearsArr = () => {
        // const max = new Date().getFullYear() ;
        const max = 2020;
        const min = max - 6;
        const years = [];
        // eslint-disable-next-line no-plusplus
        for (let i = max; i >= min; i--) {
            years.push(i);
        }

        return years;
    };

    const arr = generateYearsArr();
    const [selectedArr, setSelectedArr] = useState([]);

    const handleyearClick = (year) => {
        setInitial(false);
        if (compareMode) {
            const array = [...selectedArr];
            const index = selectedArr.indexOf(year);
            if (index === -1) {
                const newArr = [...array, year];
                setSelectedArr(newArr);
                handleYearSelect(newArr);
            } else {
                const newArr = array.filter(y => y !== year);
                setSelectedArr(newArr);
                handleYearSelect(newArr);
            }
        } else {
            const array = [year];
            setSelectedArr(array);
            handleYearSelect(array);
        }
    };

    const handleCompareClick = () => {
        if (compareMode) {
            const array = [];
            handleYearSelect([]);
            setSelectedArr(array);
        }
        setInitial(false);
        setCompare(!compareMode);
    };

    useEffect(() => {
        handleYearSelect([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <div className={styles.landslideCriticalLegend}>
                <div className={styles.criticalIcons}>
                    <p>Post Monsoon Landslide</p>
                    {arr.sort((a, b) => a - b).map((ls, i) => (
                        <div key={ls} className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={selectedArr.indexOf(ls) !== -1
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleyearClick(ls)}
                            >
                                <div className={styles.section}>
                                    <span className={styles.text}>
                                        {ls}
                                    </span>
                                    <div
                                        className={styles.underline}
                                        style={{ backgroundColor: colorArr[i] }}
                                    />
                                </div>
                            </button>
                        </div>
                    ))
                    }
                    <button
                        type="button"
                        className={styles.navbutton}
                        onClick={() => handleCompareClick()}
                    >
                        {compareMode ? 'RESET' : 'COMPARE'}
                    </button>
                </div>
            </div>

        </>
    );
};

export default LandCoverLegends;
