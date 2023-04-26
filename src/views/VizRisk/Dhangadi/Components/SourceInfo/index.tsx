import React, { useState } from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';

const SourceInfo = (props) => {
    const [showInfo, setShowInfo] = useState(true);
    const handleInfoClick = () => {
        setShowInfo(!showInfo);
    };
    return (
        <div className={styles.iconContainer}>

            <div
                className={showInfo ? styles.bottomInfo : styles.bottomInfoHide}
            >
                Source: Rajapur Municipality Profile
            </div>
            <button type="button" className={styles.infoContainerBtn} onClick={handleInfoClick}>
                <Icon
                    name="info"
                    className={styles.closeIcon}
                />
            </button>
        </div>
    );
};

export default SourceInfo;
