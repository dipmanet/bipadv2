import React from 'react';
import Button from '#rsca/Button';
import Icon from '#rscg/Icon';

import styles from './styles.scss';

const VRSetting = (props: Props) => {
    console.log('settings props');
    return (
        <div className={styles.settingsButtonContainer}>
            <p>Light Mode</p>
            <Button
                transparent
                disabled
            >
                <Icon
                    name="cog"
                    className={styles.settingsBtn}
                />
            </Button>

        </div>
    );
};

export default VRSetting;
