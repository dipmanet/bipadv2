import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import ReduxContext from '#components/ReduxContext';

import osmLibertyStyle from '#mapStyles/style';
import osmStyle from '#mapStyles/rasterStyle';

import DropdownMenu from '#rsca/DropdownMenu';
import ListView from '#rscv/List/ListView';

import { setMapStyleAction } from '#actionCreators';
import { languageSelector, mapStyleSelector } from '#selectors';

import LayerButton from './LayerButton';

// Icons
import OutLineIcon from '#resources/images/outline.png';
import MapboxLightIcon from '#resources/images/mapbox-light.png';
import MapboxRoadsIcon from '#resources/images/mapbox-roads.png';
import MapboxSatelliteIcon from '#resources/images/mapbox-satellite.png';
import OSMIcon from '#resources/images/osm.png';

import styles from './styles.scss';

const mapStyles = (language: string) => ([
    {
        name: 'none',
        style: `${process.env.REACT_APP_MAP_STYLE_NONE}`,
        color: '#dddddd',
        title: 'Outline',
        description: language === 'en'
            ? 'A national political and administrative boundary layer. It’s a default map view.'
            : 'राष्ट्रिय राजनीतिक र प्रशासनिक सीमा तह। यो पूर्वनिर्धारित नक्सा हो । ',
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
        description: language === 'en'
            ? 'OpenStreetMap (OSM) is a collaborative project to create a free editable map of the world.'
            : 'Openstreetmap विश्वको निस्शुल्क सम्पादन योग्य नक्सा परियोजना हो।',
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
        description: language === 'en'
            ? 'Mapbox Roads is a map view highlighting the road features designed specifically for navigation.'
            : 'Mapbox roads  नेभिगेसनको लागि विशेष रूपमा डिजाइन गरिएको road features हाइलाइट गर्ने नक्सा दृश्य हो । ',
        icon: MapboxRoadsIcon,
    },
    {
        name: 'satellite',
        style: `${process.env.REACT_APP_MAP_STYLE_SATELLITE}`,
        color: '#c89966',
        title: 'Mapbox Satellite',
        description: language === 'en'
            ? 'Mapbox Satellite overlays satellite imagery onto the map and highlights roads, buildings and major landmarks for easy identification.'
            : 'नक्सामा mapbox स्याटेलाइट ओभरले स्याटेलाइट इमेजरी र पहिचानको लागि सडक, भवन र प्रमुख स्थल चिन्हहरू हाइलाइट गर्दछ ',
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
]);

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
    language: languageSelector(state),
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
                // do nothing
            });
        }
    }

    public render() {
        const { className, language: { language } } = this.props;

        return (
            <DropdownMenu
                className={_cs(styles.layerSwitch, className)}
                iconName="layers"
                hideDropdownIcon
                tooltip={language === 'en' ? 'Select layers' : 'तह चयन गर्नुहोस्'}
            >
                <ListView
                    data={mapStyles(language)}
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
