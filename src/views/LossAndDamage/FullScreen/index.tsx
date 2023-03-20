import React from 'react';
import Icon from '#rscg/Icon';
import styles from './styles.scss';

interface Props {
    domElement: string;
    setFullScreenHeightWidth: (width: string, height: string) => void;
    setBarAllDataOnFullScreen: (val: boolean) => void;
    selectOption: string;
    headerText: string;
}

const FullScreenIcon = ({
    domElement,
    setFullScreenHeightWidth,
    setBarAllDataOnFullScreen,
    selectOption,
    headerText,
    language,
}: Props) => {
    function openFullscreen() {
        if (setBarAllDataOnFullScreen) setBarAllDataOnFullScreen(true);
        const element = document.getElementById(domElement);
        const tag = document.createElement('p');
        tag.setAttribute('id', 'titleHeading');
        tag.style.fontSize = `${14}px`;
        tag.style.fontWeight = 700;
        tag.style.textTransform = 'capitalize';
        tag.style.position = 'absolute';
        tag.style.top = `${50}px`;
        const textContent = document.createTextNode(headerText);
        tag.appendChild(textContent);
        element.appendChild(tag);
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            /* Safari */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            /* IE11 */
            element.msRequestFullscreen();
        }
        setFullScreenHeightWidth('75%', '75%');
    }
    return (
        <>
            <Icon className={styles.fullScreen} name="fullScreen" id="fullScreen" onClick={openFullscreen} />
            <span className={styles.toolTipItem}>
                {language === 'en' ? 'View in fullScreen' : 'फुलस्क्रिनमा हेर्नुहोस्'}
            </span>
        </>
    );
};

export default FullScreenIcon;
