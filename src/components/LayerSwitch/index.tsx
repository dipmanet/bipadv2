import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import ReduxContext from '#components/ReduxContext';

import osmLibertyStyle from '#mapStyles/style';
import osmStyle from '#mapStyles/rasterStyle';

import DropdownMenu from '#rsca/DropdownMenu';
import ListView from '#rscv/List/ListView';

import { setMapStyleAction } from '#actionCreators';
import { mapStyleSelector } from '#selectors';


// Icons
import OutLineIcon from '#resources/images/outline.png';
import MapboxLightIcon from '#resources/images/mapbox-light.png';
import MapboxRoadsIcon from '#resources/images/mapbox-roads.png';
import MapboxSatelliteIcon from '#resources/images/mapbox-satellite.png';
import OSMIcon from '#resources/images/osm.png';
import LayerButton from './LayerButton';
import styles from './styles.scss';

const mapStyles = [
    {
        name: 'none',
        style: `${process.env.REACT_APP_MAP_STYLE_NONE}`,
        color: '#dddddd',
        title: 'Outline',
        description: 'A national political and administrative boundary layer. It’s a default map view.',
        icon: OutLineIcon,
    },
    // {
    //     name: 'osm',
    //     color: '#000000',
    //     style: osmLibertyStyle,
    // },
    {
        name: 'osm-raster',
        color: '#f0ff0f',
        style: osmStyle,
        title: 'OpenStreetMap',
        description: 'OpenStreetMap (OSM) is a collaborative project to create a free editable map of the world.',
        icon: OSMIcon,
    },
    {
        name: 'light',
        style: `${process.env.REACT_APP_MAP_STYLE_LIGHT}`,
        color: '#cdcdcd',
        title: 'Mapbox Light',
        description: 'Mapbox Light is map view designed to provide geographic context while highlighting the data on your dashboard, data visualization, or data overlay.',
        icon: MapboxLightIcon,
    },
    {
        name: 'roads',
        style: `${process.env.REACT_APP_MAP_STYLE_ROADS}`,
        color: '#671076',
        title: 'Mapbox Roads',
        description: 'Mapbox Roads is a map view highlighting the road features designed specifically for navigation.',
        icon: MapboxRoadsIcon,
    },
    {
        name: 'satellite',
        style: `${process.env.REACT_APP_MAP_STYLE_SATELLITE}`,
        color: '#c89966',
        title: 'Mapbox Satellite',
        description: 'Mapbox Satellite overlays satellite imagery onto the map and highlights roads, buildings and major landmarks for easy identification.',
        icon: MapboxSatelliteIcon,
    },
    /*
    {
        name: 'outdoor',
        style: 'mapbox://styles/mapbox/outdoors-v11',
        color: '#c8dd97',
    },
    {
        name: 'street',
        style: 'mapbox://styles/mapbox/streets-v11',
        color: '#ece0ca',
    },
    */
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

class LayerSwitch extends React.PureComponent<Props, State> {
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
                window.location.reload();
            });
        }
    }

    public render() {
        const { className } = this.props;

        return (
            <DropdownMenu
                className={_cs(styles.layerSwitch, className)}
                iconName="layers"
                hideDropdownIcon
                tooltip="Select layer"
            >
                <ListView
                    data={mapStyles}
                    keySelector={layerKeySelector}
                    renderer={LayerButton}
                    rendererParams={this.getLayerButtonRendererParams}
                />
            </DropdownMenu>
        );
    }
}
LayerSwitch.contextType = ReduxContext;

export default connect(mapAppStateToComponentProps, mapDispatchToProps)(LayerSwitch);
