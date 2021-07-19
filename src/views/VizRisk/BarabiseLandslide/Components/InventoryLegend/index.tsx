import React, { useState, useEffect } from 'react';
import styles from './styles.scss';
import Icon from '#rscg/Icon';

const LandCoverLegends = (props) => {
    const { handleYearSelect, criticalFlood } = props;
    const [showAll, setshowAll] = useState(true);
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
    const [selectedArr, setSelectedArr] = useState(arr);

    const handleyearClick = (year) => {
        if (year === 'all') {
            setSelectedArr(arr);
            handleYearSelect(arr);
            setshowAll(true);
        } else {
            setshowAll(false);
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
        }
    };

    return (
        <>
            <div className={styles.landslideCriticalLegend}>

                <h2>Years</h2>

                <div className={styles.criticalIcons}>

                    <div className={styles.toggleContainer}>
                        <div className={styles.infraIconContainer}>
                            <button
                                type="button"
                                className={showAll
                                    ? styles.criticalButtonSelected
                                    : styles.criticalButton}
                                onClick={() => handleyearClick('all')}
                            >
                                <Icon
                                    name="circle"
                                    className={showAll
                                        ? styles.allIconSelected
                                        : styles.allIcon
                                    }
                                />

                                    Show All
                            </button>
                        </div>

                        {arr.map((ls, i) => (
                            <div key={ls} className={styles.infraIconContainer}>
                                <button
                                    type="button"
                                    className={selectedArr.indexOf(ls) !== -1
                                        ? styles.criticalButtonSelected
                                        : styles.criticalButton}
                                    onClick={() => handleyearClick(ls)}
                                >

                                    <Icon
                                        name="circle"
                                        className={selectedArr.indexOf(ls) !== -1
                                            ? styles.allIconSelected
                                            : styles.allIcon
                                        }
                                    />
                                    <p>
                                        {ls}
                                    </p>
                                </button>
                            </div>
                        ))
                        }

                    </div>
                </div>
            </div>

        </>
    );
};

export default LandCoverLegends;
