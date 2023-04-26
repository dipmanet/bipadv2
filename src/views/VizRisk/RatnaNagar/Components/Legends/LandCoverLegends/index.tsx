import React from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

const LandCoverLegends = () => (
    <>

        <div className={styles.mainDivLand}>
            {/* <p className={styles.landcoverIconContainer}>
                <span>

                    <Hexagon
                        style={{
                            stroke: '#f3f2f2',
                            strokeWidth: 50,
                            fill: '#d2d0d0',

                        }}
                        className={styles.buildingIcon}
                    />
                </span>
                Buildings

            </p> */}
            {/* <p className={styles.landcoverIconContainer}>
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
            </p> */}


            <div className={styles.landcoverIconContainer}>
                <div className={styles.roadIcon} />

                Roads
            </div>
            <div className={styles.landcoverIconContainer}>
                <div className={styles.bridgeLine} />

                Bridges
            </div>


            {/* <p className={styles.landcoverIconContainer}>
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
                        fill: '#04771f',

                    }}
                    className={styles.otherIcon}
                />
                Grassland

            </p>
            <p className={styles.landcoverIconContainer}>
                <span>
                    <Hexagon
                        style={{
                            stroke: '#fff',
                            strokeWidth: 50,
                            fill: '#e0e0e0',

                        }}
                        className={styles.otherIcon}
                    />
                </span>
                Other
            </p> */}
        </div>
    </>
);

export default LandCoverLegends;
