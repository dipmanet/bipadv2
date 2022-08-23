/* eslint-disable max-len */
import React, { useRef } from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import { Translation } from 'react-i18next';
import styles from './styles.scss';
import DrawIcon from './icons/bbox.svg';
import GlobeIcon from './icons/latlng.svg';
import NavigationIcon from './icons/navigation.svg';
import SearchIcon from './icons/search.svg';
import ReloadIcon from './icons/reset.svg';
import FullScreenIcon from './icons/fullscreen.svg';
import { languageSelector } from '#selectors';

interface OwnProps {
    className?: string;
    // onPlusZoomCLick: () => void;
    // onMinusZoomCLick: () => void;
    goToLocation: () => void;
    lattitude: number | string | undefined;
    longitude: number | string | undefined;
    setLongitude: React.Dispatch<React.SetStateAction<number | undefined | string>>;
    setLattitude: React.Dispatch<React.SetStateAction<number | undefined | string>>;
    resetLocation: () => void;
    // activeRouteName: () => void;
    hideMap: boolean;
    toggleLeftPaneButtonStretched: boolean;
    drawToZoom: () => void;
    fullScreenMap: () => void;
    currentLocation: () => void;
    handleToggle: () => void;
    checkLatLngState: boolean;
    lattitudeRef: any;
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});

const ZoomToolBar = (props: OwnProps) => {
    const {
        className,
        goToLocation,
        lattitude,
        longitude,
        setLongitude,
        setLattitude,
        resetLocation,
        hideMap,
        drawToZoom,
        fullScreenMap,
        currentLocation,
        handleToggle,
        checkLatLngState,
        lattitudeRef,
        language: { language },

    } = props;

    const handleEnterFunction = (event: any) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            goToLocation();
        }
    };


    return (
        <>
            {
                !hideMap && (
                    <>
                        <div
                            className={styles.zoomToolBar}
                        >
                            <div className={styles.zoomSection}>
                                <button
                                    type="submit"
                                    className={_cs(styles.bboxDrawBtn, className)}
                                    onClick={drawToZoom}
                                >
                                    <span className={styles.tooltip}>
                                        {language === 'en'
                                            ? 'Draw box to zoom into an area'
                                            : 'कुनै क्षेत्रमा जुम गर्न बक्स कोर्नुहोस्'}
                                    </span>
                                    <img className={styles.svgIcon} src={DrawIcon} alt="" />
                                </button>
                                <button
                                    type="submit"
                                    className={_cs(styles.navigationBtn, className)}
                                    onClick={currentLocation}
                                >
                                    <span className={styles.tooltip}>
                                        {language === 'en'
                                            ? 'Click to locate your current area'
                                            : 'आफ्नो हालको क्षेत्र पत्ता लगाउन यहाँ  क्लिक गर्नुहोस्'}
                                    </span>

                                    <img src={NavigationIcon} alt="" />
                                </button>
                                <button
                                    type="submit"
                                    className={_cs(styles.globeBtn, className)}
                                    onClick={handleToggle}
                                >
                                    <span className={styles.tooltip}>
                                        {language === 'en'
                                            ? 'Click to search by lattitude and longitude'
                                            : 'अक्षांश र देशान्तर द्वारा खोजी गर्न यहाँ क्लिक गर्नुहोस्'}
                                    </span>

                                    <img className={styles.svgIcon} src={GlobeIcon} alt="" />
                                </button>
                                <button
                                    type="submit"
                                    className={_cs(styles.fullScreenIcon, className)}
                                    onClick={fullScreenMap}
                                >
                                    <span className={styles.tooltip}>
                                        {language === 'en'
                                            ? 'Click to view map in fullscreen'
                                            : 'पूर्ण स्क्रिनमा नक्सा हेर्न यहाँ क्लिक गर्नुहोस्'}
                                    </span>


                                    <img className={styles.svgIcon} src={FullScreenIcon} alt="" />
                                </button>
                                <button
                                    type="submit"
                                    className={_cs(styles.reloadIcon, className)}
                                    onClick={resetLocation}
                                >

                                    <span className={styles.tooltip}>
                                        {language === 'en'
                                            ? 'Reset the zoom of map to orginal view'
                                            : 'जुम भएको नक्सालाई  मूल दृश्यमा रिसेट गर्नुहोस्'}
                                    </span>
                                    <img style={{ height: '17px' }} className={styles.svgIcon} src={ReloadIcon} alt="" />
                                </button>
                            </div>
                            <Translation>
                                {
                                    t => (
                                        <div className={!checkLatLngState ? styles.latLngSectionHide : styles.latLngSection}>
                                            <input
                                                className={_cs(styles.latLngInputField, className)}
                                                type="number"
                                                name=""
                                                id=""
                                                placeholder={t('Latitude')}
                                                value={lattitude}
                                                onChange={e => setLattitude(e.target.value)}
                                                ref={lattitudeRef}
                                            />
                                            <input
                                                className={_cs(styles.latLngInputField, className)}
                                                type="number"
                                                name=""
                                                id=""
                                                placeholder={t('Longitude')}
                                                value={longitude}
                                                onChange={e => setLongitude(e.target.value)}
                                                onKeyUp={e => handleEnterFunction(e)}
                                            />
                                            <button
                                                type="submit"
                                                className={_cs((longitude && lattitude) ? styles.searchIcon : styles.searchIconDisabled, className)}
                                                onClick={goToLocation}
                                            >
                                                {
                                                    longitude && lattitude
                                                        ? (
                                                            <span className={styles.tooltip}>
                                                                {language === 'en'
                                                                    ? 'Search'
                                                                    : 'खोजनुहोस्'}
                                                            </span>
                                                        )
                                                        : (
                                                            <span className={styles.tooltip}>
                                                                {language === 'en'
                                                                    ? 'Please add a value in Lattitude and Longitude fields'
                                                                    : 'कृपया अक्षांश र देशान्तर क्षेत्रहरूमा मान थप्नुहोस्'}
                                                            </span>
                                                        )
                                                }


                                                <img className={styles.svgIcon} src={SearchIcon} alt="" />
                                            </button>
                                        </div>
                                    )
                                }
                            </Translation>

                        </div>
                    </>
                )
            }

        </>
    );
};

export default connect(mapStateToProps)(ZoomToolBar);
