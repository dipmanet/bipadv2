import React from 'react';
import styles from './styles.scss';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;


const FloodHistoryLegends = (props: Props) => (
    <>
        <div className={styles.floodDepthContainer}>
            <h2>Flood depth (in meters)</h2>
            <div className={styles.depthItems}>
                <div className={styles.floodDepth}>
                    <div className={styles.floodIndicator1}>
                        {'> 2m'}
(High)
                    </div>
                    {/* <div className={styles.floodText}>
                                 High
                    </div> */}
                </div>
                <div className={styles.floodDepth}>

                    <div className={styles.floodIndicator2}>
                        {'1m - 2m'}
(Med)
                    </div>
                    {/* <div className={styles.floodText}>Med</div> */}
                </div>
                <div className={styles.floodDepth}>
                    <div className={styles.floodIndicator3}>
                        {'< 1m'}
(Low)
                    </div>
                    {/* <div className={styles.floodText}>
                                    Low
                    </div> */}
                </div>
            </div>
        </div>

    </>

);

export default FloodHistoryLegends;
