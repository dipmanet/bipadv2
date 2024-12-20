import React from 'react';
import VRLegend from '#views/VizRisk/Rajapur/Components/VRLegend';
import styles from '../../LeftPane/style.scss';

export default function ElementsExposedLegend() {
    const exposureElements = [
        'Critical Infrastructure',
        'Population Density',
        'Landcover',
        'Building Footprint',
    ];
    return (
        <div>
            <VRLegend>

                { exposureElements.map(item => (
                    <div className={styles.incidentsLegendsContainer3} key={item}>
                        <div className={styles.hazardItemContainer3}>
                            <button
                                key={item}
                                type="button"
                                className={
                                    multipleLegendItem === item
                                        ? styles.legendBtnSelected3
                                        : styles.legendBtn3
                                }
                                onClick={() => handleMultipeLegendClicked(item)}
                            >
                                <Hexagon
                                    style={{
                                        innerHeight: 80,
                                        stroke: '#FFFFFF',
                                        strokeWidth: 30,
                                        fill:
                              multipleLegendItem === item ? 'white' : 'transparent',
                                    }}
                                    className={styles.educationHexagon3}
                                />
                                {item}
                            </button>
                        </div>
                    </div>

			 ))}
            </VRLegend>

        </div>
    );
}
