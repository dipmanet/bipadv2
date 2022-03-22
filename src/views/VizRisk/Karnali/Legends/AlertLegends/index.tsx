/* eslint-disable no-nested-ternary */
import React from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

const AlertsLegend = props => (
    <>
        <div className={styles.mainDivLand}>
            <p className={styles.landcoverIconContainer}>
                <span>

                    <Hexagon
                        style={{
                            stroke: '#f3f2f2',
                            strokeWidth: 50,
                            fill: 'red',

                        }}
                        className={styles.fireIcon}
                    />
                </span>
                            Fire

            </p>
            <p className={styles.landcoverIconContainer}>
                <span>
                    <Hexagon
                        style={{
                            stroke: '#a7ced6',
                            strokeWidth: 50,
                            fill: '#0670bc',

                        }}
                        className={styles.rainFallIcon}
                    />

                </span>
                           Heavy Rainfall
            </p>

            <p className={styles.landcoverIconContainer}>
                <span>
                    <Hexagon
                        style={{
                            stroke: '#edf7d2',
                            strokeWidth: 50,
                            fill: 'purple',

                        }}
                        className={styles.pollutionIcon}
                    />

                </span>
                           Environmental Pollution
            </p>
            <p className={styles.landcoverIconContainer}>
                <span>
                    <Hexagon
                        style={{
                            stroke: '#a6dea6',
                            strokeWidth: 50,
                            fill: 'blue',

                        }}
                        className={styles.pollutionIcon}
                    />

                </span>
                            Flood
            </p>
            <p className={styles.landcoverIconContainer}>
                <span>
                    <Hexagon
                        style={{
                            stroke: '#a6dea6',
                            strokeWidth: 50,
                            fill: 'rgb(93, 64, 55)',

                        }}
                        className={styles.earthquakeIcon}
                    />

                </span>
                            EarthQuake
            </p>
        </div>
    </>
);

export default AlertsLegend;
