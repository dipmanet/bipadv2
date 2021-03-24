import React from 'react';
import Hexagon from 'react-hexagon';
import legendData from './legends';
import styles from './styles.scss';

const Legends = (props) => {
    const { page } = props;
    console.log('legend data ', legendData[3]);
    console.log('currentPage ', page);
    return (
        <div className={styles.legendsContainer}>
            <h2>{legendData[page].title}</h2>
            <div className={styles.legendsItemsList}>
                {legendData[page].legends.map(legend => (
                    <div key={legend.key} className={styles.legendsRow}>
                        <Hexagon
                            style={{
                                stroke: '#fff',
                                strokeWidth: 50,
                                fill: legend.color,
                            }}
                            className={styles.legendsHexagon}
                        />
                        {legend.label}

                    </div>
                ))}
            </div>
        </div>

    );
};

export default Legends;
