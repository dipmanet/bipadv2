import React from 'react';
import Icon from '#rscg/Icon';

import Page from '#components/Page';
import styles from './styles.scss';
import { iconNames } from '#constants';
import Button from '#rsca/Button';
import Alert from '#rscv/Modal/Alert';

const VizRiskMenuPage = (props) => {
    console.log(props);
    const handleIconClick = () => console.log('clicked!');
    return (
        <div>
            <Page
                hideMap
                hideFilter
            />
            <div className={styles.vizrisknmenupagecontainer}>
                <div className={styles.vizrisknmenupage}>
                    <p className={styles.menuTitle}>Visualizing Flood Exposure</p>
                    <h1 className={styles.menuItems}>Rajapur Municipality</h1>
                </div>
                <div className={styles.hamburgerBtnContainer}>
                    <Button
                        transparent
                    >
                        <Icon
                            name="menu"
                            className={styles.hamburgerBtn}
                        />
                    </Button>

                    <div className={styles.cropper} />
                </div>
            </div>
        </div>
    );
};

export default VizRiskMenuPage;
