import React from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';
<<<<<<< HEAD:src/views/VizRisk/Rajapur/Legends/LandCoverLegends/index.tsx
import AgriPattern from '../../Icons/agrihexagon.svg';
=======
>>>>>>> feature/JugalPanckpokhari:src/views/VizRisk/Panchpokhari/Legends/LandCoverLegends/index.tsx

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
            <span>
                <Hexagon
                    style={{
                        stroke: '#edf7d2',
                        strokeWidth: 50,
                        fill: '#d3e878',

                    }}
                    className={styles.agricultureIcon}
                />

<<<<<<< HEAD:src/views/VizRisk/Rajapur/Legends/LandCoverLegends/index.tsx
            </span> */}
            <img src={AgriPattern} alt="agriculture legend" className={styles.agricultureIcon} />
            <span className={styles.legendText}>Agricultural Land</span>

=======
            </span>
                            Agricultural Land
>>>>>>> feature/JugalPanckpokhari:src/views/VizRisk/Panchpokhari/Legends/LandCoverLegends/index.tsx
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
            <span className={styles.legendText}>Forest</span>

        </p>

<<<<<<< HEAD:src/views/VizRisk/Rajapur/Legends/LandCoverLegends/index.tsx
        <div className={styles.landcoverIconContainer}>
            <div className={styles.canalIcon} />

            <span className={styles.legendText}>Canals</span>

        </div>
=======
>>>>>>> feature/JugalPanckpokhari:src/views/VizRisk/Panchpokhari/Legends/LandCoverLegends/index.tsx

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
