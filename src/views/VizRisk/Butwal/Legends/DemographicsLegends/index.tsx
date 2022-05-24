/* eslint-disable max-len */
import React, { useState } from 'react';
import Hexagon from 'react-hexagon';
import { parseStringToNumber } from '../../Functions';
import styles from './styles.scss';


const DemoGraphicsLegends = (props) => {
    const { demographicsData } = props;
    const [showPopulationWard, setShowPopulationWard] = useState(true);
    // Quantile
    const totalPopulationByWard = demographicsData.map(item => ({ ward: item.name, totalpop: item.MalePop + item.FemalePop }));
    const arrayValue = totalPopulationByWard.map(item => item.totalpop);
    const maxPop = Math.max(...arrayValue);
    const minPop = Math.min(...arrayValue);
    const popStep = Math.ceil((maxPop - minPop) / 5);

    const divider = Math.ceil(arrayValue.length / 5);
    arrayValue.sort((a, b) => a - b);
    const dividedSpecificData = new Array(Math.ceil(arrayValue.length / divider))
        .fill()
        .map(_ => arrayValue.splice(0, divider));
    const intervals: number[] = [];
    const nonEmptyData = dividedSpecificData.filter(r => r.length > 0);
    nonEmptyData.map(d => intervals.push(Math.max(...d) === 0
        ? Math.max(...d) + 1 : Math.max(...d)));


    return (
        <>
            <div style={{
                position: 'fixed',
                bottom: '100px',
                right: '82px',
                zIndex: '15',
                backgroundColor: 'rgba(19,32,55,0.9)',
                padding: '15px',
                borderRadius: '10px',
            }}
            >
                {showPopulationWard
                    && (
                        <div>
                            <h4 style={{ marginLeft: '10px', color: 'white' }}>Population by Ward</h4>
                            <div className={styles.populationContainer}>
                                <div className={styles.populationIndContainerShort}>
                                    <div className={styles.populationIndicator1} />
                                    <div className={styles.populationIndicator2} />
                                    <div className={styles.populationIndicator3} />
                                    <div className={styles.populationIndicator4} />
                                    <div className={styles.populationIndicator5} />
                                </div>
                                <div className={styles.populationTextContainer}>
                                    {
                                        intervals[3] !== maxPop && (
                                            <div className={styles.populationText}>{`${parseStringToNumber(intervals[3])} - ${parseStringToNumber(intervals[4])}`}</div>
                                        )
                                    }
                                    <div className={styles.populationText}>{`${parseStringToNumber(intervals[2])} - ${parseStringToNumber(intervals[3])}`}</div>
                                    <div className={styles.populationText}>{`${parseStringToNumber(intervals[1])} - ${parseStringToNumber(intervals[2])}`}</div>
                                    <div className={styles.populationText}>{`${parseStringToNumber(intervals[0])} - ${parseStringToNumber(intervals[1])}`}</div>
                                    <div className={styles.populationText}>{`0- ${parseStringToNumber(intervals[0])}`}</div>
                                </div>

                            </div>

                        </div>
                    )
                }
            </div>
        </>
    );
};

export default DemoGraphicsLegends;
