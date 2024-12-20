import React from 'react';
import styles from './styles.scss';

const InundationLegend = () => (
    <div className={styles.mainLegendDivHomePage}>
        <p style={{ color: 'white', margin: '0 0 3px 0', fontSize: '11px' }}>DEPTH OF FFLOODING(FT.)</p>
        <div className={styles.scale}>
            {['#FFFFFF', '#DF9D4F', '#D2885E', '#D96A2B', '#FF7A00'].map((c, i) => (
                <div className={styles.scaleElement} key={c}>
                    <div
                        key={c}
                        className={styles.colorUnit}
                        style={{
                            // width: colorUnitWidth,
                            backgroundColor: c,
                        }}
                    />
                    <div className={styles.value}>
                        {[0.5, 1, 2, 3, 4].filter(item => typeof item === 'number')[i]}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
export default InundationLegend;
