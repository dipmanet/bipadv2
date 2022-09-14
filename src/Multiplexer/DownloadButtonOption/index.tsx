/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import {
    _cs,
} from '@togglecorp/fujs';

import Faram from '@togglecorp/faram';
import ReduxContext from '#components/ReduxContext';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import osmLibertyStyle from '#mapStyles/style';
import osmStyle from '#mapStyles/rasterStyle';

import DropdownMenu from '#rsca/DropdownMenu';
import ListView from '#rscv/List/ListView';

import { setMapStyleAction } from '#actionCreators';
import { mapStyleSelector } from '#selectors';
import { MapChildContext } from '#re-map/context';
import LayerButton from './LayerButton';
// Icons
import OutLineIcon from '#resources/images/outline.png';
import MapboxLightIcon from '#resources/images/mapbox-light.png';
import MapboxRoadsIcon from '#resources/images/mapbox-roads.png';
import MapboxSatelliteIcon from '#resources/images/mapbox-satellite.png';
import OSMIcon from '#resources/images/osm.png';
import Button from '#rsca/Button';
import styles from './styles.scss';
import SelectInput from '#rsci/SelectInput';
import MapDownloadButton from '#components/MapDownloadButton';
import LoadingAnimation from '#rscv/LoadingAnimation';

const mapStyles = [
    {
        name: 'none',
        style: `${process.env.REACT_APP_MAP_STYLE_NONE}`,
        color: '#dddddd',
        title: 'Download Default Map',
        description: 'A Default Size Map',
        icon: OutLineIcon,
    },

];

interface OwnProps {
    className?: string;
}

interface State {
}

interface MapStyle {
    name: string;
    color: string;
}

interface PropsFromAppState {
    mapStyles: MapStyle[];
}

interface PropsFromDispatch {
    setMapStyle: typeof setMapStyleAction;
}

type Props = OwnProps & PropsFromAppState & PropsFromDispatch;

const mapAppStateToComponentProps = state => ({
    currentMapStyle: mapStyleSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setMapStyle: params => dispatch(setMapStyleAction(params)),
});

