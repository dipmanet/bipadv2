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

import osmLibertyStyle from '#mapStyles/style';
import osmStyle from '#mapStyles/rasterStyle';

import DropdownMenu from '#rsca/DropdownMenu';
import ListView from '#rscv/List/ListView';

import { setMapStyleAction } from '#actionCreators';
import { mapStyleSelector } from '#selectors';

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
        };
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
        console.log('faram value', faramValues);
        this.setState({
            faramValues: {
                customType: faramValues,
            },
            faramErrors,

        });
    }

    public render() {
        const { className } = this.props;
        const { faramValues, faramErrors, showCustomSetting, showPageType, selectedPageType, selectedFileFormat } = this.state;
        const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];
        console.log('showPageType', typeof showPageType);
        return (
            <DropdownMenu
                className={_cs(styles.layerSwitch, className)}
                iconName="download"
                hideDropdownIcon
                tooltip="Download current map"
            >
                <div className={styles.mainContainer}>
                    <div className={styles.heading}>
                        <h3>Download</h3>
                    </div>
                    <div className={styles.buttonOptions}>
                        <Button
                            className={styles.downloadButton}
                        >
                            Download with default settings
                        </Button>
                        {
                            showCustomSetting ? '' : (
                                <Button
                                    className={styles.downloadButton}
                                    onClick={() => this.setState({ showCustomSetting: true })}
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
                                                <select name="custom" id="custom" onClick={e => this.setState({ showPageType: e.target.value })}>
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
                                                            onClick={() => this.setState({ selectedPageType: 'A3' })}
                                                        >
                                                            A3
                                                        </Button>
                                                        <Button
                                                            className={_cs(selectedPageType === 'A4' ? (styles.active) : (styles.pageSizeButton))}
                                                            onClick={() => this.setState({ selectedPageType: 'A4' })}
                                                        >
                                                            A4
                                                        </Button>
                                                        <Button
                                                            className={_cs(selectedPageType === 'B4' ? (styles.active) : (styles.pageSizeButton))}
                                                            onClick={() => this.setState({ selectedPageType: 'B4' })}
                                                        >
                                                            B4
                                                        </Button>
                                                        <Button
                                                            className={_cs(selectedPageType === 'B5' ? (styles.active) : (styles.pageSizeButton))}
                                                            onClick={() => this.setState({ selectedPageType: 'B5' })}
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
                                                        <input type="number" id="vehicle1" style={{ width: '66px', marginLeft: '5px', marginRight: '5px' }} />
                                                        X
                                                        <input type="number" id="vehicle1" style={{ width: '66px', marginLeft: '5px', marginRight: '5px' }} />

                                                    </div>
                                                </form>

                                            </div>
                                        )

                                        }


                                        <div>
                                            <form className={styles.pageType}>
                                                <label htmlFor="Custom">
                                                    File format :
                                                </label>
                                                <div>
                                                    <Button
                                                        className={_cs(selectedFileFormat === 'PNG' ? (styles.activeFileFormatButton) : (styles.fileFormatButton))}
                                                        onClick={() => this.setState({ selectedFileFormat: 'PNG' })}

                                                    >
                                                        PNG
                                                    </Button>
                                                    <Button
                                                        className={_cs(selectedFileFormat === 'JPG' ? (styles.activeFileFormatButton) : (styles.fileFormatButton))}
                                                        onClick={() => this.setState({ selectedFileFormat: 'JPG' })}

                                                    >
                                                        JPG
                                                    </Button>
                                                    <Button
                                                        className={_cs(selectedFileFormat === 'PDF' ? (styles.activeFileFormatButton) : (styles.fileFormatButton))}
                                                        onClick={() => this.setState({ selectedFileFormat: 'PDF' })}
                                                    >
                                                        PDF
                                                    </Button>

                                                </div>
                                            </form>

                                        </div>
                                        <div>
                                            <form className={styles.grid}>

                                                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                                                <label htmlFor="vehicle1"> Show Grid</label>


                                            </form>
                                        </div>
                                        <div className={styles.footerButton}>
                                            <Button
                                                className={styles.fileFormatButton}
                                            >
                                                Download
                                            </Button>
                                            <Button
                                                className={styles.fileFormatButton}
                                                onClick={() => this.setState({ showCustomSetting: false, selectedFileFormat: '', selectedPageType: '' })}
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
LayerSwitch.contextType = ReduxContext;

export default connect(mapAppStateToComponentProps, mapDispatchToProps)(LayerSwitch);
