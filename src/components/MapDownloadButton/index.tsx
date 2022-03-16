/* eslint-disable prefer-const */
import React, { useContext, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { saveChart } from '#utils/common';

import Button from '#rsca/Button';
import { MapChildContext } from '#re-map/context';

import PageContext from '#components/PageContext';
import { TitleContext } from '#components/TitleContext';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';

import { AppState } from '#store/types';
import { FiltersElement } from '#types';

import {
    District,
    Province,
    Municipality,
    Region,
} from '#store/atom/page/types';
import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    regionSelector,
    filtersSelector,
    realTimeFiltersSelector,
    layersSelector,
    layerGroupSelector,
} from '#selectors';

import indexMapImage from '#resources/images/index-map.png';

import { getRouteWiseTitleAndSource } from './utils';

interface OwnProps {
    className?: string;
    disabled?: boolean;
    pending?: boolean;
    onPendingStateChange?: (pending: boolean) => void;
}

interface State {
    pending: boolean;
}

interface PropsFromAppState {
    region: Region;
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
    filters: FiltersElement;
    realtimeFilters: {
        faramValues: object;
        faramErrors: object;
    };
}

type Props = OwnProps & PropsFromAppState;

const indexBounds = {
    sw: { lng: 80.0884245137, lat: 26.3978980576 },
    ne: { lng: 88.1748043151, lat: 30.4227169866 },
};

const largeFont = '20px Source Sans Pro';
const smallFont = '14px Source Sans Pro';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    region: regionSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
    filters: filtersSelector(state),
    realtimeFilters: realTimeFiltersSelector(state),
    layers: layersSelector(state),
    layerGroups: layerGroupSelector(state),

});

interface GeoPoint {
    lat: number;
    lng: number;
}

const getIndexMapProportion = (bounds: {
    _sw: GeoPoint;
    _ne: GeoPoint;
}) => {
    const {
        _sw,
        _ne,
    } = bounds;

    const lngBW = (indexBounds.ne.lng - indexBounds.sw.lng);
    const latBW = (indexBounds.ne.lat - indexBounds.sw.lat);

    return {
        left: (_sw.lng - indexBounds.sw.lng) / lngBW,
        top: (indexBounds.ne.lat - _ne.lat) / latBW,
        height: (_ne.lat - _sw.lat) / latBW,
        width: (_ne.lng - _sw.lng) / lngBW,
    };
};

const drawText = (
    context: CanvasRenderingContext2D,
    font: string,
    text: string,
    x: number,
    y: number,
    textColor: string,
    backgroundColor: string,
) => {
    context.save();

    // eslint-disable-next-line no-param-reassign
    context.font = font;
    const { width } = context.measureText(text);

    // eslint-disable-next-line no-param-reassign
    context.fillStyle = backgroundColor;

    // eslint-disable-next-line no-param-reassign
    context.textBaseline = 'top';
    context.fillRect(x, y, width, parseInt(font, 10));

    // eslint-disable-next-line no-param-reassign
    context.fillStyle = textColor;
    context.fillText(text, x, y);

    context.restore();
};

