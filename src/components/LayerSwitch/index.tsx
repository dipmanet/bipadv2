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

import LayerButton from './LayerButton';
import styles from './styles.scss';

const mapStyles = [
    {
        name: 'none',
        style: `${process.env.REACT_APP_MAP_STYLE_NONE}`,
        color: '#dddddd',
    },
    {
        name: 'light',
        style: `${process.env.REACT_APP_MAP_STYLE_LIGHT}`,
        color: '#cdcdcd',
    },
    {
        name: 'roads',
        style: `${process.env.REACT_APP_MAP_STYLE_ROADS}`,
        color: '#671076',
    },
    {
        name: 'satellite',
        style: `${process.env.REACT_APP_MAP_STYLE_SATELLITE}`,
        color: '#c89966',
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
