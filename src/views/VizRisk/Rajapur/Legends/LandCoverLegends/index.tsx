import React from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';
import AgriPattern from '../../Icons/agrihexagon.svg';

const LandCoverLegends = () => (
    <>
        {/* <h2>Land Cover</h2> */}
        <p className={styles.landcoverIconContainer}>
            <span>

                <Hexagon
                    style={{
                        stroke: '#f3f2f2',
                        strokeWidth: 50,
                        fill: '#d5d3d3',

                    }}
                    className={styles.buildingIcon}
                />
            </span>
            <span className={styles.legendText}>Buildings</span>

        </p>
        <p className={styles.landcoverIconContainer}>
            <span>
                <Hexagon
                    style={{
                        stroke: '#a7ced6',
                        strokeWidth: 50,
                        fill: '#0670bc',

                    }}
                    className={styles.riverIcon}
                />

            </span>
            <span className={styles.legendText}>Water Bodies</span>

        </p>

        <p className={styles.landcoverIconContainer}>
            {/* <span>
                <Hexagon
                    style={{
                        stroke: '#edf7d2',
                        strokeWidth: 50,
                        // fill: '#e6f2a1',

                    }}
                    className={styles.agricultureIcon}
                    backgroundImage={AgriPattern}

                />

            </span> */}
            <img src={AgriPattern} alt="agriculture legend" className={styles.agricultureIcon} />
            <span className={styles.legendText}>Agricultural Land</span>

        </p>
        <p className={styles.landcoverIconContainer}>
            <span>
                <Hexagon
                    style={{
                        stroke: '#a6dea6',
                        strokeWidth: 50,
                        fill: '#00a811',

                    }}
                    className={styles.forestIcon}
                />

            </span>
            <span className={styles.legendText}>Forest</span>

        </p>

        <div className={styles.landcoverIconContainer}>
            <div className={styles.canalIcon} />

            <span className={styles.legendText}>Canals</span>

        </div>

        <div className={styles.landcoverIconContainer}>
            <div className={styles.roadIcon} />

            <span className={styles.legendText}>Roads</span>

        </div>
        <div className={styles.landcoverIconContainer}>
            <div className={styles.bridgeLine} />

            <span className={styles.legendText}>Bridges</span>

        </div>

        <p className={styles.landcoverIconContainer}>
            <span>
                <Hexagon
                    style={{
                        stroke: '#fff',
                        strokeWidth: 50,
                        fill: '#b4b4b4',

                    }}
                    className={styles.otherIcon}
                />
            </span>
            <span className={styles.legendText}>Other</span>

        </p>

    </>

);

export default LandCoverLegends;