const layerKeySelector = (d: MapStyle) => d.name;
const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;
class LayerSwitch extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            faramValues: {
                customType: '',
            },
            faramErrors: {},
            showCustomSetting: false,
            showPageType: 'true',
            selectedPageType: '',
            selectedFileFormat: '',
            resolution: {
                height: null,
                width: null,
            },
            isTilesLoaded: false,
            disableDefaultDownload: false,
            mapOrientation: 'portrait',
            disableDownloadButton: true,
            orientationType: {
                height: null,
                width: null,
            },
        };
    }


    public componentDidUpdate(prevProps, prevState) {
        const { map, loaded } = this.context;


        const { resolution: { height, width }, resolution, selectedFileFormat, mapOrientation, orientationType } = this.state;
        if (prevState.mapOrientation !== mapOrientation) {
            this.setState({
                resolution: {
                    height: orientationType.height,
                    width: orientationType.width,
                },
            });
        }
        const { showCustomSetting } = this.state;

        if (prevState.resolution !== resolution) {
            // this.setState({ isTilesLoaded: false });

            // const test = map.loaded();
            // console.log('test', test);

            // if (map.loaded()) {

            //     console.log('Loaded with tiles');
            // }
            if ((height > 499 && height < 5001) && (width > 499 && width < 5001)) {
                const dpr = window.devicePixelRatio || 1;

                // const finalHeight = `${height * 1.2549019607843}px`;
                // const finalWidth = `${width * 1.2549019607843}px`;
                const finalHeight = `${height / dpr}px`;
                const finalWidth = `${width / dpr}px`;
                const myElements = document.getElementById('realMap123');
                myElements.style.setProperty('height', finalHeight, 'important');
                myElements.style.setProperty('width', finalWidth, 'important');
                myElements.style.setProperty('position', 'absolute', 'important');
                myElements.style.setProperty('overflow', 'scroll', 'important');
                myElements.style.setProperty('top', '0', 'important');
                myElements.style.setProperty('background-color', 'transparent', 'important');
                myElements.style.setProperty('flex-grow', 'unset', 'important');
            }
            // setTimeout(() => this.setState({ isTilesLoaded: true }), 5000);
        }
    }

    private isActiveMapStyle = (styleFromLayer) => {
        const { currentMapStyle } = this.props;

        if (typeof styleFromLayer === 'string') {
            return currentMapStyle === styleFromLayer;
        }

        return styleFromLayer.id === currentMapStyle.id;
    }

    private getLayerButtonRendererParams = (key: string, layer: MapStyle) => ({
        onClick: this.handleLayerButtonClick,
        isActive: this.isActiveMapStyle(layer.style),
        ...layer,
    })

    private handleLayerButtonClick = (style: string) => {
        const { setMapStyle } = this.props;
        setMapStyle(style);
        // To reload styling
        if (this.context.persistor) {
            this.context.persistor.flush().then(() => {
                // do nothing
            });
        }
    }

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
        this.setState({
            faramValues: {
                customType: faramValues,
            },
            faramErrors,

        });
    }

    private handleChangeResolution = (e) => {
        const { resolution } = this.state;
        this.setState({
            resolution: {
                ...resolution,
                [e.target.name]: Number(e.target.value),
            },

        });
    }

    // private handlepreview = () => {
    //     const { map } = this.context;
    //     const { resolution: { height, width } } = this.state;
    //     const finalHeight = `${height * 1.2549019607843}px`;
    //     const finalWidth = `${width * 1.2549019607843}px`;
    //     console.log('final height', height);
    //     console.log('final width', width);
    //     const myElements = document.getElementById('realMap123');
    //     myElements.style.setProperty('height', finalHeight, 'important');
    //     myElements.style.setProperty('width', finalWidth, 'important');
    //     myElements.style.setProperty('position', 'absolute', 'important');
    //     myElements.style.setProperty('overflow', 'scroll', 'important');
    //     myElements.style.setProperty('top', '0', 'important');
    //     myElements.style.setProperty('background-color', 'transparent', 'important');
    //     myElements.style.setProperty('flex-grow', 'unset', 'important');
    //     // myElements.style.height = finalHeight;
    //     // myElements.style.width = finalWidth;
    //     // myElements.style.position = 'absolute';
    //     // myElements.style.top = '0';
    //     // myElements.style.backgroundColor = 'transparent';
    //     // myElements.style.flexGrow = 'unset';
    //     // if (map) {
    //     //     const mapContainer = map.getContainer();
    //     //     console.log('map container', mapContainer);
    //     //     mapContainer.requestFullscreen();
    //     // }
    // }
    private handleCustomDownloadClick = () => {
        const { handleToggleAnimationMapDownloadButton } = this.props;
        this.setState({ showCustomSetting: true });
        handleToggleAnimationMapDownloadButton(true);
        this.setState({ disableDefaultDownload: true });
    }

    private handleCancelButton = () => {
        const { handleToggleAnimationMapDownloadButton } = this.props;
        handleToggleAnimationMapDownloadButton(false);
        const myElements = document.getElementById('realMap123');
        myElements.style.setProperty('height', 'unset', 'important');
        myElements.style.setProperty('width', 'unset', 'important');
        myElements.style.setProperty('position', 'unset', 'important');
        myElements.style.setProperty('top', 'unset', 'important');
        myElements.style.setProperty('background-color', 'transparent', 'important');
        myElements.style.setProperty('flex-grow', '1', 'important');

        this.setState({
            showCustomSetting: false,
            selectedFileFormat: '',
            disableDefaultDownload: false,
            selectedPageType: '',
            resolution: {
                height: null,
                width: null,
            },
            showPageType: 'true',
        });
    }

    private handleDisableDownloadButton = (boolean) => {
        this.setState({
            disableDownloadButton: boolean,
        });
    }

    private handleCustomPageCategory = (e) => {
        this.setState({
            showPageType: e.target.value,
            resolution: {
                height: null,
                width: null,
            },
            selectedFileFormat: '',
            selectedPageType: '',
        });
        const myElements = document.getElementById('realMap123');
        myElements.style.setProperty('height', 'unset', 'important');
        myElements.style.setProperty('width', 'unset', 'important');
        myElements.style.setProperty('position', 'unset', 'important');
        myElements.style.setProperty('top', 'unset', 'important');
        myElements.style.setProperty('background-color', 'transparent', 'important');
        myElements.style.setProperty('flex-grow', '1', 'important');
    }


    public render() {
        const { className, onPendingStateChange, activeLayers, isTilesLoaded, handleToggleAnimationMapDownloadButton } = this.props;

        const { faramValues, faramErrors, showCustomSetting, showPageType, selectedPageType,

            selectedFileFormat, resolution: { height, width }, resolution, disableDefaultDownload, mapOrientation, disableDownloadButton } = this.state;
        const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];

        return (

            <DropdownMenu
                className={_cs(styles.layerSwitch, className)}
                iconName="download"
                hideDropdownIcon
                tooltip="Download Map"
                handleToggleAnimationMapDownloadButton={handleToggleAnimationMapDownloadButton}
            >
                <div className={styles.mainContainer} id="downloadButtonOption123">
                    <div className={styles.heading}>
                        <h3>Download</h3>
                    </div>
                    <div className={styles.buttonOptions}>
                        {/* <Button
                            className={styles.downloadButton}
                        >
                            Download with default settings
                        </Button> */}
                        <MapDownloadButton
                            // className={styles.mapDownloadButton}
                            className={showCustomSetting ? styles.disableButton : styles.downloadButton}
                            // transparent
                            title="Download current map"
                            // iconName="download"
                            onPendingStateChange={
                                onPendingStateChange
                            }
                            activeLayers={activeLayers}
                            resolution={resolution}
                            buttonText="Download with default settings"
                            defaultMap
                            disableDefaultDownload={disableDefaultDownload}
                            handleDisableDownloadButton={this.handleDisableDownloadButton}

                        />
                        {
                            showCustomSetting ? '' : (
                                <Button
                                    className={styles.downloadButton}
                                    onClick={this.handleCustomDownloadClick}
                                >
                                    Download with custom settings
                                </Button>
                            )
                        }
                        {
                            showCustomSetting
                                ? (
                                    <>
                                        <div>
                                            <form className={styles.dropdown}>
                                                <label htmlFor="Custom">
                                                    Custom:
                                                </label>
                                                <select name="custom" id="custom" onClick={this.handleCustomPageCategory}>
                                                    <option value>Page Type</option>
                                                    <option value={false}>Resolution Type</option>

                                                </select>


                                            </form>

                                        </div>
                                        {showPageType === 'true' ? (
                                            <div>
                                                <form className={styles.pageType}>
                                                    <label htmlFor="Custom">
                                                        Select Page Type :
                                                    </label>
                                                    <div>
                                                        <Button
                                                            className={_cs(selectedPageType === 'A3' ? (styles.active) : (styles.pageSizeButton))}
                                                            onClick={() => {
                                                                this.setState({
                                                                    selectedPageType: 'A3',
                                                                    // resolution: {
                                                                    //     height: 1587,
                                                                    //     width: 1123,
                                                                    // },
                                                                    resolution: {
                                                                        height: mapOrientation === 'portrait' ? 1587 : 1123,
                                                                        width: mapOrientation === 'portrait' ? 1123 : 1587,
                                                                    },
                                                                });
                                                            }}
                                                        >
                                                            A3
                                                        </Button>
                                                        <Button
                                                            className={_cs(selectedPageType === 'A4' ? (styles.active) : (styles.pageSizeButton))}

                                                            onClick={() => {
                                                                this.setState({
                                                                    selectedPageType: 'A4',
                                                                    resolution: {
                                                                        height: mapOrientation === 'portrait' ? 1123 : 794,
                                                                        width: mapOrientation === 'portrait' ? 794 : 1123,
                                                                    },
                                                                });
                                                            }}
                                                        >
                                                            A4
                                                        </Button>
                                                        <Button
                                                            className={_cs(selectedPageType === 'B4' ? (styles.active) : (styles.pageSizeButton))}

                                                            onClick={() => {
                                                                this.setState({
                                                                    selectedPageType: 'B4',
                                                                    // resolution: {
                                                                    //     height: 1334,
                                                                    //     width: 945,
                                                                    // },
                                                                    resolution: {
                                                                        height: mapOrientation === 'portrait' ? 1334 : 945,
                                                                        width: mapOrientation === 'portrait' ? 945 : 1334,
                                                                    },
                                                                });
                                                            }}
                                                        >
                                                            B4
                                                        </Button>
                                                        <Button
                                                            className={_cs(selectedPageType === 'B5' ? (styles.active) : (styles.pageSizeButton))}

                                                            onClick={() => {
                                                                this.setState({
                                                                    selectedPageType: 'B5',
                                                                    // resolution: {
                                                                    //     height: 945,
                                                                    //     width: 665,
                                                                    // },
                                                                    resolution: {
                                                                        height: mapOrientation === 'portrait' ? 945 : 665,
                                                                        width: mapOrientation === 'portrait' ? 665 : 945,
                                                                    },
                                                                });
                                                            }}
                                                        >
                                                            B5
                                                        </Button>
                                                    </div>
                                                </form>

                                            </div>
                                        ) : (

                                            <div>
                                                <form className={styles.pageType}>
                                                    <label htmlFor="Custom">
                                                        Resolution :
                                                    </label>

                                                    <div>

                                                        <input
                                                            type="number"
                                                            name="width"
                                                            id="vehicle1"
                                                            value={width}
                                                            style={{ width: '66px', marginLeft: '5px', marginRight: '5px' }}
                                                            onChange={e => this.handleChangeResolution(e)}
                                                            placeholder="Width"
                                                        />

                                                        X
                                                        <input
                                                            type="number"
                                                            name="height"
                                                            id="vehicle1"
                                                            value={height}
                                                            style={{ width: '66px', marginLeft: '5px', marginRight: '5px' }}
                                                            onChange={e => this.handleChangeResolution(e)}
                                                            placeholder="Height"

                                                        />

                                                    </div>


                                                </form>
                                                {(height > 499 && height < 5001) && (width > 499 && width < 5001) ? ''
                                                    : <h5 style={{ textAlign: 'right', marginRight: '10px', color: '#E35163' }}>Max value 5000 & Min value 500</h5>
                                                }

                                            </div>
                                        )

                                        }
                                        {showPageType === 'true'
                                            ? (
                                                <div>
                                                    <form className={styles.pageType}>
                                                        <label htmlFor="Custom">
                                                            Orientation :
                                                        </label>
                                                        <div>
                                                            <Button
                                                                className={_cs(mapOrientation === 'landscape' ? (styles.active) : (styles.pageSizeButton))}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        mapOrientation: 'landscape',
                                                                        orientationType: {
                                                                            height: width,
                                                                            width: height,
                                                                        },


                                                                    });
                                                                }}
                                                            >
                                                                Landscape
                                                            </Button>
                                                            <Button
                                                                className={_cs(mapOrientation === 'portrait' ? (styles.active) : (styles.pageSizeButton))}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        mapOrientation: 'portrait',
                                                                        orientationType: {
                                                                            height: resolution.width,
                                                                            width: resolution.height,
                                                                        },

                                                                    });
                                                                }}
                                                            >
                                                                Portrait
                                                            </Button>

                                                        </div>
                                                    </form>

                                                </div>
                                            ) : ''}

                                        <div>
                                            <form className={styles.pageType}>
                                                <label htmlFor="Custom">
                                                    File format :
                                                </label>
                                                <div>
                                                    <Button
                                                        className={_cs(selectedFileFormat === 'png' ? (styles.activeFileFormatButton) : (styles.fileFormatButton))}
                                                        onClick={() => this.setState({ selectedFileFormat: 'png' })}

                                                    >
                                                        PNG
                                                    </Button>
                                                    <Button
                                                        className={_cs(selectedFileFormat === 'jpeg' ? (styles.activeFileFormatButton) : (styles.fileFormatButton))}
                                                        onClick={() => this.setState({ selectedFileFormat: 'jpeg' })}

                                                    >
                                                        JPG
                                                    </Button>
                                                    {showPageType === 'true'
                                                        ? (
                                                            <Button
                                                                className={_cs(selectedFileFormat === 'PDF' ? (styles.activeFileFormatButton) : (styles.fileFormatButton))}
                                                                onClick={() => this.setState({ selectedFileFormat: 'PDF' })}
                                                            >
                                                                PDF
                                                            </Button>
                                                        ) : ''}

                                                </div>
                                            </form>

                                        </div>
                                        {/* <div>
                                            <form className={styles.grid}>

                                                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                                                <label htmlFor="vehicle1"> Show Grid</label>


                                            </form>
                                        </div> */}
                                        <div className={styles.footerButton}>
                                            {!isTilesLoaded ? (
                                                <div style={{ position: 'relative' }}>
                                                    <LoadingAnimation className={styles.loader} />
                                                    {' '}
                                                    <p style={{ marginLeft: '20px' }}> Loading...</p>
                                                </div>
                                            )
                                                : (
                                                    // <Button
                                                    //     className={styles.fileFormatButton}
                                                    //     onClick={this.handlepreview}
                                                    // >
                                                    //     Download
                                                    // </Button>
                                                    <MapDownloadButton
                                                        // className={styles.mapDownloadButton}
                                                        className={disableDownloadButton ? styles.disableButton : styles.downloadButton}
                                                        // transparent
                                                        title="Download custom map"
                                                        // iconName="download"
                                                        onPendingStateChange={
                                                            onPendingStateChange
                                                        }
                                                        activeLayers={activeLayers}
                                                        resolution={resolution}
                                                        buttonText="Download"
                                                        selectedFileFormat={selectedFileFormat}
                                                        selectedPageType={selectedPageType}
                                                        showPageType={showPageType}
                                                        handleCancelButton={this.handleCancelButton}
                                                        mapOrientation={mapOrientation}
                                                        handleDisableDownloadButton={this.handleDisableDownloadButton}


                                                    />
                                                )}
                                            <Button
                                                className={styles.cancelButton}
                                                onClick={this.handleCancelButton}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </>
                                ) : ''

                        }

                    </div>


                </div>

                {/* <ListView
                    data={mapStyles}
                    keySelector={layerKeySelector}
                    renderer={LayerButton}
                    rendererParams={this.getLayerButtonRendererParams}
                /> */}
            </DropdownMenu>

        );
    }
}
LayerSwitch.contextType = MapChildContext;

export default connect(mapAppStateToComponentProps, mapDispatchToProps)(LayerSwitch);