const MapDownloadButton = (props: Props) => {
    const {
        disabled,
        dispatch,
        pending: pendingFromProps,

        region,
        districts,
        municipalities,
        provinces,
        filters: { hazard, dataDateRange },
        realtimeFilters,
        onPendingStateChange,
        activeLayers,
        layers,
        layerGroups,
        ...otherProps
    } = props;

    const mapContext = useContext(MapChildContext);
    const pageContext = useContext(PageContext);
    const titleContext = useContext(TitleContext);
    const riskInfoLayerContext = useContext(RiskInfoLayerContext);

    const [pending, setPending] = useState(false);
    const setDownloadPending = useCallback((isPending) => {
        setPending(isPending);

        if (onPendingStateChange) {
            onPendingStateChange(isPending);
        }
    }, [setPending, onPendingStateChange]);
    const filteredLayer = layers && activeLayers
        && layers.filter(item => item.layername
            === activeLayers.layername).filter(data => data.title === activeLayers.title);
    const filteredLayerGroup = filteredLayer && filteredLayer.length
        && layerGroups.filter(i => i.id === filteredLayer[0].group);
    const publicationDate = filteredLayerGroup && filteredLayerGroup.length
        && filteredLayerGroup[0].metadata && filteredLayerGroup[0].metadata.value
        && filteredLayerGroup[0].metadata.value.general
        && filteredLayerGroup[0].metadata.value.general.datasetCreationDate;
    const handleExport = useCallback(
        () => {
            if (!mapContext || !mapContext.map) {
                console.warn('Map context not found');
                return;
            }

            if (!pageContext || !pageContext.activeRouteDetails) {
                console.warn('Page context not found');
                return;
            }

            if (!titleContext) {
                console.warn('Title context not found');
                return;
            }

            if (!riskInfoLayerContext) {
                console.warn('RiskInfo context not found');
                return;
            }

            const pageTitle = pageContext.activeRouteDetails.title;

            let regionName = 'Nepal';
            if (region.adminLevel === 1) {
                const province = provinces.find(d => d.id === region.geoarea);
                if (province) {
                    regionName = province.title;
                }
            } else if (region.adminLevel === 2) {
                const district = districts.find(d => d.id === region.geoarea);
                if (district) {
                    regionName = district.title;
                }
            } else if (region.adminLevel === 3) {
                const municipality = municipalities.find(d => d.id === region.geoarea);
                if (municipality) {
                    regionName = municipality.title;
                }
            }

            let source = '';
            // previous source logic
            // if (pageContext.activeRouteDetails.name === 'realtime') {
            //     source = 'Rain / river: DHM';
            // } else if (pageContext.activeRouteDetails.name === 'incident') {
            //     source = 'Nepal police';
            // }

            setDownloadPending(true);

            const { map } = mapContext;

            const mapCanvas = map.getCanvas();
            const { activeLayers: riskInfoActiveLayers } = riskInfoLayerContext;
            const canvas = document.createElement('canvas');
            canvas.width = mapCanvas.width;
            canvas.height = mapCanvas.height;

            const context = canvas.getContext('2d');
            if (!context) {
                setDownloadPending(false);
                return;
            }

            context.drawImage(mapCanvas, 0, 0);
            const mapBounds = map.getBounds();

            const mp = getIndexMapProportion(mapBounds);
            const indexMap = new Image();
            indexMap.src = indexMapImage;

            indexMap.onload = () => {
                const rightMargin = 24;
                const topMargin = 24;

                const indexMapWidth = 200;
                const indexMapHeight = 200 * indexMap.height / indexMap.width;

                const left = canvas.width - indexMapWidth - rightMargin;
                const top = topMargin;

                const dx = mp.left * indexMapWidth;
                const dy = mp.top * indexMapHeight;

                context.drawImage(
                    indexMap,
                    canvas.width - indexMapWidth - rightMargin,
                    topMargin,
                    indexMapWidth,
                    indexMapHeight,
                );

                context.beginPath();
                context.strokeStyle = '#ff0000';
                context.rect(
                    left + dx,
                    top + dy,
                    indexMapWidth * mp.width,
                    indexMapHeight * mp.height,
                );

                context.stroke();

                const legendContainerClassName = 'map-legend-container';
                const legend = document.getElementsByClassName(legendContainerClassName);
                const scale = document.getElementsByClassName('mapboxgl-ctrl-scale')[0];
                const navigation = document.getElementsByClassName('mapboxgl-ctrl-compass')[0];
                document.getElementsByClassName('mapboxgl-ctrl-compass')[0].style.height = '50px';
                navigation.getElementsByTagName('span')[0].style.backgroundSize = '50px';

                const today = new Date();
                let title = `${pageTitle} for ${regionName}`;
                const exportText = `Exported on: ${today.toLocaleDateString()}`;
                const [specificTitle, specificSource] = getRouteWiseTitleAndSource(
                    pageTitle,
                    pageContext,
                    titleContext,
                    regionName,
                    hazard,
                    realtimeFilters,
                    riskInfoActiveLayers,
                    dataDateRange,
                );
                title = specificTitle || `${pageTitle} for ${regionName}`;
                source = specificSource || '';
                drawText(context, largeFont, title, 12, 24, '#000', '#fff');
                drawText(context, smallFont, exportText, 12, 52, '#000', '#fff');

                if (source) {
                    drawText(context, smallFont, `Source: ${source}`, 12, 68, '#000', '#fff');
                }
                if (publicationDate) {
                    if (source) {
                        drawText(context, smallFont, `Publication Date: ${publicationDate}`, 12, 82, '#000', '#fff');
                    } else {
                        drawText(context, smallFont, `Publication Date: ${publicationDate}`, 12, 68, '#000', '#fff');
                    }
                }
                const allPromises = [];

                if (scale) {
                    const scaleCanvas = html2canvas(scale as HTMLElement);

                    const scalePromise = new Promise((resolve) => {
                        scaleCanvas.then((c) => {
                            context.drawImage(
                                c,
                                mapCanvas.width - c.width - 6,
                                mapCanvas.height - c.height - 6,
                            );
                            resolve();
                        });
                    });

                    allPromises.push(scalePromise);
                }
                if (navigation) {
                    const navigationCanvas = html2canvas(navigation as HTMLElement);

                    const navigationPromise = new Promise((resolve) => {
                        navigationCanvas.then((c) => {
                            context.drawImage(
                                c,
                                mapCanvas.width - c.width - 6,
                                mapCanvas.height - c.height - 22,
                                // indexMap.height,
                                // indexMapHeight - 70,
                                // indexMapHeight - indexMapHeight + 20,
                                // 20,
                            );
                            resolve();
                        });
                    });

                    allPromises.push(navigationPromise);
                }
                if (legend) {
                    const legendPromise = new Promise((resolve) => {
                        const promises = Array.from(legend).map((legendElement) => {
                            const elCanvas = html2canvas(legendElement as HTMLElement);
                            return elCanvas;
                        });
                        Promise.all(promises).then((canvases) => {
                            canvases.forEach((c, i) => {
                                const y = mapCanvas.height - c.height - 6;
                                const x = 6 + c.width * i;
                                // context.drawImage(c, x, y, c.width, c.height);
                                if (c.width !== 0 || c.height !== 0) {
                                    context.drawImage(c, x, y, c.width, c.height);
                                }
                            });

                            resolve();
                        });
                    });

                    allPromises.push(legendPromise);
                }

                Promise.all(allPromises).then(() => {
                    canvas.toBlob((blob) => {
                        const link = document.createElement('a');
                        link.download = `map-export-${(new Date()).getTime()}.png`;
                        link.href = URL.createObjectURL(blob);
                        link.click();
                        setDownloadPending(false);
                        document.getElementsByClassName('mapboxgl-ctrl-compass')[0].style.height = '29px';
                        navigation.getElementsByTagName('span')[0].style.backgroundSize = 'auto';
                    }, 'image/png');
                });
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            region,
            districts,
            provinces,
            municipalities,
            mapContext,
            pageContext,
            titleContext,
            hazard,
            realtimeFilters,
        ],
    );
    const handleSaveClick = (classname) => {
        if (classname === 'mapboxgl-canvas') {
            const divToDisplay = document.getElementsByClassName('mapboxgl-canvas');
            const pdf = new JsPDF('p', 'mm', 'a4');
            html2canvas(divToDisplay).then((canvas) => {
                const divImage = canvas.toDataURL('image/png');
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;
                pdf.addImage(divImage, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(divImage, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                pdf.save('Report.pdf');
            });
        } else {
            saveChart(classname, classname);
        }

        // saveChart("hazardSeverity", "hazardSeverity");
    };
    return (
        <Button
            disabled={disabled || !mapContext || !mapContext.map}
            pending={pending || pendingFromProps}
            onClick={handleExport}
            // onClick={handleSaveClick('mapboxgl-canvas')}
            {...otherProps}
        >
            Download with default settings
        </Button>
    );
};

export default connect(mapStateToProps)(MapDownloadButton);
