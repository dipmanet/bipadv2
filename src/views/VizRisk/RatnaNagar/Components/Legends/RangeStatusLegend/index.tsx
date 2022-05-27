/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useState } from 'react';
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';
import Return from '#resources/icons/Reset.svg';

import { rangeData } from '#views/VizRisk/RatnaNagar/expressions';
import styles from './styles.scss';
import { getCurrentType } from '#views/VizRisk/RatnaNagar/utils';

const RangeStatusLegend = (props) => {
    const { rangeNames, setRangeNames } = props;
    const {
        leftElement,
        handleReset,
        handleRangeLegendClick,
    } = useContext(MainPageDataContext);

    const handleClick = (range, rangeName) => {
        handleRangeLegendClick(range);
        setRangeNames(prevState => [...prevState, rangeName]);

        if (rangeNames.includes(rangeName)) {
            setRangeNames(prevState => prevState.filter(item => item !== rangeName));
        }
    };


    return (
        <div className={styles.mainStatusLegendContainer}>
            <div className={styles.reloadAndTitle}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.resetIcon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth="1"
                    onClick={handleReset}
                >
                    <path
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                </svg>
                <p className={styles.titleName}>
                    {`${getCurrentType(leftElement).charAt(0).toUpperCase()
                        + getCurrentType(leftElement).slice(1)} Score`
                    }

                </p>
            </div>
            {
                rangeData.map(item => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <div
                        key={item.status}
                        className={styles.statusSection}
                        onClick={() => handleClick(item.range, item.name)}
                    >
                        <div
                            style={{ backgroundColor: item.color }}
                            className={styles.statusColor}
                        />
                        <p
                            className={rangeNames.includes(item.name) ? styles.statusnameActive
                                : styles.statusname}
                            style={{
                                color: rangeNames.includes(item.name)
                                    ? item.color : 'white',
                            }}
                        >
                            {item.status}

                        </p>
                    </div>
                ))
            }
        </div>

    );
};

export default RangeStatusLegend;
