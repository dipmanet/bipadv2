import React, { useState } from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';

const Disclaimer = (props) => {
    const [showInfo, setShowInfo] = useState(true);
    const handleInfoClick = () => {
        setShowInfo(!showInfo);
    };
    return (
        <div className={styles.iconContainer}>
            <button type="button" className={styles.infoContainerBtn} onClick={handleInfoClick}>
                <Icon
                    name="warning"
                    className={styles.closeIcon}
                />
            </button>
            <div
                className={showInfo ? styles.bottomInfo : styles.bottomInfoHide}
            >
                Disclaimer: Map data not consistent
            </div>

        </div>
    );
};

export default Disclaimer;
