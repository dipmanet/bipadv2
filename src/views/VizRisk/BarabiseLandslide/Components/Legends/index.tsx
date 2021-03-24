import React from 'react';
import Hexagon from 'react-hexagon';
import legendData from './legends';
import styles from './styles.scss';

const Legends = (props) => {
    console.log('legends comp:');
    const { currentPage } = props;
    return (
        <div className={styles.legendsContainer}>
            <h2>{legendData[currentPage].title}</h2>
            <div className={legendsItemsList}>
                {legendsData.legends.map(legend => (
                    <div className={styles.legendsRow}>
                        <Hexagon
                            style={{
                                stroke: '#fff',
                                strokeWidth: 50,
                                fill: legend.color,
                            }}
                            className={styles.educationHexagon}
                        />
                        {legend.label}

                    </div>
                ))}
            </div>
        </div>

    );
};

export default Legends;
