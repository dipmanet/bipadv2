import React, { useState } from 'react';
import styles from './styles.scss';

const LayerToggle = ({ setVzLabel, vzLabel }) => {
    const [clickedState, setclickedState] = useState(false);
    const handleLayerChange = () => {
        if (vzLabel === 'municipality') {
            setVzLabel('province');
            console.log('layerToggle-vzLabel', vzLabel);
        } else {
            (
                setVzLabel('municipality')
            );
        }
    };
    return (
        <div className={styles.containerToggle}>
            <button
                style={{ border: 'none', backgroundColor: 'transparent' }}
                type="submit"
                onClick={() => {
                    handleLayerChange();
                    setclickedState(!clickedState);
                }}
            >
                <div className={styles.toggleDiv}>
                    <div
                        className={clickedState ? styles.circle : styles.circleMove}
                    />
                </div>
            </button>

            <div className={styles.textSection}>
                {
                    ['Select Province', 'Select municipality'].map(item => (
                        <p className={styles.textLabel}>{item}</p>
                    ))
                }
            </div>
        </div>
    );
};

export default LayerToggle;
