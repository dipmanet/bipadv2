import React from 'react';
import { connect } from 'react-redux';
import html2canvas from 'html2canvas';

import Button from '#rsca/Button';
import MapChild from '#rscz/Map/MapChild';

import PageContext from '#components/PageContext';

import { AppState } from '#store/types';
import {
    Ward,
    District,
    Province,
    Municipality,
    Region,
} from '#store/atom/page/types';
import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    wardsSelector,
    regionSelector,
} from '#selectors';

import indexMapImage from '#resources/images/index-map.png';

interface OwnProps {
    map: {};
}

interface State {
    pending: boolean;
}

interface PropsFromAppState {
    region: Region;
    wards: Ward[];
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
}

type Props = OwnProps & PropsFromAppState;

const indexBounds = {
    sw: { lng: 80.0884245137, lat: 26.3978980576 },
    ne: { lng: 88.1748043151, lat: 30.4227169866 },
};

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    region: regionSelector(state),
    wards: wardsSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
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

const largeFont = '24px Source Sans Pro';
const smallFont = '14px Source Sans Pro';

class MapDownloadButton extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            pending: false,
        };
    }

    private export = () => {
        const {
            map,
            region,
            districts,
            municipalities,
            provinces,
        } = this.props;

        if (!map) {
            console.warn('Cannot export as there is no map');
            return;
        }


        let regionName = 'Nepal';
        const pageTitle = this.context.activeRouteDetails.title;
        let source = '';

        if (map) {
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

            if (this.context.activeRouteDetails.name === 'realtime') {
                source = 'Rain / river: DHM';
            } else if (this.context.activeRouteDetails.name === 'incident') {
                source = 'Nepal police';
            }
        }

        const legendContainerClassName = 'map-legend-container';

        this.setState({ pending: true });
        const mapCanvas = map.getCanvas();

        const canvas = document.createElement('canvas');
        canvas.width = mapCanvas.width;
        canvas.height = mapCanvas.height;

        const context = canvas.getContext('2d');

        if (!context) {
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

            const legend = document.getElementsByClassName(legendContainerClassName);
            const scale = document.getElementsByClassName('mapboxgl-ctrl-scale')[0];

            const today = new Date();
            const title = `${pageTitle} for ${regionName}`;
            const exportText = `Exported on: ${today.toLocaleDateString()}`;

            drawText(context, largeFont, title, 12, 24, '#000', '#fff');
            drawText(context, smallFont, exportText, 12, 52, '#000', '#fff');

            if (source) {
                drawText(context, smallFont, `Source: ${source}`, 12, 68, '#000', '#fff');
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

            if (legend) {
                const legendPromise = new Promise((resolve) => {
                    const promises = Array.from(legend).map((legendElement) => {
                        const elCanvas = html2canvas(legendElement as HTMLElement);

                        return elCanvas;
                    });

                    Promise.all(promises).then((canvases) => {
                        const x = 6;

                        canvases.forEach((c) => {
                            const y = mapCanvas.height - c.height - 6;
                            context.drawImage(c, x, y);
                        });

                        resolve();
                    });
                });

                allPromises.push(legendPromise);
            }

            Promise.all(allPromises).then(() => {
                canvas.toBlob((blob) => {
                    const link = document.createElement('a');
                    link.download = 'map-export.png';
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    this.setState({ pending: false });
                }, 'image/png');
            });
        };
    }

    public render() {
        const {
            legendContainerClassName, // capturing the prop
            setDestroyer,
            zoomLevel,
            mapContainerRef,
            mapStyle,
            dispatch,
            ...otherProps
        } = this.props;

        const {
            pending,
        } = this.state;

        return (
            <Button
                pending={pending}
                onClick={this.export}
                {...otherProps}
            />
        );
    }
}

MapDownloadButton.contextType = PageContext;

export default connect(mapStateToProps)(MapChild(MapDownloadButton));
