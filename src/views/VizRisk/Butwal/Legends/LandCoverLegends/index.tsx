/* eslint-disable no-nested-ternary */
import React from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

const LandCoverLegends = (props) => {
    const { leftElement, clickedArr, exposureElementArr } = props;


    return (
        <>


            <div className={(leftElement === 2 && clickedArr[2] === 1)
				 ? styles.mainDivLandClicked : (leftElement === 3 && exposureElementArr[2] === 1)
				  ? styles.mainDivLandEx : styles.mainDivLand}
            >
                <p className={styles.landcoverIconContainer}>
                    <span>

                        <Hexagon
                            style={{
                                stroke: '#f3f2f2',
                                strokeWidth: 50,
                                fill: '#964B00',

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
                                fill: '#5ac44a',

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
                                fill: '#e0e0e0',

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
                            fill: '#04771f',

                        }}
                        className={styles.otherIcon}
                    />
            Grassland

                </p>
            </div>
        </>
    );
};

export default LandCoverLegends;
