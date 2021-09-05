/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
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
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import { OpenSeaDragonViewer } from '../OpenSeaDragonImageViewer';
import PrimaryButton from '#rsca/Button/PrimaryButton';

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
    closeOnClick: false,
    closeButton: false,
    offset: 8,
};
const rasterTooltipOptions = {
    closeOnClick: true,
    closeButton: false,
    offset: 8,
};
// eslint-disable-next-line prefer-const
let rasterLayers = [];
// eslint-disable-next-line prefer-const
let choroplethLayers = [];

class RiskInfoMap extends React.PureComponent<Props, State> {
    public constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    public state = {
        feature: undefined,
        hoverLngLat: undefined,
        isModalOpen: false,
        clickedButton: 1,
        loadedImages: [],
        selectedImage: '',
        selectedMunicipalityName: '',
        loader: null,


    }

    private handleCloseModal=() => {
        const { loadedImages } = this.state;

        this.setState({
            isModalOpen: false,
            selectedImage: loadedImages[0].landslideInventoryEnglishFilename,
            clickedButton: 1,


        });
    }

    private handleClick=(feature, lngLat) => {
        const { activeLayers } = this.context;
        const municipalityAvailableForOpenseadragon = !!(feature && feature.state.value);
        if (activeLayers[activeLayers.length - 1].type === 'choropleth' && municipalityAvailableForOpenseadragon && choroplethLayers[choroplethLayers.length - 1].layername === 'post_monsoon' && feature && feature.state.value === 1) {
            const municipalityName = (`${feature.properties.title_en} ${feature.properties.type}`);
            this.setState({
                selectedMunicipalityName: municipalityName,
            });

            this.setState({
                feature,
                hoverLngLat: lngLat,
                isModalOpen: true,
            });

            const imagesLoaded = choroplethLayers[choroplethLayers.length - 1].data.filter(item => item.municipality === feature.id);

            this.setState({
                loadedImages: imagesLoaded,
                selectedImage: imagesLoaded[0].landslideInventoryEnglishFilename,
            });
        }
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

    private handleClickModalButton=(buttonId) => {
        const { loadedImages } = this.state;
        this.setState({
            loader: true,
        });
        this.setState({
            clickedButton: buttonId,
        });
        if (buttonId === 1) {
            this.setState({
                selectedImage: loadedImages[0].landslideInventoryEnglishFilename,
            });
        } else if (buttonId === 2) {
            this.setState({
                selectedImage: loadedImages[0].landslideInventoryNepaliFilename,
            });
        } else if (buttonId === 3) {
            this.setState({
                selectedImage: loadedImages[0].landslideRunoutEnglishFilename,
            });
        } else if (buttonId === 4) {
            this.setState({
                selectedImage: loadedImages[0].landslideRunoutNepaliFilename,
            });
        } else if (buttonId === 5) {
            this.setState({
                selectedImage: loadedImages[0].landslideSusceptibilityEnglishFilename,
            });
        } else {
            this.setState({
                selectedImage: loadedImages[0].landslideSusceptibilityNepaliFilename,
            });
        }
    }

    public render() {
        const {
            feature,
            hoverLngLat,
            isModalOpen,
            clickedButton,
            selectedImage,
            selectedMunicipalityName,
            loader,

        } = this.state;
        const { closeModal } = this.props;
        const { activeLayers, LoadingTooltip, tooltipLatlng,
            mapClickedResponse, landslidePolygonChoroplethMapData } = this.context;

        // const selectedActiveLayer = activeLayers.length ? [activeLayers[activeLayers.length - 1]] : [];
        // const selectedActiveLayer = activeLayers;

        // rasterLayers = selectedActiveLayer.filter(d => d.type === 'raster');
        // choroplethLayers = selectedActiveLayer.filter(d => d.type === 'choropleth');
        // const test1 = choroplethLayers.filter(item => item.adminLevel === 'district');
        // const test2 = choroplethLayers.filter(item => item.adminLevel === 'municipality');
        // console.log('This is test1', test1);
        // console.log('This is test2', test2);
        // const finalChoroPlethLayer = choroplethLayers.length ? [choroplethLayers[choroplethLayers.length - 1]] : [];

        const municipalityAvailableForOpenseadragon = !!(feature && feature.state.value);

        rasterLayers = activeLayers.filter(d => d.type === 'raster');
        choroplethLayers = activeLayers.filter(d => d.type === 'choropleth');
        const isJsonDataPresent = rasterLayers.length && Object.keys(rasterLayers[rasterLayers.length - 1]).find(item => item === 'jsonData');
        const JsonDataPresent = rasterLayers.length && rasterLayers[rasterLayers.length - 1].jsonData;

        const tooltipKeys = JsonDataPresent !== undefined && JsonDataPresent !== 0 && JsonDataPresent.map(item => item.label);

        const responseDataKeys = Object.keys(mapClickedResponse);
        const tooltipData = responseDataKeys.length && mapClickedResponse.features.map(item => item.properties)[0];

        const tooltipValues = JsonDataPresent !== undefined && JsonDataPresent !== 0 && tooltipData !== undefined && tooltipData !== 0 && JsonDataPresent.map(item => tooltipData[item.key]);


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


                        {activeLayers[activeLayers.length - 1].type === 'raster' && rasterLayers.length && isJsonDataPresent !== undefined ? tooltipLatlng && (

                            <MapTooltip
                                coordinates={tooltipLatlng}
                                tooltipOptions={rasterTooltipOptions}
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
                {isModalOpen

                    ? (
                        <Modal
                            className={styles.openseadragon}
                        >

                            <ModalHeader
                                className={styles.header}
                                title={selectedMunicipalityName}
                                rightComponent={(
                                    <DangerButton
                                        transparent
                                        iconName="close"
                                        onClick={this.handleCloseModal}
                                        title="Close Modal"
                                    />
                                )}
                            />
                            <ModalBody className={styles.modalBody}>
                                <div className={styles.imageViewer}>
                                    <div className={styles.leftPane}>
                                        <div className={styles.municipalityName} />
                                        <div className={styles.buttons}>
                                            <PrimaryButton
                                                type="button"
                                                className={clickedButton === 1 ? styles.selectedAgreeBtn : styles.agreeBtn}
                                                onClick={() => this.handleClickModalButton(1)}

                                            >
                                        Landslide Inventory English
                                            </PrimaryButton>
                                            <PrimaryButton
                                                type="button"
                                                className={clickedButton === 2 ? styles.selectedAgreeBtn : styles.agreeBtn}
                                                onClick={() => this.handleClickModalButton(2)}
                                            >
                                        Landslide Inventory Nepali
                                            </PrimaryButton>
                                            <PrimaryButton
                                                type="button"
                                                className={clickedButton === 3 ? styles.selectedAgreeBtn : styles.agreeBtn}
                                                onClick={() => this.handleClickModalButton(3)}
                                            >
                                        Landslide Runout English
                                            </PrimaryButton>
                                            <PrimaryButton
                                                type="button"
                                                className={clickedButton === 4 ? styles.selectedAgreeBtn : styles.agreeBtn}
                                                onClick={() => this.handleClickModalButton(4)}
                                            >
                                         Landslide Runout Nepali
                                            </PrimaryButton>
                                            <PrimaryButton
                                                type="button"
                                                className={clickedButton === 5 ? styles.selectedAgreeBtn : styles.agreeBtn}
                                                onClick={() => this.handleClickModalButton(5)}
                                            >
                                        Landslide Susceptibility English
                                            </PrimaryButton>
                                            <PrimaryButton
                                                type="button"
                                                className={clickedButton === 6 ? styles.selectedAgreeBtn : styles.agreeBtn}
                                                onClick={() => this.handleClickModalButton(6)}
                                            >
                                         Landslide Susceptibility Nepali
                                            </PrimaryButton>

                                        </div>
                                    </div>
                                    <div className={styles.rightPane}>
                                        <OpenSeaDragonViewer selectedImage={selectedImage} loadLoader={loader} />
                                    </div>
                                </div>
                            </ModalBody>


                        </Modal>
                    )
                    : ''}
                { choroplethLayers.map((layer, i) => (
                    <MapSource
                        key={layer.id}
                        sourceKey={layer.layername}
                        // sourceKey={layer.layername === 'post_monsoon' ? `${layer.layername}-${i}` : layer.layername}
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
                                paint: linePaintByAdminLevel.municipality,
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
                            // onClick={layer.onClick ? layer.onClick : undefined}
                            onClick={layer.tooltipRenderer ? this.handleClick : undefined}
                            onMouseEnter={layer.tooltipRenderer ? this.handleMouseEnter : undefined}
                            onMouseLeave={layer.tooltipRenderer ? this.handleMouseLeave : undefined}
                        />

                        <MapState
                            attributes={layer.mapState}
                            attributeKey="value"
                            sourceLayer={sourceLayerByAdminLevel[layer.adminLevel]}
                        />


                        {activeLayers[activeLayers.length - 1].type === 'choropleth'
                        && layer.tooltipRenderer
                            && hoverLngLat
                            && feature
                            && (feature.source === layer.layername)
                            && municipalityAvailableForOpenseadragon && (
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
