import React from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';
import AgriPattern from '#resources/icons/Agrihexagon.png';

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
                            Buildings

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
                            Water Bodies
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
                            Agricultural Land
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
                            Forest
        </p>
        <p className={styles.landcoverIconContainer}>
            <span>
                <Hexagon
                    style={{
                        stroke: '#fff',
                        strokeWidth: 50,
                        fill: '#4ad391',

                    }}
                    className={styles.otherIcon}
                />
            </span>
                            Grassland
        </p>
        <p className={styles.landcoverIconContainer}>
            <span>
                <Hexagon
                    style={{
                        stroke: '#fff',
                        strokeWidth: 50,
                        fill: '#afeb0a',

                    }}
                    className={styles.otherIcon}
                />
            </span>
                            Meadow
        </p>
        <p className={styles.landcoverIconContainer}>
            <span>
                <Hexagon
                    style={{
                        stroke: '#fff',
                        strokeWidth: 50,
                        fill: '#effdc9',

                    }}
                    className={styles.otherIcon}
                />
            </span>
                            Sand
        </p>
        <div className={styles.landcoverIconContainer}>
            <div className={styles.canalIcon} />

                            Canals
        </div>

        <div className={styles.landcoverIconContainer}>
            <div className={styles.roadIcon} />

                            Roads
        </div>
        <div className={styles.landcoverIconContainer}>
            <div className={styles.bridgeLine} />

                            Bridges
        </div>

        <p className={styles.landcoverIconContainer}>
            <span>
                <Hexagon
                    style={{
                        stroke: '#fff',
                        strokeWidth: 50,
                        fill: '#f3f2f2',

                    }}
                    className={styles.otherIcon}
                />
            </span>
                            Other
        </p>

    </>

);

export default LandCoverLegends;
