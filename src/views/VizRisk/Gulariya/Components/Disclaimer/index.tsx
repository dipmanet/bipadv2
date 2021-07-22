import React, { useState } from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';

const Disclaimer = ({ disclamer }) => {
    const [showInfo, setShowInfo] = useState(true);
    const handleInfoClick = () => {
        setShowInfo(!showInfo);
    };
    return (
        <div className={styles.iconContainer}>
            <button type="button" className={showInfo ? styles.infoContainerBtn : styles.infoContainerClosed} onClick={handleInfoClick}>
                <Icon
                    name="warning"
                    className={styles.closeIcon}
                />
            </button>
            <div
                className={showInfo ? styles.bottomInfo : styles.bottomInfoHide}
            >
                {disclamer}
            </div>

        </div>
    );
};

export default Disclaimer;
