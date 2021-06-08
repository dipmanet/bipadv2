import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';

const DemoGraphicsLegends = (props) => {
    const {
        layer,
    } = props;

    return (
        <div className={styles.susLegend}>
            {layer
                ? (
                    <div>
                        <h2>Seismic hazard (g)</h2>
                        <div className={styles.populationContainer}>

                            <div className={styles.populationIndContainerShort}>
                                <div className={styles.populationIndicator1}>
                                0.08 - 0.13

                                </div>
                                <div className={styles.populationIndicator2}>0.13 - 0.2</div>
                                <div className={styles.populationIndicator3}>0.2-0.35</div>
                                <div className={styles.populationIndicator4}>0.35-0.55</div>
                                <div className={styles.populationIndicator5}>0.55-0.9</div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div>
                        <h2>
                            Landslide Suseptibility


                        </h2>

                        <div className={styles.populationContainer}>
                            <div className={styles.populationIndContainer}>
                                <div className={styles.populationIndicator1} />
                                <div className={styles.populationIndicator2} />
                                <div className={styles.populationIndicator3} />
                                <div className={styles.populationIndicator4} />
                                <div className={styles.populationIndicator5} />
                            </div>
                            <div className={styles.populationTextContainer}>
                                {/* <div className={styles.populationText}>16400</div> */}
                                {/* <div className={styles.populationText}>16400</div> */}
                                <div className={styles.populationText}>0-120</div>
                                <div className={styles.populationText}>120.01-480</div>
                                <div className={styles.populationText}>480.01-1040</div>
                                <div className={styles.populationText}>1040.01-1840</div>
                                <div className={styles.populationText}>1840.01 - 3680</div>
                            </div>

                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default DemoGraphicsLegends;
