/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

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
        const { faramValues, faramErrors } = this.state;
        const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];
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
                        <Button
                            className={styles.downloadButton}
                        >
                            Download with custom settings
                        </Button>
                        <div>
                            <form className={styles.dropdown}>
                                <label htmlFor="Custom">
                                    Custom:
                                </label>
                                <select name="custom" id="custom">
                                    <option value="volvo">Page Type</option>
                                    <option value="saab">Resolution Type</option>

                                </select>


                            </form>

                        </div>
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
