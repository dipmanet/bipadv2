/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { connect } from 'react-redux';
import { getRasterTile, getBuildingFootprint, getFeatureInfo } from '#utils/domain';

import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapState from '#re-map/MapSource/MapState';
import MapTooltip from '#re-map/MapTooltip';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import { mapSources, mapStyles } from '#constants';

import CommonMap from '#components/CommonMap';
import LandslideToolTip from './Tooltips/RiskInfo/Landslide';
import styles from './styles.scss';


interface Props {
}

interface State {
    feature: any;
    hoverLngLat: any;
}

const sourceLayerByAdminLevel = {
    municipality: mapSources.nepal.layers.municipality,
    district: mapSources.nepal.layers.district,
    ward: mapSources.nepal.layers.ward,
};

const linePaintByAdminLevel = {
    municipality: mapStyles.municipality.choroplethOutline,
    district: mapStyles.district.choroplethOutline,
    ward: mapStyles.ward.choroplethOutline,
};

const tooltipOptions = {
    closeOnClick: true,
    closeButton: false,
    offset: 8,
};

// eslint-disable-next-line prefer-const
let rasterLayers = [];
// eslint-disable-next-line prefer-const
let choroplethLayers = [];
const test = '';
class RiskInfoMap extends React.PureComponent<Props, State> {
    public constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    public state = {
        feature: undefined,
        hoverLngLat: undefined,


    }

    private handleMouseEnter = (feature, lngLat) => {
        this.setState({
            feature,
            hoverLngLat: lngLat,
        });
    }

    private handleMouseLeave = () => {
        this.setState({
            feature: undefined,
            hoverLngLat: undefined,
        });
    }

    private handleAlertClose = () => {
        const { closeTooltip, mapDataOnClick } = this.context;
        closeTooltip(undefined);
    }

    public render() {
        const {
            feature,
            hoverLngLat,

        } = this.state;

        const { activeLayers, LoadingTooltip, tooltipLatlng,
            mapClickedResponse } = this.context;
        // const { requests: { FeatureGetRequest } } = this.props;
        rasterLayers = activeLayers.filter(d => d.type === 'raster');
        // const vectorLayers = activeLayers.filter(d => d.type === 'vector');
        choroplethLayers = activeLayers.filter(d => d.type === 'choropleth');
        console.log('choropleth layer', choroplethLayers);
        const responseDataKeys = Object.keys(mapClickedResponse);
        const tooltipKeys = responseDataKeys.length && mapClickedResponse.features.length && Object.keys(mapClickedResponse.features[0].properties);
        const tooltipValues = responseDataKeys.length && mapClickedResponse.features.length && Object.values(mapClickedResponse.features[0].properties);
        return (
            <>
                <CommonMap
                    sourceKey="risk-infoz"
                />
                { rasterLayers.map(layer => (
                    <MapSource
                        key={layer.id}
                        sourceKey={layer.layername}
                        sourceOptions={{
                            type: 'raster',
                            tiles: [getRasterTile(layer)],
                            tileSize: 256,
                        }}
                    >
                        <MapLayer
                            layerKey="raster-layer"
                            layerOptions={{
                                type: 'raster',
                                paint: {
                                    'raster-opacity': layer.opacity,
                                },
                            }}
                            // onClick={this.handleAlertClick()}

                        />


                        {rasterLayers[rasterLayers.length - 1].showPopup ? tooltipLatlng && (

                            <MapTooltip
                                coordinates={tooltipLatlng}
                                tooltipOptions={tooltipOptions}
                                onHide={this.handleAlertClose}

                            >
                                <div className={styles.landslideTooltip}>
                                    <div className={styles.header}>
                                        <h4>{layer.title}</h4>
                                    </div>
                                    {LoadingTooltip ? <div className={styles.noData}>Loading...</div> : responseDataKeys.length && mapClickedResponse.features.length
                                        ? (
                                            <div className={styles.content}>
                                                <div>
                                                    {tooltipKeys.map((item, i) => <div key={i}>{item}</div>)}
                                                </div>
                                                <div>
                                                    {tooltipValues.map((item, i) => <div key={i}>{item}</div>)}
                                                </div>
                                            </div>


                                        ) : <div className={styles.noData}>No Data</div>}
                                </div>


                            </MapTooltip>

                        ) : ''}


                    </MapSource>
                ))}
                {/* { vectorLayers.map(layer => (
                    <MapSource
                        key={layer.id}
                        sourceKey={layer.layername}
                        sourceOptions={{
                            type: 'raster',
                            tiles: [getRasterTile(layer)],
                            tileSize: 256,
                        }}
                    >
                        <MapLayer
                            layerKey="raster-layer"
                            layerOptions={{
                                type: 'raster',
                                paint: {
                                    'raster-opacity': layer.opacity,
                                },
                            }}
                            onClick={this.handleClick}
                        />
                    </MapSource>
                ))} */}
                {/* <MapSource
                    key={'buildingKey'}
                    sourceKey={'buildingFootprint'}
                    sourceOptions={{
                        type: 'raster',
                        tiles: [getBuildingFootprint()],
                        tileSize: 256,
                    }}
                >
                    <MapLayer
                        layerKey="raster-layer"
                        layerOptions={{
                            type: 'raster',
                            paint: {
                                'raster-opacity': 1,
                            },
                        }}
                    />
                </MapSource> */}

                { choroplethLayers.map(layer => (
                    <MapSource
                        key={layer.id}
                        sourceKey={layer.layername}
                        sourceOptions={{
                            type: 'vector',
                            url: mapSources.nepal.url,
                        }}
                    >
                        <MapLayer
                            layerKey="choropleth-layer-outline"
                            layerOptions={{
                                'source-layer': sourceLayerByAdminLevel[layer.adminLevel],
                                type: 'line',
                                paint: linePaintByAdminLevel[layer.adminLevel],
                            }}
                        />
                        <MapLayer
                            layerKey="choropleth-layer"
                            layerOptions={{
                                type: 'fill',
                                'source-layer': sourceLayerByAdminLevel[layer.adminLevel],
                                paint: {
                                    ...layer.paint,
                                    'fill-opacity': layer.paint['fill-opacity'].map(
                                        val => (typeof val === 'number' ? val * layer.opacity : val),
                                    ),
                                },
                            }}
                            onClick={layer.onClick ? layer.onClick : undefined}
                            onMouseEnter={layer.tooltipRenderer ? this.handleMouseEnter : undefined}
                            onMouseLeave={layer.tooltipRenderer ? this.handleMouseLeave : undefined}
                        />
                        <MapState
                            attributes={layer.mapState}
                            attributeKey="value"
                            sourceLayer={sourceLayerByAdminLevel[layer.adminLevel]}
                        />

                        { layer.tooltipRenderer
                            && hoverLngLat
                            && feature
                            && (feature.source === layer.layername)
                            && (
                                <MapTooltip
                                    coordinates={hoverLngLat}
                                    trackPointer
                                    tooltipOptions={tooltipOptions}
                                >
                                    <layer.tooltipRenderer
                                        feature={feature}
                                        layer={layer}
                                    />
                                </MapTooltip>
                            )
                        }
                    </MapSource>
                ))}
            </>
        );
    }
}

RiskInfoMap.contextType = RiskInfoLayerContext;
export default RiskInfoMap;
