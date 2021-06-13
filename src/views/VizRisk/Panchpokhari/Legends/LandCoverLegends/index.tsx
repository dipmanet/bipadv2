import React from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

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
            <span>
                <Hexagon
                    style={{
                        stroke: '#edf7d2',
                        strokeWidth: 50,
                        fill: '#d3e878',

                    }}
                    className={styles.agricultureIcon}
                />

            </span>
                            Agricultural Land
        </p>
        <p className={styles.landcoverIconContainer}>
            <span>
                <Hexagon
                    style={{
                        stroke: '#a6dea6',
                        strokeWidth: 50,
                        fill: '#90d086',

                    }}
                    className={styles.forestIcon}
                />

            </span>
                            Forest
        </p>


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
                        fill: '#b4b4b4',

                    }}
                    className={styles.otherIcon}
                />
            </span>
                            Other
        </p>

        <p className={styles.landcoverIconContainer}>
            <Hexagon
                style={{
                    stroke: '#fff',
                    strokeWidth: 50,
                    fill: '#c2d9a5',

                }}
                className={styles.otherIcon}
            />
            Shrubs
        </p>
        <p className={styles.landcoverIconContainer}>
            <Hexagon
                style={{
                    stroke: '#fff',
                    strokeWidth: 50,
                    fill: '#ffffff',

                }}
                className={styles.otherIcon}
            />
            Snow

        </p>
        <p className={styles.landcoverIconContainer}>
            <Hexagon
                style={{
                    stroke: '#fff',
                    strokeWidth: 50,
                    fill: '#e9e1d8',

                }}
                className={styles.otherIcon}
            />
            Rocks/Stones

        </p>
        <p className={styles.landcoverIconContainer}>
            <Hexagon
                style={{
                    stroke: '#fff',
                    strokeWidth: 50,
                    fill: '#c4f1ac',

                }}
                className={styles.otherIcon}
            />
            Grassland

        </p>

    </>

);

export default LandCoverLegends;
