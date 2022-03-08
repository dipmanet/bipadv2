/* eslint-disable max-len */
import React, { useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';
import PlusIcon from './icons/plus.svg';
import DrawIcon from './icons/bbox.svg';
import GlobeIcon from './icons/latlng.svg';
import NavigationIcon from './icons/navigation.svg';
import SearchIcon from './icons/search.svg';
import ReloadIcon from './icons/reset.svg';
import FullScreenIcon from './icons/fullscreen.svg';
import MapShapeEditor from '#re-map/MapShapeEditor';

interface OwnProps {
    className?: string;
    // onPlusZoomCLick: () => void;
    // onMinusZoomCLick: () => void;
    goToLocation: () => void;
    lattitude: number | string | undefined;
    longitude: number | string | undefined ;
    setLongitude: React.Dispatch<React.SetStateAction<number | undefined | string>>;
    setLattitude: React.Dispatch<React.SetStateAction<number | undefined | string>>;
    resetLocation: () => void;
    // activeRouteName: () => void;
    hideMap: boolean;
    toggleLeftPaneButtonStretched: boolean;
    drawToZoom: () => void;
    fullScreenMap: () => void;
    currentLocation: () => void;
    leftContainerWidth: number;

}


const ZoomToolBar = (props: OwnProps) => {
    const {
        className,
        // onPlusZoomCLick,
        // onMinusZoomCLick,
        goToLocation,
        lattitude,
        longitude,
        setLongitude,
        setLattitude,
        resetLocation,
        // activeRouteName,
        hideMap,
        toggleLeftPaneButtonStretched,
        drawToZoom,
        fullScreenMap,
        currentLocation,
        leftContainerWidth,
        handleToggle,
        checkLatLngState,
    } = props;


    console.log('zoomtoolbar', leftContainerWidth);


    return (
        <>
            {
                !hideMap && (
                <>
                    <div
                        style={{ left: (`${toggleLeftPaneButtonStretched ? leftContainerWidth + 130 : 130}px`) }}
                        className={!toggleLeftPaneButtonStretched
                            ? styles.zoomToolBarShrink : styles.zoomToolBar}
                    >
                        <div className={styles.zoomSection}>
                            <button
                                type="submit"
                                className={_cs(styles.bboxDrawBtn, className)}
                                onClick={drawToZoom}
                            >
                                <img className={styles.svgIcon} src={DrawIcon} alt="" />
                            </button>

                            {/* <button
                                type="submit"
                                className={_cs(styles.zoomInBtn, className)}
                                onClick={onPlusZoomCLick}
                            >
                                <img src={PlusIcon} alt="" />
                            </button>
                            <button
                                type="submit"
                                className={_cs(styles.zoomOutBtn, className)}
                                onClick={onMinusZoomCLick}
                            >
                                <img className={styles.svgIcon} src={MinusIcon} alt="" />
                            </button> */}
                            <button
                                type="submit"
                                className={_cs(styles.navigationBtn, className)}
                                onClick={currentLocation}
                            >
                                <img src={NavigationIcon} alt="" />
                            </button>
                            <button
                                type="submit"
                                className={_cs(styles.globeBtn, className)}
                                onClick={handleToggle}
                            >
                                <img className={styles.svgIcon} src={GlobeIcon} alt="" />
                            </button>
                            <button
                                type="submit"
                                className={_cs(styles.reloadIcon, className)}
                                onClick={resetLocation}
                            >
                                <img className={styles.svgIcon} src={ReloadIcon} alt="" />
                            </button>
                            <button
                                type="submit"
                                className={_cs(styles.fullScreenIcon, className)}
                                onClick={fullScreenMap}
                            >
                                <img className={styles.svgIcon} src={FullScreenIcon} alt="" />
                            </button>
                        </div>
                        {/* <div className={styles.locationSection}>
                            <button
                                type="submit"
                                className={_cs(styles.bboxDrawBtn, className)}
                                onClick={drawToZoom}
                            >
                                <img className={styles.svgIcon} src={DrawIcon} alt="" />
                            </button>
                        </div> */}
                        <div className={checkLatLngState ? styles.latLngSection : styles.latLngSectionHide}>
                            <input
                                className={_cs(styles.latLngInputField, className)}
                                type="number"
                                name=""
                                id=""
                                placeholder="Longitude"
                                value={longitude}
                                onChange={e => setLongitude(e.target.value)}
                            />
                            <input
                                className={_cs(styles.latLngInputField, className)}
                                type="number"
                                name=""
                                id=""
                                placeholder="Lattitude"
                                value={lattitude}
                                onChange={e => setLattitude(e.target.value)}
                            />
                            <button
                                type="submit"
                                className={_cs((longitude && lattitude) ? styles.searchIcon : styles.searchIconDisabled, className)}
                                onClick={goToLocation}
                            >
                                <img className={styles.svgIcon} src={SearchIcon} alt="" />
                            </button>
                        </div>
                        {/* <div className={styles.relooadScreenSection}>
                            <button
                                type="submit"
                                className={_cs(styles.reloadIcon, className)}
                                onClick={resetLocation}
                            >
                                <img className={styles.svgIcon} src={ReloadIcon} alt="" />
                            </button>
                            <button
                                type="submit"
                                className={_cs(styles.fullScreenIcon, className)}
                                onClick={fullScreenMap}
                            >
                                <img className={styles.svgIcon} src={FullScreenIcon} alt="" />
                            </button>

                        </div> */}
                    </div>
                </>
                )
            }

        </>
    );
};

export default ZoomToolBar;
