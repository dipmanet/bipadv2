import React from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';

interface Props {
    domElement: string;
    setFullScreenHeightWidth: (width: string, height: string) => void;
    setBarAllDataOnFullScreen: (val: boolean) => void;
}

const FullScreenIcon = ({ domElement,
    setFullScreenHeightWidth,
    setBarAllDataOnFullScreen }: Props) => {
    function openFullscreen() {
        if (setBarAllDataOnFullScreen) setBarAllDataOnFullScreen(true);

        const element = document.getElementById(domElement);
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { /* Safari */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE11 */
            element.msRequestFullscreen();
        }
        setFullScreenHeightWidth('75%', '75%');
    }
    return (
        <>
            <Icon
                className={styles.fullScreen}
                name="fullScreen"
                id="fullScreen"
                onClick={openFullscreen}
            />
            <span className={styles.toolTipItem}>
                View in fullScreen
            </span>
        </>

    );
};

export default FullScreenIcon;
