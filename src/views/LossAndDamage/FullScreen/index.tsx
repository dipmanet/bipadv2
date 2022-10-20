import React from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';

interface Props {
    domElement: string;
    setFullScreenHeightWidth: (width: string, height: string) => void;
}

const FullScreenIcon = ({ domElement, setFullScreenHeightWidth }: Props) => {
    function openFullscreen() {
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
                Enter fullScreen Mode
            </span>
        </>

    );
};

export default FullScreenIcon;
